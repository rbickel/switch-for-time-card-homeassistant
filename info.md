# Toggle Timer Card

A Home Assistant custom Lovelace card that lets you tap any entity, pick a duration from quick-pick buttons, and toggle that entity (on/off/toggle) for the chosen duration before automatically reverting it.

## Features

- ⏱️ **Quick Duration Buttons**: Tap any entity and select from pre-configured durations
- 🔄 **Auto-Revert**: Automatically returns entities to their previous state after the timer
- 💾 **Survives Restarts**: Timers persist through Home Assistant restarts
- 🎯 **Multiple Timers**: Support for up to 8 concurrent timers (configurable)
- 📱 **Mobile Friendly**: Clean, responsive interface that works on all devices
- 🌍 **i18n Support**: Includes English and French translations
- 🎨 **Theme Support**: Uses Home Assistant theme variables for consistent styling

## What's Included

This repository includes both:
1. **Frontend**: Custom Lovelace card (TypeScript/Lit)
2. **Backend**: Home Assistant package with scripts and automations (YAML)

## Supported Entity Types

- `switch` - Switches
- `light` - Lights
- `input_boolean` - Input Booleans
- `fan` - Fans
- `siren` - Sirens
- `humidifier` - Humidifiers
- `media_player` - Media Players (on/off only)

## Example

```yaml
type: custom:toggle-timer-card
entity: switch.living_room_lamp
action: toggle
revert_to: previous
durations: [10, 20, 30, 60]
name: Living Room Lamp
show_remaining: true
allow_custom_duration: true
```

## Options

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `type` | string | yes | - | Must be `custom:toggle-timer-card` |
| `entity` | string | yes | - | Entity ID to control |
| `action` | string | no | `toggle` | Action: `on`, `off`, or `toggle` |
| `revert_to` | string | no | `previous` | Revert to: `previous`, `on`, `off`, or `none` |
| `durations` | array | yes | - | List of durations in minutes (1-8 entries) |
| `name` | string | no | - | Override entity friendly name |
| `icon` | string | no | - | Override entity icon |
| `show_remaining` | boolean | no | `true` | Show countdown when timer is active |
| `allow_custom_duration` | boolean | no | `false` | Allow custom duration input |
| `confirm_cancel` | boolean | no | `false` | Confirm before canceling |
| `tap_behavior` | string | no | `popup` | `popup` or `immediate` |
| `long_press_action` | string | no | `cancel` | `none` or `cancel` |

## Installation

See the main README.md for detailed installation instructions.
