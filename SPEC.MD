# Switch Timer Specification

## Scope

This repository contains only the Home Assistant custom integration for Switch Timer. It does not ship a Lovelace card or other frontend assets.

## Integration identity

- Repository: `switch-timer-homeassistant`
- Domain: `switch_timer`
- Name: `Switch Timer`
- Integration type: `service`

## Core behavior

1. `switch_timer.start` stores timer metadata for a supported entity and applies the requested action.
2. `switch_timer.cancel` stops an active timer and applies the configured revert behavior immediately.
3. `sensor.switch_timer_state` exposes the active timer map for dashboards, automations, and debugging.
4. Timer state is persisted in Home Assistant storage and restored during startup.
5. Expired timers are finished during startup so recovery is safe after restarts or reboots.

## Supported domains

- `switch`
- `light`
- `input_boolean`
- `fan`
- `siren`
- `humidifier`
- `media_player` (`toggle` is rejected)

## Restart recovery requirements

- Future timers must be rescheduled when Home Assistant restarts.
- Timers that expired during downtime must be reverted during startup.
- Invalid persisted timer entries must be discarded without breaking startup.

## Validation

The repository is validated with:

```bash
npm run lint
npm run build
npm test
```
