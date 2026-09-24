/**
 * Ludo Royale - Token Entity & Animation Engine
 * Manages token state, position calculation, and multi-step hopping movement
 */

class LudoToken {
  constructor(id, color, playerIndex) {
    this.id = id;
    this.color = color;
    this.playerIndex = playerIndex;
    this.step = -1; // -1: Base/Yard, 0..50: Circuit, 51..55: Home Stretch, 56: Finished
    this.isFinished = false;
    this.domElement = null;
  }

  reset() {
    this.step = -1;
    this.isFinished = false;
  }

  canMove(diceVal) {
    if (this.isFinished) return false;
    if (this.step === -1) {
      return diceVal === 6;
    }
    return (this.step + diceVal) <= 56;
  }

  getNextStep(diceVal) {
    if (this.step === -1) {
      return diceVal === 6 ? 0 : -1;
    }
    return this.step + diceVal;
  }

  /**
   * Animates token step by step towards targetStep
   */
  async animateMove(targetStep, board, onStepCallback) {
    if (this.step === -1 && targetStep === 0) {
      this.step = 0;
      if (onStepCallback) onStepCallback(this);
      window.audioManager.playTokenStep(0);
      await this.sleep(220);
      return;
    }

    while (this.step < targetStep) {
      this.step += 1;
      if (this.step >= 56) {
        this.step = 56;
        this.isFinished = true;
      }
      if (onStepCallback) onStepCallback(this);
      window.audioManager.playTokenStep(this.step);
      await this.sleep(170);
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
