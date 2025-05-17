import { Player } from './player.js';
import { Enemy, spawnEnemy } from './enemy.js';
import { initJoystick } from './joystick.js';
import { initUI, updateUI } from './ui.js';
import { Bullet } from './bullet.js';

export class Game {
    constructor(isTelegramApp) {
        this.isTelegramApp = isTelegramApp;
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scaleFactor = this.calculateScaleFactor();
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.lastEnemySpawn = 0;
        this.gameOver = false;
        this.gamePaused = false;
    }

    calculateScaleFactor() {
        return this.isTelegramApp ? Math.min(window.devicePixelRatio, 2) : 1;
    }

    init(tgData) {
        this.setupCanvas();
        this.player = new Player(this);
        initJoystick(this);
        initUI(this, tgData?.themeParams);
        this.gameLoop();
        window.addEventListener('resize', () => this.handleResize());
    }

    handleResize() {
        if (this.isTelegramApp) {
            this.scaleFactor = this.calculateScaleFactor();
        }
        this.setupCanvas();
    }

    setupCanvas() {
        const [width, height] = this.isTelegramApp 
            ? [window.innerWidth, window.innerHeight]
            : [800, 600];
            
        this.canvas.width = width * this.scaleFactor;
        this.canvas.height = height * this.scaleFactor;
        this.ctx.scale(this.scaleFactor, this.scaleFactor);
    }

    gameLoop() {
        if (!this.gameOver && !this.gamePaused) {
            this.update();
            this.draw();
            updateUI(this);
        }
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        this.player.update();
        
        if (Date.now() - this.lastEnemySpawn > 2000) {
            this.enemies.push(spawnEnemy(this));
            this.lastEnemySpawn = Date.now();
        }

        this.enemies.forEach(enemy => enemy.update());
        this.bullets.forEach(bullet => bullet.update());

        this.checkCollisions();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
                    this.resetGame();
                }
            }
        });
    }

    resetGame() {
        this.player.resetPosition();
        this.player.health = 100;
        this.player.score = 0;
        this.enemies = [];
        this.bullets = [];
        this.lastEnemySpawn = 0;
        this.gameOver = false;
    }
}