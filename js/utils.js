// Utilitários gerais
class Utils {
  static lerp(start, end, factor) {
    return start + (end - start) * factor;
  }

  static distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  static clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  static randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  static hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  static easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  static vibrate(pattern = [100]) {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  }

  static playSound(frequency, duration = 100) {
    if (
      typeof AudioContext !== "undefined" ||
      typeof webkitAudioContext !== "undefined"
    ) {
      const audioContext = new (AudioContext || webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + duration / 1000
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    }
  }

  static saveToLocalStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn("Não foi possível salvar no localStorage:", e);
    }
  }

  static loadFromLocalStorage(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.warn("Não foi possível carregar do localStorage:", e);
      return defaultValue;
    }
  }
}

// Constantes do jogo
const GAME_CONFIG = {
  CANVAS_SIZE: 300,
  GRID_SIZE: 10,
  CELL_SIZE: 30,
  COLORS: {
    DIMENSION_1: "#00d4ff",
    DIMENSION_2: "#ff00ff",
    DIMENSION_3: "#00ff88",
    DIMENSION_4: "#ffff00",
    PLAYER: "#ffffff",
    ENERGY: "#ffd700",
    OBSTACLE: "#ff4757",
    PORTAL: "#9c88ff",
  },
  SOUNDS: {
    MOVE: 440,
    COLLECT: 880,
    WIN: 1320,
    ERROR: 220,
  },
};
