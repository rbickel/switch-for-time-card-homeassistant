"""End-to-end integration test for Switch For Time."""
from pathlib import Path
import pytest
from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component

from custom_components.switch_for_time.const import DOMAIN


@pytest.mark.asyncio
async def test_integration_setup_e2e(hass: HomeAssistant, mock_config_entry):
    """Test that the integration can be fully loaded and setup end-to-end."""
    # Setup HTTP component first (required dependency)
    assert await async_setup_component(hass, "http", {"http": {}})
    await hass.async_block_till_done()

    # Ensure the www directory exists with the frontend card
    www_dir = Path(hass.config.path(f"custom_components/{DOMAIN}/www"))
    www_dir.mkdir(parents=True, exist_ok=True)

    # Create a dummy frontend card file
    card_file = www_dir / "switch-for-time-card.js"
    card_file.write_text("// Test card file")

    try:
        # Add the config entry to hass
        mock_config_entry.add_to_hass(hass)

        # Setup the integration
        assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
        await hass.async_block_till_done()

        # Verify the integration is loaded
        assert DOMAIN in hass.data
        assert mock_config_entry.entry_id in hass.data[DOMAIN]

        # Verify services are registered
        assert hass.services.has_service(DOMAIN, "start")
        assert hass.services.has_service(DOMAIN, "cancel")

        # Verify the state is correct
        assert mock_config_entry.state.name == "LOADED"

    finally:
        # Cleanup
        if card_file.exists():
            card_file.unlink()
        if www_dir.exists():
            www_dir.rmdir()
