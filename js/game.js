class QuantumDriftGame {
  constructor() {
    this.dimensions = {};
    this.player = new Player();
    this.levelManager = new LevelManager();
    this.inputHandler = new InputHandler(this);

    this.gameState = "menu"; // menu, playing, paused, won, tutorial
    this.moves = 0;
    this.startTime = 0;
    this.lastFrameTime = 0;

    this.setupDimensions();
    this.setupUI();
    this.loadGameData();

    this.gameLoop();
  }

  setupDimensions() {
    const colors = [
      GAME_CONFIG.COLORS.DIMENSION_1,
      GAME_CONFIG.COLORS.DIMENSION_2,
      GAME_CONFIG.COLORS.DIMENSION_3,
      GAME_CONFIG.COLORS.DIMENSION_4,
    ];

    for (let i = 1; i <= 4; i++) {
      const canvas = document.getElementById(`dimension${i}`);
      this.dimensions[i] = new Dimension(i, colors[i - 1], canvas);
    }
  }

  setupUI() {
    // Botões do menu principal
    document
      .getElementById("playBtn")
      .addEventListener("click", () => this.startGame());
    document
      .getElementById("tutorialBtn")
      .addEventListener("click", () => this.showTutorial());
    document
      .getElementById("settingsBtn")
      .addEventListener("click", () => this.showSettings());

    // Botões do jogo
    document
      .getElementById("pauseBtn")
      .addEventListener("click", () => this.pauseGame());
    document
      .getElementById("powerButton")
      .addEventListener("click", () => this.activateQuantumPower());

    // Botões de pausa
    document
      .getElementById("resumeBtn")
      .addEventListener("click", () => this.resumeGame());
    document
      .getElementById("restartBtn")
      .addEventListener("click", () => this.restartLevel());
    document
      .getElementById("menuBtn")
      .addEventListener("click", () => this.goToMenu());

    // Botões de vitória
    document
      .getElementById("nextLevelBtn")
      .addEventListener("click", () => this.nextLevel());
    document
      .getElementById("replayBtn")
      .addEventListener("click", () => this.restartLevel());

    // Botões do tutorial
    document
      .getElementById("closeTutorialBtn")
      .addEventListener("click", () => this.closeTutorial());
  }

  startGame() {
    this.gameState = "playing";
    this.showScreen("gameScreen");
    this.loadLevel(this.levelManager.getCurrentLevel());
    this.startTime = Date.now();
    this.moves = 0;
    this.updateUI();
  }

  loadLevel(level) {
    // Resetar player
    this.player.reset();
    this.player.activeDimensions = [...level.activeDimensions];

    // Configurar dimensões
    Object.keys(this.dimensions).forEach((dimId) => {
      const dimension = this.dimensions[dimId];
      const dimData = level.dimensions[dimId];

      // Limpar dimensão
      dimension.obstacles = [];
      dimension.energyOrbs = [];
      dimension.portals = [];

      if (dimData) {
        // Carregar dados da dimensão
        dimension.obstacles = [...dimData.obstacles];
        dimension.energyOrbs = dimData.energyOrbs.map((orb) => ({
          ...orb,
          collected: false,
        }));
        dimension.portals = [...dimData.portals];

        if (level.activeDimensions.includes(parseInt(dimId))) {
          dimension.activate();
        } else {
          dimension.deactivate();
        }
      } else {
        dimension.deactivate();
      }
    });

    this.updateDimensionIndicators();
    this.updateUI();
  }

  movePlayer(direction) {
    if (this.gameState !== "playing") return;

    const moved = this.player.move(direction, this.dimensions);
    if (moved) {
      this.moves++;
      this.updateUI();
      this.checkWinCondition();
    }
  }

  activateQuantumPower() {
    if (this.gameState !== "playing") return;
    this.player.activateQuantumPower();
  }

  checkWinCondition() {
    let totalEnergy = 0;
    let collectedEnergy = 0;

    this.player.activeDimensions.forEach((dimId) => {
      const dimension = this.dimensions[dimId];
      totalEnergy += dimension.getTotalEnergyOrbs();
      collectedEnergy += dimension.getCollectedEnergyOrbs();
    });

    if (totalEnergy > 0 && collectedEnergy >= totalEnergy) {
      this.winLevel();
    }
  }

  winLevel() {
    this.gameState = "won";
    const playTime = Date.now() - this.startTime;
    const stars = this.calculateStars(this.moves, playTime);

    this.showWinScreen(stars);
    this.saveProgress();

    Utils.playSound(GAME_CONFIG.SOUNDS.WIN, 500);
    Utils.vibrate([200, 100, 200, 100, 200]);
  }

  calculateStars(moves, time) {
    const level = this.levelManager.getCurrentLevel();
    const baseStars = 1;

    // Critérios para estrelas adicionais
    const perfectMoves = this.getOptimalMoves(level);
    const timeBonus = time < 60000; // Menos de 1 minuto

    let stars = baseStars;
    if (moves <= perfectMoves * 1.2) stars++;
    if (timeBonus) stars++;

    return Math.min(stars, 3);
  }

  getOptimalMoves(level) {
    // Cálculo simplificado de movimentos ótimos
    let totalOrbs = 0;
    Object.values(level.dimensions).forEach((dim) => {
      if (dim.energyOrbs) totalOrbs += dim.energyOrbs.length;
    });
    return totalOrbs * 2; // Estimativa básica
  }

  showWinScreen(stars) {
    document.getElementById("finalMoves").textContent = this.moves;

    let totalEnergy = 0;
    this.player.activeDimensions.forEach((dimId) => {
      totalEnergy += this.dimensions[dimId].getCollectedEnergyOrbs();
    });
    document.getElementById("finalEnergy").textContent = totalEnergy;

    const starsContainer = document.getElementById("starsEarned");
    starsContainer.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const star = document.createElement("span");
      star.className = "star";
      star.textContent = i < stars ? "⭐" : "☆";
      starsContainer.appendChild(star);
    }

    this.showScreen("winScreen");
  }

  nextLevel() {
    const nextLevel = this.levelManager.nextLevel();
    if (nextLevel) {
      this.startGame();
    } else {
      // Jogo completo
      alert("Parabéns! Você completou todos os níveis!");
      this.goToMenu();
    }
  }

  restartLevel() {
    this.startGame();
  }

  pauseGame() {
    if (this.gameState === "playing") {
      this.gameState = "paused";
      this.showScreen("pauseScreen");
    }
  }

  resumeGame() {
    if (this.gameState === "paused") {
      this.gameState = "playing";
      this.showScreen("gameScreen");
    }
  }

  goToMenu() {
    this.gameState = "menu";
    this.showScreen("mainMenu");
  }

  showTutorial() {
    this.gameState = "tutorial";
    this.showScreen("tutorialScreen");
  }

  closeTutorial() {
    this.goToMenu();
  }

  showSettings() {
    // Implementar tela de configurações
    alert("Configurações em desenvolvimento!");
  }

  showScreen(screenId) {
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.remove("active");
    });
    document.getElementById(screenId).classList.add("active");
  }

  updateUI() {
    document.getElementById("currentLevel").textContent =
      this.levelManager.currentLevel;
    document.getElementById("moves").textContent = this.moves;

    let totalEnergy = 0;
    let collectedEnergy = 0;

    this.player.activeDimensions.forEach((dimId) => {
      const dimension = this.dimensions[dimId];
      totalEnergy += dimension.getTotalEnergyOrbs();
      collectedEnergy += dimension.getCollectedEnergyOrbs();
    });

    document.getElementById("energy").textContent = collectedEnergy;
    document.getElementById("totalEnergy").textContent = totalEnergy;
  }

  updateDimensionIndicators() {
    document.querySelectorAll(".dim-indicator").forEach((indicator, index) => {
      const dimId = index + 1;
      if (this.player.activeDimensions.includes(dimId)) {
        indicator.classList.add("active");
      } else {
        indicator.classList.remove("active");
      }
    });
  }

  saveProgress() {
    const gameData = {
      currentLevel: this.levelManager.currentLevel,
      unlockedLevels: this.levelManager.currentLevel,
      totalMoves: this.moves,
      playTime: Date.now() - this.startTime,
    };
    Utils.saveToLocalStorage("quantumDriftProgress", gameData);
  }

  loadGameData() {
    const gameData = Utils.loadFromLocalStorage("quantumDriftProgress");
    if (gameData) {
      this.levelManager.resetToLevel(gameData.currentLevel);
    }
  }

  gameLoop() {
    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    // Atualizar player
    this.player.update(deltaTime);

    // Renderizar dimensões ativas
    if (this.gameState === "playing") {
      this.player.activeDimensions.forEach((dimId) => {
        this.dimensions[dimId].render(this.player);
      });
    }

    requestAnimationFrame(() => this.gameLoop());
  }
}

// Inicializar o jogo quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  new QuantumDriftGame();
});

// Prevenir zoom no mobile
document.addEventListener("gesturestart", function (e) {
  e.preventDefault();
});

document.addEventListener("gesturechange", function (e) {
  e.preventDefault();
});

document.addEventListener("gestureend", function (e) {
  e.preventDefault();
});
