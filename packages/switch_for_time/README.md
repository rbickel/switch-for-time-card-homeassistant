# Switch For Time - Backend Package

This directory contains the Home Assistant package that provides the backend scripts and automations for the Switch For Time custom card.

## Installation

1. Ensure your `configuration.yaml` includes:
   ```yaml
   homeassistant:
     packages: !include_dir_named packages
   ```

2. Copy the `package.yaml` file to your Home Assistant config directory:
   ```
   <config>/packages/switch_for_time/package.yaml
   ```
   Or simply:
   ```
   <config>/packages/switch_for_time.yaml
   ```

3. Restart Home Assistant

## What's Included

This package creates the following entities:

### Input Helpers
- `input_text.switch_for_time_state` - Stores timer state as JSON (survives restarts)

### Timers (8 slots)
- `timer.switch_for_time_slot_1` through `timer.switch_for_time_slot_8`

### Scripts
- `script.switch_for_time` - Main script to start a timed switch operation
- `script.switch_for_time_cancel` - Cancel a timer for a specific entity
- `script.switch_for_time_persist` - Persist timer state
- `script.switch_for_time_remove_state` - Remove entity from state
- `script.switch_for_time_revert` - Revert entity to target state

### Automations
- `automation.switch_for_time_on_timer_finished` - Handle timer completion
- `automation.switch_for_time_resume_on_restart` - Resume timers after HA restart

## Configuration

By default, the package provides 8 timer slots. This means you can have up to 8 concurrent timers running across different entities.

If you need more slots, you can:
1. Edit the `package.yaml` file
2. Add more timer entities (e.g., `timer.switch_for_time_slot_9`)
3. Add corresponding triggers in the automation

## Events

The package fires the following custom events:
- `switch_for_time_started` - When a timer starts
- `switch_for_time_finished` - When a timer completes
- `switch_for_time_cancelled` - When a timer is cancelled

These events are used by the frontend card to update the UI in real-time.
