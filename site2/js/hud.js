// Получаем элементы HUD один раз при загрузке
const healthElement = document.getElementById('health-value');
const timerElement = document.getElementById('timer-value');
const weaponElement = document.getElementById('weapon-name');
const scoreElement = document.getElementById('score-value');

export function updateHUD(player, time, score = 0, level = 1) {
    if (healthElement) healthElement.textContent = Math.floor(player.health);
    if (timerElement) timerElement.textContent = Math.ceil(time);
    if (weaponElement) {
        weaponElement.textContent = player.currentWeapon.charAt(0).toUpperCase() + 
                                  player.currentWeapon.slice(1);
    }
    if (scoreElement) scoreElement.textContent = score;
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

export function showGameOver(score) {
    const overlay = createOverlay();
    overlay.innerHTML = `
        <div class="game-over">
            <h2>GAME OVER</h2>
            <p>Your score: ${score}</p>
            <button id="restart-btn">Try Again</button>
        </div>
    `;
    
    document.getElementById('restart-btn').addEventListener('click', () => {
        window.location.reload();
    });
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
            flex-direction: column;
            z-index: 1000;
        `;
        document.body.appendChild(overlay);
    }
    return overlay;
}