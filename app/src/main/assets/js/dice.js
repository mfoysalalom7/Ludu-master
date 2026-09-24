/**
 * Ludo Royale - 3D Animated Dice System
 * Handles 3D CSS tumbling physics, randomized results, skin customizer and callbacks
 */

class LudoDice {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.isRolling = false;
    this.currentValue = 1;
    this.skin = 'classic';
    this.cubeElement = null;

    // Face rotation map in degrees [x, y]
    this.faceRotations = {
      1: { x: 0, y: 0 },
      2: { x: 0, y: -90 },
      3: { x: 0, y: -180 },
      4: { x: 0, y: 90 },
      5: { x: -90, y: 0 },
      6: { x: 90, y: 0 }
    };

    this.render();
  }

  setSkin(skinName) {
    this.skin = skinName || 'classic';
    if (this.cubeElement) {
      this.cubeElement.className = `dice-cube skin-${this.skin}`;
    }
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="dice-cube skin-${this.skin}" id="interactive-dice-cube">
        <!-- Face 1 -->
        <div class="dice-face face-1"><div class="dice-dot"></div></div>
        <!-- Face 2 -->
        <div class="dice-face face-2"><div class="dice-dot"></div><div class="dice-dot"></div></div>
        <!-- Face 3 -->
        <div class="dice-face face-3"><div class="dice-dot"></div><div class="dice-dot"></div><div class="dice-dot"></div></div>
        <!-- Face 4 -->
        <div class="dice-face face-4">
          <div class="dice-dot"></div><div class="dice-dot"></div>
          <div class="dice-dot"></div><div class="dice-dot"></div>
        </div>
        <!-- Face 5 -->
        <div class="dice-face face-5">
          <div class="dice-dot"></div><div class="dice-dot"></div>
          <div class="dice-dot"></div>
          <div class="dice-dot"></div><div class="dice-dot"></div>
        </div>
        <!-- Face 6 -->
        <div class="dice-face face-6">
          <div class="dice-dot"></div><div class="dice-dot"></div>
          <div class="dice-dot"></div><div class="dice-dot"></div>
          <div class="dice-dot"></div><div class="dice-dot"></div>
        </div>
      </div>
      <div class="dice-roll-hint" id="dice-roll-hint">TAP TO ROLL</div>
    `;
    this.cubeElement = document.getElementById('interactive-dice-cube');
  }

  roll() {
    if (this.isRolling) return Promise.reject(new Error("Dice is already rolling"));
    this.isRolling = true;

    const hint = document.getElementById('dice-roll-hint');
    if (hint) hint.style.opacity = '0';

    window.audioManager.playDiceRoll();

    return new Promise((resolve) => {
      const result = Math.floor(Math.random() * 6) + 1;
      this.currentValue = result;

      // Add multi-revolution tumbling offset
      const extraX = (Math.floor(Math.random() * 3) + 2) * 360;
      const extraY = (Math.floor(Math.random() * 3) + 2) * 360;
      const targetRot = this.faceRotations[result];

      const finalX = extraX + targetRot.x;
      const finalY = extraY + targetRot.y;

      if (this.cubeElement) {
        this.cubeElement.style.transition = 'transform 0.75s cubic-bezier(0.2, 0.8, 0.3, 1.15)';
        this.cubeElement.style.transform = `rotateX(${finalX}deg) rotateY(${finalY}deg)`;
      }

      setTimeout(() => {
        this.isRolling = false;
        if (result === 6) {
          window.audioManager.playRollSix();
        }
        resolve(result);
      }, 760);
    });
  }

  reset() {
    if (this.cubeElement) {
      this.cubeElement.style.transition = 'none';
      this.cubeElement.style.transform = `rotateX(0deg) rotateY(0deg)`;
    }
    const hint = document.getElementById('dice-roll-hint');
    if (hint) hint.style.opacity = '1';
  }
}
