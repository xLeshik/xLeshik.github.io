export class Bullet {
    constructor(x, y, dx, dy, game) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.speed = 7;
        this.size = 10;
        this.color = '#e74c3c';
        this.game = game;
    }

    update() {
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }

    checkCollision(target) {
        return Math.hypot(this.x - target.x, this.y - target.y) < this.size + target.size;
    }

    isOutOfBounds() {
        return this.x < 0 || this.x > this.game.canvas.width/this.game.scaleFactor ||
               this.y < 0 || this.y > this.game.canvas.height/this.game.scaleFactor;
    }
}