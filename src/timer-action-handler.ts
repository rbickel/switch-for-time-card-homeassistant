import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import type { HomeAssistant } from './types';
import type { TimerPopupConfig } from './timer-popup';
import './timer-popup';

type TimerActionRequest = {
  config?: TimerPopupConfig;
  hass?: HomeAssistant;
};

type TimerActionRequestDetail =
  | TimerActionRequest
  | (TimerPopupConfig & { hass?: HomeAssistant })
  | null
  | undefined;

type FireDomEventDetail = {
  event?: string;
  detail?: TimerActionRequestDetail;
};

type LovelaceCustomEventDetail = {
  fire_dom_event?: FireDomEventDetail;
  event?: string;
  detail?: TimerActionRequestDetail;
};

declare global {
  interface Window {
    switchForTimeAction?: (
      hass: HomeAssistant,
      config: TimerPopupConfig
    ) => Promise<void>;
  }
}

console.info(
  '%c SWITCH-FOR-TIME-ACTION %c Registering global timer action handler ',
  'color: white; background: #0288d1; font-weight: bold;',
  'color: #0288d1; background: white; font-weight: bold;'
);

@customElement('switch-for-time-action-handler')
export class SwitchForTimeActionHandler extends LitElement {
  @state() private _hass?: HomeAssistant;
  @state() private _config?: TimerPopupConfig;
  private _registered = false;

  private readonly _handleTimerActionEvent = (event: Event): void => {
    const actionRequest = this._extractActionRequest(event);
    if (!actionRequest) {
      return;
    }

    const { config } = actionRequest;
    if (!config) {
      console.warn(
        'switch-for-time-action: missing "config" in event detail'
      );
      return;
    }

    const hass =
      actionRequest.hass || this._resolveHass(event);
    if (!hass) {
      console.warn(
        'switch-for-time-action: unable to resolve Home Assistant instance'
      );
      return;
    }

    void window.switchForTimeAction?.(hass, config);
  };

  connectedCallback(): void {
    super.connectedCallback();
    this._registerGlobalHandler();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.removeEventListener(
      'switch-for-time-action',
      this._handleTimerActionEvent
    );
    window.removeEventListener('ll-custom', this._handleTimerActionEvent);
    this._registered = false;
  }

  private _registerGlobalHandler(): void {
    if (this._registered) {
      return;
    }
    this._registered = true;

    // Register global function for tap_action
    window.switchForTimeAction = async (
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
    window.addEventListener(
      'switch-for-time-action',
      this._handleTimerActionEvent
    );
    window.addEventListener('ll-custom', this._handleTimerActionEvent);

    console.info('Switch For Time: Global timer action handler registered');
  }

  private _extractActionRequest(
    event: Event
  ): TimerActionRequest | undefined {
    const detail = (event as CustomEvent<TimerActionRequestDetail | LovelaceCustomEventDetail>).detail;

    if (event.type === 'switch-for-time-action') {
      return this._normalizeActionRequest(
        this._isLovelaceCustomEventDetail(detail) ? undefined : detail
      );
    }

    if (event.type !== 'll-custom') {
      return undefined;
    }

    if (!this._isLovelaceCustomEventDetail(detail)) {
      return undefined;
    }

    const fireDomEventDetail =
      detail?.fire_dom_event?.event === 'switch-for-time-action'
        ? detail.fire_dom_event.detail
        : detail?.event === 'switch-for-time-action'
          ? detail.detail
          : undefined;

    if (!fireDomEventDetail) {
      return undefined;
    }

    return this._normalizeActionRequest(fireDomEventDetail);
  }

  private _isLovelaceCustomEventDetail(
    detail: TimerActionRequestDetail | LovelaceCustomEventDetail
  ): detail is LovelaceCustomEventDetail {
    return Boolean(
      detail &&
        typeof detail === 'object' &&
        ('fire_dom_event' in detail || ('event' in detail && 'detail' in detail))
    );
  }

  private _normalizeActionRequest(
    detail: TimerActionRequestDetail
  ): TimerActionRequest {
    if (!detail || typeof detail !== 'object') {
      return {};
    }

    if ('config' in detail) {
      return {
        config: detail.config as TimerPopupConfig,
        hass: detail.hass as HomeAssistant | undefined,
      };
    }

    if ('entity' in detail && 'durations' in detail && Array.isArray(detail.durations)) {
      return {
        config: detail as TimerPopupConfig,
        hass: detail.hass as HomeAssistant | undefined,
      };
    }

    return {};
  }

  /**
   * Best-effort resolution of the active `hass` object when the caller does
   * not provide it explicitly in the event detail. Walks up from the event
   * target through composed paths looking for an element exposing `hass`,
   * and falls back to the `home-assistant` root element.
   */
  private _resolveHass(event: Event): HomeAssistant | undefined {
    const path =
      typeof (event as any).composedPath === 'function'
        ? ((event as any).composedPath() as EventTarget[])
        : [];
    for (const node of path) {
      const hass = (node as any)?.hass;
      if (hass) {
        return hass as HomeAssistant;
      }
    }

    const root = document.querySelector('home-assistant') as any;
    if (root?.hass) {
      return root.hass as HomeAssistant;
    }

    return undefined;
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
function autoRegisterHandler() {
  if (!document.querySelector('switch-for-time-action-handler')) {
    console.info('Switch For Time: Creating action handler element');
    const handler = document.createElement('switch-for-time-action-handler');
    document.body.appendChild(handler);
    console.info('Switch For Time: Action handler element added to DOM');
  } else {
    console.info('Switch For Time: Action handler already exists in DOM');
  }
}

// Try immediate registration
if (document.body) {
  customElements.whenDefined('switch-for-time-action-handler').then(autoRegisterHandler);
} else {
  // If body not ready, wait for DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      customElements.whenDefined('switch-for-time-action-handler').then(autoRegisterHandler);
    });
  } else {
    // DOM already loaded
    customElements.whenDefined('switch-for-time-action-handler').then(autoRegisterHandler);
  }
}

// Additional fallback: register when custom element is first defined
customElements.whenDefined('switch-for-time-action-handler').then(() => {
  // Give a small delay to ensure DOM is ready
  setTimeout(autoRegisterHandler, 100);
});
