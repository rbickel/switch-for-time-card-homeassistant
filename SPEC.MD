# toggle-timer

A Home Assistant custom Lovelace card + companion script package that lets the user tap any entity, pick a duration from quick-buttons in a popup, and toggle that entity (on / off / toggle) for the chosen duration before reverting it automatically.

---

## 1. Goals & non-goals

### Goals
- Tap any Lovelace entity → popup with quick-pick duration buttons (durations configured in YAML).
- After picking a duration, the target entity is switched to the configured state (`on`, `off`, or `toggle`) and reverts to its **previous** state after the duration elapses.
- The timed action survives Home Assistant restarts.
- Tapping again while a timer is running shows the remaining time and lets the user **cancel**, **extend**, or **replace** the timer.
- Distributable as a single HACS-compatible repository (frontend custom card + backend YAML package).

### Non-goals
- No cloud, no external dependencies.
- No support for non-switchable entities (lights/switches/input_booleans/fans only — see §4).
- No scheduling (use HA automations/schedule helpers for that).
- No per-user duration presets — durations are global per card config.

---

## 2. Repository layout

```
toggle-timer/
├── README.md
├── SPEC.md                          # this file
├── hacs.json                        # HACS metadata (frontend + integration)
├── info.md                          # HACS info card
├── LICENSE
├── dist/
│   └── toggle-timer-card.js      # built custom card (HACS frontend artifact)
├── src/
│   ├── toggle-timer-card.ts      # custom card source (Lit + TS)
│   ├── editor.ts                    # GUI editor for the card
│   ├── types.ts                     # shared type defs
│   └── localize/
│       ├── en.json
│       └── fr.json
├── package.json
├── tsconfig.json
├── rollup.config.js
└── packages/
    └── toggle_timer/
        ├── package.yaml             # HA package: script + helpers
        └── README.md                # install instructions for the backend
```

The `dist/toggle-timer-card.js` file is what HACS installs as a Lovelace resource. The `packages/toggle_timer/package.yaml` is what the user includes via `homeassistant.packages` in their `configuration.yaml`.

---

## 3. Backend (Home Assistant package)

### 3.1 Helpers created by the package

| Entity ID | Type | Purpose |
|---|---|---|
| `input_text.toggle_timer_state` | input_text (max 255) | JSON blob storing per-entity timer state so it survives restarts. Keyed by `entity_id`. |

> Why `input_text` and not a custom integration: keeps the package install pure-YAML, no Python. If the JSON exceeds 255 chars (many concurrent timers), we shard across `input_text.toggle_timer_state_2`, `_3`, … (see §3.4). For v1, document the 255-char limit and warn if exceeded.

### 3.2 Script: `script.toggle_timer`

**Fields:**

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `entity_id` | entity selector (domain: switch, light, input_boolean, fan) | yes | — | Target entity. |
| `action` | select: `on`, `off`, `toggle` | yes | — | What to do at start. |
| `duration_minutes` | number (1–1440) | yes | — | How long before reverting. |
| `revert_to` | select: `previous`, `on`, `off`, `none` | no | `previous` | What state to set when the timer ends. `none` = leave as-is. |
| `cancel_existing` | boolean | no | `true` | If a timer already exists for this entity, cancel it before starting a new one. |

**Behaviour (pseudocode):**

```yaml
sequence:
  # 1. If a timer for this entity already exists, cancel it (script + timer helper).
  - if: "{{ cancel_existing and entity_has_active_timer(entity_id) }}"
    then:
      - service: script.toggle_timer_cancel
        data:
          entity_id: "{{ entity_id }}"

  # 2. Capture current state for revert.
  - variables:
      previous_state: "{{ states(entity_id) }}"
      timer_id: "toggle_timer_{{ entity_id | replace('.', '_') }}"
      ends_at: "{{ (now() + timedelta(minutes=duration_minutes)).isoformat() }}"

  # 3. Persist state (so we survive restarts).
  - service: script.toggle_timer_persist
    data:
      entity_id: "{{ entity_id }}"
      previous_state: "{{ previous_state }}"
      revert_to: "{{ revert_to }}"
      ends_at: "{{ ends_at }}"

  # 4. Apply the action.
  - choose:
      - conditions: "{{ action == 'on' }}"
        sequence:
          - service: homeassistant.turn_on
            target: { entity_id: "{{ entity_id }}" }
      - conditions: "{{ action == 'off' }}"
        sequence:
          - service: homeassistant.turn_off
            target: { entity_id: "{{ entity_id }}" }
      - conditions: "{{ action == 'toggle' }}"
        sequence:
          - service: homeassistant.toggle
            target: { entity_id: "{{ entity_id }}" }

  # 5. Start a dynamically-created timer helper (timer.start with duration override).
  - service: timer.start
    target:
      entity_id: timer.toggle_timer_runtime
    data:
      duration: "{{ '%02d:%02d:00' | format(duration_minutes // 60, duration_minutes % 60) }}"

  # 6. Fire an event so the frontend can update without polling.
  - event: toggle_timer_started
    event_data:
      entity_id: "{{ entity_id }}"
      ends_at: "{{ ends_at }}"
      duration_minutes: "{{ duration_minutes }}"
```

