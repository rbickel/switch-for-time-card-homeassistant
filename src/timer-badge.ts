import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { HomeAssistant, TimerState, TimerStateMap } from './types';

@customElement('toggle-timer-badge')
export class ToggleTimerBadge extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ type: String }) public entity!: string;

  @state() private _timerState?: TimerState;
  @state() private _remainingSeconds = 0;

  private _updateInterval?: number;
  private _unsubscribeEvents: Array<() => void> = [];

  connectedCallback(): void {
    super.connectedCallback();
    this._subscribeToEvents();
    this._startUpdateLoop();
    this._updateTimerState();
  }

  protected updated(changedProperties: Map<string, unknown>): void {
    if (!changedProperties.has('hass') && !changedProperties.has('entity')) {
      return;
    }

    if (!this.isConnected) {
      return;
    }

    if (this.hass && this.entity) {
      this._subscribeToEvents();
    } else {
      this._unsubscribeFromEvents();
    }

    this._updateTimerState();
  }
  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._stopUpdateLoop();
    this._unsubscribeFromEvents();
  }

  private async _subscribeToEvents(): Promise<void> {
    if (!this.hass || !this.entity) return;

    this._unsubscribeFromEvents();

    try {
      const startedUnsubscribe = await this.hass.connection.subscribeEvents(
        (event: any) => {
          const eventEntity = event.data?.entity_id;
          if (eventEntity === this.entity) {
            this._updateTimerState();
          }
        },
        'toggle_timer_started'
      );
      this._unsubscribeEvents.push(startedUnsubscribe);

      const finishedUnsubscribe = await this.hass.connection.subscribeEvents(
        (event: any) => {
          const eventEntity = event.data?.entity_id;
          if (eventEntity === this.entity) {
            this._timerState = undefined;
            this._remainingSeconds = 0;
          }
        },
        'toggle_timer_finished'
      );
      this._unsubscribeEvents.push(finishedUnsubscribe);

      const cancelledUnsubscribe = await this.hass.connection.subscribeEvents(
        (event: any) => {
          const eventEntity = event.data?.entity_id;
          if (eventEntity === this.entity) {
            this._timerState = undefined;
            this._remainingSeconds = 0;
          }
        },
        'toggle_timer_cancelled'
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
    if (!this.entity) return;
    const stateEntity =
      this.hass?.states['input_text.toggle_timer_state'] ||
      this.hass?.states['sensor.toggle_timer_state'];
    if (!stateEntity) return;

    try {
      const stateData: TimerStateMap = JSON.parse(stateEntity.state);
      const timerState = stateData[this.entity];

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

  private _formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  protected render() {
    if (!this._timerState || this._remainingSeconds === 0) {
      return html``;
    }

    return html`
      <div class="timer-badge">
        <ha-icon icon="mdi:timer-outline"></ha-icon>
        <span class="timer-text">${this._formatTime(this._remainingSeconds)}</span>
      </div>
    `;
  }

  static get styles() {
    return css`
      :host {
        position: absolute;
        top: 8px;
        right: 8px;
        z-index: 1;
        pointer-events: none;
      }

      .timer-badge {
        display: flex;
        align-items: center;
        gap: 4px;
        background-color: var(--primary-color, #0288d1);
        color: var(--text-primary-color, white);
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      ha-icon {
        --mdc-icon-size: 14px;
      }

      .timer-text {
        line-height: 1;
      }
    `;
  }
}
