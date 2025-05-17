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
        this.assetsLoaded = false;
        this.assetsToLoad = 2; // Player image + background
        this.assetsLoadedCount = 0;
        this.background = new Image();
        this.animationFrameId = null;
    }

    assetLoaded() {
        this.assetsLoadedCount++;
        const progress = Math.floor((this.assetsLoadedCount / this.assetsToLoad) * 100);
        document.getElementById('loadingProgress').style.width = `${progress}%`;
        
        if (this.assetsLoadedCount >= this.assetsToLoad) {
            this.assetsLoaded = true;
            setTimeout(() => {
                document.querySelector('.preloader').style.opacity = '0';
                setTimeout(() => {
                    document.querySelector('.preloader').style.display = 'none';
                    document.getElementById('mainMenu').classList.remove('hidden');
                }, 300);
            }, 500);
        }
    }

    init() {
        this.setupCanvas();
        
        // Load background
        this.background.src = 'images/backbat.png';
        this.background.onload = () => {
            this.assetLoaded();
        };
        this.background.onerror = () => {
            console.error('Failed to load background image');
            this.assetLoaded();
        };

        this.player = new Player(this);
        initJoystick(this);
        initUI(this);
        
        this.gameLoop();
        window.addEventListener('resize', () => this.setupCanvas());
    }

    destroy() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
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

    draw() {
        // Draw background
        this.ctx.drawImage(
            this.background,
            0,
            0,
            this.canvas.width / this.scaleFactor,
            this.canvas.height / this.scaleFactor
        );

        // Draw entities
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