class InteractiveTutorial {
  constructor(game) {
    this.game = game;
    this.currentStep = 1;
    this.totalSteps = 5;
    this.isActive = false;
    this.setupEventListeners();
  }

  setupEventListeners() {
    document
      .getElementById("nextTutorialBtn")
      .addEventListener("click", () => this.nextStep());
    document
      .getElementById("prevTutorialBtn")
      .addEventListener("click", () => this.prevStep());
    document
      .getElementById("skipTutorialBtn")
      .addEventListener("click", () => this.skip());
  }

  start() {
    this.isActive = true;
    this.currentStep = 1;
    this.game.showScreen("interactiveTutorialScreen");
    this.updateStep();
    this.startStepDemo();
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
      this.updateStep();
      this.startStepDemo();
    } else {
      this.complete();
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateStep();
      this.startStepDemo();
    }
  }

  updateStep() {
    // Atualizar indicador de progresso
    document.getElementById("tutorialStep").textContent = this.currentStep;
    document.getElementById("totalTutorialSteps").textContent = this.totalSteps;

    // Mostrar/ocultar passos
    document.querySelectorAll(".tutorial-step").forEach((step, index) => {
      step.classList.toggle("active", index + 1 === this.currentStep);
    });

    // Atualizar botões
    document.getElementById("prevTutorialBtn").disabled =
      this.currentStep === 1;
    document.getElementById("nextTutorialBtn").textContent =
      this.currentStep === this.totalSteps ? "FINALIZAR" : "PRÓXIMO";
  }

  startStepDemo() {
    const canvas = document.getElementById(`tutorialCanvas${this.currentStep}`);
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (this.currentStep) {
      case 1:
        this.demoMovement(ctx, canvas);
        break;
      case 2:
        this.demoMultipleDimensions(ctx, canvas);
        break;
      case 3:
        this.demoEnergyCollection(ctx, canvas);
        break;
      case 4:
        this.demoObstacles(ctx, canvas);
        break;
      case 5:
        this.demoPortals(ctx, canvas);
        break;
    }
  }

  demoMovement(ctx, canvas) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const time = Date.now() * 0.002;

    // Grid simples
    ctx.strokeStyle = "#00d4ff30";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const pos = i * 30;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(canvas.width, pos);
      ctx.stroke();
    }

    // Partícula em movimento
    const x = centerX + Math.sin(time) * 30;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(x, centerY, 8, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(() => {
      if (this.currentStep === 1 && this.isActive) {
        this.demoMovement(ctx, canvas);
      }
    });
  }

  demoMultipleDimensions(ctx, canvas) {
    const time = Date.now() * 0.003;

    // Dimensão 1
    ctx.fillStyle = "#00d4ff80";
    ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Partícula dimensão 1
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(50 + Math.sin(time) * 20, 50, 6, 0, Math.PI * 2);
    ctx.fill();

    // Dimensão 2 (sobreposta)
    ctx.fillStyle = "#ff00ff40";
    ctx.fillRect(15, 15, canvas.width - 30, canvas.height - 30);

    // Partícula dimensão 2
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(55 + Math.sin(time) * 20, 55, 6, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(() => {
      if (this.currentStep === 2 && this.isActive) {
        this.demoMultipleDimensions(ctx, canvas);
      }
    });
  }

  demoEnergyCollection(ctx, canvas) {
    const time = Date.now() * 0.003;

    // Fundo
    ctx.fillStyle = "#00d4ff20";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Orbs de energia
    const orbPositions = [
      { x: 40, y: 40 },
      { x: 110, y: 40 },
      { x: 75, y: 110 },
    ];

    orbPositions.forEach((orb, index) => {
      const pulse = Math.sin(time + index) * 0.3 + 1;
      ctx.fillStyle = "#ffd700";
      ctx.shadowColor = "#ffd700";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, 8 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Partícula do jogador
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(75, 75, 8, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(() => {
      if (this.currentStep === 3 && this.isActive) {
        this.demoEnergyCollection(ctx, canvas);
      }
    });
  }

  demoObstacles(ctx, canvas) {
    // Fundo
    ctx.fillStyle = "#00d4ff20";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Obstáculos
    const obstacles = [
      { x: 60, y: 30 },
      { x: 90, y: 30 },
      { x: 60, y: 60 },
      { x: 90, y: 60 },
    ];

    obstacles.forEach((obstacle) => {
      ctx.fillStyle = "#ff4757";
      ctx.shadowColor = "#ff4757";
      ctx.shadowBlur = 5;
      ctx.fillRect(obstacle.x - 10, obstacle.y - 10, 20, 20);
      ctx.shadowBlur = 0;
    });

    // Partícula do jogador
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(30, 75, 8, 0, Math.PI * 2);
    ctx.fill();

    // Caminho seguro (linha pontilhada)
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#00ff88";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(30, 75);
    ctx.lineTo(30, 120);
    ctx.lineTo(120, 120);
    ctx.lineTo(120, 30);
    ctx.stroke();
    ctx.setLineDash([]);

    requestAnimationFrame(() => {
      if (this.currentStep === 4 && this.isActive) {
        this.demoObstacles(ctx, canvas);
      }
    });
  }

  demoPortals(ctx, canvas) {
    const time = Date.now() * 0.005;

    // Fundo
    ctx.fillStyle = "#00d4ff20";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Portal
    ctx.save();
    ctx.translate(75, 75);
    ctx.rotate(time);
    ctx.strokeStyle = "#9c88ff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.stroke();

    // Efeito interno do portal
    ctx.fillStyle = "#9c88ff30";
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Partícula do jogador
    const playerX = 40 + Math.sin(time * 0.5) * 10;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(playerX, 40, 6, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(() => {
      if (this.currentStep === 5 && this.isActive) {
        this.demoPortals(ctx, canvas);
      }
    });
  }

  complete() {
    this.isActive = false;
    Utils.saveToLocalStorage("tutorialCompleted", true);
    this.game.goToMenu();
  }

  skip() {
    this.complete();
  }
}
