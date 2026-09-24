/**
 * Ludo Royale - Master Game Engine
 * Orchestrates player turns, dice rolling, legal move detection, token hops, captures, and victory
 */

class LudoGame {
  constructor() {
    this.players = [];
    this.currentTurnIndex = 0;
    this.consecutiveSixes = 0;
    this.diceValue = 1;
    this.gameState = 'IDLE'; // 'WAITING_ROLL', 'ROLLING', 'SELECTING_TOKEN', 'MOVING', 'GAME_OVER'
    this.rankings = [];
    this.gameMode = 'local'; // 'local', 'ai', 'online'
    this.turnTimer = null;
    this.timeRemaining = 15;
    this.tokenSkin = 'gem';
  }

  startNewGame(config) {
    const { mode = 'local', playerCount = 4, aiDifficulty = 'medium', humanColor = 'red' } = config;
    this.gameMode = mode;
    this.rankings = [];
    this.consecutiveSixes = 0;
    this.tokenSkin = window.storageManager.data.inventory.equippedToken || 'gem';

    const colors = ['red', 'green', 'yellow', 'blue'];
    const activeColors = playerCount === 2 ? ['red', 'yellow'] :
                         playerCount === 3 ? ['red', 'green', 'yellow'] :
                         ['red', 'green', 'yellow', 'blue'];

    const userProfile = window.storageManager.data;
    this.players = activeColors.map((color, idx) => {
      let isAI = false;
      let name = `Player ${idx + 1}`;
      let avatar = "👤";

      if (mode === 'ai') {
        if (color === humanColor) {
          name = userProfile.name || "You";
          avatar = userProfile.avatar || "👑";
          isAI = false;
        } else {
          isAI = true;
          const aiNames = {
            green: "Emerald Bot",
            yellow: "Solar AI",
            blue: "Cobalt CPU",
            red: "Crimson Bot"
          };
          name = aiNames[color] || `Bot ${idx + 1}`;
          avatar = "🤖";
        }
      } else if (mode === 'local') {
        if (idx === 0) {
          name = userProfile.name || "Player 1";
          avatar = userProfile.avatar || "👑";
        } else {
          name = `Player ${idx + 1}`;
          avatar = ["🦁", "🐯", "🦅", "🐺"][idx % 4];
        }
      } else {
        // Online mode
        name = idx === 0 ? userProfile.name : `Rival ${idx + 1}`;
        avatar = idx === 0 ? userProfile.avatar : "🎮";
      }

      const p = new LudoPlayer(idx, name, color, avatar, isAI, aiDifficulty);
      p.reset();
      return p;
    });

    this.currentTurnIndex = 0;
    this.gameState = 'WAITING_ROLL';

    // Apply equipped board theme
    const theme = window.storageManager.data.inventory.equippedTheme || 'classic';
    document.body.className = `theme-${theme}`;
    window.ludoBoard.renderToSVG('ludo-board', theme);

    // Apply equipped dice skin
    const diceSkin = window.storageManager.data.inventory.equippedDice || 'classic';
    if (window.gameDice) {
      window.gameDice.setSkin(diceSkin);
      window.gameDice.reset();
    }

    this.renderAllTokens();
    this.updateHUD();

    window.uiManager.showToast(`Match Started! ${this.currentPlayer.name}'s turn`, 1800);

    if (this.currentPlayer.isAI) {
      setTimeout(() => this.executeAITurn(), 900);
    }
  }

  get currentPlayer() {
    return this.players[this.currentTurnIndex];
  }

  async rollDice() {
    if (this.gameState !== 'WAITING_ROLL') return;
    this.gameState = 'ROLLING';
    this.updateHUD();

    try {
      const val = await window.gameDice.roll();
      this.diceValue = val;
      this.handleDiceResult(val);
    } catch (_) {
      this.gameState = 'WAITING_ROLL';
      this.updateHUD();
    }
  }

