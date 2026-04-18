import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { HomeAssistant } from './types';
import type { TimerPopupConfig } from './timer-popup';
import './timer-popup';

console.info(
  '%c SWITCH-FOR-TIME-ACTION %c Registering global timer action handler ',
  'color: white; background: #0288d1; font-weight: bold;',
  'color: #0288d1; background: white; font-weight: bold;'
);

@customElement('switch-for-time-action-handler')
export class SwitchForTimeActionHandler extends LitElement {
  @state() private _hass?: HomeAssistant;
  @state() private _config?: TimerPopupConfig;

  connectedCallback(): void {
    super.connectedCallback();
    this._registerGlobalHandler();
  }

  private _registerGlobalHandler(): void {
    // Register global function for tap_action
    (window as any).switchForTimeAction = async (
      hass: HomeAssistant,
      config: TimerPopupConfig
    ) => {
      this._hass = hass;
      this._config = config;
      this.requestUpdate();
      await this.updateComplete;

      const popup = this.shadowRoot?.querySelector('switch-for-time-popup') as any;
      if (popup) {
        popup.open();
      }
    };

    // Listen for fire-dom-event from cards
    window.addEventListener('switch-for-time-action', ((event: CustomEvent) => {
      const { hass, config } = event.detail;
      if (hass && config) {
        (window as any).switchForTimeAction(hass, config);
      }
    }) as EventListener);

    console.info('Switch For Time: Global timer action handler registered');
  }

  protected render() {
    if (!this._hass || !this._config) {
      return html``;
    }

    return html`
      <switch-for-time-popup
        .hass=${this._hass}
        .config=${this._config}
      ></switch-for-time-popup>
    `;
  }
}

// Auto-register the handler on load
customElements.whenDefined('switch-for-time-action-handler').then(() => {
  if (!document.querySelector('switch-for-time-action-handler')) {
    const handler = document.createElement('switch-for-time-action-handler');
    document.body.appendChild(handler);
  }
});
