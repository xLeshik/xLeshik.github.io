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
        this.initGame();
    }

    initGame() {
        this.game = new Game();
        initControls(this.game);
        this.game.start();
        this.setupResizeHandler();
    }

    setupResizeHandler() {
        window.addEventListener('resize', () => {
            this.game.resizeCanvas();
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    new App();
});