  handleDiceResult(val) {
    // Check 3 consecutive sixes rule
    if (val === 6) {
      this.consecutiveSixes += 1;
      if (this.consecutiveSixes >= 3) {
        window.uiManager.showToast("3 consecutive Sixes! Turn forfeited!", 2000);
        this.consecutiveSixes = 0;
        setTimeout(() => this.passTurn(), 1200);
        return;
      }
    } else {
      this.consecutiveSixes = 0;
    }

    const legalTokens = this.currentPlayer.getLegalTokens(val);

    if (legalTokens.length === 0) {
      window.uiManager.showToast(window.storageManager.t.noLegalMoves, 1800);
      setTimeout(() => this.passTurn(), 1400);
      return;
    }

    if (this.currentPlayer.isAI) {
      setTimeout(() => {
        const chosenToken = LudoAI.chooseMove(this.currentPlayer, val, this.players, window.ludoBoard);
        if (chosenToken) {
          this.executeTokenMove(chosenToken);
        } else {
          this.passTurn();
        }
      }, 600);
      return;
    }

    // Human player
    if (legalTokens.length === 1) {
      // Auto move single legal token
      setTimeout(() => this.executeTokenMove(legalTokens[0]), 350);
    } else {
      this.gameState = 'SELECTING_TOKEN';
      this.highlightLegalTokens(legalTokens);
      this.updateHUD();
    }
  }

  async executeTokenMove(token) {
    this.gameState = 'MOVING';
    this.clearTokenHighlights();
    this.updateHUD();

    const targetStep = token.getNextStep(this.diceValue);

    await token.animateMove(targetStep, window.ludoBoard, () => {
      this.renderAllTokens();
    });

    this.renderAllTokens();

    // Check Capture & Extra Turn
    let extraTurn = false;
    let extraTurnReason = "";

    // 1. Did token finish into home goal?
    if (token.isFinished) {
      window.audioManager.playTokenHome();
      extraTurn = true;
      extraTurnReason = window.storageManager.t.extraTurnFinish;

      if (this.currentPlayer.checkHasFinished()) {
        this.handlePlayerFinish(this.currentPlayer);
      }
    } else {
      // 2. Did token capture an opponent?
      const captured = this.checkCapture(token);
      if (captured) {
        window.audioManager.playTokenCapture();
        extraTurn = true;
        extraTurnReason = window.storageManager.t.extraTurnCapture;
      }
    }

    // 3. Did roll 6?
    if (this.diceValue === 6 && !this.currentPlayer.hasFinished) {
      extraTurn = true;
      extraTurnReason = window.storageManager.t.extraTurnSix;
    }

    if (this.isMatchOver()) {
      this.handleGameOver();
      return;
    }

    if (extraTurn && !this.currentPlayer.hasFinished) {
      window.uiManager.showToast(extraTurnReason, 1800);
      this.gameState = 'WAITING_ROLL';
      if (window.gameDice) window.gameDice.reset();
      this.updateHUD();

      if (this.currentPlayer.isAI) {
        setTimeout(() => this.executeAITurn(), 850);
      }
    } else {
      this.passTurn();
    }
  }

  checkCapture(token) {
    if (token.step < 0 || token.step > 50) return false;
    const coords = window.ludoBoard.getTokenCoordinates(this.currentPlayer.color, token.step, token.id);
    if (coords.isSafe || coords.commonIndex === undefined) return false;

    let didCapture = false;
    this.players.forEach(opp => {
      if (opp.index === this.currentPlayer.index || opp.hasFinished) return;
      opp.tokens.forEach(oppToken => {
        if (oppToken.step >= 0 && oppToken.step <= 50) {
          const oppCoords = window.ludoBoard.getTokenCoordinates(opp.color, oppToken.step, oppToken.id);
          if (oppCoords.commonIndex === coords.commonIndex && !oppCoords.isSafe) {
            // Captured! Send back to yard
            oppToken.step = -1;
            didCapture = true;

            // Spawn capture explosion burst
            this.spawnCaptureEffect(coords);
          }
        }
      });
    });

    if (didCapture) {
      this.renderAllTokens();
      if (!this.currentPlayer.isAI) {
        window.storageManager.recordMatch(false, 1, 0); // Increment capture count
      }
    }
    return didCapture;
  }

