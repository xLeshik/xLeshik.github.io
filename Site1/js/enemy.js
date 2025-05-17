(function() {
    function spawnEnemy(game) {
        let x, y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? -50 : game.canvas.width / game.scaleFactor + 50;
            y = Math.random() * game.canvas.height / game.scaleFactor;
        } else {
            x = Math.random() * game.canvas.width / game.scaleFactor;
            y = Math.random() < 0.5 ? -50 : game.canvas.height / game.scaleFactor + 50;
        }

        return new Enemy(game, x, y);
    }

    function Enemy(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = 1 + Math.random() * 1;
        this.health = 100;
    }

    Enemy.prototype.update = function() {
        const dx = this.game.player.x - this.x;
        const dy = this.game.player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            this.x += (dx / distance) * this.speed;
            this.y += (dy / distance) * this.speed;
        }
    };

    Enemy.prototype.draw = function(ctx) {
        ctx.fillStyle = 'red';
        ctx.fillRect(
            this.x - this.width/2,
            this.y - this.height/2,
            this.width,
            this.height
        );
    };

    window.spawnEnemy = spawnEnemy;
    window.Enemy = Enemy;
})();