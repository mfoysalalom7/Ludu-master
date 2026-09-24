/**
 * Ludo Royale - Main App Bootstrap & Event Router
 * Initializes managers, binds interactive listeners, and bridges Android system back events
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Dice Controller
  window.gameDice = new LudoDice('interactive-dice-container');

  // Load and apply sound & theme settings
  const settings = window.storageManager.data.settings;
  window.audioManager.toggleSound(settings.sound);
  window.audioManager.toggleMusic(settings.music);
  window.audioManager.toggleVibration(settings.vibration);

  const equippedTheme = window.storageManager.data.inventory.equippedTheme || 'classic';
  document.body.className = `theme-${equippedTheme}`;

  window.uiManager.updateProfileBadge();
  applyLocalization();

  // Check Daily Reward badge
  if (window.storageManager.canClaimDailyReward()) {
    const dot = document.getElementById('daily-notif-dot');
    if (dot) dot.style.display = 'block';
  }

  // Setup click listeners for main screens
  setupMainNavigation();
  setupGameHUD();
  setupSettingsModal();
});

function applyLocalization() {
  const t = window.storageManager.t;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) {
      el.innerText = t[key];
    }
  });
}

function setupMainNavigation() {
  // Pass & Play
  const btnPassPlay = document.getElementById('btn-mode-local');
  if (btnPassPlay) {
    btnPassPlay.onclick = () => {
      window.audioManager.playClick();
      window.uiManager.showModal('modal-select-players');
    };
  }

  // VS Computer
  const btnComputer = document.getElementById('btn-mode-ai');
  if (btnComputer) {
    btnComputer.onclick = () => {
      window.audioManager.playClick();
      window.uiManager.showModal('modal-ai-settings');
    };
  }

  // Online Match
  const btnOnline = document.getElementById('btn-mode-online');
  if (btnOnline) {
    btnOnline.onclick = () => {
      window.audioManager.playClick();
      window.startQuickMatch();
    };
  }

  // Play with Friends
  const btnFriends = document.getElementById('btn-mode-friends');
  if (btnFriends) {
    btnFriends.onclick = () => {
      window.audioManager.playClick();
      window.uiManager.showModal('modal-friends-lobby');
    };
  }

  // Profile Button
  const userBadge = document.getElementById('user-profile-badge');
  if (userBadge) {
    userBadge.onclick = () => {
      window.audioManager.playClick();
      window.openProfileModal();
    };
  }

  // Shop Navigation
  const btnShop = document.getElementById('nav-shop');
  if (btnShop) {
    btnShop.onclick = () => {
      window.audioManager.playClick();
      window.openShopModal();
    };
  }

  // Missions Navigation
  const btnMissions = document.getElementById('nav-missions');
  if (btnMissions) {
    btnMissions.onclick = () => {
      window.audioManager.playClick();
      window.openMissionsModal();
    };
  }

  // Achievements Navigation
  const btnAchievements = document.getElementById('nav-achievements');
  if (btnAchievements) {
    btnAchievements.onclick = () => {
      window.audioManager.playClick();
      window.openAchievementsModal();
    };
  }

  // Daily Reward Navigation
  const btnDaily = document.getElementById('nav-daily');
  if (btnDaily) {
    btnDaily.onclick = () => {
      window.audioManager.playClick();
      window.openDailyRewardModal();
    };
  }

  // Settings Button
  const btnSettings = document.getElementById('btn-open-settings');
  if (btnSettings) {
    btnSettings.onclick = () => {
      window.audioManager.playClick();
      window.uiManager.showModal('modal-settings');
    };
  }
}

function setupGameHUD() {
  // Dice container click to roll
  const diceContainer = document.getElementById('interactive-dice-container');
  if (diceContainer) {
    diceContainer.onclick = () => {
      if (window.ludoGame && window.ludoGame.gameState === 'WAITING_ROLL') {
        window.ludoGame.rollDice();
      }
    };
  }

  // Quick Chat Toggle
  const btnChat = document.getElementById('btn-quick-chat');
  const chatPopover = document.getElementById('quick-chat-popover');
  if (btnChat && chatPopover) {
    btnChat.onclick = (e) => {
      e.stopPropagation();
      window.audioManager.playClick();
      chatPopover.classList.toggle('active');
    };

    document.addEventListener('click', () => {
      chatPopover.classList.remove('active');
    });
  }

  // Game Pause / Leave Button
  const btnPause = document.getElementById('btn-game-pause');
  if (btnPause) {
    btnPause.onclick = () => {
      window.audioManager.playClick();
      window.uiManager.showModal('modal-pause-game');
    };
  }
}

function setupSettingsModal() {
  const soundToggle = document.getElementById('setting-sound');
  const musicToggle = document.getElementById('setting-music');
  const vibToggle = document.getElementById('setting-vibration');
  const langSelect = document.getElementById('setting-language');

  const settings = window.storageManager.data.settings;
  if (soundToggle) {
    soundToggle.checked = settings.sound;
    soundToggle.onchange = (e) => {
      settings.sound = e.target.checked;
      window.storageManager.save();
      window.audioManager.toggleSound(e.target.checked);
    };
  }
  if (musicToggle) {
    musicToggle.checked = settings.music;
    musicToggle.onchange = (e) => {
      settings.music = e.target.checked;
      window.storageManager.save();
      window.audioManager.toggleMusic(e.target.checked);
    };
  }
  if (vibToggle) {
    vibToggle.checked = settings.vibration;
    vibToggle.onchange = (e) => {
      settings.vibration = e.target.checked;
      window.storageManager.save();
      window.audioManager.toggleVibration(e.target.checked);
    };
  }
  if (langSelect) {
    langSelect.value = settings.language || 'en';
    langSelect.onchange = (e) => {
      settings.language = e.target.value;
      window.storageManager.save();
      applyLocalization();
      window.uiManager.updateProfileBadge();
    };
  }
}

// Global Actions Callable from HTML Buttons
window.startLocalGame = (playerCount) => {
  window.uiManager.closeModal();
  window.uiManager.showScreen('screen-game');
  window.ludoGame.startNewGame({
    mode: 'local',
    playerCount
  });
};

window.startAIGame = () => {
  const difficulty = document.querySelector('input[name="ai-diff"]:checked')?.value || 'medium';
  const color = document.querySelector('input[name="ai-color"]:checked')?.value || 'red';
  const count = parseInt(document.getElementById('ai-player-count')?.value || '4', 10);

  window.uiManager.closeModal();
  window.uiManager.showScreen('screen-game');
  window.ludoGame.startNewGame({
    mode: 'ai',
    playerCount: count,
    aiDifficulty: difficulty,
    humanColor: color
  });
};

window.startQuickMatch = () => {
  window.uiManager.showToast("Finding opponents...", 1500);
  setTimeout(() => {
    window.uiManager.showScreen('screen-game');
    window.ludoGame.startNewGame({
      mode: 'online',
      playerCount: 4
    });
  }, 1200);
};

window.createCustomRoom = () => {
  const code = window.multiplayerManager.createRoom();
  document.getElementById('lobby-room-code').innerText = code;
  window.uiManager.showToast(`Room Created: ${code}`, 2000);
};

window.joinCustomRoom = () => {
  const input = document.getElementById('input-join-code');
  if (!input || !input.value.trim()) {
    window.uiManager.showToast("Please enter a room code!", 1800);
    return;
  }
  window.multiplayerManager.joinRoom(input.value.trim());
  window.uiManager.closeModal();
  window.uiManager.showToast(`Joined Room ${input.value.trim().toUpperCase()}`, 2000);
  window.startQuickMatch();
};

window.onTokenClicked = (playerIndex, tokenId) => {
  if (!window.ludoGame || window.ludoGame.gameState !== 'SELECTING_TOKEN') return;
  const player = window.ludoGame.players[playerIndex];
  if (!player || player.index !== window.ludoGame.currentTurnIndex) return;

  const token = player.tokens[tokenId];
  if (token && token.canMove(window.ludoGame.diceValue)) {
    window.ludoGame.executeTokenMove(token);
  }
};

window.sendQuickChat = (text, isEmoji = false) => {
  const popover = document.getElementById('quick-chat-popover');
  if (popover) popover.classList.remove('active');

  const playerIdx = window.ludoGame ? window.ludoGame.currentTurnIndex : 0;
  window.uiManager.showChatBubble(playerIdx, text, isEmoji);
  window.multiplayerManager.sendChat(window.storageManager.data.name, text, isEmoji);
};

window.openShopModal = () => {
  window.uiManager.renderShop('themes');
  window.uiManager.showModal('modal-shop');
};

window.switchShopTab = (tab) => {
  document.querySelectorAll('.shop-tab-btn').forEach(b => b.classList.remove('active'));
  const btn = document.getElementById(`shop-tab-${tab}`);
  if (btn) btn.classList.add('active');
  window.uiManager.renderShop(tab);
};

window.buyShopItem = (category, itemId, price) => {
  const data = window.storageManager.data;
  if (data.coins < price) {
    window.uiManager.showToast(window.storageManager.t.notEnoughCoins, 2000);
    return;
  }
  data.coins -= price;
  if (!data.inventory[category]) data.inventory[category] = [];
  data.inventory[category].push(itemId);
  window.storageManager.save();
  window.uiManager.updateProfileBadge();
  window.uiManager.renderShop(category);
  window.audioManager.playVictory();
  window.uiManager.showToast(`Unlocked ${itemId.toUpperCase()}!`, 1800);
};

window.equipShopItem = (category, itemId) => {
  const data = window.storageManager.data;
  const key = category === 'themes' ? 'equippedTheme' : category === 'dice' ? 'equippedDice' : 'equippedToken';
  data.inventory[key] = itemId;
  window.storageManager.save();

  if (category === 'themes') {
    document.body.className = `theme-${itemId}`;
  } else if (category === 'dice' && window.gameDice) {
    window.gameDice.setSkin(itemId);
  }

  window.uiManager.renderShop(category);
  window.audioManager.playClick();
  window.uiManager.showToast(window.storageManager.t.equipped, 1500);
};

window.openProfileModal = () => {
  const data = window.storageManager.data;
  const t = window.storageManager.t;

  document.getElementById('profile-edit-name').value = data.name;
  document.getElementById('profile-level-display').innerText = `${t.level} ${data.level} (${data.xp} / ${data.level * 300} XP)`;
  document.getElementById('profile-stats-played').innerText = data.stats.played;
  document.getElementById('profile-stats-won').innerText = data.stats.won;
  document.getElementById('profile-stats-lost').innerText = data.stats.lost;

  const winRate = data.stats.played > 0 ? Math.round((data.stats.won / data.stats.played) * 100) : 0;
  document.getElementById('profile-stats-winrate').innerText = `${winRate}%`;

  window.uiManager.showModal('modal-profile');
};

window.saveProfile = () => {
  const input = document.getElementById('profile-edit-name');
  if (input && input.value.trim()) {
    window.storageManager.data.name = input.value.trim();
    window.storageManager.save();
    window.uiManager.updateProfileBadge();
    window.uiManager.closeModal();
    window.uiManager.showToast("Profile Updated!", 1500);
  }
};

window.selectAvatar = (emoji) => {
  window.storageManager.data.avatar = emoji;
  window.storageManager.save();
  window.uiManager.updateProfileBadge();
  document.getElementById('profile-current-avatar').innerText = emoji;
};

window.openMissionsModal = () => {
  window.uiManager.renderMissions();
  window.uiManager.showModal('modal-missions');
};

window.claimMissionReward = (missionId) => {
  const reward = window.storageManager.claimMission(missionId);
  if (reward > 0) {
    window.audioManager.playVictory();
    window.uiManager.updateProfileBadge();
    window.uiManager.renderMissions();
    window.uiManager.showToast(`Claimed +${reward} 🪙 Coins!`, 2000);
  }
};

window.openAchievementsModal = () => {
  window.uiManager.renderAchievements();
  window.uiManager.showModal('modal-achievements');
};

window.claimAchievementReward = (achId) => {
  const reward = window.storageManager.claimAchievement(achId);
  if (reward > 0) {
    window.audioManager.playVictory();
    window.uiManager.updateProfileBadge();
    window.uiManager.renderAchievements();
    window.uiManager.showToast(`Claimed +${reward} 🪙 Coins!`, 2000);
  }
};

window.openDailyRewardModal = () => {
  const canClaim = window.storageManager.canClaimDailyReward();
  const streak = window.storageManager.data.daily.streak || 0;
  const reward = streak * 150 + 100;

  const claimBtn = document.getElementById('btn-claim-daily');
  const streakEl = document.getElementById('daily-streak-display');
  const rewardEl = document.getElementById('daily-reward-display');

  if (streakEl) streakEl.innerText = `Streak: ${streak} Days 🔥`;
  if (rewardEl) rewardEl.innerText = `+${reward} 🪙 Coins`;

  if (claimBtn) {
    claimBtn.disabled = !canClaim;
    claimBtn.innerText = canClaim ? window.storageManager.t.claim : window.storageManager.t.claimed;
  }

  window.uiManager.showModal('modal-daily-reward');
};

window.claimDailyRewardAction = () => {
  const res = window.storageManager.claimDailyReward();
  if (res) {
    window.audioManager.playVictory();
    window.uiManager.updateProfileBadge();
    const dot = document.getElementById('daily-notif-dot');
    if (dot) dot.style.display = 'none';
    window.uiManager.closeModal();
    window.uiManager.showToast(`Claimed Day ${res.streak} (+${res.reward} 🪙)!`, 2500);
  }
};

window.exitToMainMenu = () => {
  window.uiManager.closeModal();
  window.uiManager.showScreen('screen-main-menu');
  window.uiManager.updateProfileBadge();
};

// Android System Back Button Handler
window.handleAndroidBack = () => {
  if (window.uiManager.activeModal) {
    window.uiManager.closeModal();
    return;
  }
  if (window.uiManager.currentScreen === 'screen-game') {
    window.uiManager.showModal('modal-pause-game');
    return;
  }
  // Exit or toast
  window.uiManager.showToast("Press home button to exit", 1500);
};
