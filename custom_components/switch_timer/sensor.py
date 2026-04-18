"""Sensor platform for Switch Timer."""

from __future__ import annotations

from typing import Any

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN, SENSOR_UNIQUE_ID, SIGNAL_STATE_UPDATED
from .manager import SwitchTimerManager


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the Switch Timer state sensor."""
    manager: SwitchTimerManager = hass.data[DOMAIN][entry.entry_id]
    async_add_entities([SwitchTimerStateSensor(manager)], True)


class SwitchTimerStateSensor(SensorEntity):
    """Expose active timer state as JSON."""

    _attr_name = "Switch Timer State"
    _attr_unique_id = SENSOR_UNIQUE_ID
    _attr_icon = "mdi:timer-outline"

    def __init__(self, manager: SwitchTimerManager) -> None:
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
        """Subscribe to state updates."""
        self.async_on_remove(
            async_dispatcher_connect(
                self.hass,
                SIGNAL_STATE_UPDATED,
                self.async_write_ha_state,
            )
        )
