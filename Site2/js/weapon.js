export default class WeaponSystem {
    constructor(player) {
        this.player = player;
        this.bullets = [];
        this.weapons = {
            pistol: {
                damage: 10,
                fireRate: 500,
                projectileSpeed: 12,
                lastShot: 0
            },
            shotgun: {
                damage: 25,
                fireRate: 1000,
                projectileSpeed: 10,
                spread: 0.2,
                pelletCount: 5,
                lastShot: 0
            },
            machinegun: {
                damage: 7,
                fireRate: 100,
                projectileSpeed: 15,
                lastShot: 0
            }
        };
    }

    shoot(direction) {
        const currentTime = Date.now();
        const weapon = this.weapons[this.player.currentWeapon];

        if (currentTime - weapon.lastShot > weapon.fireRate) {
            weapon.lastShot = currentTime;
            
            switch(this.player.currentWeapon) {
                case 'pistol':
                    this.createBullet(direction);
                    break;
                case 'shotgun':
                    for (let i = 0; i < weapon.pelletCount; i++) {
                        const spread = (Math.random() - 0.5) * weapon.spread;
                        this.createBullet(direction + spread);
                    }
                    break;
                case 'machinegun':
                    this.createBullet(direction);
                    break;
            }
        }
    }

    createBullet(direction) {
        const weapon = this.weapons[this.player.currentWeapon];
        this.bullets.push({
            x: this.player.position.x + this.player.size.width,
            y: this.player.position.y + this.player.size.height/2,
            dx: Math.cos(direction) * weapon.projectileSpeed,
            dy: Math.sin(direction) * weapon.projectileSpeed,
            damage: weapon.damage,
            lifetime: 1000
        });
    }

    updateBullets() {
        this.bullets = this.bullets.filter(bullet => {
            bullet.x += bullet.dx;
            bullet.y += bullet.dy;
            bullet.lifetime -= 16;
            return bullet.lifetime > 0 && 
                   bullet.x < this.player.canvas.width &&
                   bullet.x > 0;
        });
    }
}