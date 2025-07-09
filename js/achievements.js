class AchievementSystem {
  constructor(game) {
    this.game = game;
    this.achievements = this.initializeAchievements();
    this.unlockedAchievements = Utils.loadFromLocalStorage(
      "unlockedAchievements",
      []
    );
    this.stats = Utils.loadFromLocalStorage(
      "gameStats",
      this.getDefaultStats()
    );
  }

  initializeAchievements() {
    return [
      {
        id: "first_steps",
        title: "Primeiros Passos",
        description: "Complete seu primeiro nível",
        icon: "👶",
        condition: (stats) => stats.levelsCompleted >= 1,
      },
      {
        id: "dimension_walker",
        title: "Caminhante Dimensional",
        description: "Ative 3 dimensões simultaneamente",
        icon: "🌀",
        condition: (stats) => stats.maxDimensionsActive >= 3,
      },
      {
        id: "energy_collector",
        title: "Coletor de Energia",
        description: "Colete 100 orbs de energia",
        icon: "⚡",
        condition: (stats) => stats.totalEnergyCollected >= 100,
      },
      {
        id: "speed_runner",
        title: "Velocista",
        description: "Complete um nível em menos de 30 segundos",
        icon: "🏃",
        condition: (stats) => stats.fastestLevel <= 30000,
      },
      {
        id: "perfectionist",
        title: "Perfeccionista",
        description: "Complete 5 níveis com 3 estrelas",
        icon: "⭐",
        condition: (stats) => stats.perfectLevels >= 5,
      },
      {
        id: "quantum_master",
        title: "Mestre Quântico",
        description: "Use o poder quântico 50 vezes",
        icon: "🔮",
        condition: (stats) => stats.quantumPowersUsed >= 50,
      },
      {
        id: "portal_jumper",
        title: "Saltador de Portais",
        description: "Use 25 portais",
        icon: "🌀",
        condition: (stats) => stats.portalsUsed >= 25,
      },
      {
        id: "persistent",
        title: "Persistente",
        description: "Complete 10 níveis",
        icon: "💪",
        condition: (stats) => stats.levelsCompleted >= 10,
      },
      {
        id: "dimension_master",
        title: "Mestre das Dimensões",
        description: "Desbloqueie todas as 4 dimensões",
        icon: "🌌",
        condition: (stats) => stats.dimensionsUnlocked >= 4,
      },
      {
        id: "efficient",
        title: "Eficiente",
        description: "Complete um nível com movimentos mínimos",
        icon: "🎯",
        condition: (stats) => stats.hasOptimalSolution,
      },
    ];
  }

  getDefaultStats() {
    return {
      levelsCompleted: 0,
      totalMoves: 0,
      totalPlayTime: 0,
      totalEnergyCollected: 0,
      perfectLevels: 0,
      quantumPowersUsed: 0,
      portalsUsed: 0,
      maxDimensionsActive: 2,
      dimensionsUnlocked: 2,
      fastestLevel: Infinity,
      hasOptimalSolution: false,
      totalStars: 0,
    };
  }

  updateStats(statKey, value, operation = "add") {
    if (operation === "add") {
      this.stats[statKey] = (this.stats[statKey] || 0) + value;
    } else if (operation === "max") {
      this.stats[statKey] = Math.max(this.stats[statKey] || 0, value);
    } else if (operation === "min") {
      this.stats[statKey] = Math.min(this.stats[statKey] || Infinity, value);
    } else {
      this.stats[statKey] = value;
    }

    this.saveStats();
    this.checkAchievements();
  }

  checkAchievements() {
    this.achievements.forEach((achievement) => {
      if (
        !this.isUnlocked(achievement.id) &&
        achievement.condition(this.stats)
      ) {
        this.unlockAchievement(achievement);
      }
    });
  }

  unlockAchievement(achievement) {
    this.unlockedAchievements.push(achievement.id);
    Utils.saveToLocalStorage("unlockedAchievements", this.unlockedAchievements);
    this.showAchievementNotification(achievement);
    Utils.playSound(1500, 300);
    Utils.vibrate([200, 100, 200]);
  }

  isUnlocked(achievementId) {
    return this.unlockedAchievements.includes(achievementId);
  }

  showAchievementNotification(achievement) {
    const notification = document.getElementById("achievementNotification");
    const description = notification.querySelector(".achievement-description");

    description.textContent = achievement.title;
    notification.classList.add("show");

    setTimeout(() => {
      notification.classList.remove("show");
    }, 4000);
  }

  saveStats() {
    Utils.saveToLocalStorage("gameStats", this.stats);
  }

  getStats() {
    return { ...this.stats };
  }

  getAchievements() {
    return this.achievements.map((achievement) => ({
      ...achievement,
      unlocked: this.isUnlocked(achievement.id),
    }));
  }

  resetStats() {
    this.stats = this.getDefaultStats();
    this.unlockedAchievements = [];
    Utils.saveToLocalStorage("gameStats", this.stats);
    Utils.saveToLocalStorage("unlockedAchievements", this.unlockedAchievements);
  }
}
