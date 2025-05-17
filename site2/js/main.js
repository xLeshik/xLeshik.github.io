import Game from './game.js';
import { initControls } from './utils.js';

const tg = window.Telegram.WebApp;

class App {
    constructor() {
        this.game = null;
        this.init();
    }

    init() {
        tg.expand();
        tg.enableClosingConfirmation();
        
        // Ждем полной загрузки DOM
        document.addEventListener('DOMContentLoaded', () => {
            this.initGame();
        });
    }

    initGame() {
        this.game = new Game();
        initControls(this.game);
        
        // Проверяем готовность перед стартом
        if (this.game && this.game.canvas) {
            this.game.start();
            window.addEventListener('resize', () => this.game.resizeCanvas());
        } else {
            console.error('Game initialization failed');
        }
    }
}

// Запускаем приложение
new App();