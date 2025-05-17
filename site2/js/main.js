import Game from './game.js';

class App {
    constructor() {
        this.game = null;
        this.init();
    }

    async init() {
        const tg = window.Telegram.WebApp;
        tg.expand();
        tg.enableClosingConfirmation();

        await this.preloadAssets();
        this.initGame();
    }

    async preloadAssets() {
        return new Promise((resolve) => {
            // Здесь можно добавить реальную загрузку спрайтов
            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
                resolve();
            }, 500);
        });
    }

    initGame() {
        this.game = new Game();
        this.game.start();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Touch controls
        document.querySelector('.left').addEventListener('touchstart', () => this.game.keys.left = true);
        document.querySelector('.left').addEventListener('touchend', () => this.game.keys.left = false);
        document.querySelector('.right').addEventListener('touchstart', () => this.game.keys.right = true);
        document.querySelector('.right').addEventListener('touchend', () => this.game.keys.right = false);
        document.querySelector('.jump').addEventListener('touchstart', () => this.game.keys.jump = true);
        document.querySelector('.shoot').addEventListener('touchstart', () => this.game.keys.shoot = true);

        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            if (e.code === 'ArrowLeft') this.game.keys.left = true;
            if (e.code === 'ArrowRight') this.game.keys.right = true;
            if (e.code === 'ArrowUp') this.game.keys.jump = true;
            if (e.code === 'Space') this.game.keys.shoot = true;
        });

        window.addEventListener('keyup', (e) => {
            if (e.code === 'ArrowLeft') this.game.keys.left = false;
            if (e.code === 'ArrowRight') this.game.keys.right = false;
            if (e.code === 'ArrowUp') this.game.keys.jump = false;
            if (e.code === 'Space') this.game.keys.shoot = false;
        });

        window.addEventListener('resize', () => this.game.resize());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});