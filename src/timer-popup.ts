import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  HomeAssistant,
  TimerConfigBase,
  TimerState,
  TimerStateMap,
} from './types';
import enTranslations from './localize/en.json';
import frTranslations from './localize/fr.json';

const TRANSLATIONS: Record<string, any> = {
  en: enTranslations,
  fr: frTranslations,
};

export type TimerPopupConfig = TimerConfigBase;

@customElement('switch-for-time-popup')
export class SwitchForTimePopup extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: Object }) public config!: TimerPopupConfig;

  @state() private _timerState?: TimerState;
  @state() private _showCustomDuration = false;
  @state() private _customDuration = 30;
  @state() private _remainingSeconds = 0;
  @state() private _popupMode: 'select' | 'active' = 'select';
  @state() private _confirmCancelPending = false;
  @state() private _visible = false;

  private _updateInterval?: number;
  private _selectionMode: 'start' | 'replace' | 'extend' = 'start';

  public open(): void {
    this._visible = true;
    this._updateTimerState();
    this._startUpdateLoop();

    // Determine mode based on timer state
    if (this._timerState) {
      this._popupMode = 'active';
    } else {
      this._selectionMode = 'start';
      this._popupMode = 'select';
    }
  }

  public close(): void {
    this._visible = false;
    this._stopUpdateLoop();
    this._showCustomDuration = false;
    this._popupMode = 'select';
    this._selectionMode = 'start';
    this._confirmCancelPending = false;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopUpdateLoop();
  }

  private _updateTimerState(): void {
    if (!this.config?.entity) return;
    const stateEntity =
      this.hass?.states['input_text.switch_for_time_state'] ||
      this.hass?.states['sensor.switch_for_time_state'];
    if (!stateEntity) return;

    try {
      const stateData: TimerStateMap = JSON.parse(stateEntity.state);
      const timerState = stateData[this.config.entity];

      if (timerState) {
        this._timerState = timerState;
        this._updateRemainingTime();
      } else {
        this._timerState = undefined;
        this._remainingSeconds = 0;
      }
    } catch (err) {
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

  private async _startTimer(durationMinutes: number, extend = false): Promise<void> {
    try {
      const serviceData: any = {
        entity_id: this.config.entity,
        action: this.config.action || 'toggle',
        duration_minutes: durationMinutes,
        revert_to: this.config.revert_to || 'previous',
        cancel_existing: !extend,
      };

      if (extend && this._timerState) {
        serviceData.duration_minutes = durationMinutes + Math.ceil(this._remainingSeconds / 60);
      }

      if (this._hasIntegrationBackend()) {
        await this.hass.callService('switch_for_time', 'start', serviceData);
      } else {
        await this.hass.callService('script', 'switch_for_time', serviceData);
      }

      this.close();
      this._showToast(
        this._localize('card.timer_started').replace('{duration}', durationMinutes.toString())
      );
    } catch (err) {
      console.error('Failed to start timer:', err);
    }
  }

  private async _cancelTimer(): Promise<void> {
    try {
      if (this._hasIntegrationBackend()) {
        await this.hass.callService('switch_for_time', 'cancel', {
          entity_id: this.config.entity,
        });
      } else {
        await this.hass.callService('script', 'switch_for_time_cancel', {
          entity_id: this.config.entity,
        });
      }

      this.close();
      this._showToast(this._localize('card.timer_cancelled'));
    } catch (err) {
      console.error('Failed to cancel timer:', err);
    }
  }

  private _hasIntegrationBackend(): boolean {
    return Boolean(this.hass?.services?.switch_for_time?.start);
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
    if (this.config.name) return this.config.name;
    const entity = this.hass?.states[this.config.entity];
    return entity?.attributes?.friendly_name || this.config.entity;
  }

  private _renderPopupTitle(): string {
    const template = this.config.theme?.popup_title || this._localize('card.default_popup_title');
    return template
      .replace('{action}', this.config.action || 'toggle')
      .replace('{entity}', this.config.entity)
      .replace('{name}', this._getEntityName());
  }

  private _renderButtonLabel(minutes: number): string {
    const template = this.config.theme?.button_format || this._localize('card.default_button_format');
    return template.replace('{minutes}', minutes.toString());
  }

  protected render() {
    if (!this._visible || !this.config || !this.hass) {
      return html``;
    }

    return html`
      <div class="popup-overlay" @click=${() => this.close()}>
        <div class="popup-content" @click=${(e: Event) => e.stopPropagation()}>
          <div class="popup-header">
            <h3>${this._renderPopupTitle()}</h3>
            <button class="close-button" @click=${() => this.close()}>×</button>
          </div>

          ${this._popupMode === 'active' ? this._renderActivePopup() : this._renderSelectPopup()}
        </div>
      </div>
    `;
  }

  private _renderSelectPopup() {
    const durations = Array.isArray(this.config?.durations) ? this.config.durations : [];
    const allowCustomDuration = Boolean(this.config?.allow_custom_duration);
    const hasDurationOptions = durations.length > 0;

    return html`
      <div class="popup-body">
        <div class="duration-buttons">
          ${hasDurationOptions
            ? durations.map(
                (duration) => html`
                  <button
                    class="duration-button"
                    @click=${() => this._startTimer(duration, this._selectionMode === 'extend')}
                  >
                    ${this._renderButtonLabel(duration)}
                  </button>
                `
              )
            : html`<div class="duration-error">
                ${this._localize('card.custom_duration')}
              </div>`}
        </div>

        ${allowCustomDuration
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

        <button class="cancel-button" @click=${() => this.close()}>
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
              if (this.config.confirm_cancel && !this._confirmCancelPending) {
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

      .popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .popup-content {
        background-color: var(--card-background-color, white);
        border-radius: var(--ha-card-border-radius, 12px);
        box-shadow: var(--ha-card-box-shadow, 0 4px 8px rgba(0, 0, 0, 0.1));
        width: 90%;
        max-width: 400px;
        max-height: 80vh;
        overflow-y: auto;
      }

      .popup-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 1px solid var(--divider-color, #e0e0e0);
      }

      .popup-header h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 500;
        color: var(--primary-text-color, #212121);
      }

      .close-button {
        background: none;
        border: none;
        font-size: 28px;
        line-height: 1;
        cursor: pointer;
        color: var(--secondary-text-color, #757575);
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .close-button:hover {
        color: var(--primary-text-color, #212121);
      }

      .popup-body {
        padding: 16px;
      }

      .duration-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 8px;
        margin-bottom: 16px;
      }

      .duration-button {
        background-color: var(--primary-color, #0288d1);
        color: var(--text-primary-color, white);
        border: none;
        border-radius: 8px;
        padding: 12px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .duration-button:hover {
        background-color: var(--dark-primary-color, #0277bd);
      }

      .custom-duration {
        margin-bottom: 16px;
      }

      .custom-duration input {
        width: calc(100% - 100px);
        padding: 8px;
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 4px;
        margin-right: 8px;
      }

      .custom-duration button {
        padding: 8px 16px;
        background-color: var(--primary-color, #0288d1);
        color: var(--text-primary-color, white);
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }

      .custom-button {
        width: 100%;
        padding: 12px;
        background-color: transparent;
        color: var(--primary-color, #0288d1);
        border: 1px solid var(--primary-color, #0288d1);
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      }

      .cancel-button {
        width: 100%;
        padding: 12px;
        background-color: transparent;
        color: var(--secondary-text-color, #757575);
        border: 1px solid var(--divider-color, #e0e0e0);
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      }

      .timer-info {
        text-align: center;
        padding: 24px 0;
      }

      .timer-remaining {
        font-size: 48px;
        font-weight: 300;
        color: var(--primary-text-color, #212121);
        margin-bottom: 8px;
      }

      .timer-label {
        font-size: 14px;
        color: var(--secondary-text-color, #757575);
      }

      .action-buttons {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .action-button {
        width: 100%;
        padding: 12px;
        background-color: var(--primary-color, #0288d1);
        color: var(--text-primary-color, white);
        border: none;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      }

      .action-button:hover {
        background-color: var(--dark-primary-color, #0277bd);
      }
    `;
  }
}
