/**
 * Tutorial Gesture Handler — long-press triggert hint tijdens actieve tutorial.
 *
 * Pedagogie: tutorials zijn command-driven (typ commando om door te gaan).
 * Long-press is GEEN step-skip — het is een UX-shortcut voor het bestaande
 * `hint` command. Hint is een leermoment binnen de stap, niet een step-skip.
 *
 * WCAG SC 2.5.1 (Pointer Gestures): single-pointer (1 touch, time-based,
 * geen path). Keyboard fallback `hint` command blijft 100% functioneel.
 * Modal-protection-pattern Sessie 77 gerespecteerd via `.modal.active` check.
 */

import tutorialManager from '../tutorial/tutorial-manager.js';

const LONG_PRESS_MS = 500;
const MOVE_TOLERANCE_PX = 10;

export default new class TutorialGestureHandler {
  constructor() {
    this.terminal = null;
    this.timerId = null;
    this.startX = 0;
    this.startY = 0;
  }

  /**
   * Initialize gesture handler — bind touch listeners op #terminal-output.
   * @param {Object} terminal - Terminal instance met execute() method
   */
  init(terminal) {
    if (!terminal || typeof terminal.execute !== 'function') {
      return;
    }
    this.terminal = terminal;

    const target = document.getElementById('terminal-output');
    if (!target) {
      return;
    }

    target.addEventListener('touchstart', (e) => this._onStart(e), { passive: true });
    target.addEventListener('touchmove', (e) => this._onMove(e), { passive: true });
    target.addEventListener('touchend', () => this._onEnd(), { passive: true });
    target.addEventListener('touchcancel', () => this._cancel(), { passive: true });
  }

  _onStart(e) {
    if (!tutorialManager.isActive()) return;
    if (document.querySelector('.modal.active')) return;
    if (!e.touches || e.touches.length !== 1) return;

    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
    this.timerId = setTimeout(() => this._trigger(), LONG_PRESS_MS);
  }

  _onMove(e) {
    if (!this.timerId || !e.touches || e.touches.length === 0) return;

    const dx = Math.abs(e.touches[0].clientX - this.startX);
    const dy = Math.abs(e.touches[0].clientY - this.startY);
    if (dx > MOVE_TOLERANCE_PX || dy > MOVE_TOLERANCE_PX) {
      this._cancel();
    }
  }

  _onEnd() {
    this._cancel();
  }

  _cancel() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  _trigger() {
    this.timerId = null;
    if (!tutorialManager.isActive()) return;
    if (document.querySelector('.modal.active')) return;
    if (!this.terminal) return;

    this.terminal.execute('hint');
  }
};
