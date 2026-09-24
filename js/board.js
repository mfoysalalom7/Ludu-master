/**
 * Ludo Royale - Board Geometry, Layout & Coordinates Engine
 * Calculates 15x15 Ludo grid coordinates, paths, safe spots, and renders dynamic vector board
 */

class LudoBoard {
  constructor() {
    this.gridSize = 15;

    // 52 common perimeter circuit tiles [row, col]
    this.commonPath = [
      /* 0..4: Red arm out */
      [6, 1], [6, 2], [6, 3], [6, 4], [6, 5],
      /* 5..10: Left vertical up */
      [5, 6], [4, 6], [3, 6], [2, 6], [1, 6], [0, 6],
      /* 11: Top edge transition */
      [0, 7],
      /* 12..17: Green arm in */
      [0, 8], [1, 8], [2, 8], [3, 8], [4, 8], [5, 8],
      /* 18..23: Top horizontal right */
      [6, 9], [6, 10], [6, 11], [6, 12], [6, 13], [6, 14],
      /* 24: Right edge transition */
      [7, 14],
      /* 25..30: Yellow arm in */
      [8, 14], [8, 13], [8, 12], [8, 11], [8, 10], [8, 9],
      /* 31..36: Right vertical down */
      [9, 8], [10, 8], [11, 8], [12, 8], [13, 8], [14, 8],
      /* 37: Bottom edge transition */
      [14, 7],
      /* 38..43: Blue arm in */
      [14, 6], [13, 6], [12, 6], [11, 6], [10, 6], [9, 6],
      /* 44..49: Bottom horizontal left */
      [8, 5], [8, 4], [8, 3], [8, 2], [8, 1], [8, 0],
      /* 50: Left edge transition */
      [7, 0],
      /* 51: Entry to Red home run */
      [6, 0]
    ];

    // Starting indices on commonPath for each color
    this.colorOffsets = {
      red: 0,
      green: 13,
      yellow: 26,
      blue: 39
    };

    // Safe indices on commonPath
    this.safeIndices = [0, 8, 13, 21, 26, 34, 39, 47];

    // Home stretches (steps 51 to 55) and Center Home (step 56) [row, col]
    this.homeStretches = {
      red: [
        [7, 1], [7, 2], [7, 3], [7, 4], [7, 5], [7, 6]
      ],
      green: [
        [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7]
      ],
      yellow: [
        [7, 13], [7, 12], [7, 11], [7, 10], [7, 9], [7, 8]
      ],
      blue: [
        [13, 7], [12, 7], [11, 7], [10, 7], [9, 7], [8, 7]
      ]
    };

    // Home yard base nests coordinates for each token index (0..3)
    this.yardPositions = {
      red: [
        { r: 2, c: 2 }, { r: 2, c: 3.5 },
        { r: 3.5, c: 2 }, { r: 3.5, c: 3.5 }
      ],
      green: [
        { r: 2, c: 11 }, { r: 2, c: 12.5 },
        { r: 3.5, c: 11 }, { r: 3.5, c: 12.5 }
      ],
      yellow: [
        { r: 11, c: 11 }, { r: 11, c: 12.5 },
        { r: 12.5, c: 11 }, { r: 12.5, c: 12.5 }
      ],
      blue: [
        { r: 11, c: 2 }, { r: 11, c: 3.5 },
        { r: 12.5, c: 2 }, { r: 12.5, c: 3.5 }
      ]
    };
  }

  isSafeCommonIndex(index) {
    return this.safeIndices.includes(index);
  }

  getTokenCoordinates(color, step, tokenIndex = 0) {
    if (step < 0) {
      // In home base yard
      const pos = this.yardPositions[color][tokenIndex] || { r: 2, c: 2 };
      return {
        row: pos.r,
        col: pos.c,
        isSafe: true,
        isBase: true
      };
    }

    if (step >= 56) {
      // Finished in center crown home
      const finalTile = this.homeStretches[color][5];
      return {
        row: finalTile[0],
        col: finalTile[1],
        isSafe: true,
        isHome: true
      };
    }

    if (step >= 51) {
      // On colored home stretch
      const stretchTile = this.homeStretches[color][step - 51];
      return {
        row: stretchTile[0],
        col: stretchTile[1],
        isSafe: true,
        isHomeStretch: true
      };
    }

    // On common perimeter path
    const offset = this.colorOffsets[color];
    const commonIndex = (offset + step) % 52;
    const tile = this.commonPath[commonIndex];
    return {
      row: tile[0],
      col: tile[1],
      commonIndex,
      isSafe: this.isSafeCommonIndex(commonIndex),
      isBase: false
    };
  }

