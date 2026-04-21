"""End-to-end integration tests for Toggle Timer."""
from datetime import datetime
import json
from pathlib import Path
import shutil

import pytest
from homeassistant.components.frontend import DATA_EXTRA_MODULE_URL
from homeassistant.core import HomeAssistant
from homeassistant.setup import async_setup_component

from custom_components.toggle_timer.const import DOMAIN, SERVICE_CANCEL, SERVICE_START

SECONDS_PER_MINUTE = 60
HACS_FILES_PATH = "/hacsfiles"


@pytest.fixture(autouse=True)
def cleanup_test_custom_component_files(hass: HomeAssistant):
    """Ensure temporary custom component files are removed after each test."""
    yield
    integration_dir = Path(hass.config.path(f"custom_components/{DOMAIN}"))
    shutil.rmtree(integration_dir, ignore_errors=True)


async def _setup_full_integration(
    hass: HomeAssistant, mock_config_entry, manifest_version: str = "9.9.9"
) -> str:
    """Set up Home Assistant components and return the versioned card resource URL."""
    assert await async_setup_component(hass, "http", {"http": {}})
    assert await async_setup_component(
        hass,
        "input_boolean",
        {
            "input_boolean": {
                "timer_target": {"name": "Timer Target"},
            }
        },
    )
    assert await async_setup_component(hass, "homeassistant", {})
    await hass.async_block_till_done()

    integration_dir = Path(hass.config.path(f"custom_components/{DOMAIN}"))
    www_dir = integration_dir / "www"
    www_dir.mkdir(parents=True, exist_ok=True)
    (www_dir / "toggle-timer-card.js").write_text("// Test card file", encoding="utf-8")
    (integration_dir / "manifest.json").write_text(
        json.dumps({"version": manifest_version}), encoding="utf-8"
    )

    mock_config_entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(mock_config_entry.entry_id)
    await hass.async_block_till_done()

    return f"{HACS_FILES_PATH}/{DOMAIN}/toggle-timer-card.js?v={manifest_version}"


@pytest.mark.asyncio
async def test_integration_setup_registers_dashboard_card_resource(
    hass: HomeAssistant, mock_config_entry
):
    """Test full setup and Lovelace dashboard card resource registration."""
    expected_resource = await _setup_full_integration(hass, mock_config_entry)

    assert DOMAIN in hass.data
    assert mock_config_entry.entry_id in hass.data[DOMAIN]
    assert mock_config_entry.state.name == "LOADED"
    assert hass.services.has_service(DOMAIN, SERVICE_START)
    assert hass.services.has_service(DOMAIN, SERVICE_CANCEL)
    assert expected_resource in hass.data[DATA_EXTRA_MODULE_URL]


@pytest.mark.asyncio
async def test_integration_timer_lifecycle_covers_start_replace_extend_and_cancel(
    hass: HomeAssistant, mock_config_entry
):
    """Test timer lifecycle used by the card and remaining-time badge."""
    await _setup_full_integration(hass, mock_config_entry)
    entity_id = "input_boolean.timer_target"

    await hass.services.async_call(
        DOMAIN,
        SERVICE_START,
        {
            "entity_id": entity_id,
            "action": "on",
            "duration_minutes": 5,
            "revert_to": "off",
            "cancel_existing": True,
        },
        blocking=True,
    )
    await hass.async_block_till_done()

    assert hass.states.get(entity_id).state == "on"
    sensor_state = hass.states.get("sensor.toggle_timer_state")
    assert sensor_state is not None
    state_data = json.loads(sensor_state.state)
    timer_state = state_data[entity_id]
    first_started_at = datetime.fromisoformat(timer_state["started_at"])
    first_ends_at = datetime.fromisoformat(timer_state["ends_at"])
    first_duration = (first_ends_at - first_started_at).total_seconds()
    assert timer_state["duration_minutes"] == 5
    # Allow a small tolerance for async scheduling jitter during service handling.
    assert first_duration == pytest.approx(5 * SECONDS_PER_MINUTE, abs=1)

    await hass.services.async_call(
        DOMAIN,
        SERVICE_START,
        {
            "entity_id": entity_id,
            "action": "on",
            "duration_minutes": 3,
            "revert_to": "off",
            "cancel_existing": True,
        },
        blocking=True,
    )
    await hass.async_block_till_done()

    sensor_state = hass.states.get("sensor.toggle_timer_state")
    state_data = json.loads(sensor_state.state)
    replaced_state = state_data[entity_id]
    replaced_ends_at = datetime.fromisoformat(replaced_state["ends_at"])
    assert replaced_state["duration_minutes"] == 3
    assert replaced_ends_at < first_ends_at

    await hass.services.async_call(
        DOMAIN,
        SERVICE_START,
        {
            "entity_id": entity_id,
            "action": "on",
            "duration_minutes": 8,
            "revert_to": "off",
            "cancel_existing": False,
        },
        blocking=True,
    )
    await hass.async_block_till_done()

    sensor_state = hass.states.get("sensor.toggle_timer_state")
    state_data = json.loads(sensor_state.state)
    extended_state = state_data[entity_id]
    extended_ends_at = datetime.fromisoformat(extended_state["ends_at"])
    assert extended_state["duration_minutes"] == 8
    assert extended_ends_at > replaced_ends_at
    assert sensor_state.attributes["active_timers"] == 1

    await hass.services.async_call(
        DOMAIN,
        SERVICE_CANCEL,
        {"entity_id": entity_id},
        blocking=True,
    )
    await hass.async_block_till_done()

    assert hass.states.get(entity_id).state == "off"
    sensor_state = hass.states.get("sensor.toggle_timer_state")
    state_data = json.loads(sensor_state.state)
    assert entity_id not in state_data
    assert sensor_state.attributes["active_timers"] == 0
