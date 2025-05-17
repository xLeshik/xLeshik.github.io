export default class Enemy {
    constructor(game) {
        this.game = game;
        this.width = 50;
        this.height = 60;
        this.x = game.canvas.width;
        this.y = game.canvas.height - this.height - 50;
        this.speed = 100;
        this.health = 100;
        this.isActive = true;
    }

    update(deltaTime) {
        this.x -= this.speed * deltaTime;
        
        if (this.x + this.width < 0) {
            this.isActive = false;
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.isActive = false;
            this.game.particles.createExplosion(
                this.x + this.width/2,
                this.y + this.height/2
            );
            this.game.score += 50;
        }
    }

    render(ctx) {
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}