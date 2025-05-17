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
        
        // Инициализация игровых объектов
        this.player = new Player(this);
        initJoystick(this);
        initUI(this);
        
        // Загрузка фона
        this.background.src = 'images/backbat.png';
        this.background.onload = () => {
            this.startGameLoop();
        };
        this.background.onerror = () => {
            console.error('Background image failed to load');
            this.startGameLoop();
        };
    }

    startGameLoop() {
        this.gameLoop();
        window.addEventListener('resize', this.handleResize.bind(this));
    }

    handleResize() {
        this.setupCanvas();
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
        
        // Спавн врагов
        if (Date.now() - this.lastEnemySpawn > 2000) {
            this.enemies.push(spawnEnemy(this));
            this.lastEnemySpawn = Date.now();
        }

        // Обновление объектов
        this.enemies.forEach(enemy => enemy.update());
        this.bullets.forEach(bullet => bullet.update());

        // Удаление пуль за пределами экрана
        this.bullets = this.bullets.filter(bullet => !bullet.isOutOfBounds());

        // Проверка коллизий
        this.checkCollisions();
        updateUI(this);
    }

    draw() {
        // Очистка canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Рисование фона
        this.ctx.drawImage(
            this.background,
            0,
            0,
            this.canvas.width / this.scaleFactor,
            this.canvas.height / this.scaleFactor
        );

        // Рисование игровых объектов
        this.player.draw(this.ctx);
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
    }

    checkCollisions() {
        // Коллизии пуль с врагами
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

        // Коллизии игрока с врагами
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

    destroy() {
        // Остановка игрового цикла
        cancelAnimationFrame(this.animationFrameId);
        
        // Удаление обработчиков событий
        window.removeEventListener('resize', this.handleResize);
        
        // Очистка игровых объектов
        this.player = null;
        this.enemies = [];
        this.bullets = [];
    }
}