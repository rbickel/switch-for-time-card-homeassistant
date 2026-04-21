"""Fixtures for Toggle Timer integration tests."""
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry
from homeassistant.components.frontend import DATA_EXTRA_MODULE_URL, DATA_EXTRA_JS_URL_ES5

from custom_components.toggle_timer.const import DOMAIN


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Enable loading custom integrations."""
    yield


@pytest.fixture(autouse=True)
def setup_frontend_data(hass):
    """Set up frontend data required by add_extra_js_url."""
    hass.data[DATA_EXTRA_MODULE_URL] = set()
    hass.data[DATA_EXTRA_JS_URL_ES5] = set()
    yield


@pytest.fixture
def mock_config_entry() -> MockConfigEntry:
    """Return a mock config entry."""
    return MockConfigEntry(
        domain=DOMAIN,
        title="Toggle Timer",
        data={},
        entry_id="test_entry_id",
    )
