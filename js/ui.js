export function initUI(game) {
    const pauseBtn = document.getElementById('pauseBtn');
    const resumeBtn = document.getElementById('resumeBtn');
    const mainMenuBtn = document.getElementById('mainMenuBtn');
    const gameOverlay = document.getElementById('gameOverlay');

    pauseBtn.addEventListener('click', () => {
        game.gamePaused = !game.gamePaused;
        gameOverlay.classList.toggle('hidden', !game.gamePaused);
    });

    resumeBtn.addEventListener('click', () => {
        game.gamePaused = false;
        gameOverlay.classList.add('hidden');
    });

    mainMenuBtn.addEventListener('click', () => {
        gameOverlay.classList.add('hidden');
    });
}

export function updateUI(game) {
    document.getElementById('health').textContent = `Health: ${Math.floor(game.player.health)}`;
    document.getElementById('score').textContent = `Score: ${game.player.score}`;
}