import Player from './player.js';
import { Enemy, Boss } from './enemy.js';
import WeaponSystem from './weapon.js';
import BonusSystem from './bonus.js';
import { updateHUD, showLevelComplete, showGameOver } from './hud.js';

export default class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        this.player = new Player(this.canvas);
        this.weaponSystem = new WeaponSystem(this.player);
        this.bonusSystem = new BonusSystem(this.player);
        this.currentLevel = 1;
        this.maxLevels = 3;
        this.gameTime = 60;
        this.isRunning = false;
        this.enemies = [];
        this.bullets = [];
        this.bonuses = [];
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.loadLevel();
        this.gameLoop();
    }

    loadLevel() {
        this.gameTime = 60;
        this.enemies = [];
        this.bonuses = [];
        this.spawnEnemies();
        this.setupTimers();
    }

    spawnEnemies() {
        const enemyCount = 5 + this.currentLevel * 2;
        for (let i = 0; i < enemyCount; i++) {
            this.enemies.push(new Enemy({
                type: Math.random() > 0.5 ? 'melee' : 'ranged',
                canvas: this.canvas,
                player: this.player
            }));
        }
    }

    setupTimers() {
        this.levelTimer = setInterval(() => {
            this.gameTime -= 0.1;
            if (this.gameTime <= 0) this.endLevel(true);
        }, 100);

        this.enemySpawner = setInterval(() => {
            if (this.enemies.length < 10 + this.currentLevel * 2) {
                this.enemies.push(new Enemy({
                    type: Math.random() > 0.5 ? 'melee' : 'ranged',
                    canvas: this.canvas,
                    player: this.player
                }));
            }
        }, 2000);
    }

    gameLoop() {
        if (!this.isRunning) return;
        
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        this.player.update();
        this.enemies.forEach(enemy => enemy.update());
        this.bullets.forEach(bullet => bullet.update());
        this.bonuses.forEach(bonus => bonus.update());
        
        this.checkCollisions();
        this.cleanupObjects();
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.draw(this.ctx);
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        this.bullets.forEach(bullet => bullet.draw(this.ctx));
        this.bonuses.forEach(bonus => bonus.draw(this.ctx));
        updateHUD(this.player, this.gameTime);
    }

    checkCollisions() {
        // Реализация проверки столкновений
    }

    cleanupObjects() {
        // Удаление вышедших за пределы экрана объектов
    }

    endLevel(success) {
        clearInterval(this.levelTimer);
        clearInterval(this.enemySpawner);
        this.isRunning = false;
        
        if (success && this.currentLevel < this.maxLevels) {
            this.currentLevel++;
            showLevelComplete(this.currentLevel);
            setTimeout(() => this.start(), 3000);
        } else {
            showGameOver();
        }
    }
}