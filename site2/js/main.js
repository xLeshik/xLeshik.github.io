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

    // В файле main.js обновим preloadAssets:
async preloadAssets() {
    const loadImage = (src) => new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });

    try {
        // Пример загрузки одного спрайта для проверки
        await loadImage('assets/player/idle_0.png');
        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error('Error loading assets:', error);
        document.getElementById('loading').innerHTML = 
            '<p style="color: red">Error loading game assets!</p>';
    }
}

    async initGame() {
        this.game = new Game();
        await this.game.player.loadSprites();
        this.setupEventListeners();
        this.game.start();
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