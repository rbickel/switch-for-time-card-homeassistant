"""The Switch For Time integration."""

from __future__ import annotations

from typing import Any

import voluptuous as vol

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import ATTR_ENTITY_ID
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.exceptions import HomeAssistantError
import homeassistant.helpers.config_validation as cv

from .const import (
    ACTION_OFF,
    ACTION_ON,
    ACTION_TOGGLE,
    CONF_ACTION,
    CONF_CANCEL_EXISTING,
    CONF_DURATION_MINUTES,
    CONF_REVERT_TO,
    DOMAIN,
    REVERT_NONE,
    REVERT_OFF,
    REVERT_ON,
    REVERT_PREVIOUS,
    SERVICE_CANCEL,
    SERVICE_START,
)
from .manager import SwitchForTimeManager

PLATFORMS: list[str] = ["sensor"]
CARD_URL = f"/hacsfiles/{DOMAIN}/switch-for-time-card.js"

START_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_ENTITY_ID): cv.entity_id,
        vol.Required(CONF_ACTION, default=ACTION_TOGGLE): vol.In(
            [ACTION_ON, ACTION_OFF, ACTION_TOGGLE]
        ),
        vol.Required(CONF_DURATION_MINUTES): vol.All(
            vol.Coerce(int), vol.Range(min=1, max=1440)
        ),
        vol.Required(CONF_REVERT_TO, default=REVERT_PREVIOUS): vol.In(
            [REVERT_PREVIOUS, REVERT_ON, REVERT_OFF, REVERT_NONE]
        ),
        vol.Required(CONF_CANCEL_EXISTING, default=True): cv.boolean,
    }
)

CANCEL_SCHEMA = vol.Schema({vol.Required(ATTR_ENTITY_ID): cv.entity_id})


async def async_setup(hass: HomeAssistant, config: dict[str, Any]) -> bool:
    """Set up integration from YAML (unused)."""
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Switch For Time from a config entry."""
    # Register the frontend card
    await hass.http.async_register_static_paths(
        [
            {
                "url": CARD_URL,
                "path": hass.config.path(f"custom_components/{DOMAIN}/www/switch-for-time-card.js"),
            }
        ]
    )
    add_extra_js_url(hass, CARD_URL)

    manager = SwitchForTimeManager(hass)
    await manager.async_initialize()

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = manager

    if not hass.services.has_service(DOMAIN, SERVICE_START):
        hass.services.async_register(
            DOMAIN,
            SERVICE_START,
            lambda call: _async_handle_start(hass, call),
            schema=START_SCHEMA,
        )

    if not hass.services.has_service(DOMAIN, SERVICE_CANCEL):
        hass.services.async_register(
            DOMAIN,
            SERVICE_CANCEL,
            lambda call: _async_handle_cancel(hass, call),
            schema=CANCEL_SCHEMA,
        )

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    domain_data: dict[str, SwitchForTimeManager] | None = hass.data.get(DOMAIN)
    manager: SwitchForTimeManager | None = None
    if domain_data is not None:
        manager = domain_data.pop(entry.entry_id, None)
    if manager is not None:
        await manager.async_shutdown()

    if unload_ok and not hass.data.get(DOMAIN):
        if hass.services.has_service(DOMAIN, SERVICE_START):
            hass.services.async_remove(DOMAIN, SERVICE_START)
        if hass.services.has_service(DOMAIN, SERVICE_CANCEL):
            hass.services.async_remove(DOMAIN, SERVICE_CANCEL)

    return unload_ok


async def _async_handle_start(hass: HomeAssistant, call: ServiceCall) -> None:
    """Handle switch_for_time.start service."""
    manager = _get_manager(hass)
    await manager.async_start_timer(dict(call.data))


async def _async_handle_cancel(hass: HomeAssistant, call: ServiceCall) -> None:
    """Handle switch_for_time.cancel service."""
    manager = _get_manager(hass)
    await manager.async_cancel_timer(call.data[ATTR_ENTITY_ID])


def _get_manager(hass: HomeAssistant) -> SwitchForTimeManager:
    managers = hass.data.get(DOMAIN, {})
    if not managers:
        raise HomeAssistantError("Switch For Time integration is not loaded")

    return next(iter(managers.values()))
