import Player from './player.js';
import Enemy from './enemy.js';
import ParticleSystem from './particles.js';

export default class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.keys = {
            left: false,
            right: false,
            jump: false,
            shoot: false
        };
        
        this.resize();
        this.init();
    }

    init() {
        this.player = new Player(this);
        this.enemies = [];
        this.particles = new ParticleSystem();
        this.score = 0;
        this.level = 1;
        this.gameTime = 0;
        this.lastTime = 0;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    start() {
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }

    gameLoop(time) {
        const deltaTime = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame((t) => this.gameLoop(t));
    }

    update(deltaTime) {
        this.player.update(deltaTime, this.keys);
        
        if (this.keys.shoot) {
            this.player.shoot();
            this.keys.shoot = false;
        }

        this.particles.update(deltaTime);
        this.spawnEnemies();
        this.updateEnemies(deltaTime);
    }

    spawnEnemies() {
        if (Math.random() < 0.01) {
            this.enemies.push(new Enemy(this));
        }
    }

    updateEnemies(deltaTime) {
        this.enemies.forEach(enemy => enemy.update(deltaTime));
        this.enemies = this.enemies.filter(enemy => enemy.isActive);
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw ground
        this.ctx.fillStyle = '#2d3436';
        this.ctx.fillRect(0, this.canvas.height - 50, this.canvas.width, 50);
        
        this.player.render(this.ctx);
        this.enemies.forEach(enemy => enemy.render(this.ctx));
        this.particles.render(this.ctx);
        
        // Update HUD
        document.getElementById('health').textContent = this.player.health;
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
    }
}