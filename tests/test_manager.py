"""Timer recovery tests for Switch Timer."""

from datetime import timedelta
from unittest.mock import AsyncMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_fire_time_changed

from custom_components.switch_timer.manager import SwitchTimerManager


@pytest.mark.asyncio
async def test_async_initialize_resumes_future_timer(hass: HomeAssistant) -> None:
    """Test that future timers are rescheduled after restart."""
    manager = SwitchTimerManager(hass)
    now = dt_util.utcnow()
    ends_at = now + timedelta(minutes=5)
    manager._store.async_load = AsyncMock(
        return_value={
            "switch.test": {
                "slot": 1,
                "previous_state": "off",
                "revert_to": "previous",
                "started_at": now.isoformat(),
                "ends_at": ends_at.isoformat(),
                "action": "on",
                "duration_minutes": 5,
            }
        }
    )
    manager._store.async_save = AsyncMock()
    manager._revert_entity = AsyncMock()

    await manager.async_initialize()

    assert "switch.test" in manager.state
    assert "switch.test" in manager._cancel_handles

    async_fire_time_changed(hass, ends_at + timedelta(seconds=1))
    await hass.async_block_till_done()

    manager._revert_entity.assert_awaited_once_with("switch.test")
    assert manager.state == {}
    assert "switch.test" not in manager._cancel_handles


@pytest.mark.asyncio
async def test_async_initialize_finishes_expired_timer(hass: HomeAssistant) -> None:
    """Test that expired timers are reverted during startup."""
    manager = SwitchTimerManager(hass)
    now = dt_util.utcnow()
    manager._store.async_load = AsyncMock(
        return_value={
            "switch.test": {
                "slot": 1,
                "previous_state": "off",
                "revert_to": "previous",
                "started_at": (now - timedelta(minutes=10)).isoformat(),
                "ends_at": (now - timedelta(seconds=1)).isoformat(),
                "action": "on",
                "duration_minutes": 5,
            }
        }
    )
    manager._store.async_save = AsyncMock()
    manager._revert_entity = AsyncMock()

    await manager.async_initialize()

    manager._revert_entity.assert_awaited_once_with("switch.test")
    assert manager.state == {}
    assert manager._cancel_handles == {}


@pytest.mark.asyncio
async def test_async_initialize_discards_invalid_timer_state(hass: HomeAssistant) -> None:
    """Test that invalid persisted timer data is removed during startup."""
    manager = SwitchTimerManager(hass)
    manager._store.async_load = AsyncMock(
        return_value={"switch.test": {"slot": 1, "ends_at": "not-a-date"}}
    )
    manager._store.async_save = AsyncMock()
    manager._revert_entity = AsyncMock()

    await manager.async_initialize()

    manager._revert_entity.assert_not_awaited()
    assert manager.state == {}
    assert manager._cancel_handles == {}
