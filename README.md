# Toggle Timer Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Home Assistant custom Lovelace card + companion script package that lets you tap any entity, pick a duration from quick-pick buttons in a popup, and toggle that entity (on/off/toggle) for the chosen duration before automatically reverting it.

## ✨ Features

- ⏱️ **Quick Duration Buttons**: Tap any entity and select from pre-configured durations
- 🎯 **Works with ANY Card**: New! Add timer functionality to standard Home Assistant cards (tile, entity, button, etc.) through tap_action
- 🏷️ **Visual Timer Badge**: Optional badge overlay shows remaining time on any card
- 🔄 **Auto-Revert**: Automatically returns entities to their previous state after the timer
- 💾 **Survives Restarts**: Timers persist through Home Assistant restarts
- 🎯 **Multiple Timers**: Support for up to 8 concurrent timers (configurable)
- 📱 **Mobile Friendly**: Clean, responsive interface that works on all devices
- 🌍 **i18n Support**: Includes English and French translations
- 🎨 **Theme Support**: Uses Home Assistant theme variables for consistent styling
- ✏️ **Visual Editor**: Full GUI configuration editor in Lovelace UI

## 📷 Screenshots

<!-- Add screenshots here when available -->

## 🎯 Use Cases

- Turn on a bathroom fan for 15 minutes
- Enable a switch for 30 minutes then auto-off
- Toggle lights temporarily without forgetting to turn them off
- Any scenario where you need temporary control with automatic revert

## 🚀 Installation

### Prerequisites

You need both the **frontend card** AND a **backend** for this to work.

### HACS Installation (Recommended)

This repository provides both the frontend Lovelace card and the backend Home Assistant integration in a single package.

1. Open HACS in Home Assistant
2. Go to "Integrations"
3. Click the menu (⋮) in the top right
4. Select "Custom repositories"
5. Add this repository URL: `https://github.com/rbickel/toggle-timer-homeassistant`
6. Select category: "Integration"
7. Click "Add"
8. Find "Toggle Timer" in the integrations list and click "Download"
9. Restart Home Assistant
10. **IMPORTANT:** Go to **Settings → Devices & Services → Add Integration** and search for "Toggle Timer"
11. **IMPORTANT:** Add the **Toggle Timer** integration via the UI - this step is required for the card to work!
12. **Frontend JavaScript registration:** After step 11, the integration auto-registers the card at `/hacsfiles/toggle_timer/toggle-timer-card.js`. No manual Lovelace resource is needed. If you want to double-check, open **Settings → Dashboards → Resources** and confirm a `module` resource exists with that URL (add it if it is missing).

**⚠️ Critical:** The Lovelace card will **only** be loaded after you configure the integration in step 10-11. Simply downloading via HACS is not enough - you **must** add the integration via **Settings → Devices & Services**. The Lovelace card is automatically registered when you configure the integration. You do **not** need to add this repository separately as a Frontend/Lovelace repository.

After installation, you can add the card to your Lovelace dashboard. The card is available at:
```
/hacsfiles/toggle_timer/toggle-timer-card.js
```

This provides:
- **Backend**: The `toggle_timer.start` and `toggle_timer.cancel` services and `sensor.toggle_timer_state`
- **Frontend**: The `custom:toggle-timer-card` Lovelace card

### Manual Installation

#### Integration (Recommended)

