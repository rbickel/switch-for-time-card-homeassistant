import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  SwitchForTimeCardConfig,
  HomeAssistant,
  TimerStateMap,
  TimerState,
  LovelaceCard,
} from './types';
import { SUPPORTED_DOMAINS, CARD_VERSION } from './types';
import './editor';
import enTranslations from './localize/en.json';
import frTranslations from './localize/fr.json';

const TRANSLATIONS: Record<string, any> = {
  en: enTranslations,
  fr: frTranslations,
};

console.info(
  `%c SWITCH-FOR-TIME-CARD %c ${CARD_VERSION} `,
  'color: white; background: #0288d1; font-weight: bold;',
  'color: #0288d1; background: white; font-weight: bold;'
);

@customElement('switch-for-time-card')
export class SwitchForTimeCard extends LitElement implements LovelaceCard {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: SwitchForTimeCardConfig;
  @state() private _timerState?: TimerState;
  @state() private _showPopup = false;
  @state() private _showCustomDuration = false;
  @state() private _customDuration = 30;
  @state() private _remainingSeconds = 0;
  @state() private _popupMode: 'select' | 'active' = 'select';
  @state() private _confirmCancelPending = false;

  private _updateInterval?: number;
  private _unsubscribeEvents: Array<() => void> = [];
  private _selectionMode: 'start' | 'replace' | 'extend' = 'start';

  public static async getConfigElement() {
    return document.createElement('switch-for-time-card-editor');
  }

  public static getStubConfig() {
    return {
      type: 'custom:switch-for-time-card',
      entity: '',
      action: 'toggle',
      revert_to: 'previous',
      durations: [10, 20, 30],
    };
  }

  public setConfig(config: SwitchForTimeCardConfig): void {
    if (!config.entity) {
      throw new Error(this._localize('editor.entity_required'));
    }

    const domain = config.entity.split('.')[0];
    if (!SUPPORTED_DOMAINS.includes(domain)) {
      throw new Error(this._localize('editor.entity_invalid_domain'));
    }

    if (!config.durations || config.durations.length === 0) {
      throw new Error(this._localize('editor.durations_required'));
    }

    if (config.durations.length > 8) {
      throw new Error(this._localize('editor.durations_max'));
    }

    if (config.durations.some((d) => typeof d !== 'number' || !Number.isInteger(d) || d <= 0)) {
      throw new Error(this._localize('editor.durations_positive'));
    }

    if (new Set(config.durations).size !== config.durations.length) {
      throw new Error(this._localize('editor.durations_unique'));
    }

    if (domain === 'media_player' && config.action === 'toggle') {
      throw new Error(this._localize('editor.action_invalid_media_player'));
    }

    this._config = {
      action: 'toggle',
      revert_to: 'previous',
      show_remaining: true,
      allow_custom_duration: false,
      confirm_cancel: false,
      tap_behavior: 'popup',
      long_press_action: 'cancel',
      ...config,
    };

  }

  public getCardSize(): number {
    return 1;
  }

  public connectedCallback(): void {
    super.connectedCallback();
    if (this._config?.entity) {
      this._subscribeToEvents();
    }
    this._startUpdateLoop();
  }