  spawnCaptureEffect(coords) {
    const cs = 100 / 15;
    const board = document.getElementById('board-container');
    if (!board) return;

    const blast = document.createElement('div');
    blast.className = 'capture-blast';
    const leftPercent = (coords.col + 0.5) * cs;
    const topPercent = (coords.row + 0.5) * cs;
    blast.style.left = `${leftPercent}%`;
    blast.style.top = `${topPercent}%`;
    blast.style.transform = 'translate(-50%, -50%)';

    board.appendChild(blast);
    setTimeout(() => blast.remove(), 450);
  }

  handlePlayerFinish(player) {
    this.rankings.push(player);
    player.rank = this.rankings.length;
    window.uiManager.showToast(`🎉 ${player.name} finished #${player.rank}!`, 2500);
  }

  isMatchOver() {
    const remaining = this.players.filter(p => !p.hasFinished);
    return remaining.length <= 1;
  }

  handleGameOver() {
    this.gameState = 'GAME_OVER';

    // Add remaining player to ranking
    this.players.forEach(p => {
      if (!p.hasFinished) {
        this.rankings.push(p);
        p.rank = this.rankings.length;
      }
    });

    window.audioManager.playVictory();

    const humanPlayer = this.players.find(p => !p.isAI);
    const didWin = humanPlayer && humanPlayer.rank === 1;

    // Record stats and give coins & XP
    window.storageManager.recordMatch(didWin, 0, 0);

    this.renderVictoryPodium();
  }

  renderVictoryPodium() {
    const container = document.getElementById('victory-podium-list');
    if (container) {
      container.innerHTML = this.rankings.map((p, idx) => `
        <div class="podium-item ${idx === 0 ? 'winner' : ''}">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span class="podium-rank">${idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '4th'}</span>
            <span style="font-size: 22px;">${p.avatar}</span>
            <span style="font-weight: 800; font-size: 14px;">${p.name}</span>
          </div>
          <span style="font-weight: 700; font-size: 12px; color: var(--accent-gold); text-transform: uppercase;">
            ${p.color}
          </span>
        </div>
      `).join('');
    }

    const humanPlayer = this.players.find(p => !p.isAI);
    const won = humanPlayer && humanPlayer.rank === 1;
    const rewardCoins = won ? 500 : 100;
    const rewardXP = won ? 350 : 100;

    const rewardEl = document.getElementById('victory-rewards');
    if (rewardEl) {
      rewardEl.innerHTML = `
        <div class="reward-pill">+${rewardCoins} 🪙 Coins</div>
        <div class="reward-pill">+${rewardXP} ⭐ XP</div>
      `;
    }

    window.uiManager.showModal('modal-victory');
  }

  passTurn() {
    if (this.isMatchOver()) {
      this.handleGameOver();
      return;
    }

    this.consecutiveSixes = 0;
    do {
      this.currentTurnIndex = (this.currentTurnIndex + 1) % this.players.length;
    } while (this.currentPlayer.hasFinished);

    this.gameState = 'WAITING_ROLL';
    if (window.gameDice) window.gameDice.reset();
    this.updateHUD();

    if (this.currentPlayer.isAI) {
      setTimeout(() => this.executeAITurn(), 800);
    }
  }

  executeAITurn() {
    if (this.gameState !== 'WAITING_ROLL' || !this.currentPlayer.isAI) return;
    this.rollDice();
  }

  highlightLegalTokens(legalTokens) {
    this.clearTokenHighlights();
    legalTokens.forEach(t => {
      const el = document.getElementById(`token-${t.playerIndex}-${t.id}`);
      if (el) {
        el.classList.add('token-selectable');
      }
    });
  }

