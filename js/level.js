class LevelManager {
  constructor() {
    this.currentLevel = 1;
    this.levels = this.generateLevels();
  }

  generateLevels() {
    const levels = [];

    // Nível 1 - Tutorial básico
    levels.push({
      id: 1,
      name: "Primeiros Passos",
      activeDimensions: [1, 2],
      dimensions: {
        1: {
          obstacles: [
            { x: 3, y: 3 },
            { x: 4, y: 3 },
            { x: 5, y: 3 },
          ],
          energyOrbs: [
            { x: 7, y: 2 },
            { x: 8, y: 7 },
          ],
          portals: [],
        },
        2: {
          obstacles: [
            { x: 2, y: 5 },
            { x: 3, y: 5 },
            { x: 4, y: 5 },
          ],
          energyOrbs: [
            { x: 6, y: 4 },
            { x: 2, y: 8 },
          ],
          portals: [],
        },
      },
    });

    // Nível 2 - Introdução aos portais
    levels.push({
      id: 2,
      name: "Portais Quânticos",
      activeDimensions: [1, 2],
      dimensions: {
        1: {
          obstacles: [
            { x: 4, y: 4 },
            { x: 5, y: 4 },
            { x: 6, y: 4 },
            { x: 4, y: 5 },
            { x: 6, y: 5 },
            { x: 4, y: 6 },
            { x: 5, y: 6 },
            { x: 6, y: 6 },
          ],
          energyOrbs: [
            { x: 5, y: 5 },
            { x: 8, y: 8 },
          ],
          portals: [{ x: 2, y: 2, targetDimension: 3 }],
        },
        2: {
          obstacles: [
            { x: 1, y: 7 },
            { x: 2, y: 7 },
            { x: 3, y: 7 },
            { x: 7, y: 1 },
            { x: 7, y: 2 },
            { x: 7, y: 3 },
          ],
          energyOrbs: [
            { x: 1, y: 1 },
            { x: 8, y: 1 },
          ],
          portals: [],
        },
        3: {
          obstacles: [
            { x: 6, y: 6 },
            { x: 7, y: 6 },
            { x: 8, y: 6 },
          ],
          energyOrbs: [
            { x: 3, y: 3 },
            { x: 6, y: 8 },
          ],
          portals: [],
        },
      },
    });

    // Nível 3 - Múltiplas dimensões
    levels.push({
      id: 3,
      name: "Realidade Múltipla",
      activeDimensions: [1, 2, 3],
      dimensions: {
        1: {
          obstacles: [
            { x: 3, y: 1 },
            { x: 3, y: 2 },
            { x: 3, y: 3 },
            { x: 6, y: 6 },
            { x: 6, y: 7 },
            { x: 6, y: 8 },
          ],
          energyOrbs: [
            { x: 8, y: 1 },
            { x: 1, y: 8 },
          ],
          portals: [{ x: 5, y: 5, targetDimension: 4 }],
        },
        2: {
          obstacles: [
            { x: 1, y: 4 },
            { x: 2, y: 4 },
            { x: 3, y: 4 },
            { x: 7, y: 2 },
            { x: 8, y: 2 },
            { x: 8, y: 3 },
          ],
          energyOrbs: [
            { x: 4, y: 1 },
            { x: 8, y: 8 },
          ],
          portals: [],
        },
        3: {
          obstacles: [
            { x: 2, y: 6 },
            { x: 3, y: 6 },
            { x: 4, y: 6 },
            { x: 5, y: 2 },
            { x: 6, y: 2 },
            { x: 7, y: 2 },
          ],
          energyOrbs: [
            { x: 1, y: 1 },
            { x: 7, y: 7 },
          ],
          portals: [],
        },
        4: {
          obstacles: [
            { x: 4, y: 4 },
            { x: 5, y: 4 },
            { x: 4, y: 5 },
            { x: 5, y: 5 },
          ],
          energyOrbs: [
            { x: 2, y: 2 },
            { x: 7, y: 7 },
          ],
          portals: [],
        },
      },
    });

    // Gerar mais níveis proceduralmente
    for (let i = 4; i <= 20; i++) {
      levels.push(this.generateProceduralLevel(i));
    }

    return levels;
  }

  generateProceduralLevel(levelNumber) {
    const difficulty = Math.min(levelNumber / 5, 4);
    const activeDimensions = [];

    // Determinar dimensões ativas baseado no nível
    if (levelNumber <= 5) {
      activeDimensions.push(1, 2);
    } else if (levelNumber <= 10) {
      activeDimensions.push(1, 2, 3);
    } else {
      activeDimensions.push(1, 2, 3, 4);
    }

    const level = {
      id: levelNumber,
      name: `Nível ${levelNumber}`,
      activeDimensions,
      dimensions: {},
    };

    activeDimensions.forEach((dimId) => {
      level.dimensions[dimId] = this.generateDimensionLayout(
        difficulty,
        levelNumber
      );
    });

    return level;
  }

  generateDimensionLayout(difficulty, levelNumber) {
    const layout = {
      obstacles: [],
      energyOrbs: [],
      portals: [],
    };

    // Gerar obstáculos
    const obstacleCount = Math.floor(
      difficulty * 3 + Utils.randomBetween(2, 6)
    );
    for (let i = 0; i < obstacleCount; i++) {
      let x, y;
      do {
        x = Math.floor(Utils.randomBetween(0, GAME_CONFIG.GRID_SIZE));
        y = Math.floor(Utils.randomBetween(0, GAME_CONFIG.GRID_SIZE));
      } while ((x <= 1 && y <= 1) || this.isPositionOccupied(layout, x, y));

      layout.obstacles.push({ x, y });
    }

    // Gerar orbs de energia
    const energyCount = Math.floor(difficulty + Utils.randomBetween(2, 4));
    for (let i = 0; i < energyCount; i++) {
      let x, y;
      do {
        x = Math.floor(Utils.randomBetween(0, GAME_CONFIG.GRID_SIZE));
        y = Math.floor(Utils.randomBetween(0, GAME_CONFIG.GRID_SIZE));
      } while ((x <= 1 && y <= 1) || this.isPositionOccupied(layout, x, y));

      layout.energyOrbs.push({ x, y });
    }

    // Gerar portais (ocasionalmente)
    if (levelNumber > 3 && Math.random() < 0.3) {
      let x, y;
      do {
        x = Math.floor(Utils.randomBetween(0, GAME_CONFIG.GRID_SIZE));
        y = Math.floor(Utils.randomBetween(0, GAME_CONFIG.GRID_SIZE));
      } while ((x <= 1 && y <= 1) || this.isPositionOccupied(layout, x, y));

      layout.portals.push({ x, y, targetDimension: null });
    }

    return layout;
  }

  isPositionOccupied(layout, x, y) {
    return (
      layout.obstacles.some((obs) => obs.x === x && obs.y === y) ||
      layout.energyOrbs.some((orb) => orb.x === x && orb.y === y) ||
      layout.portals.some((portal) => portal.x === x && portal.y === y)
    );
  }

  getCurrentLevel() {
    return this.levels[this.currentLevel - 1];
  }

  nextLevel() {
    if (this.currentLevel < this.levels.length) {
      this.currentLevel++;
      return this.getCurrentLevel();
    }
    return null;
  }

  resetToLevel(levelNumber) {
    this.currentLevel = Math.max(1, Math.min(levelNumber, this.levels.length));
    return this.getCurrentLevel();
  }

  getLevelProgress() {
    return {
      current: this.currentLevel,
      total: this.levels.length,
      percentage: (this.currentLevel / this.levels.length) * 100,
    };
  }
}
