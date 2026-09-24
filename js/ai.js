/**
 * Ludo Royale - Intelligent AI Opponent
 * Implements tactical heuristic evaluation for Easy, Medium, and Hard AI difficulties
 */

class LudoAI {
  /**
   * Chooses the best token to move given legal moves and game state
   */
  static chooseMove(player, diceVal, allPlayers, board) {
    const legalTokens = player.getLegalTokens(diceVal);
    if (legalTokens.length === 0) return null;
    if (legalTokens.length === 1) return legalTokens[0];

    const difficulty = player.aiDifficulty || 'medium';

    if (difficulty === 'easy') {
      // Easy: mostly random pick with slight preference for unhoming
      if (diceVal === 6 && Math.random() < 0.5) {
        const yardToken = legalTokens.find(t => t.step === -1);
        if (yardToken) return yardToken;
      }
      return legalTokens[Math.floor(Math.random() * legalTokens.length)];
    }

    if (difficulty === 'medium') {
      // 1. Capture opponent if possible
      for (const token of legalTokens) {
        if (this.willCapture(token, diceVal, player, allPlayers, board)) {
          return token;
        }
      }
      // 2. Reach center goal
      for (const token of legalTokens) {
        if (token.step + diceVal === 56) {
          return token;
        }
      }
      // 3. Unlock token from base on 6
      if (diceVal === 6) {
        const yardToken = legalTokens.find(t => t.step === -1);
        if (yardToken) return yardToken;
      }
      // 4. Advance furthest along token
      return legalTokens.sort((a, b) => b.step - a.step)[0];
    }

    // Hard AI: Full Tactical Evaluation
    let bestScore = -Infinity;
    let bestToken = legalTokens[0];

    for (const token of legalTokens) {
      const score = this.evaluateMove(token, diceVal, player, allPlayers, board);
      if (score > bestScore) {
        bestScore = score;
        bestToken = token;
      }
    }

    return bestToken;
  }

  static evaluateMove(token, diceVal, player, allPlayers, board) {
    let score = 0;
    const targetStep = token.step === -1 ? 0 : token.step + diceVal;

    // 1. Finish token into center home goal
    if (targetStep === 56) {
      score += 150;
      return score;
    }

    // 2. Unlocking token from base
    if (token.step === -1) {
      score += 85;
      return score;
    }

    const currentCoords = board.getTokenCoordinates(player.color, token.step, token.id);
    const targetCoords = board.getTokenCoordinates(player.color, targetStep, token.id);

    // 3. Check for capture
    if (!targetCoords.isSafe && !targetCoords.isHomeStretch && targetCoords.commonIndex !== undefined) {
      for (const opp of allPlayers) {
        if (opp.index === player.index || opp.hasFinished) continue;
        for (const oppToken of opp.tokens) {
          if (oppToken.step >= 0 && oppToken.step <= 50) {
            const oppCoords = board.getTokenCoordinates(opp.color, oppToken.step, oppToken.id);
            if (oppCoords.commonIndex === targetCoords.commonIndex && !oppCoords.isSafe) {
              score += 130; // High priority capture!
            }
          }
        }
      }
    }

    // 4. Landing on a safe star spot or colored home stretch
    if (targetCoords.isSafe || targetCoords.isHomeStretch) {
      score += 55;
    }

    // 5. Escaping a threatened position
    if (!currentCoords.isSafe && !currentCoords.isHomeStretch && currentCoords.commonIndex !== undefined) {
      if (this.isThreatened(currentCoords.commonIndex, player, allPlayers, board)) {
        score += 45; // Move out of danger!
      }
    }

    // 6. Avoid moving into a dangerous position (opponent 1..6 steps behind)
    if (!targetCoords.isSafe && !targetCoords.isHomeStretch && targetCoords.commonIndex !== undefined) {
      if (this.isThreatened(targetCoords.commonIndex, player, allPlayers, board)) {
        score -= 50; // Dangerous spot!
      }
    }

    // 7. General progression bonus
    score += (targetStep * 1.5);

    return score;
  }

  static willCapture(token, diceVal, player, allPlayers, board) {
    const targetStep = token.step === -1 ? 0 : token.step + diceVal;
    if (targetStep > 50) return false;

    const targetCoords = board.getTokenCoordinates(player.color, targetStep, token.id);
    if (targetCoords.isSafe || targetCoords.commonIndex === undefined) return false;

    for (const opp of allPlayers) {
      if (opp.index === player.index || opp.hasFinished) continue;
      for (const oppToken of opp.tokens) {
        if (oppToken.step >= 0 && oppToken.step <= 50) {
          const oppCoords = board.getTokenCoordinates(opp.color, oppToken.step, oppToken.id);
          if (oppCoords.commonIndex === targetCoords.commonIndex && !oppCoords.isSafe) {
            return true;
          }
        }
      }
    }
    return false;
  }

  static isThreatened(commonIndex, player, allPlayers, board) {
    for (const opp of allPlayers) {
      if (opp.index === player.index || opp.hasFinished) continue;
      for (const oppToken of opp.tokens) {
        if (oppToken.step >= 0 && oppToken.step <= 50) {
          const oppCoords = board.getTokenCoordinates(opp.color, oppToken.step, oppToken.id);
          if (oppCoords.commonIndex !== undefined) {
            const distance = (commonIndex - oppCoords.commonIndex + 52) % 52;
            if (distance >= 1 && distance <= 6) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }
}
