# Integration Tests

This directory contains tests for the Switch Timer custom integration.

## Running tests

```bash
npm test
```

Or run pytest directly:

```bash
pytest tests/ -v
```

## Test files

- `conftest.py` - shared fixtures for the custom integration test environment
- `test_init.py` - setup, service registration, and unload coverage
- `test_integration_e2e.py` - end-to-end setup coverage with a Home Assistant instance
- `test_manager.py` - timer persistence and restart/recovery coverage
- `test_version_sync.py` - repository metadata and integration rename checks
