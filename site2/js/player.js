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
            idle: [],
            run: [],
            jump: [],
            shoot: []
        };
        this.spritesLoaded = false;

        this.loadSprites();
    }

    async loadSprites() {
        try {
            this.sprites.idle = await this.loadSpriteSet('idle', 4);
            this.sprites.run = await this.loadSpriteSet('run', 6);
            this.sprites.jump = await this.loadSpriteSet('jump', 2);
            this.sprites.shoot = await this.loadSpriteSet('shoot', 3);
            this.spritesLoaded = true;
        } catch (error) {
            console.error('Error loading sprites:', error);
        }
    }

    loadSpriteSet(state, count) {
        return new Promise((resolve, reject) => {
            const images = [];
            let loaded = 0;
            
            for (let i = 0; i < count; i++) {
                const img = new Image();
                img.onload = () => {
                    loaded++;
                    if (loaded === count) resolve(images);
                };
                img.onerror = (err) => reject(`Error loading ${state}_${i}.png`);
                img.src = `assets/player/${state}_${i}.png`;
                images.push(img);
            }
        });
    }

    render(ctx) {
        if (!this.spritesLoaded) {
            // Отображаем заглушку до загрузки спрайтов
            ctx.fillStyle = 'rgba(255,0,0,0.5)';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            return;
        }

        const currentSprite = this.sprites[this.state]?.[this.currentFrame];
        if (!currentSprite || !currentSprite.complete) {
            console.error('Invalid sprite:', this.state, this.currentFrame);
            return;
        }

        ctx.save();
        if (this.direction < 0) {
            ctx.scale(-1, 1);
            ctx.drawImage(
                currentSprite,
                -this.x - this.width,
                this.y,
                this.width,
                this.height
            );
        } else {
            ctx.drawImage(
                currentSprite,
                this.x,
                this.y,
                this.width,
                this.height
            );
        }
        ctx.restore();
    }
}