import Player from './player.js';
import { Enemy, Boss } from './enemy.js';
import WeaponSystem from './weapon.js';
import BonusSystem from './bonus.js';
import { updateHUD, showLevelComplete, showGameOver } from './hud.js';

export default class Game {
    constructor() {
        // Инициализация canvas и контекста
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // Создание игровых объектов
        this.player = new Player(this.canvas);
        this.player.game = this; // Ссылка на игру для других объектов
        
        this.weaponSystem = new WeaponSystem(this.player);
        this.bonusSystem = new BonusSystem(this.player);
        
        // Игровые параметры
        this.currentLevel = 1;
        this.maxLevels = 3;
        this.gameTime = 60;
        this.levelDuration = 60;
        this.isRunning = false;
        this.isPaused = false;
        
        // Игровые объекты
        this.enemies = [];
        this.bullets = [];
        this.bonuses = [];
        this.particles = [];
        
        // Таймеры
        this.levelTimer = null;
        this.enemySpawnTimer = null;
        this.bossSpawned = false;
        
        // Статистика
        this.score = 0;
        this.kills = 0;
    }

    // Настройка размеров canvas
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Перепозиционируем игрока при изменении размера
        if (this.player) {
            this.player.position.y = this.canvas.height - this.player.size.height - 50;
        }
    }

    // Запуск игры
    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.loadLevel();
        this.setupEventListeners();
        
        // Главный игровой цикл
        const gameLoop = () => {
            if (!this.isRunning || this.isPaused) return;
            
            this.update();
            this.render();
            requestAnimationFrame(gameLoop.bind(this));
        };
        
        gameLoop();
    }

    // Загрузка уровня
    loadLevel() {
        // Сброс параметров
        this.gameTime = this.levelDuration;
        this.enemies = [];
        this.bullets = [];
        this.bonuses = [];
        this.bossSpawned = false;
        this.player.resetPosition();
        
        // Настройка таймеров
        this.setupTimers();
        
        // Спавн начальных врагов
        this.spawnInitialEnemies();
    }

    // Настройка таймеров
    setupTimers() {
        // Очистка старых таймеров
        if (this.levelTimer) clearInterval(this.levelTimer);
        if (this.enemySpawnTimer) clearInterval(this.enemySpawnTimer);
        
        // Таймер уровня
        this.levelTimer = setInterval(() => {
            this.gameTime -= 0.1;
            
            // Проверка окончания времени уровня
            if (this.gameTime <= 0) {
                this.endLevel(false);
            }
            
            // Спавн босса за 10 секунд до конца
            if (!this.bossSpawned && this.gameTime <= 10) {
                this.spawnBoss();
            }
        }, 100);
        
        // Таймер спавна врагов
        this.enemySpawnTimer = setInterval(() => {
            if (this.enemies.length < 5 + this.currentLevel * 2) {
                this.spawnRandomEnemy();
            }
        }, 2000 - this.currentLevel * 200); // Увеличиваем частоту спавна с уровнем
    }

    // Спавн начальных врагов
    spawnInitialEnemies() {
        const enemyCount = 3 + this.currentLevel;
        for (let i = 0; i < enemyCount; i++) {
            this.spawnRandomEnemy();
        }
    }

    // Спавн случайного врага
    spawnRandomEnemy() {
        const type = Math.random() > 0.5 ? 'melee' : 'ranged';
        const x = this.canvas.width + Math.random() * 200;
        const y = this.canvas.height - 100 - (type === 'ranged' ? Math.random() * 100 : 0);
        
        this.enemies.push(new Enemy({
            type,
            position: { x, y },
            canvas: this.canvas,
            player: this.player,
            game: this
        }));
    }

    // Спавн босса
    spawnBoss() {
        this.bossSpawned = true;
        const boss = new Boss({
            position: { x: this.canvas.width, y: this.canvas.height - 150 },
            canvas: this.canvas,
            player: this.player,
            game: this
        });
        
        this.enemies.push(boss);
    }

    // Обновление игрового состояния
    update() {
        // Обновление игрока
        this.player.update();
        
        // Обновление врагов
        this.enemies.forEach(enemy => enemy.update());
        
        // Обновление пуль
        this.weaponSystem.updateBullets();
        
        // Обновление бонусов
        this.bonusSystem.update();
        
        // Проверка коллизий
        this.checkCollisions();
        
        // Удаление "мертвых" объектов
        this.cleanupObjects();
    }

    // Проверка коллизий
    checkCollisions() {
        // Пули с врагами
        this.bullets.forEach(bullet => {
            this.enemies.forEach(enemy => {
                if (this.checkCollision(bullet, enemy)) {
                    enemy.takeDamage(bullet.damage);
                    bullet.lifetime = 0; // Уничтожаем пулю
                    this.score += 10;
                    this.kills += 1;
                }
            });
        });
        
        // Игрок с врагами
        this.enemies.forEach(enemy => {
            if (this.checkCollision(this.player, enemy)) {
                this.player.takeDamage(enemy.type === 'melee' ? 20 : 10);
            }
        });
        
        // Игрок с бонусами
        this.bonuses.forEach(bonus => {
            if (this.checkCollision(this.player, bonus)) {
                this.bonusSystem.applyBonus(bonus);
                bonus.collected = true;
                this.score += 5;
            }
        });
    }

    // Проверка столкновения двух объектов
    checkCollision(obj1, obj2) {
        return obj1.position.x < obj2.position.x + obj2.size.width &&
               obj1.position.x + obj1.size.width > obj2.position.x &&
               obj1.position.y < obj2.position.y + obj2.size.height &&
               obj1.position.y + obj1.size.height > obj2.position.y;
    }

    // Очистка объектов
    cleanupObjects() {
        // Удаляем "мертвых" врагов
        this.enemies = this.enemies.filter(enemy => enemy.isAlive);
        
        // Удаляем пули с истекшим временем жизни
        this.bullets = this.bullets.filter(bullet => bullet.lifetime > 0);
        
        // Удаляем собранные бонусы
        this.bonuses = this.bonuses.filter(bonus => !bonus.collected);
    }

    // Отрисовка игры
    render() {
        // Очистка экрана
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Отрисовка фона
        this.drawBackground();
        
        // Отрисовка игрока
        this.player.draw(this.ctx);
        
        // Отрисовка врагов
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        
        // Отрисовка пуль
        this.bullets.forEach(bullet => {
            this.ctx.fillStyle = '#ffff00';
            this.ctx.fillRect(bullet.x, bullet.y, 5, 2);
        });
        
        // Отрисовка бонусов
        this.bonuses.forEach(bonus => {
            this.ctx.fillStyle = bonus.type === 'health' ? '#00ff00' : '#ff6600';
            this.ctx.beginPath();
            this.ctx.arc(bonus.x, bonus.y, bonus.size / 2, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // Отрисовка интерфейса
        updateHUD(this.player, this.gameTime, this.score, this.currentLevel);
    }

    // Отрисовка фона
    drawBackground() {
        // Градиентный фон
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(1, '#16213e');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Земля
        this.ctx.fillStyle = '#2d3436';
        this.ctx.fillRect(0, this.canvas.height - 50, this.canvas.width, 50);
    }

    // Завершение уровня
    endLevel(success) {
        this.isRunning = false;
        clearInterval(this.levelTimer);
        clearInterval(this.enemySpawnTimer);
        
        if (success) {
            if (this.currentLevel < this.maxLevels) {
                showLevelComplete(this.currentLevel);
                this.currentLevel++;
                setTimeout(() => this.start(), 3000);
            } else {
                this.gameComplete();
            }
        } else {
            showGameOver(this.score);
        }
    }

    // Полное прохождение игры
    gameComplete() {
        // Можно добавить экран завершения игры
        alert(`Поздравляем! Вы прошли игру с результатом: ${this.score} очков`);
        this.resetGame();
    }

    // Сброс игры
    resetGame() {
        this.currentLevel = 1;
        this.score = 0;
        this.kills = 0;
        this.start();
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        window.addEventListener('resize', this.resizeCanvas.bind(this));
        
        // Пауза при сворачивании вкладки
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.isPaused = true;
            } else {
                this.isPaused = false;
            }
        });
    }
}