export class Enemy {
    constructor({ type, canvas, player }) {
        this.type = type;
        this.canvas = canvas;
        this.player = player;
        this.position = {
            x: canvas.width,
            y: canvas.height - 100
        };
        this.velocity = { x: 0, y: 0 };
        this.size = { width: 40, height: 60 };
        this.speed = type === 'melee' ? 2 : 1.5;
        this.health = 100;
        this.attackCooldown = 0;
        this.attackRange = type === 'melee' ? 50 : 200;
        this.isAlive = true;
    }

    update() {
        if (!this.isAlive) return;

        // Движение к игроку
        const dx = this.player.position.x - this.position.x;
        const dy = this.player.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.attackRange) {
            this.attack();
        } else {
            this.position.x += Math.sign(dx) * this.speed;
        }

        // Обновление перезарядки атаки
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
    }

    attack() {
        if (this.attackCooldown <= 0) {
            if (this.type === 'melee') {
                this.player.takeDamage(20);
            } else {
                // Реализация выстрела врага
            }
            this.attackCooldown = 60;
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        this.isAlive = false;
        // Генерация бонуса с шансом 30%
        if (Math.random() < 0.3) {
            this.player.game.bonusSystem.createBonus({
                x: this.position.x,
                y: this.position.y,
                type: Math.random() > 0.5 ? 'weapon' : 'health'
            });
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.type === 'melee' ? '#ff0000' : '#ff9900';
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height
        );
    }
}

export class Boss extends Enemy {
    constructor() {
        super({ type: 'boss', canvas: null, player: null });
        this.health = 500;
        this.phase = 1;
        this.specialAttacks = ['rocketBarrage', 'groundSlam'];
        this.attackPatterns = {
            rocketBarrage: { cooldown: 200, damage: 30 },
            groundSlam: { cooldown: 150, damage: 40 }
        };
    }

    update() {
        super.update();
        if (this.health <= 300 && this.phase === 1) {
            this.phase = 2;
            this.speed *= 1.5;
        }
    }

    executeSpecialAttack(attackType) {
        switch(attackType) {
            case 'rocketBarrage':
                // Реализация ракетного обстрела
                break;
            case 'groundSlam':
                // Реализация удара по земле
                break;
        }
    }
}