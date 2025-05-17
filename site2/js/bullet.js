export default class Bullet {
    constructor(game, x, y, direction) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.speed = 800 * direction;
        this.width = 10;
        this.height = 5;
        this.damage = 25;
        this.markedForDeletion = false;
    }

    update(deltaTime) {
        this.x += this.speed * deltaTime;
        
        // Check if out of screen
        if (this.x < 0 || this.x > this.game.canvas.width) {
            this.markedForDeletion = true;
        }
        
        // Check enemy collisions
        this.game.enemies.forEach(enemy => {
            if (this.checkCollision(enemy)) {
                enemy.takeDamage(this.damage);
                this.game.particles.createExplosion(this.x, this.y);
                this.markedForDeletion = true;
                this.game.score += 10;
            }
        });
    }

    checkCollision(enemy) {
        return this.x < enemy.x + enemy.width &&
               this.x + this.width > enemy.x &&
               this.y < enemy.y + enemy.height &&
               this.y + this.height > enemy.y;
    }

    render(ctx) {
        ctx.fillStyle = '#ffff00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}