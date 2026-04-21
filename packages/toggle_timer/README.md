# Toggle Timer - Backend Package

This directory contains the **legacy Home Assistant package backend** for the Toggle Timer custom card.
If you want a no-`configuration.yaml` setup, use the integration backend in `custom_components/toggle_timer` instead.

## Installation

1. Ensure your `configuration.yaml` includes:
   ```yaml
   homeassistant:
     packages: !include_dir_named packages
   ```

2. Copy the `package.yaml` file to your Home Assistant config directory:
   ```
   <config>/packages/toggle_timer/package.yaml
   ```
   Or simply:
   ```
   <config>/packages/toggle_timer.yaml
   ```

3. Restart Home Assistant

## What's Included

This package creates the following entities:

### Input Helpers
- `input_text.toggle_timer_state` - Stores timer state as JSON (survives restarts)

### Timers (8 slots)
- `timer.toggle_timer_slot_1` through `timer.toggle_timer_slot_8`

### Scripts
- `script.toggle_timer` - Main script to start a timed switch operation
- `script.toggle_timer_cancel` - Cancel a timer for a specific entity
- `script.toggle_timer_persist` - Persist timer state
- `script.toggle_timer_remove_state` - Remove entity from state
- `script.toggle_timer_revert` - Revert entity to target state

### Automations
- `automation.toggle_timer_on_timer_finished` - Handle timer completion
- `automation.toggle_timer_resume_on_restart` - Resume timers after HA restart

## Configuration

By default, the package provides 8 timer slots. This means you can have up to 8 concurrent timers running across different entities.

If you need more slots, you can:
1. Edit the `package.yaml` file
2. Add more timer entities (e.g., `timer.toggle_timer_slot_9`)
3. Add corresponding triggers in the automation

## Events

The package fires the following custom events:
- `toggle_timer_started` - When a timer starts
- `toggle_timer_finished` - When a timer completes
- `toggle_timer_cancelled` - When a timer is cancelled

These events are used by the frontend card to update the UI in real-time.
