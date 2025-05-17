function Game() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.scaleFactor = window.devicePixelRatio > 1 ? 2 : 1;
    this.player = null;
    this.enemies = [];
    this.bullets = [];
    this.lastEnemySpawn = 0;
    this.gameOver = false;
    this.gamePaused = false;
    this.animationFrameId = null;
    this.background = new Image();
}

Game.prototype.init = function() {
    console.log('Game init');
    this.setupCanvas();
    
    this.player = new Player(this);
    initJoystick(this);
    initUI(this);
    
    this.background.src = 'images/backbat.png';
    this.background.onload = function() {
        console.log('Background loaded');
        this.startGameLoop();
    }.bind(this);
    
    this.background.onerror = function() {
        console.error('Background load error');
        this.startGameLoop();
    }.bind(this);
};

Game.prototype.startGameLoop = function() {
    console.log('Starting game loop');
    this.gameLoop();
    window.addEventListener('resize', this.handleResize.bind(this));
};

Game.prototype.handleResize = function() {
    this.setupCanvas();
};

Game.prototype.setupCanvas = function() {
    this.canvas.width = window.innerWidth * this.scaleFactor;
    this.canvas.height = window.innerHeight * this.scaleFactor;
    this.ctx.scale(this.scaleFactor, this.scaleFactor);
};

Game.prototype.gameLoop = function() {
    if (!this.gameOver && !this.gamePaused) {
        this.update();
        this.draw();
    }
    this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
};

Game.prototype.update = function() {
    this.player.update();
    
    if (Date.now() - this.lastEnemySpawn > 2000) {
        this.enemies.push(spawnEnemy(this));
        this.lastEnemySpawn = Date.now();
    }

    this.enemies.forEach(function(enemy) {
        enemy.update();
    });
    
    this.bullets.forEach(function(bullet) {
        bullet.update();
    });

    this.bullets = this.bullets.filter(function(bullet) {
        return !bullet.isOutOfBounds();
    });

    this.checkCollisions();
    updateUI(this);
};

Game.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    if (this.background.complete) {
        this.ctx.drawImage(
            this.background,
            0,
            0,
            this.canvas.width / this.scaleFactor,
            this.canvas.height / this.scaleFactor
        );
    }

    this.player.draw(this.ctx);
    
    this.enemies.forEach(function(enemy) {
        enemy.draw(this.ctx);
    }.bind(this));
    
    this.bullets.forEach(function(bullet) {
        bullet.draw(this.ctx);
    }.bind(this));
};

Game.prototype.checkCollisions = function() {
    this.bullets = this.bullets.filter(function(bullet) {
        return !this.enemies.some(function(enemy, index) {
            if (bullet.checkCollision(enemy)) {
                this.enemies.splice(index, 1);
                this.player.score += 10;
                return true;
            }
            return false;
        }.bind(this));
    }.bind(this));

    this.enemies.forEach(function(enemy) {
        if (this.player.checkCollision(enemy)) {
            this.player.health -= 0.5;
            if (this.player.health <= 0) {
                this.gameOver = true;
                alert('Game Over! Score: ' + this.player.score);
            }
        }
    }.bind(this));
};

Game.prototype.destroy = function() {
    console.log('Destroying game');
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.handleResize);
    this.player = null;
    this.enemies = [];
    this.bullets = [];
};