class Dimension {
  constructor(id, color, canvas) {
    this.id = id;
    this.color = color;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = GAME_CONFIG.CANVAS_SIZE;
    this.height = GAME_CONFIG.CANVAS_SIZE;
    this.gridSize = GAME_CONFIG.GRID_SIZE;
    this.cellSize = GAME_CONFIG.CELL_SIZE;

    this.obstacles = [];
    this.energyOrbs = [];
    this.portals = [];
    this.isActive = false;

    this.setupCanvas();
  }

  setupCanvas() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.canvas.style.width = this.width + "px";
    this.canvas.style.height = this.height + "px";
  }

  activate() {
    this.isActive = true;
    this.canvas.style.opacity = "1";
  }

  deactivate() {
    this.isActive = false;
    this.canvas.style.opacity = "0.3";
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawGrid() {
    this.ctx.strokeStyle = `${this.color}20`;
    this.ctx.lineWidth = 1;

    for (let i = 0; i <= this.gridSize; i++) {
      const pos = i * this.cellSize;

      this.ctx.beginPath();
      this.ctx.moveTo(pos, 0);
      this.ctx.lineTo(pos, this.height);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.moveTo(0, pos);
      this.ctx.lineTo(this.width, pos);
      this.ctx.stroke();
    }
  }

  drawObstacles() {
    this.obstacles.forEach((obstacle) => {
      const x = obstacle.x * this.cellSize + 2;
      const y = obstacle.y * this.cellSize + 2;
      const size = this.cellSize - 4;

      this.ctx.fillStyle = GAME_CONFIG.COLORS.OBSTACLE;
      this.ctx.fillRect(x, y, size, size);

      // Efeito de brilho
      this.ctx.shadowColor = GAME_CONFIG.COLORS.OBSTACLE;
      this.ctx.shadowBlur = 10;
      this.ctx.fillRect(x, y, size, size);
      this.ctx.shadowBlur = 0;
    });
  }

  drawEnergyOrbs() {
    this.energyOrbs.forEach((orb, index) => {
      if (!orb.collected) {
        const x = orb.x * this.cellSize + this.cellSize / 2;
        const y = orb.y * this.cellSize + this.cellSize / 2;
        const radius = this.cellSize / 3;

        // Animação de pulsação
        const pulse = Math.sin(Date.now() * 0.005 + index) * 0.2 + 1;
        const currentRadius = radius * pulse;

        this.ctx.fillStyle = GAME_CONFIG.COLORS.ENERGY;
        this.ctx.beginPath();
        this.ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // Efeito de brilho
        this.ctx.shadowColor = GAME_CONFIG.COLORS.ENERGY;
        this.ctx.shadowBlur = 15;
        this.ctx.beginPath();
        this.ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      }
    });
  }

  drawPortals() {
    this.portals.forEach((portal, index) => {
      const x = portal.x * this.cellSize + this.cellSize / 2;
      const y = portal.y * this.cellSize + this.cellSize / 2;
      const radius = this.cellSize / 2;

      // Animação de rotação
      const rotation = Date.now() * 0.003 + index;

      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(rotation);

      // Desenhar portal
      this.ctx.strokeStyle = GAME_CONFIG.COLORS.PORTAL;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
      this.ctx.stroke();

      // Efeito interno
      this.ctx.fillStyle = `${GAME_CONFIG.COLORS.PORTAL}30`;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, radius - 5, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.restore();
    });
  }

  drawPlayer(player) {
    if (!this.isActive || !player.positions[this.id]) return;

    const pos = player.positions[this.id];
    const x = pos.x * this.cellSize + this.cellSize / 2;
    const y = pos.y * this.cellSize + this.cellSize / 2;
    const radius = this.cellSize / 3;

    // Efeito de trilha
    this.ctx.fillStyle = `${this.color}40`;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius + 5, 0, Math.PI * 2);
    this.ctx.fill();

    // Partícula principal
    this.ctx.fillStyle = GAME_CONFIG.COLORS.PLAYER;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Borda colorida da dimensão
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.stroke();

    // Efeito de brilho
    this.ctx.shadowColor = this.color;
    this.ctx.shadowBlur = 10;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.shadowBlur = 0;
  }

  render(player) {
    this.clear();
    this.drawGrid();
    this.drawObstacles();
    this.drawEnergyOrbs();
    this.drawPortals();
    this.drawPlayer(player);
  }

  addObstacle(x, y) {
    this.obstacles.push({ x, y });
  }

  addEnergyOrb(x, y) {
    this.energyOrbs.push({ x, y, collected: false });
  }

  addPortal(x, y, targetDimension = null) {
    this.portals.push({ x, y, targetDimension });
  }

  isObstacle(x, y) {
    return this.obstacles.some(
      (obstacle) => obstacle.x === x && obstacle.y === y
    );
  }

  collectEnergyOrb(x, y) {
    const orb = this.energyOrbs.find(
      (orb) => orb.x === x && orb.y === y && !orb.collected
    );
    if (orb) {
      orb.collected = true;
      Utils.playSound(GAME_CONFIG.SOUNDS.COLLECT);
      Utils.vibrate([50]);
      return true;
    }
    return false;
  }

  getPortalAt(x, y) {
    return this.portals.find((portal) => portal.x === x && portal.y === y);
  }

  getTotalEnergyOrbs() {
    return this.energyOrbs.length;
  }

  getCollectedEnergyOrbs() {
    return this.energyOrbs.filter((orb) => orb.collected).length;
  }
}
