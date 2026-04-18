"""Tests for Switch For Time integration setup."""
from unittest.mock import AsyncMock, MagicMock, patch
import pytest
from homeassistant.core import HomeAssistant
from homeassistant.config_entries import ConfigEntry
from homeassistant.components.http import StaticPathConfig
from homeassistant.exceptions import HomeAssistantError

from custom_components.switch_for_time import (
    async_setup,
    async_setup_entry,
    async_unload_entry,
)
from custom_components.switch_for_time.const import DOMAIN, SERVICE_START, SERVICE_CANCEL


@pytest.mark.asyncio
async def test_async_setup(hass: HomeAssistant):
    """Test async_setup returns True."""
    assert await async_setup(hass, {}) is True


@pytest.mark.asyncio
async def test_async_setup_entry_registers_static_paths(
    hass: HomeAssistant, mock_config_entry: ConfigEntry
):
    """Test that async_setup_entry registers static paths correctly."""
    # Mock the http component
    hass.http = MagicMock()
    hass.http.async_register_static_paths = AsyncMock()

    # Mock the manager
    with patch("custom_components.switch_for_time.SwitchForTimeManager") as mock_manager_class:
        mock_manager = MagicMock()
        mock_manager.async_initialize = AsyncMock()
        mock_manager_class.return_value = mock_manager

        # Mock the config_entries forward_entry_setups
        hass.config_entries.async_forward_entry_setups = AsyncMock()

        # Add the config entry
        mock_config_entry.add_to_hass(hass)

        # Setup the integration
        result = await async_setup_entry(hass, mock_config_entry)

        # Verify result
        assert result is True

        # Verify async_register_static_paths was called with StaticPathConfig
        hass.http.async_register_static_paths.assert_called_once()
        call_args = hass.http.async_register_static_paths.call_args[0][0]

        # Should be a list with one StaticPathConfig
        assert isinstance(call_args, list)
        assert len(call_args) == 1

        static_config = call_args[0]
        assert isinstance(static_config, StaticPathConfig)
        assert static_config.url_path == "/hacsfiles/switch_for_time/switch-for-time-card.js"
        assert "switch-for-time-card.js" in static_config.path
        assert static_config.cache_headers is True


@pytest.mark.asyncio
async def test_async_setup_entry_initializes_manager(
    hass: HomeAssistant, mock_config_entry: ConfigEntry
):
    """Test that async_setup_entry initializes the manager."""
    # Mock the http component
    hass.http = MagicMock()
    hass.http.async_register_static_paths = AsyncMock()

    # Mock the manager
    with patch("custom_components.switch_for_time.SwitchForTimeManager") as mock_manager_class:
        mock_manager = MagicMock()
        mock_manager.async_initialize = AsyncMock()
        mock_manager_class.return_value = mock_manager

        # Mock the config_entries forward_entry_setups
        hass.config_entries.async_forward_entry_setups = AsyncMock()

        # Add the config entry
        mock_config_entry.add_to_hass(hass)

        # Setup the integration
        await async_setup_entry(hass, mock_config_entry)

        # Verify manager was created and initialized
        mock_manager_class.assert_called_once_with(hass)
        mock_manager.async_initialize.assert_called_once()

        # Verify manager is stored in hass.data
        assert DOMAIN in hass.data
        assert mock_config_entry.entry_id in hass.data[DOMAIN]
        assert hass.data[DOMAIN][mock_config_entry.entry_id] == mock_manager


@pytest.mark.asyncio
async def test_async_setup_entry_registers_services(
    hass: HomeAssistant, mock_config_entry: ConfigEntry
):
    """Test that async_setup_entry registers services."""
    # Mock the http component
    hass.http = MagicMock()
    hass.http.async_register_static_paths = AsyncMock()

    # Mock the manager
    with patch("custom_components.switch_for_time.SwitchForTimeManager") as mock_manager_class:
        mock_manager = MagicMock()
        mock_manager.async_initialize = AsyncMock()
        mock_manager_class.return_value = mock_manager

        # Mock the config_entries forward_entry_setups
        hass.config_entries.async_forward_entry_setups = AsyncMock()

        # Add the config entry
        mock_config_entry.add_to_hass(hass)

        # Setup the integration
        await async_setup_entry(hass, mock_config_entry)

        # Verify services are registered
        assert hass.services.has_service(DOMAIN, SERVICE_START)
        assert hass.services.has_service(DOMAIN, SERVICE_CANCEL)


