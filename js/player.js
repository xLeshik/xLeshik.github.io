import { Bullet } from './bullet.js';

export class Player {
    constructor(game) {
        this.game = game;
        this.resetPosition();
        this.size = 30;
        this.speed = 5;
        this.color = 'rgba(52, 152, 219, 0.9)';
        this.health = 100;
        this.score = 0;
        this.lastShot = 0;
    }

    resetPosition() {
        this.x = this.game.canvas.width / (2 * this.game.scaleFactor);
        this.y = this.game.canvas.height / (2 * this.game.scaleFactor);
    }

    update() {
        this.autoShoot();
        this.handleBoundaries();
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    autoShoot() {
        if (this.game.enemies.length === 0 || Date.now() - this.lastShot < 700) return;
        
        const nearestEnemy = this.game.enemies.reduce((closest, enemy) => {
            const dist = Math.hypot(this.x - enemy.x, this.y - enemy.y);
            return dist < closest.dist ? { enemy, dist } : closest;
        }, { enemy: null, dist: Infinity }).enemy;

        if (nearestEnemy) {
            const angle = Math.atan2(
                nearestEnemy.y - this.y,
                nearestEnemy.x - this.x
            );
            
            this.game.bullets.push(new Bullet(
                this.x,
                this.y,
                Math.cos(angle),
                Math.sin(angle),
                this.game
            ));
            this.lastShot = Date.now();
        }
    }

    handleBoundaries() {
        this.x = Math.max(this.size, Math.min(
            this.game.canvas.width/this.game.scaleFactor - this.size, 
            this.x
        ));
        this.y = Math.max(this.size, Math.min(
            this.game.canvas.height/this.game.scaleFactor - this.size, 
            this.y
        ));
    }

    checkCollision(target) {
        return Math.hypot(this.x - target.x, this.y - target.y) < this.size + target.size;
    }
}