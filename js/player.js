/**
 * Ludo Royale - Player Entity
 * Manages player profile, tokens, AI flags, and completion states
 */

class LudoPlayer {
  constructor(index, name, color, avatar = "👑", isAI = false, aiDifficulty = "medium") {
    this.index = index;
    this.name = name;
    this.color = color;
    this.avatar = avatar;
    this.isAI = isAI;
    this.aiDifficulty = aiDifficulty; // 'easy', 'medium', 'hard'
    this.rank = null;
    this.hasFinished = false;

    // 4 Tokens for this player
    this.tokens = [
      new LudoToken(0, color, index),
      new LudoToken(1, color, index),
      new LudoToken(2, color, index),
      new LudoToken(3, color, index)
    ];
  }

  reset() {
    this.rank = null;
    this.hasFinished = false;
    this.tokens.forEach(t => t.reset());
  }

  getLegalTokens(diceVal) {
    if (this.hasFinished) return [];
    return this.tokens.filter(t => t.canMove(diceVal));
  }

  getFinishedCount() {
    return this.tokens.filter(t => t.isFinished).length;
  }

  checkHasFinished() {
    if (this.hasFinished) return true;
    const allDone = this.tokens.every(t => t.isFinished);
    if (allDone) {
      this.hasFinished = true;
    }
    return this.hasFinished;
  }
}
