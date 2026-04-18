"""Tests for Switch Timer integration setup."""

from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError

from custom_components.switch_timer import async_setup, async_setup_entry, async_unload_entry
from custom_components.switch_timer.const import DOMAIN, SERVICE_CANCEL, SERVICE_START


@pytest.mark.asyncio
async def test_async_setup(hass: HomeAssistant) -> None:
    """Test async_setup returns True."""
    assert await async_setup(hass, {}) is True


@pytest.mark.asyncio
async def test_async_setup_entry_initializes_manager(
    hass: HomeAssistant, mock_config_entry: ConfigEntry
) -> None:
    """Test that async_setup_entry initializes and stores the manager."""
    with patch("custom_components.switch_timer.SwitchTimerManager") as mock_manager_class:
        mock_manager = MagicMock()
        mock_manager.async_initialize = AsyncMock()
        mock_manager_class.return_value = mock_manager
        hass.config_entries.async_forward_entry_setups = AsyncMock()
        mock_config_entry.add_to_hass(hass)

        result = await async_setup_entry(hass, mock_config_entry)

        assert result is True
        mock_manager_class.assert_called_once_with(hass)
        mock_manager.async_initialize.assert_called_once()
        assert DOMAIN in hass.data
        assert hass.data[DOMAIN][mock_config_entry.entry_id] is mock_manager


@pytest.mark.asyncio
async def test_async_setup_entry_registers_services(
    hass: HomeAssistant, mock_config_entry: ConfigEntry
) -> None:
    """Test that async_setup_entry registers integration services."""
    with patch("custom_components.switch_timer.SwitchTimerManager") as mock_manager_class:
        mock_manager = MagicMock()
        mock_manager.async_initialize = AsyncMock()
        mock_manager_class.return_value = mock_manager
        hass.config_entries.async_forward_entry_setups = AsyncMock()
        mock_config_entry.add_to_hass(hass)

        await async_setup_entry(hass, mock_config_entry)

        assert hass.services.has_service(DOMAIN, SERVICE_START)
        assert hass.services.has_service(DOMAIN, SERVICE_CANCEL)


@pytest.mark.asyncio
async def test_async_setup_entry_forwards_platforms(
    hass: HomeAssistant, mock_config_entry: ConfigEntry
) -> None:
    """Test that async_setup_entry forwards to platforms."""
    with patch("custom_components.switch_timer.SwitchTimerManager") as mock_manager_class:
        mock_manager = MagicMock()
        mock_manager.async_initialize = AsyncMock()
        mock_manager_class.return_value = mock_manager
        hass.config_entries.async_forward_entry_setups = AsyncMock()
        mock_config_entry.add_to_hass(hass)

        await async_setup_entry(hass, mock_config_entry)

        hass.config_entries.async_forward_entry_setups.assert_called_once_with(
            mock_config_entry, ["sensor"]
        )


@pytest.mark.asyncio
async def test_async_unload_entry(hass: HomeAssistant, mock_config_entry: ConfigEntry) -> None:
    """Test that async_unload_entry unloads properly."""
    with patch("custom_components.switch_timer.SwitchTimerManager") as mock_manager_class:
        mock_manager = MagicMock()
        mock_manager.async_initialize = AsyncMock()
        mock_manager.async_shutdown = AsyncMock()
        mock_manager_class.return_value = mock_manager
        hass.config_entries.async_forward_entry_setups = AsyncMock()
        mock_config_entry.add_to_hass(hass)

        await async_setup_entry(hass, mock_config_entry)
        hass.config_entries.async_unload_platforms = AsyncMock(return_value=True)

        result = await async_unload_entry(hass, mock_config_entry)

        assert result is True
        mock_manager.async_shutdown.assert_called_once()
        assert mock_config_entry.entry_id not in hass.data.get(DOMAIN, {})
        assert not hass.services.has_service(DOMAIN, SERVICE_START)
        assert not hass.services.has_service(DOMAIN, SERVICE_CANCEL)


@pytest.mark.asyncio
async def test_services_call_manager(hass: HomeAssistant, mock_config_entry: ConfigEntry) -> None:
    """Test that services call the manager methods."""
    with patch("custom_components.switch_timer.SwitchTimerManager") as mock_manager_class:
        mock_manager = MagicMock()
        mock_manager.async_initialize = AsyncMock()
        mock_manager.async_start_timer = AsyncMock()
        mock_manager.async_cancel_timer = AsyncMock()
        mock_manager_class.return_value = mock_manager
        hass.config_entries.async_forward_entry_setups = AsyncMock()
        mock_config_entry.add_to_hass(hass)

        await async_setup_entry(hass, mock_config_entry)

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

        mock_manager.async_start_timer.assert_awaited_once()
        start_call = mock_manager.async_start_timer.await_args
        start_data = start_call.args[0] if start_call.args else start_call.kwargs
        assert start_data["entity_id"] == "switch.test"
        assert start_data["action"] == "toggle"
        assert start_data["duration_minutes"] == 5
        assert start_data["revert_to"] == "previous"
        assert start_data["cancel_existing"] is True

        await hass.services.async_call(
            DOMAIN,
            SERVICE_CANCEL,
            {"entity_id": "switch.test"},
            blocking=True,
        )

        mock_manager.async_cancel_timer.assert_awaited_once_with("switch.test")


@pytest.mark.asyncio
async def test_service_fails_when_integration_not_loaded(hass: HomeAssistant) -> None:
    """Test that services fail gracefully when integration is not loaded."""
    from custom_components.switch_timer import _get_manager

    with pytest.raises(HomeAssistantError, match="Switch Timer integration is not loaded"):
        _get_manager(hass)