  renderToSVG(containerId, theme = 'classic') {
    const container = document.getElementById(containerId);
    if (!container) return;

    const cellSize = 100 / this.gridSize; // percentage per cell (6.666%)

    let svg = `<svg viewBox="0 0 100 100" class="ludo-svg-board theme-${theme}" style="width: 100%; height: 100%;">
      <defs>
        <!-- Gradients for bases and paths -->
        <linearGradient id="redGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#F43F5E"/>
          <stop offset="100%" stop-color="#BE123C"/>
        </linearGradient>
        <linearGradient id="greenGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#10B981"/>
          <stop offset="100%" stop-color="#047857"/>
        </linearGradient>
        <linearGradient id="yellowGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FBBF24"/>
          <stop offset="100%" stop-color="#D97706"/>
        </linearGradient>
        <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#3B82F6"/>
          <stop offset="100%" stop-color="#1D4ED8"/>
        </linearGradient>

        <filter id="shadowFilter" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="0.6" flood-opacity="0.3"/>
        </filter>
      </defs>

      <!-- Background Board Base -->
      <rect width="100" height="100" fill="var(--board-bg)" rx="4"/>

      <!-- 4 Home Bases (6x6 cells each) -->
      <!-- Red Base (Top-Left) -->
      <rect x="0" y="0" width="${cellSize * 6}" height="${cellSize * 6}" fill="url(#redGrad)"/>
      <rect x="${cellSize * 0.8}" y="${cellSize * 0.8}" width="${cellSize * 4.4}" height="${cellSize * 4.4}" rx="2" fill="#FFFFFF" opacity="0.92"/>
      
      <!-- Green Base (Top-Right) -->
      <rect x="${cellSize * 9}" y="0" width="${cellSize * 6}" height="${cellSize * 6}" fill="url(#greenGrad)"/>
      <rect x="${cellSize * 9.8}" y="${cellSize * 0.8}" width="${cellSize * 4.4}" height="${cellSize * 4.4}" rx="2" fill="#FFFFFF" opacity="0.92"/>
      
      <!-- Yellow Base (Bottom-Right) -->
      <rect x="${cellSize * 9}" y="${cellSize * 9}" width="${cellSize * 6}" height="${cellSize * 6}" fill="url(#yellowGrad)"/>
      <rect x="${cellSize * 9.8}" y="${cellSize * 9.8}" width="${cellSize * 4.4}" height="${cellSize * 4.4}" rx="2" fill="#FFFFFF" opacity="0.92"/>
      
      <!-- Blue Base (Bottom-Left) -->
      <rect x="0" y="${cellSize * 9}" width="${cellSize * 6}" height="${cellSize * 6}" fill="url(#blueGrad)"/>
      <rect x="${cellSize * 0.8}" y="${cellSize * 9.8}" width="${cellSize * 4.4}" height="${cellSize * 4.4}" rx="2" fill="#FFFFFF" opacity="0.92"/>

      <!-- Base Token Nest Circles -->
      ${this.renderBaseNests(cellSize)}

      <!-- Path Cells Outline & Grids -->
      ${this.renderPathCells(cellSize)}

      <!-- Center Home Triangles & Crown -->
      ${this.renderCenterHome(cellSize)}

      <!-- Safe Stars -->
      ${this.renderSafeStars(cellSize)}

      <!-- Dynamic Tokens Layer -->
      <g id="tokens-layer"></g>
    </svg>`;

    container.innerHTML = svg;
  }

  renderBaseNests(cs) {
    let nests = '';
    const colors = ['red', 'green', 'yellow', 'blue'];
    const fillMap = {
      red: '#E11D48',
      green: '#059669',
      yellow: '#D97706',
      blue: '#2563EB'
    };

    colors.forEach(col => {
      this.yardPositions[col].forEach(p => {
        nests += `<circle cx="${(p.c + 0.5) * cs}" cy="${(p.r + 0.5) * cs}" r="${cs * 0.45}" fill="${fillMap[col]}" stroke="#FFFFFF" stroke-width="0.6"/>`;
      });
    });

    return nests;
  }

