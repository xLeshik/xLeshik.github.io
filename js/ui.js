(function() {
    function initUI(game) {
        const pauseBtn = document.getElementById('pauseBtn');
        const resumeBtn = document.getElementById('resumeBtn');
        const gameOverlay = document.getElementById('gameOverlay');
        
        pauseBtn.addEventListener('click', function() {
            game.gamePaused = true;
            gameOverlay.classList.add('visible');
            game.player.stopAutoShooting();
        });
        
        resumeBtn.addEventListener('click', function() {
            game.gamePaused = false;
            gameOverlay.classList.remove('visible');
            if (game.player.joystickCenter) {
                game.player.startAutoShooting();
            }
        });
    }

    function updateUI(game) {
        document.getElementById('health').textContent = `Health: ${Math.max(0, Math.floor(game.player.health))}`;
        document.getElementById('score').textContent = `Score: ${game.player.score}`;
    }

    window.initUI = initUI;
    window.updateUI = updateUI;
})();