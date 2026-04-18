"""Fixtures for Switch For Time integration tests."""
import pytest
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.switch_for_time.const import DOMAIN


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Enable loading custom integrations."""
    yield


@pytest.fixture
def mock_config_entry() -> MockConfigEntry:
    """Return a mock config entry."""
    return MockConfigEntry(
        domain=DOMAIN,
        title="Switch For Time",
        data={},
        entry_id="test_entry_id",
    )
