export function initUI(game) {
    const pauseBtn = document.getElementById('pauseBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    const gameOverlay = document.getElementById('gameOverlay');

    pauseBtn.addEventListener('click', () => {
        game.gamePaused = !game.gamePaused;
        gameOverlay.style.display = game.gamePaused ? 'flex' : 'none';
    });

    resumeBtn.addEventListener('click', () => {
        game.gamePaused = false;
        gameOverlay.style.display = 'none';
    });
}

export function updateUI(game) {
    document.getElementById('health').textContent = `Health: ${Math.floor(game.player.health)}`;
    document.getElementById('score').textContent = `Score: ${game.player.score}`;
}