1. Download the latest release from [GitHub releases](https://github.com/rbickel/toggle-timer-homeassistant/releases)
2. Extract the `custom_components/toggle_timer` folder to your Home Assistant `custom_components` directory
3. Restart Home Assistant
4. Go to **Settings → Devices & Services → Add Integration** and add **Toggle Timer**
5. **Frontend JavaScript registration:** The integration will register `/hacsfiles/toggle_timer/toggle-timer-card.js` for you after step 4. Verify under **Settings → Dashboards → Resources** that a `module` resource with that URL exists (add it manually if it's missing).

The integration includes the frontend card in its `www` directory and will automatically register it.

#### Legacy Frontend Card Only (Not Recommended)

If you want to install just the frontend card manually:

1. Download `dist/toggle-timer-card.js` from the [latest release](https://github.com/rbickel/toggle-timer-homeassistant/releases)
2. Copy it to `<config>/www/toggle-timer-card.js`
3. Add to your Lovelace resources:
   ```yaml
   resources:
     - url: /local/toggle-timer-card.js
       type: module
   ```
4. Restart Home Assistant

**Note:** The frontend card alone won't work without a backend. You'll still need to install either the integration (recommended) or the legacy YAML package (see below).

### Legacy Backend Package (Advanced Users Only)

The recommended backend is the integration (installed via HACS or manually). However, if you prefer the original YAML package backend for advanced customization:

1. Ensure your `configuration.yaml` includes package support:
   ```yaml
   homeassistant:
     packages: !include_dir_named packages
   ```

2. Create the packages directory if it doesn't exist:
   ```bash
   mkdir -p <config>/packages/toggle_timer
   ```

3. Copy `packages/toggle_timer/package.yaml` to `<config>/packages/toggle_timer/package.yaml`
4. Restart Home Assistant

## 🎨 Configuration

### Timer Action for Standard Cards (NEW!)

You can now add timer functionality to ANY Home Assistant card using tap_action! No need to use the custom card if you prefer standard cards.

**Quick Example with Tile Card:**
```yaml
type: tile
entity: switch.shelly_plug_skimmer
icon: mdi:pool
vertical: false
tap_action:
  action: fire-dom-event
  fire_dom_event:
    event: toggle-timer-action
    detail:
      config:
        entity: switch.shelly_plug_skimmer
        durations: [10, 20, 30]
        action: toggle
        revert_to: previous
```

**With Timer Badge (shows remaining time):**
```yaml
type: custom:mod-card
card:
  type: tile
  entity: switch.bathroom_fan
  tap_action:
    action: fire-dom-event
    fire_dom_event:
      event: toggle-timer-action
      detail:
        config:
          entity: switch.bathroom_fan
          durations: [5, 10, 15, 30]
          action: on
          revert_to: previous
card_mod:
  style: |
    :host {
      position: relative;
    }
elements:
  - type: custom:toggle-timer-badge
    entity: switch.bathroom_fan
```

See [EXAMPLES.md](EXAMPLES.md) for more examples with different card types!

### Basic Example (Custom Card)

```yaml
type: custom:toggle-timer-card
entity: switch.bathroom_fan
action: on
revert_to: previous
durations: [5, 10, 15, 30]
```

### Advanced Example

```yaml
type: custom:toggle-timer-card
entity: light.living_room
action: toggle
revert_to: previous
durations: [10, 20, 30, 60, 120]
name: Living Room Light
icon: mdi:lightbulb
show_remaining: true
allow_custom_duration: true
confirm_cancel: false
tap_behavior: popup
long_press_action: cancel
theme:
  popup_title: "Keep {name} on for…"
  button_format: "{minutes} minutes"
```

### Configuration Options

| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `type` | string | yes | - | Must be `custom:toggle-timer-card` |
| `entity` | string | yes | - | Entity ID to control |
| `action` | string | no | `toggle` | Action to perform: `on`, `off`, or `toggle` |
| `revert_to` | string | no | `previous` | State to revert to: `previous`, `on`, `off`, or `none` |
| `durations` | array | yes | - | List of durations in minutes (1-8 entries) |
| `name` | string | no | - | Override entity friendly name |
| `icon` | string | no | - | Override entity icon (e.g., `mdi:fan`) |
| `show_remaining` | boolean | no | `true` | Show countdown when timer is active |
| `allow_custom_duration` | boolean | no | `false` | Show "+ Custom" button for manual input |
| `confirm_cancel` | boolean | no | `false` | Show confirmation before canceling |
| `tap_behavior` | string | no | `popup` | `popup` (show dialog) or `immediate` (use first duration) |
| `long_press_action` | string | no | `cancel` | `none` or `cancel` (cancel active timer) |
| `theme.popup_title` | string | no | - | Custom popup title template |
| `theme.button_format` | string | no | - | Custom button label format |

### Theme Templates

You can customize the popup title and button labels using placeholders:

**Popup Title** (`theme.popup_title`):
- `{action}` - The action (on/off/toggle)
- `{entity}` - The entity ID
- `{name}` - The entity friendly name

**Button Format** (`theme.button_format`):
- `{minutes}` - The duration in minutes

## 🎛️ Supported Entity Types

The card works with the following entity domains:
- `switch` - Switches
- `light` - Lights
- `input_boolean` - Input Booleans
- `fan` - Fans
- `siren` - Sirens
- `humidifier` - Humidifiers
- `media_player` - Media Players (on/off only)

## 🔧 Backend Configuration

The backend package creates the following:

### Entities
- `sensor.toggle_timer_state` - State JSON from integration backend
- `input_text.toggle_timer_state` - State JSON from legacy package backend
- `timer.toggle_timer_slot_1` through `timer.toggle_timer_slot_8` - Timer slots (legacy package backend)

### Services / Scripts
- `toggle_timer.start` - Start a timed operation (integration backend)
- `toggle_timer.cancel` - Cancel a timer (integration backend)
- `script.toggle_timer` - Start a timed operation (legacy package backend)
- `script.toggle_timer_cancel` - Cancel a timer (legacy package backend)
- `script.toggle_timer_persist` - Persist state (legacy package backend)
- `script.toggle_timer_remove_state` - Remove state (legacy package backend)
- `script.toggle_timer_revert` - Revert entity (legacy package backend)

### Automations
- `automation.toggle_timer_on_timer_finished` - Handle timer completion (legacy package backend)
- `automation.toggle_timer_resume_on_restart` - Resume timers after restart (legacy package backend)

### Increasing Timer Slots (legacy package backend)

By default, you can have 8 concurrent timers. To increase this:

1. Edit `packages/toggle_timer/package.yaml`
2. Add more timer entities (e.g., `timer.toggle_timer_slot_9`)
3. Add corresponding triggers in the automation
4. Restart Home Assistant

## 📖 Usage

### Starting a Timer

1. Tap the card
2. Select a duration from the popup
3. The entity will switch to the configured state
4. After the duration, it automatically reverts

### Managing Active Timers

When a timer is active:
- The card shows the remaining time (if `show_remaining: true`)
- Tap again to see options:
  - **Cancel Timer** - Stop and revert immediately
  - **Replace Timer** - Start a new timer with a new duration
  - **Extend Timer** - Add more time to the current timer
- Long-press to cancel (if `long_press_action: cancel`)

### Immediate Mode

Set `tap_behavior: immediate` to skip the popup and use the first duration instantly.

## 🔍 How It Works

1. **User taps card** → Popup shows duration buttons
2. **User selects duration** → Script starts:
   - Captures current entity state
   - Finds available timer slot
   - Persists state to `input_text` (survives restarts)
   - Applies the action (on/off/toggle)
   - Starts the timer
   - Fires `toggle_timer_started` event
3. **Timer finishes** → Automation triggers:
   - Reads persisted state
   - Applies revert action
   - Cleans up state
   - Fires `toggle_timer_finished` event
4. **Home Assistant restarts** → Automation resumes:
   - Reads all active timers from `input_text`
   - Restarts timers with remaining time
   - OR immediately reverts if time expired during downtime

## 🐛 Troubleshooting

### "Custom element not found: toggle-timer-card" Error

This error means the Lovelace card hasn't been loaded by Home Assistant. This typically happens when:

1. **Integration Not Configured** (Most Common)
   - The frontend card is **only** loaded when the **Toggle Timer** integration is properly set up
   - **Solution**: Go to **Settings → Devices & Services → Add Integration** and search for "Toggle Timer"
   - Add the integration - it will automatically register the custom card
   - Refresh your browser after adding the integration

2. **Integration Installed but Not Configured**
   - You downloaded the integration via HACS but didn't add it in Settings
   - **Solution**: Even after HACS download, you must go to **Settings → Devices & Services** and add the "Toggle Timer" integration
   - Just installing via HACS is not enough - you must configure it!

3. **Browser Cache**
   - **Solution**: Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
   - Or clear your browser cache and reload

4. **Manual Installation Issue**
   - If you installed manually, verify:
     - `custom_components/toggle_timer/www/toggle-timer-card.js` exists
     - The integration is added via **Settings → Devices & Services**
     - Home Assistant was restarted after installation

### Card not showing up
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
- Check that `custom_components/toggle_timer/www/toggle-timer-card.js` exists
- Verify the integration is configured in **Settings → Devices & Services**
- Check browser console for JavaScript errors (F12 → Console tab)

### Timer not starting
- Check that the backend integration is installed and configured
- Verify `sensor.toggle_timer_state` exists (integration backend) OR `input_text.toggle_timer_state` exists (legacy package backend)
- Check Home Assistant logs for errors: **Settings → System → Logs**
- Ensure the entity you're controlling exists and is accessible

### All slots in use
- Default is 8 concurrent timers
- Wait for a timer to finish or cancel one
- Or increase slots (see "Increasing Timer Slots") for legacy package backend
- Note: Integration backend automatically manages timer slots

### Timer doesn't survive restart
- **Integration backend**: Timers persist automatically via `sensor.toggle_timer_state`
- **Legacy package backend**: Verify `input_text.toggle_timer_state` has `restore: true` (default)
- Check the resume automation is enabled (legacy package backend)

### Still having issues?
- Check Home Assistant logs: **Settings → System → Logs**
- Check browser console: Press F12 → Console tab
- Verify entity domain is supported (switch, light, input_boolean, fan, siren, humidifier, media_player)
- Create an issue on [GitHub](https://github.com/rbickel/toggle-timer-homeassistant/issues) with:
  - Home Assistant version
  - Installation method (HACS/Manual)
  - Browser and version
  - Full error message from logs and browser console

## 🏗️ Development

### Building from Source

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch for changes
npm run watch
```

The built file will be in `dist/toggle-timer-card.js`.

### Project Structure

```
toggle-timer-card/
├── custom_components/
│   └── toggle_timer/            # Optional backend integration (no YAML package setup)
├── src/
│   ├── toggle-timer-card.ts    # Main card component
│   ├── editor.ts                   # Visual editor
│   ├── types.ts                    # TypeScript types
│   └── localize/
│       ├── en.json                 # English translations
│       └── fr.json                 # French translations
├── packages/
│   └── toggle_timer/
│       └── package.yaml            # Backend HA package
├── dist/
│   └── toggle-timer-card.js     # Built card
├── package.json
├── tsconfig.json
├── rollup.config.js
└── README.md
```

## 📝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Lit](https://lit.dev/)
- Inspired by the Home Assistant community
- Based on the specification in [SPEC.MD](SPEC.MD)

## 📚 Related Links

- [Home Assistant](https://www.home-assistant.io/)
- [HACS](https://hacs.xyz/)
- [Lovelace Custom Cards](https://www.home-assistant.io/lovelace/custom-card/)

---

If you find this card useful, please consider starring the repository! ⭐
