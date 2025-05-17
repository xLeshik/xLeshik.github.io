(function() {
    /**
     * Класс игрока
     * @param {Game} game - экземпляр игры
     */
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
        this.shootCooldown = 300; // мс между выстрелами
    }

    /**
     * Обновление состояния игрока
     */
    Player.prototype.update = function() {
        // Движение игрока
        this.x += this.direction.x * this.speed;
        this.y += this.direction.y * this.speed;

        // Ограничение движения в пределах экрана
        this.x = Math.max(this.width/2, Math.min(this.game.canvas.width / this.game.scaleFactor - this.width/2, this.x));
        this.y = Math.max(this.height/2, Math.min(this.game.canvas.height / this.game.scaleFactor - this.height/2, this.y));
    };

    /**
     * Отрисовка игрока
     * @param {CanvasRenderingContext2D} ctx - контекст рисования
     */
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

    /**
     * Проверка столкновения с другим объектом
     * @param {Object} other - другой объект
     */
    Player.prototype.checkCollision = function(other) {
        return (
            this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y
        );
    };

    /**
     * Стрельба
     * @param {number} targetX - координата X цели
     * @param {number} targetY - координата Y цели
     */
    Player.prototype.shoot = function(targetX, targetY) {
        const now = Date.now();
        if (now - this.lastShot < this.shootCooldown) return;

        this.lastShot = now;
        
        // Вычисляем направление выстрела
        const dx = targetX - this.x;
        const dy = targetY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const directionX = dx / distance;
        const directionY = dy / distance;

        // Создаем пулю
        this.game.bullets.push(new Bullet(
            this.game,
            this.x,
            this.y,
            directionX,
            directionY
        ));
    };

    // Экспорт в глобальную область видимости
    window.Player = Player;
})();