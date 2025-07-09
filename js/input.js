class InputHandler {
  constructor(game) {
    this.game = game;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.minSwipeDistance = 30;
    this.isDoubleTouch = false;
    this.lastTouchTime = 0;
    this.doubleTouchDelay = 300;

    this.setupEventListeners();
  }

  setupEventListeners() {
    // Touch events
    document.addEventListener("touchstart", this.handleTouchStart.bind(this), {
      passive: false,
    });
    document.addEventListener("touchmove", this.handleTouchMove.bind(this), {
      passive: false,
    });
    document.addEventListener("touchend", this.handleTouchEnd.bind(this), {
      passive: false,
    });

    // Keyboard events (para debug)
    document.addEventListener("keydown", this.handleKeyDown.bind(this));

    // Mouse events (para desktop)
    document.addEventListener("mousedown", this.handleMouseDown.bind(this));
    document.addEventListener("mousemove", this.handleMouseMove.bind(this));
    document.addEventListener("mouseup", this.handleMouseUp.bind(this));

    // Prevent context menu
    document.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;

    // Detectar double touch
    const currentTime = Date.now();
    if (currentTime - this.lastTouchTime < this.doubleTouchDelay) {
      this.isDoubleTouch = true;
      this.game.activateQuantumPower();
    }
    this.lastTouchTime = currentTime;
  }

  handleTouchMove(e) {
    e.preventDefault();
  }

  handleTouchEnd(e) {
    e.preventDefault();

    if (this.isDoubleTouch) {
      this.isDoubleTouch = false;
      return;
    }

    const touch = e.changedTouches[0];
    this.touchEndX = touch.clientX;
    this.touchEndY = touch.clientY;

    this.processSwipe();
  }

  handleMouseDown(e) {
    this.touchStartX = e.clientX;
    this.touchStartY = e.clientY;
  }

  handleMouseMove(e) {
    // Implementar se necessário
  }

  handleMouseUp(e) {
    this.touchEndX = e.clientX;
    this.touchEndY = e.clientY;
    this.processSwipe();
  }

  processSwipe() {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance < this.minSwipeDistance) {
      return;
    }

    const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
    let direction = null;

    if (angle >= -45 && angle <= 45) {
      direction = "right";
    } else if (angle >= 45 && angle <= 135) {
      direction = "down";
    } else if (angle >= -135 && angle <= -45) {
      direction = "up";
    } else {
      direction = "left";
    }

    if (direction) {
      this.game.movePlayer(direction);
    }
  }

  handleKeyDown(e) {
    switch (e.code) {
      case "ArrowUp":
      case "KeyW":
        this.game.movePlayer("up");
        break;
      case "ArrowDown":
      case "KeyS":
        this.game.movePlayer("down");
        break;
      case "ArrowLeft":
      case "KeyA":
        this.game.movePlayer("left");
        break;
      case "ArrowRight":
      case "KeyD":
        this.game.movePlayer("right");
        break;
      case "Space":
        this.game.activateQuantumPower();
        break;
    }
  }
}
