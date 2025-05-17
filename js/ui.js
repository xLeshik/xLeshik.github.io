export function initUI(game) {
    const pauseBtn = document.getElementById('pauseBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    const mainMenuBtn = document.getElementById('mainMenuBtn');
    const gameOverlay = document.getElementById('gameOverlay');

    pauseBtn.addEventListener('click', () => {
        game.gamePaused = !game.gamePaused;
        if (game.gamePaused) {
            gameOverlay.classList.add('visible');
        } else {
            gameOverlay.classList.remove('visible');
        }
    });

    resumeBtn.addEventListener('click', () => {
        game.gamePaused = false;
        gameOverlay.classList.remove('visible');
    });

    mainMenuBtn.addEventListener('click', () => {
        game.gamePaused = false;
        gameOverlay.classList.remove('visible');
    });
}

export function updateUI(game) {
    document.getElementById('health').textContent = `Health: ${Math.floor(game.player.health)}`;
    document.getElementById('score').textContent = `Score: ${game.player.score}`;
}