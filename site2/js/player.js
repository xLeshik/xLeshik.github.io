import Bullet from './bullet.js';

export default class Player {
    constructor(game) {
        this.game = game;
        this.width = 40;
        this.height = 60;
        this.x = 100;
        this.y = game.canvas.height - this.height - 50;
        this.speed = 300;
        this.jumpForce = -500;
        this.velocityY = 0;
        this.gravity = 1500;
        this.isGrounded = false;
        this.health = 100;
        this.direction = 1;
        this.shootCooldown = 0;
        
        // Animation
        this.frameCount = 4;
        this.currentFrame = 0;
        this.animationSpeed = 0.2;
        this.frameTime = 0;
        this.sprites = {
            idle: this.createSprites('idle', 4),
            run: this.createSprites('run', 6),
            jump: this.createSprites('jump', 2),
            shoot: this.createSprites('shoot', 3)
        };
        this.state = 'idle';
    }

    createSprites(state, count) {
        const sprites = [];
        for (let i = 0; i < count; i++) {
            const img = new Image();
            img.src = `assets/player/${state}_${i}.png`;
            sprites.push(img);
        }
        return sprites;
    }

    update(deltaTime, keys) {
        // Horizontal movement
        let moveX = 0;
        if (keys.left) {
            moveX = -1;
            this.direction = -1;
            this.state = 'run';
        } else if (keys.right) {
            moveX = 1;
            this.direction = 1;
            this.state = 'run';
        } else {
            this.state = 'idle';
        }
        
        this.x += moveX * this.speed * deltaTime;
        
        // Jump
        if (keys.jump && this.isGrounded) {
            this.velocityY = this.jumpForce;
            this.isGrounded = false;
            this.state = 'jump';
        }
        
        // Apply gravity
        this.velocityY += this.gravity * deltaTime;
        this.y += this.velocityY * deltaTime;
        
        // Ground collision
        if (this.y >= this.game.canvas.height - this.height - 50) {
            this.y = this.game.canvas.height - this.height - 50;
            this.velocityY = 0;
            this.isGrounded = true;
        }
        
        // Screen bounds
        this.x = Math.max(0, Math.min(this.x, this.game.canvas.width - this.width));
        
        // Animation
        this.frameTime += deltaTime;
        if (this.frameTime >= this.animationSpeed) {
            this.currentFrame = (this.currentFrame + 1) % this.sprites[this.state].length;
            this.frameTime = 0;
        }
        
        // Shoot cooldown
        if (this.shootCooldown > 0) {
            this.shootCooldown -= deltaTime;
        }
    }

    shoot() {
        if (this.shootCooldown <= 0) {
            this.state = 'shoot';
            this.game.particles.createBulletFlash(
                this.x + (this.direction > 0 ? this.width : 0),
                this.y + this.height / 2,
                this.direction
            );
            
            new Bullet(this.game, this.x + this.width/2, this.y + this.height/2, this.direction);
            this.shootCooldown = 0.2;
        }
    }

    render(ctx) {
        ctx.save();
        if (this.direction < 0) {
            ctx.scale(-1, 1);
            ctx.drawImage(
                this.sprites[this.state][this.currentFrame],
                -this.x - this.width,
                this.y,
                this.width,
                this.height
            );
        } else {
            ctx.drawImage(
                this.sprites[this.state][this.currentFrame],
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
        ctx.restore();
    }
}