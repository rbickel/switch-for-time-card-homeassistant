// Type definitions for Switch For Time Card

export interface SwitchForTimeCardConfig {
  type: string;
  entity: string;
  action?: 'on' | 'off' | 'toggle';
  revert_to?: 'previous' | 'on' | 'off' | 'none';
  durations: number[];
  name?: string;
  icon?: string;
  show_remaining?: boolean;
  allow_custom_duration?: boolean;
  confirm_cancel?: boolean;
  tap_behavior?: 'popup' | 'immediate';
  long_press_action?: 'none' | 'cancel';
  theme?: {
    popup_title?: string;
    button_format?: string;
  };
}

export interface TimerState {
  slot: number;
  previous_state: string;
  revert_to: string;
  started_at: string;
  ends_at: string;
  action: string;
  duration_minutes: number;
}

export interface TimerStateMap {
  [entity_id: string]: TimerState;
}

export interface HomeAssistant {
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, any>,
    target?: { entity_id?: string | string[] }
  ): Promise<void>;

  states: {
    [entity_id: string]: HassEntity;
  };

  locale: {
    language: string;
  };

  connection: {
    subscribeEvents(
      callback: (event: any) => void,
      eventType?: string
    ): Promise<() => void>;
  };
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    icon?: string;
    [key: string]: any;
  };
  last_changed: string;
  last_updated: string;
}

export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: SwitchForTimeCardConfig): void;
  getCardSize?(): number;
}

export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: SwitchForTimeCardConfig): void;
}

export const SUPPORTED_DOMAINS = [
  'switch',
  'light',
  'input_boolean',
  'fan',
  'siren',
  'humidifier',
  'media_player',
];

export const CARD_VERSION = '1.0.0';
