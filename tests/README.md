# Integration Tests

This directory contains integration tests for the Toggle Timer custom Home Assistant integration.

## Setup

Install the test dependencies:

```bash
pip install -r requirements_test.txt
```

## Running Tests

Run all tests:

```bash
pytest tests/ -v
```

Or using npm:

```bash
npm test
```

Run a specific test file:

```bash
pytest tests/test_init.py -v
```

Run a specific test:

```bash
pytest tests/test_init.py::test_async_setup_entry_registers_static_paths -v
```

## Test Structure

- `conftest.py` - Pytest fixtures and configuration
- `test_init.py` - Unit tests for integration setup, services, and static path registration
- `test_integration_e2e.py` - End-to-end integration test with real Home Assistant instance

## What's Tested

1. **Integration Setup** - Tests that the integration loads correctly
2. **Static Path Registration** - Tests that the frontend card is registered using StaticPathConfig
3. **Service Registration** - Tests that `toggle_timer.start` and `toggle_timer.cancel` services are registered
4. **Manager Initialization** - Tests that the ToggleTimerManager is created and initialized
5. **Platform Forwarding** - Tests that the sensor platform is loaded
6. **Unload** - Tests that the integration unloads cleanly
7. **End-to-End** - Tests the full integration lifecycle with HTTP component

## Coverage

The tests provide comprehensive coverage of:
- Integration loading and setup
- Static path registration (StaticPathConfig API)
- Service registration and handling
- Manager lifecycle
- Platform setup
- Error handling

## Requirements

- Home Assistant 2024.1.0+
- pytest 7.4.0+
- pytest-asyncio 0.21.0+
- pytest-homeassistant-custom-component 0.13.0+
