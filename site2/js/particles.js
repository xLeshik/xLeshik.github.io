export default class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    createBulletFlash(x, y, direction) {
        for (let i = 0; i < 5; i++) {
            this.particles.push({
                x,
                y,
                size: Math.random() * 3 + 2,
                color: '#ffff00',
                speedX: direction * (Math.random() * 50 + 50),
                speedY: (Math.random() - 0.5) * 20,
                life: 0.3,
                decay: 0.05
            });
        }
    }

    createExplosion(x, y) {
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x,
                y,
                size: Math.random() * 5 + 2,
                color: '#ff6600',
                speedX: (Math.random() - 0.5) * 200,
                speedY: (Math.random() - 0.5) * 200,
                life: 1,
                decay: 0.02
            });
        }
    }

    update(deltaTime) {
        this.particles.forEach(p => {
            p.x += p.speedX * deltaTime;
            p.y += p.speedY * deltaTime;
            p.life -= p.decay;
            p.size *= 0.95;
        });
        
        this.particles = this.particles.filter(p => p.life > 0);
    }

    render(ctx) {
        this.particles.forEach(p => {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }
}