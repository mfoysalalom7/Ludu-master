/**
 * Ludo Royale - UI & Screen Manager
 * Manages modal views, screens, toasts, localized texts, shop, profile, and HUD widgets
 */

class UIManager {
  constructor() {
    this.currentScreen = 'screen-main-menu';
    this.activeModal = null;
    this.toastTimeout = null;
  }

  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      this.currentScreen = screenId;
    }
  }

  showModal(modalId) {
    this.closeModal();
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      this.activeModal = modal;
    }
  }

  closeModal() {
    if (this.activeModal) {
      this.activeModal.classList.remove('active');
      this.activeModal = null;
    }
  }

  showToast(text, duration = 2200) {
    const toast = document.getElementById('game-toast');
    const toastText = document.getElementById('toast-message');
    if (!toast || !toastText) return;

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    toastText.innerText = text;
    toast.classList.add('active');

    this.toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
    }, duration);
  }

  showChatBubble(playerIndex, text, isEmoji = false) {
    const card = document.getElementById(`player-card-${playerIndex}`);
    if (!card) return;

    const bubble = document.createElement('div');
    bubble.className = 'chat-floating-bubble';
    bubble.innerText = text;
    if (isEmoji) {
      bubble.style.fontSize = '24px';
    }

    const rect = card.getBoundingClientRect();
    const boardArea = document.getElementById('board-container');
    const boardRect = boardArea ? boardArea.getBoundingClientRect() : { top: 0, left: 0 };

    bubble.style.top = `${rect.top - boardRect.top - 20}px`;
    bubble.style.left = `${rect.left - boardRect.left + 20}px`;

    if (boardArea) {
      boardArea.appendChild(bubble);
      setTimeout(() => bubble.remove(), 2900);
    }
  }

  updateProfileBadge() {
    const data = window.storageManager.data;
    const t = window.storageManager.t;
    const nameEl = document.getElementById('top-bar-user-name');
    const levelEl = document.getElementById('top-bar-user-level');
    const avatarEl = document.getElementById('top-bar-avatar');
    const coinsEl = document.getElementById('top-bar-coins');

    if (nameEl) nameEl.innerText = data.name;
    if (levelEl) levelEl.innerText = `${t.level} ${data.level}`;
    if (avatarEl) avatarEl.innerText = data.avatar;
    if (coinsEl) coinsEl.innerText = data.coins.toLocaleString();
  }

  renderMissions() {
    const container = document.getElementById('missions-list');
    if (!container) return;
    const data = window.storageManager.data;
    const t = window.storageManager.t;

    container.innerHTML = data.missions.map(m => `
      <div class="podium-item" style="justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 700; font-size: 13px;">${m.title}</div>
          <div style="font-size: 11px; color: var(--text-muted);">
            Progress: ${m.current}/${m.target}
          </div>
        </div>
        <div>
          ${m.claimed ? `<span style="font-size: 12px; color: var(--text-muted);">${t.claimed}</span>` :
            m.completed ? `<button class="btn btn-gold" style="padding: 6px 12px; font-size: 12px;" onclick="window.claimMissionReward('${m.id}')">${t.claim} +${m.reward}🪙</button>` :
            `<span style="font-size: 12px; color: var(--accent-gold);">+${m.reward} 🪙</span>`}
        </div>
      </div>
    `).join('');
  }

  renderAchievements() {
    const container = document.getElementById('achievements-list');
    if (!container) return;
    const data = window.storageManager.data;
    const t = window.storageManager.t;

    container.innerHTML = data.achievements.map(a => `
      <div class="podium-item" style="justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 24px;">${a.icon}</span>
          <div>
            <div style="font-weight: 700; font-size: 13px;">${a.title}</div>
            <div style="font-size: 11px; color: var(--text-muted);">${a.desc} (${a.progress}/${a.target})</div>
          </div>
        </div>
        <div>
          ${a.claimed ? `<span style="font-size: 12px; color: var(--text-muted);">${t.claimed}</span>` :
            a.completed ? `<button class="btn btn-gold" style="padding: 6px 12px; font-size: 12px;" onclick="window.claimAchievementReward('${a.id}')">${t.claim} +${a.reward}🪙</button>` :
            `<span style="font-size: 12px; color: var(--accent-gold);">+${a.reward} 🪙</span>`}
        </div>
      </div>
    `).join('');
  }

  renderShop(category = 'themes') {
    const container = document.getElementById('shop-items-grid');
    if (!container) return;
    const data = window.storageManager.data;
    const t = window.storageManager.t;

    const catalog = {
      themes: [
        { id: 'classic', name: 'Classic Royale', icon: '🏰', price: 0 },
        { id: 'space', name: 'Cosmic Nebula', icon: '🌌', price: 1000 },
        { id: 'jungle', name: 'Emerald Jungle', icon: '🌿', price: 1500 },
        { id: 'ocean', name: 'Deep Ocean', icon: '🌊', price: 2000 },
        { id: 'neon', name: 'Cyber Neon', icon: '⚡', price: 2500 },
        { id: 'fantasy', name: 'Mythic Fantasy', icon: '🔮', price: 3000 }
      ],
      dice: [
        { id: 'classic', name: 'Classic White', icon: '🎲', price: 0 },
        { id: 'gold', name: 'Golden Royale', icon: '🪙', price: 1200 },
        { id: 'neon', name: 'Neon Cyber', icon: '💠', price: 1800 },
        { id: 'cosmic', name: 'Cosmic Star', icon: '⭐', price: 2400 },
        { id: 'emerald', name: 'Emerald Gem', icon: '💎', price: 3000 }
      ],
      tokens: [
        { id: 'gem', name: 'Royal Gem', icon: '💎', price: 0 },
        { id: 'classic', name: 'Classic Pawn', icon: '♟️', price: 800 },
        { id: 'shield', name: 'Knight Shield', icon: '🛡️', price: 1500 },
        { id: 'star', name: 'Astral Star', icon: '🌟', price: 2200 }
      ]
    };

    const items = catalog[category] || [];
    container.innerHTML = items.map(item => {
      const owned = data.inventory[category]?.includes(item.id) || item.price === 0;
      const equippedKey = category === 'themes' ? 'equippedTheme' : category === 'dice' ? 'equippedDice' : 'equippedToken';
      const isEquipped = data.inventory[equippedKey] === item.id;

      return `
        <div class="shop-card ${isEquipped ? 'equipped' : ''}">
          <div class="shop-item-preview">${item.icon}</div>
          <div class="shop-item-name">${item.name}</div>
          ${isEquipped ?
            `<button class="btn btn-outline shop-item-action" disabled style="opacity: 0.8; color: var(--success);">${t.equipped}</button>` :
            owned ?
            `<button class="btn btn-primary shop-item-action" onclick="window.equipShopItem('${category}', '${item.id}')">${t.equip}</button>` :
            `<button class="btn btn-gold shop-item-action" onclick="window.buyShopItem('${category}', '${item.id}', ${item.price})">${item.price} 🪙</button>`}
        </div>
      `;
    }).join('');
  }
}

window.uiManager = new UIManager();