> **Implementation note on timers:** Home Assistant `timer` helpers are static. For per-entity timers we have two options:
>
> - **(A) One shared timer + queue:** single `timer.toggle_timer_runtime`, but only supports one active timer at a time. Simple, but a real limitation.
> - **(B) Dynamic timers via the new `timer` integration features:** since HA 2024.x, timers can be created at runtime via the helpers UI but **not via YAML at runtime**. So we instead create N pre-allocated timers (`timer.toggle_timer_slot_1` … `_slot_8`) and a slot-allocation script picks a free one.
>
> **Decision: implement (B) with 8 slots by default**, configurable via `slot_count` in the package include. Document how to raise it.

### 3.3 Companion scripts

- `script.toggle_timer_cancel` — takes `entity_id`, finds the slot timer, cancels it, removes persisted state, fires `toggle_timer_cancelled` event.
- `script.toggle_timer_persist` — writes JSON to `input_text.toggle_timer_state`.
- `script.toggle_timer_revert` — called by the automation below when a slot timer fires; reads persisted state, applies `revert_to`, clears the slot.

### 3.4 Automation: `automation.toggle_timer_on_timer_finished`

Triggers on `event_type: timer.finished` for any `timer.toggle_timer_slot_*`. Action: call `script.toggle_timer_revert` with the slot id. Looks up which `entity_id` was assigned to that slot in `input_text.toggle_timer_state`, applies the configured revert, fires `toggle_timer_finished` event.

### 3.5 Automation: `automation.toggle_timer_resume_on_restart`

Triggers on `homeassistant.start`. Reads `input_text.toggle_timer_state`, for every entry whose `ends_at` is still in the future, restarts the matching slot timer with the remaining duration. For entries whose `ends_at` is in the past, immediately calls `script.toggle_timer_revert`.

### 3.6 State JSON schema

```json
{
  "switch.living_room_lamp": {
    "slot": 3,
    "previous_state": "off",
    "revert_to": "previous",
    "started_at": "2026-04-17T18:22:11+02:00",
    "ends_at": "2026-04-17T18:52:11+02:00",
    "action": "on",
    "duration_minutes": 30
  }
}
```

---

## 4. Supported target entity domains

`switch`, `light`, `input_boolean`, `fan`, `siren`, `humidifier`, `media_player` (limited to on/off).

The card validates the configured `entity` against this list and shows a config error otherwise.

---

## 5. Frontend (custom Lovelace card)

### 5.1 Card identity

- Custom element name: `toggle-timer-card`
- HACS category: `plugin`
- Registered in `customCards` window registry with name "Toggle Timer" and description "Tap an entity, pick a duration, auto-revert."

### 5.2 Card YAML config schema

```yaml
type: custom:toggle-timer-card
entity: switch.living_room_lamp        # required
action: toggle                          # on | off | toggle  (default: toggle)
revert_to: previous                     # previous | on | off | none (default: previous)
durations: [10, 20, 30, 40]             # required, list of minutes, 1–8 entries
name: Living room lamp                  # optional, overrides friendly_name
icon: mdi:lamp                          # optional, overrides entity icon
show_remaining: true                    # default true — show countdown when timer active
allow_custom_duration: true             # default false — show "+" button opening a number input
confirm_cancel: false                   # default false — confirm before cancel when re-tapped
tap_behavior: popup                     # popup | immediate (default: popup)
                                        # if "immediate", tap uses durations[0] directly with no popup
long_press_action: cancel               # none | cancel  (default: cancel) — long-press to cancel a running timer
theme:
  popup_title: "Turn {action} for…"     # template-style placeholders: {action}, {entity}, {name}
  button_format: "{minutes} min"         # label format on each duration button
```

### 5.3 GUI editor (`editor.ts`)

Implements the standard Lovelace `getConfigElement` pattern. Provides form fields for every key above using `ha-form` schema. Validates:

- `entity` is in a supported domain (§4).
- `durations` has 1–8 unique positive integers.
- `action` ∈ {on, off, toggle}.

### 5.4 Default render (idle state, no active timer)

Render like a standard `entity` row: icon, name, current state on the right. Style matches the user's HA theme (use HA CSS variables: `--primary-text-color`, `--secondary-text-color`, `--state-icon-color`, etc.). Tapping the row opens the popup (§5.5). Long-press on idle does nothing (or opens more-info if configured — see §5.7).

