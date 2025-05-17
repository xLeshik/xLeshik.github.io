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
    }

    init() {
        this.setupCanvas();
        this.player = new Player(this);
        initJoystick(this);
        initUI(this);
        this.gameLoop();
        window.addEventListener('resize', () => this.setupCanvas());
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
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        this.player.update();
        
        // Spawn enemies
        if (Date.now() - this.lastEnemySpawn > 2000) {
            this.enemies.push(spawnEnemy(this));
            this.lastEnemySpawn = Date.now();
        }

        // Update entities
        this.enemies.forEach(enemy => enemy.update());
        this.bullets.forEach(bullet => bullet.update());

        // Remove out of bounds bullets
        this.bullets = this.bullets.filter(bullet => !bullet.isOutOfBounds());

        // Check collisions
        this.checkCollisions();
        updateUI(this);
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw(this.ctx);
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
    }

    checkCollisions() {
        // Bullet-enemy collisions
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

        // Player-enemy collisions
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