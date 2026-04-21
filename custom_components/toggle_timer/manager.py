"""Runtime manager for Toggle Timer timers."""

from __future__ import annotations

import json
from collections.abc import Callable
from datetime import datetime, timedelta
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import async_track_point_in_utc_time
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import (
    ACTION_OFF,
    ACTION_ON,
    ACTION_TOGGLE,
    CONF_ACTION,
    CONF_DURATION_MINUTES,
    CONF_REVERT_TO,
    DOMAIN,
    EVENT_CANCELLED,
    EVENT_FINISHED,
    EVENT_STARTED,
    MAX_TIMERS,
    REVERT_NONE,
    REVERT_OFF,
    REVERT_ON,
    REVERT_PREVIOUS,
    SIGNAL_STATE_UPDATED,
    STORAGE_KEY,
    STORAGE_VERSION,
    SUPPORTED_DOMAINS,
)


class ToggleTimerManager:
    """Handle timer lifecycle and persistence."""

    def __init__(self, hass: HomeAssistant) -> None:
        self.hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._state: dict[str, dict[str, Any]] = {}
        self._cancel_handles: dict[str, Callable[[], None]] = {}

    @property
    def state(self) -> dict[str, dict[str, Any]]:
        """Return in-memory timer state."""
        return self._state

    @property
    def state_json(self) -> str:
        """Return state serialized as JSON for frontend compatibility."""
        return json.dumps(self._state, separators=(",", ":"))

    async def async_initialize(self) -> None:
        """Load persisted state and resume timers."""
        stored = await self._store.async_load() or {}
        if not isinstance(stored, dict):
            stored = {}

        self._state = stored

        now = dt_util.utcnow()
        for entity_id, timer_info in list(self._state.items()):
            ends_at = dt_util.parse_datetime(timer_info.get("ends_at", ""))
            if ends_at is None:
                await self.async_remove_state(entity_id)
                continue

            if dt_util.as_utc(ends_at) <= now:
                await self.async_finish_timer(entity_id)
                continue

            self._schedule_timer(entity_id, dt_util.as_utc(ends_at))

        async_dispatcher_send(self.hass, SIGNAL_STATE_UPDATED)

    async def async_start_timer(self, service_data: dict[str, Any]) -> None:
        """Start a timer for an entity."""
        entity_id: str = service_data["entity_id"]
        action: str = service_data[CONF_ACTION]
        duration_minutes: int = service_data[CONF_DURATION_MINUTES]
        revert_to: str = service_data[CONF_REVERT_TO]
        cancel_existing: bool = service_data["cancel_existing"]

        state_obj = self.hass.states.get(entity_id)
        if state_obj is None:
            raise HomeAssistantError(f"Entity not found: {entity_id}")

        domain = entity_id.split(".", 1)[0]
        if domain not in SUPPORTED_DOMAINS:
            raise HomeAssistantError(f"Unsupported entity domain: {domain}")

        if action == ACTION_TOGGLE and domain == "media_player":
            raise HomeAssistantError("media_player does not support toggle action")

        if cancel_existing and entity_id in self._state:
            await self.async_cancel_timer(entity_id, fire_event=False)

        previous_state = self.hass.states.get(entity_id)
        previous_state_value = previous_state.state if previous_state else "off"

        slot = self._allocate_slot()
        if slot == 0:
            raise HomeAssistantError("All timer slots are currently in use")

        now = dt_util.utcnow()
        ends_at = now + timedelta(minutes=duration_minutes)

        self._state[entity_id] = {
            "slot": slot,
            "previous_state": previous_state_value,
            "revert_to": revert_to,
            "started_at": now.isoformat(),
            "ends_at": ends_at.isoformat(),
            "action": action,
            "duration_minutes": duration_minutes,
        }

        await self._apply_action(entity_id, action)
        self._schedule_timer(entity_id, ends_at)

        await self._save_state()
        self.hass.bus.async_fire(
            EVENT_STARTED,
            {
                "entity_id": entity_id,
                "ends_at": ends_at.isoformat(),
                "duration_minutes": duration_minutes,
                "slot": slot,
            },
        )

    async def async_cancel_timer(self, entity_id: str, fire_event: bool = True) -> None:
        """Cancel and revert a timer if active."""
        if entity_id not in self._state:
            return

        cancel = self._cancel_handles.pop(entity_id, None)
        if cancel:
            cancel()

        await self._revert_entity(entity_id)
        await self.async_remove_state(entity_id)

        if fire_event:
            self.hass.bus.async_fire(EVENT_CANCELLED, {"entity_id": entity_id})

    async def async_finish_timer(self, entity_id: str) -> None:
        """Complete a timer and fire finished event."""
        if entity_id not in self._state:
            return

        self._cancel_handles.pop(entity_id, None)
        await self._revert_entity(entity_id)
        await self.async_remove_state(entity_id)
        self.hass.bus.async_fire(EVENT_FINISHED, {"entity_id": entity_id})

    async def async_remove_state(self, entity_id: str) -> None:
        """Remove state for one entity and persist."""
        if entity_id in self._state:
            self._state.pop(entity_id, None)
            await self._save_state()

    async def async_shutdown(self) -> None:
        """Cleanup callbacks on unload."""
        for cancel in list(self._cancel_handles.values()):
            cancel()
        self._cancel_handles.clear()

    async def _apply_action(self, entity_id: str, action: str) -> None:
        service = {
            ACTION_ON: "turn_on",
            ACTION_OFF: "turn_off",
            ACTION_TOGGLE: "toggle",
        }[action]
        await self.hass.services.async_call(
            "homeassistant",
            service,
            {"entity_id": entity_id},
            blocking=True,
        )

    async def _revert_entity(self, entity_id: str) -> None:
        timer_info = self._state.get(entity_id)
        if not timer_info:
            return

        revert_to = timer_info.get("revert_to", REVERT_PREVIOUS)
        previous_state = timer_info.get("previous_state", ACTION_OFF)

        if revert_to == REVERT_NONE:
            return

        if revert_to == REVERT_PREVIOUS:
            service = "turn_on" if previous_state == ACTION_ON else "turn_off"
        elif revert_to == REVERT_ON:
            service = "turn_on"
        elif revert_to == REVERT_OFF:
            service = "turn_off"
        else:
            return

        await self.hass.services.async_call(
            "homeassistant",
            service,
            {"entity_id": entity_id},
            blocking=True,
        )

    def _schedule_timer(self, entity_id: str, ends_at: datetime) -> None:
        cancel = self._cancel_handles.pop(entity_id, None)
        if cancel:
            cancel()

        @callback
        def _timer_done(_):
            self.hass.async_create_task(self.async_finish_timer(entity_id))

        self._cancel_handles[entity_id] = async_track_point_in_utc_time(
            self.hass,
            _timer_done,
            dt_util.as_utc(ends_at),
        )

    def _allocate_slot(self) -> int:
        used_slots = {int(info.get("slot", 0)) for info in self._state.values()}
        for slot in range(1, MAX_TIMERS + 1):
            if slot not in used_slots:
                return slot
        return 0

    async def _save_state(self) -> None:
        await self._store.async_save(self._state)
        async_dispatcher_send(self.hass, SIGNAL_STATE_UPDATED)