### 5.5 Popup (active behaviour)

A modal dialog using `mwc-dialog` (or `ha-dialog` if available), opened on tap. Contents:

- **Title:** rendered from `theme.popup_title` template. Default: `Turn {action} for…` where `{action}` is "on" / "off" / "toggle" word.
- **Body:** a horizontal row of pill buttons, one per entry in `durations`. Each shows e.g. "10 min", "20 min".
- **Optional `+` button** if `allow_custom_duration: true` — opens a small inline number input (1–1440).
- **Cancel** button at bottom.

Clicking a duration button:
1. Closes the popup.
2. Calls `hass.callService('script', 'toggle_timer', { entity_id, action, duration_minutes, revert_to })`.
3. Shows a brief toast: "Timer started: 30 min".

### 5.6 Render when timer is active

Detect active timer by listening to `toggle_timer_started` / `toggle_timer_finished` / `toggle_timer_cancelled` events on the HA WebSocket, plus reading `input_text.toggle_timer_state` on initial render.

When active, the card row shows:
- Icon with a subtle pulsing dot overlay.
- Right side: countdown like `23:14` (mm:ss) instead of the entity state. Updates every second via `setInterval` while the card is on screen; cleared in `disconnectedCallback`.
- Tap → opens popup with three actions: **Cancel timer**, **Replace** (re-shows duration buttons), **Extend** (re-shows duration buttons; selected duration is **added** to remaining time).

### 5.7 Long-press

If `long_press_action: cancel` and a timer is active, long-press cancels it directly (with optional confirm via `confirm_cancel`). If no timer is active, long-press opens HA's standard more-info dialog for the entity.

### 5.8 Events listened to

- `state_changed` for the configured entity (to refresh state display).
- `state_changed` for `input_text.toggle_timer_state` (to refresh active timer state).
- Custom events `toggle_timer_started`, `toggle_timer_finished`, `toggle_timer_cancelled`.

### 5.9 i18n

Strings in `src/localize/{lang}.json`. Card auto-detects from `hass.locale.language`. Ship with `en` and `fr` for v1.

---

## 6. Install flow (end-user)

1. Add this repo to HACS as a custom repository (category: Integration). Install "Toggle Timer".
2. Add to HACS as a custom repository (category: Frontend) for the card. Install "Toggle Timer Card".
3. In `configuration.yaml`, ensure `homeassistant: packages: !include_dir_named packages` is set, and copy `packages/toggle_timer/package.yaml` to `<config>/packages/toggle_timer.yaml`.
4. Restart HA.
5. Add the card to a dashboard via the GUI editor or YAML.

The `README.md` walks through this in detail with screenshots.

---

## 7. Acceptance criteria

A v1 release is considered complete when **all** of the following hold:

1. Installing the package + card via HACS on a fresh HA install requires no manual file edits beyond step 3 above.
2. Tapping a configured card opens a popup within 200ms showing the configured durations.
3. Selecting a duration triggers the entity action immediately and the entity reverts within ±2s of the chosen duration.
4. If HA is restarted mid-timer, the timer resumes with the correct remaining duration on next start.
5. If the timer's `ends_at` passed during downtime, the entity is reverted on next start.
6. Re-tapping a card with an active timer offers cancel/replace/extend, and each works as specified.
7. Up to 8 concurrent timers across different entities work correctly. Attempting a 9th surfaces a non-fatal notification: "All toggle-timer slots are in use."
8. The GUI editor produces valid YAML and rejects invalid `durations` / `entity` values inline.
9. Card renders correctly in light, dark, and a custom community theme without hard-coded colors.
10. The package YAML passes `hassfest` and `ha core check` linting; the card source passes `eslint` + `tsc --noEmit`.

---

## 8. Out-of-scope ideas (parking lot for v2)

- Schedule-based actions (e.g. "off for 30 min every weekday at 22:00").
- Group targets (one card → multiple entities).
- Per-card visual style overrides beyond `theme` block.
- Mushroom/Bubble card styling presets.
- Dynamic timer slot allocation via a Python custom integration (would remove the 8-slot ceiling).
- Voice-assistant intent: "Hey, turn off the lamp for 20 minutes."

---

## 9. Open questions for the implementer

1. Should the popup also expose a **"Stop now"** button when no timer is running but the entity is currently on? (Design suggests no — keep the card focused.)
2. For `action: toggle`, what should `revert_to: previous` do? Proposal: revert means "set back to whatever it was before the toggle," i.e. functionally identical to toggling again. Confirm during implementation.
3. Should the slot count be a card-level setting or a package-level setting? Proposal: package-level only (it's a global resource).
4. Should we emit a persistent notification when a timer ends, or stay silent? Proposal: silent by default, with a `notify_on_finish: true` card option.