@pytest.mark.asyncio
async def test_async_setup_entry_forwards_platforms(
    hass: HomeAssistant, mock_config_entry: ConfigEntry
):
    """Test that async_setup_entry forwards to platforms."""
    # Mock the http component
    hass.http = MagicMock()
    hass.http.async_register_static_paths = AsyncMock()

    # Mock the manager
    with patch("custom_components.switch_for_time.SwitchForTimeManager") as mock_manager_class:
        mock_manager = MagicMock()
        mock_manager.async_initialize = AsyncMock()
        mock_manager_class.return_value = mock_manager

        # Mock the config_entries forward_entry_setups
        hass.config_entries.async_forward_entry_setups = AsyncMock()

        # Add the config entry
        mock_config_entry.add_to_hass(hass)

        # Setup the integration
        await async_setup_entry(hass, mock_config_entry)

        # Verify platforms were forwarded
        hass.config_entries.async_forward_entry_setups.assert_called_once_with(
            mock_config_entry, ["sensor"]
        )


@pytest.mark.asyncio
async def test_async_unload_entry(hass: HomeAssistant, mock_config_entry: ConfigEntry):
    """Test that async_unload_entry unloads properly."""
    # Setup the integration first
    hass.http = MagicMock()
    hass.http.async_register_static_paths = AsyncMock()

    with patch("custom_components.switch_for_time.SwitchForTimeManager") as mock_manager_class:
        mock_manager = MagicMock()
        mock_manager.async_initialize = AsyncMock()
        mock_manager.async_shutdown = AsyncMock()
        mock_manager_class.return_value = mock_manager

        hass.config_entries.async_forward_entry_setups = AsyncMock()
        mock_config_entry.add_to_hass(hass)

        await async_setup_entry(hass, mock_config_entry)

        # Now test unload
        hass.config_entries.async_unload_platforms = AsyncMock(return_value=True)

        result = await async_unload_entry(hass, mock_config_entry)

        # Verify unload succeeded
        assert result is True

        # Verify manager was shut down
        mock_manager.async_shutdown.assert_called_once()

        # Verify manager was removed from hass.data
        assert mock_config_entry.entry_id not in hass.data.get(DOMAIN, {})

        # Verify services were removed
        assert not hass.services.has_service(DOMAIN, SERVICE_START)
        assert not hass.services.has_service(DOMAIN, SERVICE_CANCEL)


@pytest.mark.asyncio
async def test_services_call_manager(hass: HomeAssistant, mock_config_entry: ConfigEntry):
    """Test that services call the manager methods."""
    # Setup the integration
    hass.http = MagicMock()
    hass.http.async_register_static_paths = AsyncMock()

    with patch("custom_components.switch_for_time.SwitchForTimeManager") as mock_manager_class:
        mock_manager = MagicMock()
        mock_manager.async_initialize = AsyncMock()
        mock_manager.async_start_timer = AsyncMock()
        mock_manager.async_cancel_timer = AsyncMock()
        mock_manager_class.return_value = mock_manager

        hass.config_entries.async_forward_entry_setups = AsyncMock()
        mock_config_entry.add_to_hass(hass)

        await async_setup_entry(hass, mock_config_entry)

        # Test start service
        await hass.services.async_call(
            DOMAIN,
            SERVICE_START,
            {
                "entity_id": "switch.test",
                "action": "toggle",
                "duration_minutes": 5,
                "revert_to": "previous",
                "cancel_existing": True,
            },
            blocking=True,
        )

        # Verify the manager method was awaited by the real service handler
        mock_manager.async_start_timer.assert_awaited_once()
        start_call = mock_manager.async_start_timer.await_args
        start_data = start_call.args[0] if start_call.args else start_call.kwargs
        assert start_data["entity_id"] == "switch.test"
        assert start_data["action"] == "toggle"
        assert start_data["duration_minutes"] == 5
        assert start_data["revert_to"] == "previous"
        assert start_data["cancel_existing"] is True

        # Test cancel service
        await hass.services.async_call(
            DOMAIN,
            SERVICE_CANCEL,
            {"entity_id": "switch.test"},
            blocking=True,
        )

        # Verify the manager method was awaited by the real service handler
        mock_manager.async_cancel_timer.assert_awaited_once()
        cancel_call = mock_manager.async_cancel_timer.await_args
        cancel_data = cancel_call.args[0] if cancel_call.args else cancel_call.kwargs
        assert cancel_data["entity_id"] == "switch.test"
@pytest.mark.asyncio
async def test_service_fails_when_integration_not_loaded(hass: HomeAssistant):
    """Test that services fail gracefully when integration is not loaded."""
    from custom_components.switch_for_time import _get_manager

    with pytest.raises(HomeAssistantError, match="Switch For Time integration is not loaded"):
        _get_manager(hass)
