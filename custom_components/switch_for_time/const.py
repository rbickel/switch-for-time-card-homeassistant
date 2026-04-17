"""Constants for the Switch For Time integration."""

DOMAIN = "switch_for_time"
STORAGE_KEY = "switch_for_time.timers"
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

EVENT_STARTED = "switch_for_time_started"
EVENT_FINISHED = "switch_for_time_finished"
EVENT_CANCELLED = "switch_for_time_cancelled"

SENSOR_ENTITY_ID = "sensor.switch_for_time_state"
SENSOR_UNIQUE_ID = "switch_for_time_state"

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
