import Game from './game.js';
import { initControls } from './utils.js';

const tg = window.Telegram.WebApp;

class App {
    constructor() {
        this.game = new Game();
        this.init();
    }

    async init() {
        tg.expand();
        tg.enableClosingConfirmation();
        await this.initGame();
    }

    async initGame() {
        initControls(this.game);
        this.game.start();
        window.addEventListener('resize', () => this.game.resizeCanvas());
    }
}

// Запуск приложения после полной загрузки страницы
document.addEventListener('DOMContentLoaded', () => {
    new App();
});