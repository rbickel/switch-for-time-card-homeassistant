"""Constants for the Switch Timer integration."""

DOMAIN = "switch_timer"
STORAGE_KEY = "switch_timer.timers"
STORAGE_VERSION = 1
MAX_TIMERS = 8

SIGNAL_STATE_UPDATED = f"{DOMAIN}_state_updated"

SUPPORTED_DOMAINS = {
    "switch",
    "light",
    "input_boolean",
    "fan",
    "siren",
    "humidifier",
    "media_player",
}

EVENT_STARTED = "switch_timer_started"
EVENT_FINISHED = "switch_timer_finished"
EVENT_CANCELLED = "switch_timer_cancelled"

SENSOR_ENTITY_ID = "sensor.switch_timer_state"
SENSOR_UNIQUE_ID = "switch_timer_state"

SERVICE_START = "start"
SERVICE_CANCEL = "cancel"

CONF_ACTION = "action"
CONF_DURATION_MINUTES = "duration_minutes"
CONF_REVERT_TO = "revert_to"
CONF_CANCEL_EXISTING = "cancel_existing"

ACTION_ON = "on"
ACTION_OFF = "off"
ACTION_TOGGLE = "toggle"

REVERT_PREVIOUS = "previous"
REVERT_ON = "on"
REVERT_OFF = "off"
REVERT_NONE = "none"
