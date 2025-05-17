import { Bullet } from './bullet.js';

export class Player {
    constructor(game) {
        this.game = game;
        this.x = game.canvas.width / (2 * game.scaleFactor);
        this.y = game.canvas.height / (2 * game.scaleFactor);
        this.width = 50;
        this.height = 50;
        this.speed = 5;
        this.health = 100;
        this.score = 0;
        this.lastShot = 0;
        this.image = new Image();
        this.image.src = 'images/player.png';
    }

    update() {
        if (this.updateWithJoystick) {
            this.updateWithJoystick();
        }
        this.autoShoot();
    }

    draw(ctx) {
        ctx.drawImage(
            this.image,
            this.x - this.width/2,
            this.y - this.height/2,
            this.width,
            this.height
        );
    }

    autoShoot() {
        if (this.game.enemies.length === 0) return;
        if (Date.now() - this.lastShot < 700) return;

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

    checkCollision(target) {
        return Math.hypot(this.x - target.x, this.y - target.y) < this.width/2 + target.size;
    }
}