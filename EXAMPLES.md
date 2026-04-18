# Switch Timer Examples

## Start a timer from an automation

```yaml
automation:
  - alias: Run bathroom fan for 15 minutes
    triggers:
      - trigger: state
        entity_id: binary_sensor.bathroom_humidity_high
        to: "on"
    actions:
      - service: switch_timer.start
        data:
          entity_id: switch.bathroom_fan
          action: on
          duration_minutes: 15
          revert_to: previous
```

## Turn a light off temporarily

```yaml
script:
  movie_mode_light_pause:
    sequence:
      - service: switch_timer.start
        data:
          entity_id: light.living_room
          action: off
          duration_minutes: 45
          revert_to: previous
```

## Cancel a running timer

```yaml
service: switch_timer.cancel
data:
  entity_id: switch.bathroom_fan
```

## Inspect active timers

```yaml
type: entities
entities:
  - entity: sensor.switch_timer_state
```

The sensor attributes expose the full timer map and active timer count.
