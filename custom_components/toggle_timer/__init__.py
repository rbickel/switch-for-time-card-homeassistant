"""The Toggle Timer integration."""

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
from .manager import ToggleTimerManager

PLATFORMS: list[str] = ["sensor"]


def get_card_url(hass: HomeAssistant) -> str:
    """Get the card URL with version query parameter for cache-busting."""
    import json

    manifest_path = hass.config.path(f"custom_components/{DOMAIN}/manifest.json")
    try:
        with open(manifest_path) as f:
            manifest = json.load(f)
            version = manifest.get("version", "unknown")
    except Exception:
        version = "unknown"

    return f"/hacsfiles/{DOMAIN}/toggle-timer-card.js?v={version}"

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
    """Set up Toggle Timer from a config entry."""
    # Get the card URL with version query parameter for cache-busting
    card_url = get_card_url(hass)
    # Register the static path without version parameter
    base_card_url = f"/hacsfiles/{DOMAIN}/toggle-timer-card.js"

    # Register the frontend card
    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(
                url_path=base_card_url,
                path=hass.config.path(f"custom_components/{DOMAIN}/www/toggle-timer-card.js"),
                cache_headers=True,
            )
        ]
    )
    # Use versioned URL for loading to bust cache
    add_extra_js_url(hass, card_url)

    manager = ToggleTimerManager(hass)
    await manager.async_initialize()

    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = manager

    async def async_handle_start(call: ServiceCall) -> None:
        """Handle toggle_timer.start service."""
        manager = _get_manager(hass)
        await manager.async_start_timer(dict(call.data))

    async def async_handle_cancel(call: ServiceCall) -> None:
        """Handle toggle_timer.cancel service."""
        manager = _get_manager(hass)
        await manager.async_cancel_timer(call.data[ATTR_ENTITY_ID])

    if not hass.services.has_service(DOMAIN, SERVICE_START):
        hass.services.async_register(
            DOMAIN,
            SERVICE_START,
            async_handle_start,
            schema=START_SCHEMA,
        )

    if not hass.services.has_service(DOMAIN, SERVICE_CANCEL):
        hass.services.async_register(
            DOMAIN,
            SERVICE_CANCEL,
            async_handle_cancel,
            schema=CANCEL_SCHEMA,
        )

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    domain_data: dict[str, ToggleTimerManager] | None = hass.data.get(DOMAIN)
    manager: ToggleTimerManager | None = None
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


def _get_manager(hass: HomeAssistant) -> ToggleTimerManager:
    managers = hass.data.get(DOMAIN, {})
    if not managers:
        raise HomeAssistantError("Toggle Timer integration is not loaded")

    return next(iter(managers.values()))