  public disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopUpdateLoop();
    this._unsubscribeFromEvents();
  }

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);
    if (changedProps.has('hass') && this.hass) {
      this._updateTimerState();
    }
    if (changedProps.has('_config') && this.hass && this.isConnected && this._config?.entity) {
      this._subscribeToEvents();
      this._updateTimerState();
    }
  }

  private async _subscribeToEvents(): Promise<void> {
    if (!this.hass || !this._config?.entity) return;

    this._unsubscribeFromEvents();

    try {
      const startedUnsubscribe = await this.hass.connection.subscribeEvents(
        (event: any) => {
          const eventEntity = event.data?.entity_id;
          if (eventEntity === this._config?.entity) {
            this._updateTimerState();
          }
        },
        'switch_for_time_started'
      );
      this._unsubscribeEvents.push(startedUnsubscribe);

      const finishedUnsubscribe = await this.hass.connection.subscribeEvents(
        (event: any) => {
          const eventEntity = event.data?.entity_id;
          if (eventEntity === this._config?.entity) {
            this._timerState = undefined;
            this._remainingSeconds = 0;
          }
        },
        'switch_for_time_finished'
      );
      this._unsubscribeEvents.push(finishedUnsubscribe);

      const cancelledUnsubscribe = await this.hass.connection.subscribeEvents(
        (event: any) => {
          const eventEntity = event.data?.entity_id;
          if (eventEntity === this._config?.entity) {
            this._timerState = undefined;
            this._remainingSeconds = 0;
          }
        },
        'switch_for_time_cancelled'
      );
      this._unsubscribeEvents.push(cancelledUnsubscribe);
    } catch (err) {
      console.error('Failed to subscribe to events:', err);
    }
  }

  private _unsubscribeFromEvents(): void {
    for (const unsubscribe of this._unsubscribeEvents) {
      unsubscribe();
    }
    this._unsubscribeEvents = [];
  }

  private _updateTimerState(): void {
    if (!this._config?.entity) return;
    const stateEntity = this.hass?.states['input_text.switch_for_time_state'];
    if (!stateEntity) return;

    try {
      const stateData: TimerStateMap = JSON.parse(stateEntity.state);
      const timerState = stateData[this._config.entity];

      if (timerState) {
        this._timerState = timerState;
        this._updateRemainingTime();
      } else {
        this._timerState = undefined;
        this._remainingSeconds = 0;
      }
    } catch (err) {
      // Invalid JSON or no state
      this._timerState = undefined;
      this._remainingSeconds = 0;
    }
  }

  private _updateRemainingTime(): void {
    if (!this._timerState) {
      this._remainingSeconds = 0;
      return;
    }

    const endsAt = new Date(this._timerState.ends_at);
    const now = new Date();
    const diffMs = endsAt.getTime() - now.getTime();
    this._remainingSeconds = Math.max(0, Math.floor(diffMs / 1000));
  }

  private _startUpdateLoop(): void {
    this._updateInterval = window.setInterval(() => {
      if (this._timerState) {
        this._updateRemainingTime();
      }
    }, 1000);
  }

  private _stopUpdateLoop(): void {
    if (this._updateInterval) {
      clearInterval(this._updateInterval);
      this._updateInterval = undefined;
    }
  }

  private _handleTap(): void {
    this._confirmCancelPending = false;
    if (this._timerState) {
      // Timer is active, show active popup
      this._popupMode = 'active';
      this._showPopup = true;
    } else if (this._config.tap_behavior === 'immediate' && this._config.durations.length > 0) {
      // Immediate mode: start timer with first duration
      this._selectionMode = 'start';
      this._startTimer(this._config.durations[0]);
    } else {
      // Show selection popup
      this._selectionMode = 'start';
      this._popupMode = 'select';
      this._showPopup = true;
    }
  }

  private _handleLongPress(): void {
    if (this._config.long_press_action === 'cancel' && this._timerState) {
      if (this._config.confirm_cancel) {
        this._confirmCancelPending = true;
        this._popupMode = 'active';
        this._showPopup = true;
      } else {
        this._cancelTimer();
      }
    } else if (!this._timerState) {
      // Show more info
      this._fireEvent('hass-more-info', { entityId: this._config.entity });
    }
  }

  private async _startTimer(durationMinutes: number, extend = false): Promise<void> {
    try {
      const serviceData: any = {
        entity_id: this._config.entity,
        action: this._config.action,
        duration_minutes: durationMinutes,
        revert_to: this._config.revert_to,
        cancel_existing: !extend,
      };

      if (extend && this._timerState) {
        // For extend, add to existing duration
        serviceData.duration_minutes = durationMinutes + Math.ceil(this._remainingSeconds / 60);
      }

      await this.hass.callService('script', 'switch_for_time', serviceData);

      this._handleClosePopup();
      this._showToast(
        this._localize('card.timer_started').replace('{duration}', durationMinutes.toString())
      );
    } catch (err) {
      console.error('Failed to start timer:', err);
    }
  }

  private async _cancelTimer(): Promise<void> {
    try {
      await this.hass.callService('script', 'switch_for_time_cancel', {
        entity_id: this._config.entity,
      });

      this._handleClosePopup();
      this._showToast(this._localize('card.timer_cancelled'));
    } catch (err) {
      console.error('Failed to cancel timer:', err);
    }
  }

  private _handleClosePopup(): void {
    this._showPopup = false;
    this._showCustomDuration = false;
    this._popupMode = 'select';
    this._selectionMode = 'start';
    this._confirmCancelPending = false;
  }

  private _showToast(message: string): void {
    this._fireEvent('hass-notification', { message });
  }

  private _fireEvent(type: string, detail: any): void {
    const event = new CustomEvent(type, {
      detail,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private _localize(key: string): string {
    const rawLang = this.hass?.locale?.language || 'en';
    const normalizedLang = rawLang.replace(/_/g, '-').toLowerCase();
    const baseLang = normalizedLang.split('-')[0];
    const translations =
      TRANSLATIONS[normalizedLang] || TRANSLATIONS[baseLang] || TRANSLATIONS.en;

    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }

    return value || key;
  }

  private _formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  private _getEntityName(): string {
    if (this._config.name) return this._config.name;
    const entity = this.hass?.states[this._config.entity];
    return entity?.attributes?.friendly_name || this._config.entity;
  }

  private _getEntityIcon(): string {
    if (this._config.icon) return this._config.icon;
    const entity = this.hass?.states[this._config.entity];
    return entity?.attributes?.icon || 'mdi:power';
  }

  private _getEntityState(): string {
    const entity = this.hass?.states[this._config.entity];
    return entity?.state || 'unknown';
  }

  private _renderPopupTitle(): string {
    const template = this._config.theme?.popup_title || this._localize('card.default_popup_title');
    return template
      .replace('{action}', this._config.action || 'toggle')
      .replace('{entity}', this._config.entity)
      .replace('{name}', this._getEntityName());
  }

  private _renderButtonLabel(minutes: number): string {
    const template = this._config.theme?.button_format || this._localize('card.default_button_format');
    return template.replace('{minutes}', minutes.toString());
  }

  protected render() {
    if (!this._config || !this.hass) {
      return html``;
    }

    return html`
      <ha-card @click=${this._handleTap} @long-press=${this._handleLongPress}>
        <div class="card-content">
          <div class="entity-row">
            <div class="icon-container">
              <ha-icon
                .icon=${this._getEntityIcon()}
                class=${this._timerState ? 'active' : ''}
              ></ha-icon>
            </div>
            <div class="info">
              <div class="name">${this._getEntityName()}</div>
              <div class="state">
                ${this._timerState && this._config.show_remaining
                  ? html`${this._formatTime(this._remainingSeconds)}`
                  : this._getEntityState()}
              </div>
            </div>
          </div>
        </div>
      </ha-card>

      ${this._showPopup ? this._renderPopup() : ''}
    `;
  }

  private _renderPopup() {
    return html`
      <div class="popup-overlay" @click=${this._handleClosePopup}>
        <div class="popup-content" @click=${(e: Event) => e.stopPropagation()}>
          <div class="popup-header">
            <h3>${this._renderPopupTitle()}</h3>
            <button class="close-button" @click=${this._handleClosePopup}>×</button>
          </div>

          ${this._popupMode === 'active' ? this._renderActivePopup() : this._renderSelectPopup()}
        </div>
      </div>
    `;
  }

  private _renderSelectPopup() {
    return html`
      <div class="popup-body">
        <div class="duration-buttons">
          ${this._config.durations.map(
            (duration) => html`
              <button
                class="duration-button"
                @click=${() => this._startTimer(duration, this._selectionMode === 'extend')}
              >
                ${this._renderButtonLabel(duration)}
              </button>
            `
          )}
        </div>

        ${this._config.allow_custom_duration
          ? html`
              <div class="custom-duration">
                ${this._showCustomDuration
                  ? html`
                      <input
                        type="number"
                        min="1"
                        max="1440"
                        .value=${this._customDuration.toString()}
                        @input=${(e: Event) =>
                          (this._customDuration = parseInt((e.target as HTMLInputElement).value) || 30)}
                        placeholder=${this._localize('card.enter_minutes')}
                      />
                      <button
                        @click=${() =>
                          this._startTimer(
                            this._customDuration,
                            this._selectionMode === 'extend'
                          )}
                      >
                        ${this._localize('common.confirm')}
                      </button>
                    `
                  : html`
                      <button
                        class="custom-button"
                        @click=${() => (this._showCustomDuration = true)}
                      >
                        + ${this._localize('card.custom_duration')}
                      </button>
                    `}
              </div>
            `
          : ''}

        <button class="cancel-button" @click=${this._handleClosePopup}>
          ${this._localize('common.cancel')}
        </button>
      </div>
    `;
  }

  private _renderActivePopup() {
    return html`
      <div class="popup-body">
        ${this._confirmCancelPending
          ? html`
              <div class="timer-info">
                <div class="timer-label">${this._localize('popup.confirm_cancel_title')}</div>
                <div class="timer-label">${this._localize('popup.confirm_cancel_message')}</div>
              </div>
            `
          : html`
              <div class="timer-info">
                <div class="timer-remaining">${this._formatTime(this._remainingSeconds)}</div>
                <div class="timer-label">${this._localize('card.remaining')}</div>
              </div>
            `}

        <div class="action-buttons">
          <button
            class="action-button"
            @click=${() => {
              if (this._config.confirm_cancel && !this._confirmCancelPending) {
                this._confirmCancelPending = true;
                return;
              }
              this._cancelTimer();
            }}
          >
            ${this._localize('popup.cancel_timer')}
          </button>
          <button
            class="action-button"
            @click=${() => {
              this._selectionMode = 'replace';
              this._confirmCancelPending = false;
              this._popupMode = 'select';
            }}
          >
            ${this._localize('popup.replace_timer')}
          </button>
          <button
            class="action-button"
            @click=${() => {
              this._selectionMode = 'extend';
              this._confirmCancelPending = false;
              this._popupMode = 'select';
            }}
          >
            ${this._localize('popup.extend_timer')}
          </button>
        </div>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      ha-card {
        cursor: pointer;
        user-select: none;
      }

      .card-content {
        padding: 16px;
      }

      .entity-row {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .icon-container {
        flex-shrink: 0;
      }

      ha-icon {
        width: 40px;
        height: 40px;
        color: var(--state-icon-color);
      }

      ha-icon.active {
        color: var(--state-icon-active-color, var(--paper-item-icon-active-color));
        animation: pulse 2s infinite;
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }

      .info {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .name {
        font-size: 16px;
        color: var(--primary-text-color);
      }

      .state {
        font-size: 14px;
        color: var(--secondary-text-color);
      }

      .popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
      }

      .popup-content {
        background: var(--card-background-color, white);
        border-radius: 8px;
        padding: 24px;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }

      .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }

      .popup-header h3 {
        margin: 0;
        font-size: 20px;
        color: var(--primary-text-color);
      }

      .close-button {
        background: none;
        border: none;
        font-size: 32px;
        cursor: pointer;
        color: var(--secondary-text-color);
        padding: 0;
        width: 32px;
        height: 32px;
        line-height: 32px;
      }

      .popup-body {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .duration-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .duration-button {
        flex: 1;
        min-width: 80px;
        padding: 12px 16px;
        border: 1px solid var(--divider-color);
        border-radius: 20px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .duration-button:hover {
        background: var(--primary-color);
        color: white;
      }

      .custom-duration {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .custom-duration input {
        flex: 1;
        padding: 8px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
      }

      .custom-button {
        width: 100%;
        padding: 12px;
        border: 1px dashed var(--divider-color);
        border-radius: 20px;
        background: none;
        color: var(--secondary-text-color);
        cursor: pointer;
      }

      .cancel-button,
      .action-button {
        padding: 12px;
        border: none;
        border-radius: 4px;
        background: var(--primary-color);
        color: white;
        font-size: 14px;
        cursor: pointer;
      }

      .action-button {
        background: var(--card-background-color);
        color: var(--primary-text-color);
        border: 1px solid var(--divider-color);
      }

      .timer-info {
        text-align: center;
        padding: 24px;
      }

      .timer-remaining {
        font-size: 48px;
        font-weight: bold;
        color: var(--primary-color);
      }

      .timer-label {
        font-size: 14px;
        color: var(--secondary-text-color);
        margin-top: 8px;
      }

      .action-buttons {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    `;
  }
}

// Register the card
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'switch-for-time-card',
  name: 'Switch For Time',
  description: 'Tap an entity, pick a duration, auto-revert.',
});
