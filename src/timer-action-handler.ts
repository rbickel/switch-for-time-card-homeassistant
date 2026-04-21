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

const VALID_ACTIONS = new Set(['on', 'off', 'toggle']);
const VALID_REVERT_STATES = new Set(['previous', 'on', 'off', 'none']);

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
    console.info(
      'Switch For Time: Received event',
      event.type,
      'with detail:',
      (event as CustomEvent).detail
    );

    const actionRequest = this._extractActionRequest(event);
    if (!actionRequest) {
      console.warn(
        'Switch For Time: Failed to extract action request from event',
        event.type
      );
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

    console.info(
      'Switch For Time: Opening popup for entity',
      config.entity
    );
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
      this._handleTimerActionEvent,
      true
    );
    window.removeEventListener('ll-custom', this._handleTimerActionEvent, true);
    document.removeEventListener(
      'switch-for-time-action',
      this._handleTimerActionEvent,
      true
    );
    document.removeEventListener('ll-custom', this._handleTimerActionEvent, true);
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
    // Use capture phase to catch events before they might be stopped
    window.addEventListener(
      'switch-for-time-action',
      this._handleTimerActionEvent,
      true
    );
    window.addEventListener('ll-custom', this._handleTimerActionEvent, true);
    // Also listen on document for events that might not reach window
    document.addEventListener(
      'switch-for-time-action',
      this._handleTimerActionEvent,
      true
    );
    document.addEventListener('ll-custom', this._handleTimerActionEvent, true);

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

    if ('config' in detail && this._isValidTimerPopupConfig(detail.config)) {
      return {
        config: detail.config,
        hass: detail.hass as HomeAssistant | undefined,
      };
    }

    if (this._isValidTimerPopupConfig(detail)) {
      return {
        config: detail,
        hass: detail.hass as HomeAssistant | undefined,
      };
    }

    return {};
  }

  private _isValidTimerPopupConfig(
    detail: unknown
  ): detail is TimerPopupConfig {
    if (!detail || typeof detail !== 'object') {
      return false;
    }

    const config = detail as Partial<TimerPopupConfig>;
    return (
      typeof config.entity === 'string' &&
      config.entity.length > 0 &&
      Array.isArray(config.durations) &&
      config.durations.length > 0 &&
      config.durations.length <= 8 &&
      config.durations.every(
        (duration) =>
          typeof duration === 'number' &&
          Number.isInteger(duration) &&
          duration > 0
      ) &&
      (config.action === undefined || VALID_ACTIONS.has(config.action)) &&
      (config.revert_to === undefined ||
        VALID_REVERT_STATES.has(config.revert_to))
    );
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

      const rootNode =
        typeof (node as any)?.getRootNode === 'function'
          ? (node as any).getRootNode()
          : undefined;
      const rootHass = (rootNode as any)?.hass;
      if (rootHass) {
        return rootHass as HomeAssistant;
      }
    }

    const root = document.querySelector('home-assistant') as any;
    if (root?.hass) {
      return root.hass as HomeAssistant;
    }

    return this._resolveHassFromKnownRoots();
  }

  private _resolveHassFromKnownRoots(): HomeAssistant | undefined {
    const selectors = [
      'home-assistant',
      'hc-main',
      'home-assistant-main',
      'ha-panel-lovelace',
      'hui-root',
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector) as any;
      const hass = this._resolveHassFromElement(element);
      if (hass) {
        return hass;
      }
    }

    return undefined;
  }

  private _resolveHassFromElement(element: any): HomeAssistant | undefined {
    if (!element || typeof element !== 'object') {
      return undefined;
    }

    if (element.hass) {
      return element.hass as HomeAssistant;
    }

    const shadowRoot = element.shadowRoot as ShadowRoot | undefined;
    if (!shadowRoot) {
      return undefined;
    }

    const nestedSelectors = [
      'home-assistant-main',
      'ha-drawer partial-panel-resolver',
      'app-drawer-layout partial-panel-resolver',
      'partial-panel-resolver',
      'ha-panel-lovelace',
      'hui-root',
      'hc-main',
    ];
    for (const nestedSelector of nestedSelectors) {
      const nestedElement = shadowRoot.querySelector(nestedSelector) as any;
      const hass = this._resolveHassFromElement(nestedElement);
      if (hass) {
        return hass;
      }
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
