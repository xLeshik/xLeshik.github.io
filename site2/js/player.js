export default class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.position = {
            x: 100,
            y: canvas.height - 100
        };
        this.velocity = { x: 0, y: 0 };
        this.size = { width: 40, height: 60 };
        this.speed = 5;
        this.jumpForce = 15;
        this.gravity = 0.5;
        this.health = 100;
        this.maxHealth = 100;
        this.isGrounded = false;
        this.currentWeapon = 'pistol';
        this.direction = 1; // 1 - вправо, -1 - влево
    }

    move(direction) {
        this.velocity.x = direction * this.speed;
        if (direction !== 0) {
            this.direction = direction;
        }
    }

    jump() {
        if (this.isGrounded) {
            this.velocity.y = -this.jumpForce;
            this.isGrounded = false;
        }
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        if (this.health === 0) this.die();
    }

    die() {
        // Обработка смерти игрока
    }

    update() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Гравитация
        if (!this.isGrounded) {
            this.velocity.y += this.gravity;
        }

        // Коллизия с землей
        if (this.position.y >= this.canvas.height - this.size.height) {
            this.position.y = this.canvas.height - this.size.height;
            this.isGrounded = true;
            this.velocity.y = 0;
        }

        // Границы экрана
        this.position.x = Math.max(0, Math.min(
            this.position.x, 
            this.canvas.width - this.size.width
        ));
    }

    draw(ctx) {
        ctx.fillStyle = '#00f';
        ctx.fillRect(
            this.position.x, 
            this.position.y, 
            this.size.width, 
            this.size.height
        );
    }
}