# Switch Timer

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Switch Timer is a Home Assistant custom integration that starts temporary timers for supported entities and automatically restores the requested state when the timer ends.

## Features

- Start timed `on`, `off`, or `toggle` actions for supported entities
- Restore the previous state or a fixed target state when the timer ends
- Persist active timers across Home Assistant restarts
- Recover expired timers immediately after restart
- Expose active timers through `sensor.switch_timer_state`
- Support up to 8 concurrent timers

## Installation

### HACS

1. Open HACS in Home Assistant.
2. Go to **Integrations**.
3. Add `https://github.com/rbickel/switch-timer-homeassistant` as a custom repository.
4. Download **Switch Timer**.
5. Restart Home Assistant.
6. Go to **Settings → Devices & Services → Add Integration**.
7. Search for **Switch Timer** and complete the setup.

### Manual

1. Download the latest release from `https://github.com/rbickel/switch-timer-homeassistant/releases`.
2. Copy `custom_components/switch_timer` into your Home Assistant `custom_components` directory.
3. Restart Home Assistant.
4. Add **Switch Timer** from **Settings → Devices & Services**.

## Services

### `switch_timer.start`

Starts or replaces a timer for an entity.

```yaml
service: switch_timer.start
data:
  entity_id: switch.bathroom_fan
  action: on
  duration_minutes: 15
  revert_to: previous
  cancel_existing: true
```

### `switch_timer.cancel`

Cancels an active timer and applies the configured revert behavior immediately.

```yaml
service: switch_timer.cancel
data:
  entity_id: switch.bathroom_fan
```

## State Sensor

The integration creates `sensor.switch_timer_state`.

- The sensor state is a compact JSON map of active timers.
- `active_timers` reports the current timer count.
- `timers` exposes the full in-memory timer metadata.

## Supported Entity Domains

- `switch`
- `light`
- `input_boolean`
- `fan`
- `siren`
- `humidifier`
- `media_player` (`toggle` is not supported)

## Restart and Recovery Behavior

- Active timers are persisted in Home Assistant storage.
- Timers that still have time remaining are rescheduled after restart.
- Timers that expired while Home Assistant was offline are reverted during startup.
- Invalid persisted timer state is discarded during startup to keep recovery safe.

## Examples

See [EXAMPLES.md](EXAMPLES.md) for service-call and automation examples.

## Development

```bash
npm run lint
npm run build
npm test
```

- `npm run lint` parses the Python sources used by the integration and tests.
- `npm run build` verifies that the repository contains only the integration artifacts.
- `npm test` runs the pytest suite.

## Migration Notes

If you are upgrading from the previous `switch_for_time` naming:

- Integration domain: `switch_timer`
- Services: `switch_timer.start` and `switch_timer.cancel`
- State sensor: `sensor.switch_timer_state`
- Repository URL: `https://github.com/rbickel/switch-timer-homeassistant`

## Support

Open issues at `https://github.com/rbickel/switch-timer-homeassistant/issues`.
