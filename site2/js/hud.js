export function updateHUD(player, time) {
    document.getElementById('health-value').textContent = Math.floor(player.health);
    document.getElementById('timer-value').textContent = Math.ceil(time);
    document.getElementById('weapon-name').textContent = 
        player.currentWeapon.charAt(0).toUpperCase() + 
        player.currentWeapon.slice(1);
}

export function showLevelComplete(level) {
    const overlay = createOverlay();
    overlay.innerHTML = `
        <div class="level-complete">
            <h2>LEVEL ${level} COMPLETE!</h2>
            <p>Next level starting in 3 seconds...</p>
        </div>
    `;
}

export function showGameOver() {
    const overlay = createOverlay();
    overlay.innerHTML = `
        <div class="game-over">
            <h2>GAME OVER</h2>
            <button onclick="window.location.reload()">Try Again</button>
        </div>
    `;
}

function createOverlay() {
    let overlay = document.getElementById('game-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'game-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;
        document.body.appendChild(overlay);
    }
    return overlay;
}