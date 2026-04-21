# Timer Action Examples

This document provides examples of using the Toggle Timer timer action with standard Home Assistant cards.

## Overview

With the new timer action feature, you can add timer functionality to ANY existing Home Assistant card (tile, entity, button, etc.) without needing to use the custom `toggle-timer-card`. This allows you to:

- Add timer popups to standard cards through `tap_action`
- Show timer badges on any card to display remaining time
- Keep your existing card configurations while adding timer functionality

## How It Works

The integration now provides:
1. **Timer Popup**: A global dialog that can be triggered from any card
2. **Timer Badge**: A visual indicator showing remaining time that can be added to any card
3. **Global Action Handler**: Automatically loaded when the integration is installed

## Basic Tile Card with Timer

Add timer functionality to a standard tile card:

```yaml
type: tile
entity: switch.shelly_plug_skimmer
icon: mdi:pool
vertical: false
tap_action:
  action: call-service
  service: browser_mod.popup
  data:
    title: Timer
    content:
      type: custom
      custom: toggle-timer-popup
      entity: switch.shelly_plug_skimmer
      durations:
        - 10
        - 20
        - 30
      action: toggle
      revert_to: previous
```

## Simplified Approach with Custom Script

For easier integration, you can use JavaScript to trigger the timer popup:

```yaml
type: tile
entity: switch.bathroom_fan
tap_action:
  action: call-service
  service: browser_mod.javascript
  data:
    code: >
      window.switchForTimeAction(this.hass, {
        entity: 'switch.bathroom_fan',
        durations: [5, 10, 15, 30],
        action: 'on',
        revert_to: 'previous'
      })
```

## Using Custom Actions (Recommended)

The easiest way is to use the fire-dom-event action directly:

```yaml
type: tile
entity: switch.pool_pump
tap_action:
  action: fire-dom-event
  fire_dom_event:
    event: toggle-timer-action
    detail:
      config:
        entity: switch.pool_pump
        durations: [30, 60, 120, 240]
        action: toggle
        revert_to: previous
        allow_custom_duration: true
```

The handler automatically resolves the active Home Assistant instance from the event target, so you don't need to pass `hass` in the event detail.

## Entity Card with Timer Badge

Add a timer badge overlay to show remaining time:

```yaml
type: custom:mod-card
card:
  type: entity
  entity: light.living_room
  tap_action:
    action: fire-dom-event
    fire_dom_event:
      event: toggle-timer-action
      detail:
        config:
          entity: light.living_room
          durations: [15, 30, 60]
          action: toggle
          revert_to: previous
card_mod:
  style: |
    :host {
      position: relative;
    }
extra_entity:
  type: custom:toggle-timer-badge
  entity: light.living_room
```

## Button Card with Timer

```yaml
type: button
entity: fan.bedroom_fan
tap_action:
  action: fire-dom-event
  fire_dom_event:
    event: toggle-timer-action
    detail:
      config:
        entity: fan.bedroom_fan
        durations: [10, 20, 30]
        action: on
        revert_to: off
```

## Multiple Cards in Grid

```yaml
type: grid
columns: 2
cards:
  - type: tile
    entity: switch.outlet_1
    tap_action:
      action: fire-dom-event
      fire_dom_event:
        event: toggle-timer-action
        detail:
          config:
            entity: switch.outlet_1
            durations: [10, 20, 30]

  - type: tile
    entity: switch.outlet_2
    tap_action:
      action: fire-dom-event
      fire_dom_event:
        event: toggle-timer-action
        detail:
          config:
            entity: switch.outlet_2
            durations: [15, 30, 60]
```

## Configuration Options

All standard configuration options are supported:

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `entity` | string | yes | - | Entity ID to control |
| `durations` | array | yes | - | List of durations in minutes (1-8 entries) |
| `action` | string | no | `toggle` | Action: `on`, `off`, or `toggle` |
| `revert_to` | string | no | `previous` | Revert state: `previous`, `on`, `off`, `none` |
| `name` | string | no | - | Override entity friendly name |
| `icon` | string | no | - | Override entity icon |
| `allow_custom_duration` | boolean | no | `false` | Show custom duration input |
| `confirm_cancel` | boolean | no | `false` | Confirm before canceling |
| `theme.popup_title` | string | no | - | Custom popup title template |
| `theme.button_format` | string | no | - | Custom button label format |

## Advanced: Using with card-mod for Badge Overlay

```yaml
type: custom:mod-card
card:
  type: tile
  entity: switch.irrigation_system
  tap_action:
    action: fire-dom-event
    fire_dom_event:
      event: toggle-timer-action
      detail:
        config:
          entity: switch.irrigation_system
          durations: [5, 10, 15, 20]
          action: on
          revert_to: off
          theme:
            popup_title: "Run {name} for..."
            button_format: "{minutes} min"
card_mod:
  style: |
    :host {
      position: relative;
    }
    toggle-timer-badge {
      position: absolute;
      top: 8px;
      right: 8px;
      z-index: 999;
    }
elements:
  - type: custom:toggle-timer-badge
    entity: switch.irrigation_system
```

## Troubleshooting

### Timer popup doesn't appear

1. **Check Browser Console**: Open browser DevTools (F12) and look for these messages:
   - `TOGGLE-TIMER-CARD <current version>` - Main card loaded
   - `TOGGLE-TIMER-ACTION Registering global timer action handler` - Action handler starting
   - `Toggle Timer: Creating action handler element` - Handler being created
   - `Toggle Timer: Action handler element added to DOM` - Handler successfully registered
   - `Toggle Timer: Global timer action handler registered` - Event listener active

2. If you only see `TOGGLE-TIMER-CARD` but not the action handler messages:
   - Restart Home Assistant completely
   - Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Check that the Toggle Timer integration is installed and configured in Settings → Devices & Services

3. Ensure the Toggle Timer integration is installed and configured
4. Verify the frontend JavaScript is loaded at `/hacsfiles/toggle_timer/toggle-timer-card.js`

### Badge doesn't show

1. Make sure you're using card-mod or a card that supports custom elements
2. Verify the entity ID matches exactly
3. Check that a timer is actually active for that entity

### Custom event not firing

1. Some cards may not support `fire-dom-event` action
2. Try using the `browser_mod.javascript` approach instead
3. Ensure you're passing the correct configuration format

## Migration from custom:toggle-timer-card

If you're currently using the custom card, you can migrate to standard cards:

**Before:**
```yaml
type: custom:toggle-timer-card
entity: switch.fan
durations: [10, 20, 30]
action: on
revert_to: previous
```

**After:**
```yaml
type: tile
entity: switch.fan
tap_action:
  action: fire-dom-event
  fire_dom_event:
    event: toggle-timer-action
    detail:
      config:
        entity: switch.fan
        durations: [10, 20, 30]
        action: on
        revert_to: previous
```

## Benefits

- ✅ Use any standard Home Assistant card
- ✅ No need to learn custom card syntax
- ✅ Consistent with other card actions
- ✅ Easier to maintain and update
- ✅ Works with card-mod and other customizations
- ✅ Better performance (no custom card overhead)
