export default class BonusSystem {
    constructor(player) {
        this.player = player;
        this.bonuses = [];
        this.bonusTypes = {
            health: { color: '#00ff00', effect: this.healPlayer },
            weapon: { color: '#ff6600', effect: this.upgradeWeapon }
        };
    }

    createBonus({ x, y, type }) {
        this.bonuses.push({
            x,
            y,
            type,
            size: 20,
            velocity: { x: (Math.random() - 0.5) * 2, y: -3 }
        });
    }

    healPlayer() {
        this.player.health = Math.min(
            this.player.maxHealth, 
            this.player.health + 30
        );
    }

    upgradeWeapon() {
        const weapons = Object.keys(this.player.weapons);
        const currentIndex = weapons.indexOf(this.player.currentWeapon);
        const nextWeapon = weapons[(currentIndex + 1) % weapons.length];
        this.player.currentWeapon = nextWeapon;
    }

    update() {
        this.bonuses.forEach((bonus, index) => {
            // Движение бонуса
            bonus.x += bonus.velocity.x;
            bonus.y += bonus.velocity.y;
            bonus.velocity.y += 0.1;

            // Проверка сбора игроком
            const dx = this.player.position.x - bonus.x;
            const dy = this.player.position.y - bonus.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.player.size.width/2 + bonus.size/2) {
                this.bonusTypes[bonus.type].effect.call(this);
                this.bonuses.splice(index, 1);
            }
        });
    }
}