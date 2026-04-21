"""Sensor platform for Toggle Timer."""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN, SENSOR_UNIQUE_ID, SIGNAL_STATE_UPDATED
from .manager import ToggleTimerManager


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Toggle Timer sensor."""
    manager: ToggleTimerManager = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([ToggleTimerStateSensor(manager)], True)


class ToggleTimerStateSensor(SensorEntity):
    """Expose active timer state as JSON for frontend compatibility."""

    _attr_name = "Toggle Timer State"
    _attr_unique_id = SENSOR_UNIQUE_ID
    _attr_icon = "mdi:timer-outline"

    def __init__(self, manager: ToggleTimerManager) -> None:
        self._manager = manager

    @property
    def native_value(self) -> str:
        """Return JSON map of active timers."""
        return self._manager.state_json

    @property
    def extra_state_attributes(self) -> dict[str, Any] | None:
        """Return active timer metadata."""
        return {
            "active_timers": len(self._manager.state),
            "timers": self._manager.state,
        }

    async def async_added_to_hass(self) -> None:
        """Subscribe to updates."""
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass,
                SIGNAL_STATE_UPDATED,
                self.async_write_ha_state,
            )
        )
