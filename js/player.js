class Player {
  constructor() {
    this.positions = {
      1: { x: 1, y: 1 },
      2: { x: 1, y: 1 },
      3: { x: 1, y: 1 },
      4: { x: 1, y: 1 },
    };
    this.activeDimensions = [1, 2];
    this.quantumPowerActive = false;
    this.quantumPowerCooldown = 0;
    this.maxQuantumPowerCooldown = 5000; // 5 segundos
  }

  move(direction, dimensions) {
    const moves = {
      up: { x: 0, y: -1 },
      down: { x: 0, y: 1 },
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
    };

    const delta = moves[direction];
    if (!delta) return false;

    let canMove = true;
    const newPositions = {};

    // Verificar se o movimento é possível em todas as dimensões ativas
    this.activeDimensions.forEach((dimId) => {
      const currentPos = this.positions[dimId];
      const newPos = {
        x: Utils.clamp(currentPos.x + delta.x, 0, GAME_CONFIG.GRID_SIZE - 1),
        y: Utils.clamp(currentPos.y + delta.y, 0, GAME_CONFIG.GRID_SIZE - 1),
      };

      const dimension = dimensions[dimId];
      if (dimension && dimension.isObstacle(newPos.x, newPos.y)) {
        canMove = false;
      }

      newPositions[dimId] = newPos;
    });

    if (canMove) {
      // Atualizar posições
      this.activeDimensions.forEach((dimId) => {
        this.positions[dimId] = newPositions[dimId];
      });

      // Verificar coleta de energia
      this.activeDimensions.forEach((dimId) => {
        const dimension = dimensions[dimId];
        const pos = this.positions[dimId];
        if (dimension) {
          dimension.collectEnergyOrb(pos.x, pos.y);
        }
      });

      // Verificar portais
      this.checkPortals(dimensions);

      Utils.playSound(GAME_CONFIG.SOUNDS.MOVE, 50);
      return true;
    } else {
      Utils.playSound(GAME_CONFIG.SOUNDS.ERROR, 100);
      Utils.vibrate([100, 50, 100]);
      return false;
    }
  }

  checkPortals(dimensions) {
    this.activeDimensions.forEach((dimId) => {
      const dimension = dimensions[dimId];
      const pos = this.positions[dimId];

      if (dimension) {
        const portal = dimension.getPortalAt(pos.x, pos.y);
        if (portal) {
          this.usePortal(portal, dimensions);
        }
      }
    });
  }

  usePortal(portal, dimensions) {
    if (portal.targetDimension) {
      // Portal para dimensão específica
      if (!this.activeDimensions.includes(portal.targetDimension)) {
        this.activateDimension(portal.targetDimension);
      }
    } else {
      // Portal quântico - ativa próxima dimensão disponível
      const nextDim = this.getNextAvailableDimension();
      if (nextDim) {
        this.activateDimension(nextDim);
      }
    }

    Utils.playSound(880, 200);
    Utils.vibrate([200]);
  }

  activateDimension(dimId) {
    if (!this.activeDimensions.includes(dimId) && dimId <= 4) {
      this.activeDimensions.push(dimId);

      // Copiar posição da primeira dimensão ativa
      if (this.activeDimensions.length > 1) {
        this.positions[dimId] = { ...this.positions[this.activeDimensions[0]] };
      }
    }
  }

  deactivateDimension(dimId) {
    if (this.activeDimensions.length > 1) {
      const index = this.activeDimensions.indexOf(dimId);
      if (index > -1) {
        this.activeDimensions.splice(index, 1);
      }
    }
  }

  getNextAvailableDimension() {
    for (let i = 1; i <= 4; i++) {
      if (!this.activeDimensions.includes(i)) {
        return i;
      }
    }
    return null;
  }

  activateQuantumPower() {
    if (this.quantumPowerCooldown <= 0) {
      this.quantumPowerActive = true;
      this.quantumPowerCooldown = this.maxQuantumPowerCooldown;

      // Efeito do poder quântico - por exemplo, permitir atravessar obstáculos
      setTimeout(() => {
        this.quantumPowerActive = false;
      }, 2000);

      Utils.playSound(1320, 300);
      Utils.vibrate([100, 100, 100]);
    }
  }

  update(deltaTime) {
    if (this.quantumPowerCooldown > 0) {
      this.quantumPowerCooldown -= deltaTime;
    }
  }

  reset() {
    this.positions = {
      1: { x: 1, y: 1 },
      2: { x: 1, y: 1 },
      3: { x: 1, y: 1 },
      4: { x: 1, y: 1 },
    };
    this.activeDimensions = [1, 2];
    this.quantumPowerActive = false;
    this.quantumPowerCooldown = 0;
  }
}
