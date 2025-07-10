class LevelManager {
  constructor() {
    this.currentLevel = 1;
    this.levels = this.generateLevels();
    this.infiniteLevels = true; // Ativar níveis infinitos após os fixos
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

    // Nível 2 - CORRIGIDO - Introdução aos portais
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
            { x: 2, y: 2 }, // CORRIGIDO: Movido para posição acessível
            { x: 8, y: 8 },
          ],
          portals: [{ x: 7, y: 3, targetDimension: 3 }], // CORRIGIDO: Portal em posição acessível
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

    return levels;
  }

  getCurrentLevel() {
    if (this.currentLevel <= this.levels.length) {
      return this.levels[this.currentLevel - 1];
    } else {
      // Gerar nível procedural infinito
      return this.generateInfiniteLevel(this.currentLevel);
    }
  }

  nextLevel() {
    this.currentLevel++;
    return this.getCurrentLevel();
  }

  resetToLevel(levelNumber) {
    this.currentLevel = Math.max(1, levelNumber);
    return this.getCurrentLevel();
  }

  // NOVO SISTEMA DE NÍVEIS INFINITOS
  generateInfiniteLevel(levelNumber) {
    const difficulty = this.calculateDifficulty(levelNumber);
    const activeDimensions = this.getDimensionsForLevel(levelNumber);

    const level = {
      id: levelNumber,
      name: `Nível ${levelNumber}`,
      activeDimensions,
      dimensions: {},
    };

    activeDimensions.forEach((dimId) => {
      level.dimensions[dimId] = this.generateSmartDimensionLayout(
        difficulty,
        levelNumber,
        dimId
      );
    });

    // Validar se o nível é solucionável
    if (!this.validateLevel(level)) {
      console.warn(`Nível ${levelNumber} regenerado por ser insolucionável`);
      return this.generateInfiniteLevel(levelNumber);
    }

    return level;
  }

  calculateDifficulty(levelNumber) {
    // Dificuldade progressiva mais suave
    const baseDifficulty = Math.min((levelNumber - 3) / 10, 1);
    const cycleDifficulty = 0.3 + baseDifficulty * 0.7;

    return {
      obstacleRatio: 0.15 + cycleDifficulty * 0.25, // 15% a 40% de obstáculos
      energyCount: Math.max(
        2,
        Math.min(6, 2 + Math.floor(cycleDifficulty * 4))
      ),
      portalChance: levelNumber > 5 ? 0.3 + cycleDifficulty * 0.4 : 0,
      complexity: cycleDifficulty,
    };
  }

  getDimensionsForLevel(levelNumber) {
    if (levelNumber <= 5) {
      return [1, 2];
    } else if (levelNumber <= 15) {
      return [1, 2, 3];
    } else {
      return [1, 2, 3, 4];
    }
  }

  generateSmartDimensionLayout(difficulty, levelNumber, dimensionId) {
    const layout = {
      obstacles: [],
      energyOrbs: [],
      portals: [],
    };

    // Usar seed baseado no nível para consistência
    const seed = levelNumber * 1000 + dimensionId;
    const rng = this.createSeededRNG(seed);

    // Gerar obstáculos com padrões inteligentes
    this.generateSmartObstacles(layout, difficulty, rng);

    // Gerar orbs de energia em posições acessíveis
    this.generateAccessibleEnergyOrbs(layout, difficulty, rng);

    // Gerar portais ocasionalmente
    if (levelNumber > 5 && rng() < difficulty.portalChance) {
      this.generatePortal(layout, rng);
    }

    return layout;
  }

  createSeededRNG(seed) {
    let currentSeed = seed;
    return function () {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };
  }

  generateSmartObstacles(layout, difficulty, rng) {
    const totalCells = GAME_CONFIG.GRID_SIZE * GAME_CONFIG.GRID_SIZE;
    const maxObstacles = Math.floor(totalCells * difficulty.obstacleRatio);

    // Padrões de obstáculos
    const patterns = [
      this.generateLinePattern,
      this.generateLShapePattern,
      this.generateClusterPattern,
      this.generateMazePattern,
    ];

    let obstaclesPlaced = 0;
    const maxAttempts = 50;
    let attempts = 0;

    while (obstaclesPlaced < maxObstacles && attempts < maxAttempts) {
      const pattern = patterns[Math.floor(rng() * patterns.length)];
      const newObstacles = pattern.call(this, rng, layout);

      // Verificar se não bloqueia áreas essenciais
      if (this.isPatternValid(layout, newObstacles)) {
        newObstacles.forEach((obs) => {
          if (obstaclesPlaced < maxObstacles) {
            layout.obstacles.push(obs);
            obstaclesPlaced++;
          }
        });
      }
      attempts++;
    }
  }

  generateLinePattern(rng, layout) {
    const obstacles = [];
    const isHorizontal = rng() > 0.5;
    const length = 2 + Math.floor(rng() * 4); // 2-5 blocos

    if (isHorizontal) {
      const y = 2 + Math.floor(rng() * (GAME_CONFIG.GRID_SIZE - 4));
      const startX =
        2 + Math.floor(rng() * (GAME_CONFIG.GRID_SIZE - length - 2));

      for (let i = 0; i < length; i++) {
        const x = startX + i;
        if (!this.isPositionOccupied(layout, x, y)) {
          obstacles.push({ x, y });
        }
      }
    } else {
      const x = 2 + Math.floor(rng() * (GAME_CONFIG.GRID_SIZE - 4));
      const startY =
        2 + Math.floor(rng() * (GAME_CONFIG.GRID_SIZE - length - 2));

      for (let i = 0; i < length; i++) {
        const y = startY + i;
        if (!this.isPositionOccupied(layout, x, y)) {
          obstacles.push({ x, y });
        }
      }
    }

    return obstacles;
  }

  generateLShapePattern(rng, layout) {
    const obstacles = [];
    const size = 2 + Math.floor(rng() * 3); // 2-4 blocos por lado
    const x = 2 + Math.floor(rng() * (GAME_CONFIG.GRID_SIZE - size - 2));
    const y = 2 + Math.floor(rng() * (GAME_CONFIG.GRID_SIZE - size - 2));

    // Braço horizontal
    for (let i = 0; i < size; i++) {
      if (!this.isPositionOccupied(layout, x + i, y)) {
        obstacles.push({ x: x + i, y });
      }
    }

    // Braço vertical
    for (let i = 1; i < size; i++) {
      if (!this.isPositionOccupied(layout, x, y + i)) {
        obstacles.push({ x, y: y + i });
      }
    }

    return obstacles;
  }

  generateClusterPattern(rng, layout) {
    const obstacles = [];
    const centerX = 2 + Math.floor(rng() * (GAME_CONFIG.GRID_SIZE - 4));
    const centerY = 2 + Math.floor(rng() * (GAME_CONFIG.GRID_SIZE - 4));
    const clusterSize = 2 + Math.floor(rng() * 3);

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (rng() > 0.4) {
          // 60% chance para cada célula
          const x = centerX + dx;
          const y = centerY + dy;

          if (
            x >= 0 &&
            x < GAME_CONFIG.GRID_SIZE &&
            y >= 0 &&
            y < GAME_CONFIG.GRID_SIZE &&
            !this.isPositionOccupied(layout, x, y)
          ) {
            obstacles.push({ x, y });
          }
        }
      }
    }

    return obstacles;
  }

  generateMazePattern(rng, layout) {
    const obstacles = [];
    const spacing = 3;

    for (let x = 3; x < GAME_CONFIG.GRID_SIZE - 1; x += spacing) {
      for (let y = 3; y < GAME_CONFIG.GRID_SIZE - 1; y += spacing) {
        if (rng() > 0.5 && !this.isPositionOccupied(layout, x, y)) {
          obstacles.push({ x, y });

          // Adicionar extensão aleatória
          const direction = Math.floor(rng() * 4);
          const extensions = [
            { x: x + 1, y },
            { x: x - 1, y },
            { x, y: y + 1 },
            { x, y: y - 1 },
          ];

          const ext = extensions[direction];
          if (
            ext.x >= 0 &&
            ext.x < GAME_CONFIG.GRID_SIZE &&
            ext.y >= 0 &&
            ext.y < GAME_CONFIG.GRID_SIZE &&
            !this.isPositionOccupied(layout, ext.x, ext.y)
          ) {
            obstacles.push(ext);
          }
        }
      }
    }

    return obstacles;
  }

  isPatternValid(layout, newObstacles) {
    // Verificar se não bloqueia a posição inicial
    const hasStartBlocked = newObstacles.some(
      (obs) => obs.x <= 1 && obs.y <= 1
    );

    if (hasStartBlocked) return false;

    // Verificar se não cria áreas completamente isoladas
    const tempLayout = {
      obstacles: [...layout.obstacles, ...newObstacles],
      energyOrbs: layout.energyOrbs,
      portals: layout.portals,
    };

    return this.hasAccessibleAreas(tempLayout);
  }

  hasAccessibleAreas(layout) {
    const visited = new Set();
    const queue = [{ x: 1, y: 1 }]; // Começar da posição inicial
    let accessibleCells = 0;

    while (queue.length > 0) {
      const { x, y } = queue.shift();
      const key = `${x},${y}`;

      if (visited.has(key)) continue;
      visited.add(key);
      accessibleCells++;

      // Verificar células adjacentes
      const neighbors = [
        { x: x + 1, y },
        { x: x - 1, y },
        { x, y: y + 1 },
        { x, y: y - 1 },
      ];

      neighbors.forEach((neighbor) => {
        if (
          neighbor.x >= 0 &&
          neighbor.x < GAME_CONFIG.GRID_SIZE &&
          neighbor.y >= 0 &&
          neighbor.y < GAME_CONFIG.GRID_SIZE &&
          !this.isPositionOccupied(layout, neighbor.x, neighbor.y) &&
          !visited.has(`${neighbor.x},${neighbor.y}`)
        ) {
          queue.push(neighbor);
        }
      });
    }

    // Deve ter pelo menos 30% das células acessíveis
    const totalCells = GAME_CONFIG.GRID_SIZE * GAME_CONFIG.GRID_SIZE;
    return accessibleCells >= totalCells * 0.3;
  }

  generateAccessibleEnergyOrbs(layout, difficulty, rng) {
    const energyCount = difficulty.energyCount;
    const accessiblePositions = this.findAccessiblePositions(layout);

    // Filtrar posições que não estão muito próximas da posição inicial
    const filteredPositions = accessiblePositions.filter((pos) => {
      const distance = Math.abs(pos.x - 1) + Math.abs(pos.y - 1);
      return distance >= 3; // Pelo menos 3 células de distância
    });

    // Selecionar posições aleatórias
    for (let i = 0; i < energyCount && filteredPositions.length > 0; i++) {
      const randomIndex = Math.floor(rng() * filteredPositions.length);
      const position = filteredPositions.splice(randomIndex, 1)[0];
      layout.energyOrbs.push(position);
    }
  }

  findAccessiblePositions(layout) {
    const accessible = [];
    const visited = new Set();
    const queue = [{ x: 1, y: 1 }];

    while (queue.length > 0) {
      const { x, y } = queue.shift();
      const key = `${x},${y}`;

      if (visited.has(key)) continue;
      visited.add(key);

      // Adicionar à lista de posições acessíveis (exceto posição inicial)
      if (!(x === 1 && y === 1)) {
        accessible.push({ x, y });
      }

      // Verificar células adjacentes
      const neighbors = [
        { x: x + 1, y },
        { x: x - 1, y },
        { x, y: y + 1 },
        { x, y: y - 1 },
      ];

      neighbors.forEach((neighbor) => {
        if (
          neighbor.x >= 0 &&
          neighbor.x < GAME_CONFIG.GRID_SIZE &&
          neighbor.y >= 0 &&
          neighbor.y < GAME_CONFIG.GRID_SIZE &&
          !this.isPositionOccupied(layout, neighbor.x, neighbor.y) &&
          !visited.has(`${neighbor.x},${neighbor.y}`)
        ) {
          queue.push(neighbor);
        }
      });
    }

    return accessible;
  }

  generatePortal(layout, rng) {
    const accessiblePositions = this.findAccessiblePositions(layout);

    if (accessiblePositions.length > 0) {
      const randomIndex = Math.floor(rng() * accessiblePositions.length);
      const position = accessiblePositions[randomIndex];
      layout.portals.push({
        x: position.x,
        y: position.y,
        targetDimension: null,
      });
    }
  }

  validateLevel(level) {
    // Verificar se todos os orbs são acessíveis em todas as dimensões
    for (const dimId of level.activeDimensions) {
      const dimension = level.dimensions[dimId];
      if (!dimension) continue;

      for (const orb of dimension.energyOrbs) {
        if (!this.isPositionAccessible(dimension, orb.x, orb.y)) {
          return false;
        }
      }
    }
    return true;
  }

  isPositionAccessible(dimension, targetX, targetY) {
    const visited = new Set();
    const queue = [{ x: 1, y: 1 }];

    while (queue.length > 0) {
      const { x, y } = queue.shift();
      const key = `${x},${y}`;

      if (visited.has(key)) continue;
      visited.add(key);

      if (x === targetX && y === targetY) {
        return true;
      }

      const neighbors = [
        { x: x + 1, y },
        { x: x - 1, y },
        { x, y: y + 1 },
        { x, y: y - 1 },
      ];

      neighbors.forEach((neighbor) => {
        if (
          neighbor.x >= 0 &&
          neighbor.x < GAME_CONFIG.GRID_SIZE &&
          neighbor.y >= 0 &&
          neighbor.y < GAME_CONFIG.GRID_SIZE &&
          !this.isPositionOccupied(dimension, neighbor.x, neighbor.y) &&
          !visited.has(`${neighbor.x},${neighbor.y}`)
        ) {
          queue.push(neighbor);
        }
      });
    }

    return false;
  }

  isPositionOccupied(layout, x, y) {
    return (
      layout.obstacles.some((obs) => obs.x === x && obs.y === y) ||
      layout.energyOrbs.some((orb) => orb.x === x && orb.y === y) ||
      layout.portals.some((portal) => portal.x === x && portal.y === y)
    );
  }

  getLevelProgress() {
    return {
      current: this.currentLevel,
      total: this.infiniteLevels ? "∞" : this.levels.length,
      percentage: this.infiniteLevels
        ? Math.min((this.currentLevel / 50) * 100, 100)
        : (this.currentLevel / this.levels.length) * 100,
    };
  }
}
