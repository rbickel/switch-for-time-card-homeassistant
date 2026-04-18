"""End-to-end integration tests for Switch Timer."""

import pytest
from homeassistant.core import HomeAssistant

from custom_components.switch_timer.const import (
    DOMAIN,
    SENSOR_ENTITY_ID,
    SERVICE_CANCEL,
    SERVICE_START,
)


@pytest.mark.asyncio
async def test_integration_setup_e2e(
    hass: HomeAssistant, mock_config_entry
) -> None:
    """Test that the integration loads end-to-end."""
    mock_config_entry.add_to_hass(hass)

    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    assert DOMAIN in hass.data
    assert mock_config_entry.entry_id in hass.data[DOMAIN]
    assert hass.services.has_service(DOMAIN, SERVICE_START)
    assert hass.services.has_service(DOMAIN, SERVICE_CANCEL)

    sensor_state = hass.states.get(SENSOR_ENTITY_ID)
    assert sensor_state is not None
    assert sensor_state.state == "{}"
    assert sensor_state.attributes["active_timers"] == 0
    assert mock_config_entry.state.name == "LOADED"
