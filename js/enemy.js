export class Enemy {
    constructor(x, y, game) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.size = 25;
        this.speed = 1.9 + Math.random() * 0.5;
        this.color = 'rgba(241, 196, 15, 0.9)';
        this.health = 3;
    }

    update() {
        const angle = Math.atan2(
            this.game.player.y - this.y,
            this.game.player.x - this.x
        );
        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

export function spawnEnemy(game) {
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    if (side === 0) [x, y] = [Math.random() * game.canvas.width/game.scaleFactor, -30];
    else if (side === 1) [x, y] = [game.canvas.width/game.scaleFactor + 30, Math.random() * game.canvas.height/game.scaleFactor];
    else if (side === 2) [x, y] = [Math.random() * game.canvas.width/game.scaleFactor, game.canvas.height/game.scaleFactor + 30];
    else [x, y] = [-30, Math.random() * game.canvas.height/game.scaleFactor];

    return new Enemy(x, y, game);
}