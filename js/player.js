(function() {
    function Player(game) {
        this.game = game;
        this.x = game.canvas.width / 2 / game.scaleFactor;
        this.y = game.canvas.height / 2 / game.scaleFactor;
        this.width = 40;
        this.height = 40;
        this.speed = 5;
        this.health = 100;
        this.score = 0;
        this.direction = { x: 0, y: 0 };
        this.image = new Image();
        this.image.src = 'images/player.png';
        this.lastShot = 0;
        this.shootCooldown = 300;
        this.autoShootInterval = null;
        this.maxDistanceFromCenter = 150;
        this.joystickCenter = null;
    }

    Player.prototype.update = function() {
        this.x += this.direction.x * this.speed;
        this.y += this.direction.y * this.speed;

        if (this.joystickCenter) {
            const dx = this.x - this.joystickCenter.x;
            const dy = this.y - this.joystickCenter.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance > this.maxDistanceFromCenter) {
                this.x = this.joystickCenter.x + (dx / distance) * this.maxDistanceFromCenter;
                this.y = this.joystickCenter.y + (dy / distance) * this.maxDistanceFromCenter;
            }
        }

        this.x = Math.max(this.width/2, Math.min(this.game.canvas.width / this.game.scaleFactor - this.width/2, this.x));
        this.y = Math.max(this.height/2, Math.min(this.game.canvas.height / this.game.scaleFactor - this.height/2, this.y));
    };

    Player.prototype.draw = function(ctx) {
        if (this.image.complete) {
            ctx.drawImage(
                this.image,
                this.x - this.width/2,
                this.y - this.height/2,
                this.width,
                this.height
            );
        } else {
            ctx.fillStyle = 'blue';
            ctx.fillRect(
                this.x - this.width/2,
                this.y - this.height/2,
                this.width,
                this.height
            );
        }
    };

    Player.prototype.checkCollision = function(other) {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    };

    Player.prototype.shoot = function(targetX, targetY) {
        const now = Date.now();
        if (now - this.lastShot < this.shootCooldown) return;

        this.lastShot = now;
        
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const directionX = dx / distance;
        const directionY = dy / distance;

        this.game.bullets.push(new Bullet(
            this.game,
            this.x,
            this.y,
            directionX,
            directionY
        ));
    };

    Player.prototype.startAutoShooting = function() {
        if (this.autoShootInterval) return;
        
        this.autoShootInterval = setInterval(() => {
            if (!this.game.gamePaused && !this.game.gameOver) {
                const nearestEnemy = this.findNearestEnemy();
                if (nearestEnemy) {
                    this.shoot(nearestEnemy.x, nearestEnemy.y);
                } else {
                    const angle = Math.random() * Math.PI * 2;
                    this.shoot(
                        this.x + Math.cos(angle) * 100,
                        this.y + Math.sin(angle) * 100
                    );
                }
            }
        }, this.shootCooldown);
    };

    Player.prototype.stopAutoShooting = function() {
        if (this.autoShootInterval) {
            clearInterval(this.autoShootInterval);
            this.autoShootInterval = null;
        }
    };

    Player.prototype.findNearestEnemy = function() {
        if (this.game.enemies.length === 0) return null;
        
        let nearest = null;
        let minDistance = Infinity;
        
        this.game.enemies.forEach(enemy => {
            const dx = enemy.x - this.x;
            const dy = enemy.y - this.y;
            const distance = dx * dx + dy * dy;
            
            if (distance < minDistance) {
                minDistance = distance;
                nearest = enemy;
            }
        });
        
        return nearest;
    };

    window.Player = Player;
})();