  renderPathCells(cs) {
    let paths = '';
    
    // Draw cells on cross arms (rows 0-5, 9-14 at cols 6-8, and cols 0-5, 9-14 at rows 6-8)
    for (let r = 0; r < 15; r++) {
      for (let c = 0; c < 15; c++) {
        // Skip base boxes and center 3x3
        const inRedBase = r < 6 && c < 6;
        const inGreenBase = r < 6 && c > 8;
        const inYellowBase = r > 8 && c > 8;
        const inBlueBase = r > 8 && c < 6;
        const inCenter = r >= 6 && r <= 8 && c >= 6 && c <= 8;

        if (inRedBase || inGreenBase || inYellowBase || inBlueBase || inCenter) continue;

        let fill = '#FFFFFF';
        let stroke = '#E2E8F0';

        // Colored home stretch columns
        if (r === 7 && c >= 1 && c <= 5) fill = '#FDA4AF'; // Red stretch
        if (c === 7 && r >= 1 && r <= 5) fill = '#A7F3D0'; // Green stretch
        if (r === 7 && c >= 9 && c <= 13) fill = '#FDE68A'; // Yellow stretch
        if (c === 7 && r >= 9 && r <= 13) fill = '#BFDBFE'; // Blue stretch

        // Starting cells
        if (r === 6 && c === 1) fill = '#E11D48'; // Red start
        if (r === 1 && c === 8) fill = '#059669'; // Green start
        if (r === 8 && c === 13) fill = '#D97706'; // Yellow start
        if (r === 13 && c === 6) fill = '#2563EB'; // Blue start

        paths += `<rect x="${c * cs}" y="${r * cs}" width="${cs}" height="${cs}" fill="${fill}" stroke="${stroke}" stroke-width="0.3"/>`;
      }
    }

    return paths;
  }

  renderCenterHome(cs) {
    const cx = 7.5 * cs;
    const cy = 7.5 * cs;
    const x6 = 6 * cs;
    const y6 = 6 * cs;
    const x9 = 9 * cs;
    const y9 = 9 * cs;

    return `
      <!-- Red Center Triangle (Left) -->
      <polygon points="${x6},${y6} ${x6},${y9} ${cx},${cy}" fill="#E11D48"/>
      <!-- Green Center Triangle (Top) -->
      <polygon points="${x6},${y6} ${x9},${y6} ${cx},${cy}" fill="#059669"/>
      <!-- Yellow Center Triangle (Right) -->
      <polygon points="${x9},${y6} ${x9},${y9} ${cx},${cy}" fill="#D97706"/>
      <!-- Blue Center Triangle (Bottom) -->
      <polygon points="${x6},${y9} ${x9},${y9} ${cx},${cy}" fill="#2563EB"/>

      <!-- Center Crown Emblem -->
      <circle cx="${cx}" cy="${cy}" r="${cs * 0.7}" fill="#FFFFFF" stroke="#F59E0B" stroke-width="0.8"/>
      <text x="${cx}" y="${cy + 1.8}" font-size="5" text-anchor="middle" dominant-baseline="middle">👑</text>
    `;
  }

  renderSafeStars(cs) {
    const starCoords = [
      { r: 2, c: 6 },  // Top-left arm star
      { r: 6, c: 12 }, // Right arm star
      { r: 12, c: 8 }, // Bottom arm star
      { r: 8, c: 2 },  // Left arm star
      // Starting positions also have small emblem
      { r: 6, c: 1, text: '★' },
      { r: 1, c: 8, text: '★' },
      { r: 8, c: 13, text: '★' },
      { r: 13, c: 6, text: '★' }
    ];

    let stars = '';
    starCoords.forEach(pos => {
      const cx = (pos.c + 0.5) * cs;
      const cy = (pos.r + 0.5) * cs;
      stars += `<text x="${cx}" y="${cy + 1.2}" font-size="4" fill="#64748B" font-weight="900" text-anchor="middle" dominant-baseline="middle" opacity="0.75">⭐</text>`;
    });

    return stars;
  }
}

window.ludoBoard = new LudoBoard();
