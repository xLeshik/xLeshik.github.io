(function() {
    function Bullet(game, x, y, dx, dy) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.radius = 5;
        this.speed = 10;
        this.dx = dx;
        this.dy = dy;
        this.damage = 25;
    }

    Bullet.prototype.update = function() {
        this.x += this.dx * this.speed;
        this.y += this.dy * this.speed;
    };

    Bullet.prototype.draw = function(ctx) {
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    };

    Bullet.prototype.isOutOfBounds = function() {
        return (
            this.x < -this.radius ||
            this.x > this.game.canvas.width / this.game.scaleFactor + this.radius ||
            this.y < -this.radius ||
            this.y > this.game.canvas.height / this.game.scaleFactor + this.radius
        );
    };

    Bullet.prototype.checkCollision = function(enemy) {
        const distance = Math.sqrt(
            Math.pow(this.x - enemy.x, 2) + 
            Math.pow(this.y - enemy.y, 2)
        );
        return distance < this.radius + Math.max(enemy.width, enemy.height)/2;
    };

    window.Bullet = Bullet;
})();