  clearTokenHighlights() {
    document.querySelectorAll('.token-selectable').forEach(el => {
      el.classList.remove('token-selectable');
    });
  }

  renderAllTokens() {
    const layer = document.getElementById('tokens-layer');
    if (!layer) return;

    const cs = 100 / 15;
    let tokensHtml = '';

    // Group tokens by cell coordinate to apply offset if multiple pieces share a square
    const cellGroups = {};

    this.players.forEach(player => {
      player.tokens.forEach(token => {
        const coords = window.ludoBoard.getTokenCoordinates(player.color, token.step, token.id);
        const key = `${coords.row.toFixed(1)}_${coords.col.toFixed(1)}`;
        if (!cellGroups[key]) cellGroups[key] = [];
        cellGroups[key].push({ player, token, coords });
      });
    });

    const colorFills = {
      red: '#E11D48',
      green: '#059669',
      yellow: '#D97706',
      blue: '#2563EB'
    };

    Object.values(cellGroups).forEach(group => {
      const count = group.length;
      group.forEach((item, idx) => {
        const { player, token, coords } = item;
        let cx = (coords.col + 0.5) * cs;
        let cy = (coords.row + 0.5) * cs;
        let radius = cs * 0.42;

        if (count > 1 && !coords.isBase && !coords.isHome) {
          // Offset overlapping tokens in a small circle
          radius = cs * 0.32;
          const angle = (idx / count) * 2 * Math.PI;
          cx += Math.cos(angle) * (cs * 0.22);
          cy += Math.sin(angle) * (cs * 0.22);
        }

        const fill = colorFills[player.color];

        tokensHtml += `
          <g id="token-${player.index}-${token.id}" 
             class="ludo-token-elem ${token.isFinished ? 'finished' : ''}" 
             onclick="window.onTokenClicked(${player.index}, ${token.id})"
             style="cursor: pointer; transition: transform 0.2s;">
            <!-- Outer Glow / Shadow -->
            <circle cx="${cx}" cy="${cy}" r="${radius}" fill="${fill}" stroke="#FFFFFF" stroke-width="0.7" filter="url(#shadowFilter)"/>
            <!-- Inner highlight ring -->
            <circle cx="${cx}" cy="${cy}" r="${radius * 0.65}" fill="none" stroke="rgba(255,255,255,0.7)" stroke-width="0.5"/>
            <!-- Center crown or gem symbol -->
            <circle cx="${cx}" cy="${cy}" r="${radius * 0.32}" fill="#FFFFFF"/>
          </g>
        `;
      });
    });

    layer.innerHTML = tokensHtml;
  }

  updateHUD() {
    // Update player cards
    this.players.forEach(p => {
      const card = document.getElementById(`player-card-${p.index}`);
      if (!card) return;

      const isCurrent = p.index === this.currentTurnIndex && !p.hasFinished;
      if (isCurrent) {
        card.classList.add('active-turn');
      } else {
        card.classList.remove('active-turn');
      }

      const statusEl = document.getElementById(`player-status-${p.index}`);
      if (statusEl) {
        if (p.hasFinished) {
          statusEl.innerText = `Rank #${p.rank}`;
          statusEl.style.color = 'var(--accent-gold)';
        } else {
          statusEl.innerText = `${p.getFinishedCount()}/4 Home`;
        }
      }
    });

    // Update Turn Banner
    const banner = document.getElementById('turn-player-name');
    if (banner) {
      banner.innerText = this.currentPlayer.name;
    }

    const diceContainer = document.getElementById('interactive-dice-container');
    if (diceContainer) {
      if (this.currentPlayer.isAI || this.gameState !== 'WAITING_ROLL') {
        diceContainer.classList.add('disabled');
      } else {
        diceContainer.classList.remove('disabled');
      }
    }
  }
}

window.ludoGame = new LudoGame();
