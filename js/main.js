<<<<<<< HEAD
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Game initialized');
        
        const startGameBtn = document.getElementById('startGameBtn');
        const mainMenuBtn = document.getElementById('mainMenuBtn');
        const mainMenu = document.getElementById('mainMenu');
        const gameScreen = document.getElementById('gameScreen');
        const gameOverlay = document.getElementById('gameOverlay');
        
        let gameInstance = null;

        function startNewGame() {
            console.log('Starting new game');
            mainMenu.classList.remove('visible');
            gameScreen.classList.add('visible');
            gameInstance = new Game();
            gameInstance.init();
        }

        function returnToMainMenu() {
            console.log('Returning to main menu');
            gameOverlay.classList.remove('visible');
            gameScreen.classList.remove('visible');
            mainMenu.classList.add('visible');
            if (gameInstance) {
                gameInstance.destroy();
                gameInstance = null;
            }
        }

        startGameBtn.addEventListener('click', startNewGame);
        mainMenuBtn.addEventListener('click', returnToMainMenu);
        
        // Показываем главное меню при загрузке
        mainMenu.classList.add('visible');
        
        // Для Telegram
        if (window.Telegram && window.Telegram.WebApp) {
            Telegram.WebApp.setHeaderColor('#222');
            Telegram.WebApp.setBackgroundColor('#222');
        }
    });
})();
=======
import { Player } from './player.js';
import { Enemy, spawnEnemy } from './enemy.js';
import { initJoystick } from './joystick.js';
import { initUI, updateUI } from './ui.js';
import { Bullet } from './bullet.js';

export class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scaleFactor = window.devicePixelRatio > 1 ? 2 : 1;
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.lastEnemySpawn = 0;
        this.gameOver = false;
        this.gamePaused = false;
        this.animationFrameId = null;
        this.background = new Image();
    }

    init() {
        this.setupCanvas();
        
        // Загружаем фон
        this.background.src = 'images/backbat.png';
        this.background.onload = () => {
            this.startGame();
        };
        this.background.onerror = () => {
            console.error('Failed to load background image');
            this.startGame();
        };
    }

    startGame() {
        this.player = new Player(this);
        initJoystick(this);
        initUI(this);
        
        this.gameLoop();
        window.addEventListener('resize', () => this.setupCanvas());
    }

    destroy() {
        cancelAnimationFrame(this.animationFrameId);
        window.removeEventListener('resize', () => this.setupCanvas());
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth * this.scaleFactor;
        this.canvas.height = window.innerHeight * this.scaleFactor;
        this.ctx.scale(this.scaleFactor, this.scaleFactor);
    }

    gameLoop() {
        if (!this.gameOver && !this.gamePaused) {
            this.update();
            this.draw();
        }
        this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        this.player.update();
        
        if (Date.now() - this.lastEnemySpawn > 2000) {
            this.enemies.push(spawnEnemy(this));
            this.lastEnemySpawn = Date.now();
        }

        this.enemies.forEach(enemy => enemy.update());
        this.bullets.forEach(bullet => bullet.update());

        this.bullets = this.bullets.filter(bullet => !bullet.isOutOfBounds());

        this.checkCollisions();
        updateUI(this);
    }

    draw() {
        // Рисуем фон
        this.ctx.drawImage(
            this.background,
            0,
            0,
            this.canvas.width / this.scaleFactor,
            this.canvas.height / this.scaleFactor
        );

        // Рисуем игровые объекты
        this.player.draw(this.ctx);
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
    }

    checkCollisions() {
        this.bullets = this.bullets.filter(bullet => {
            return !this.enemies.some((enemy, index) => {
                if (bullet.checkCollision(enemy)) {
                    this.enemies.splice(index, 1);
                    this.player.score += 10;
                    return true;
                }
                return false;
            });
        });

        this.enemies.forEach(enemy => {
            if (this.player.checkCollision(enemy)) {
                this.player.health -= 0.5;
                if (this.player.health <= 0) {
                    this.gameOver = true;
                    alert(`Game Over! Score: ${this.player.score}`);
                }
            }
        });
    }
}
>>>>>>> 51d78df38af49148ba66bd4e87d3814938161f5e
