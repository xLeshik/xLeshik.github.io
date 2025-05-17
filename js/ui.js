(function() {
    /**
     * Инициализация пользовательского интерфейса
     * @param {Game} game - экземпляр игры
     */
    function initUI(game) {
        const pauseBtn = document.getElementById('pauseBtn');
        const resumeBtn = document.getElementById('resumeBtn');
        const gameOverlay = document.getElementById('gameOverlay');
        
        pauseBtn.addEventListener('click', function() {
            game.gamePaused = true;
            gameOverlay.classList.add('visible');
        });
        
        resumeBtn.addEventListener('click', function() {
            game.gamePaused = false;
            gameOverlay.classList.remove('visible');
        });
    }

    /**
     * Обновление пользовательского интерфейса
     * @param {Game} game - экземпляр игры
     */
    function updateUI(game) {
        document.getElementById('health').textContent = `Health: ${Math.max(0, Math.floor(game.player.health))}`;
        document.getElementById('score').textContent = `Score: ${game.player.score}`;
    }

<<<<<<< HEAD
    // Экспорт в глобальную область видимости
    window.initUI = initUI;
    window.updateUI = updateUI;
})();
=======
    resumeBtn.addEventListener('click', () => {
        game.gamePaused = false;
        gameOverlay.classList.add('hidden');
    });

    mainMenuBtn.addEventListener('click', () => {
        game.gamePaused = false;
        gameOverlay.classList.add('hidden');
        // Возврат в главное меню обрабатывается в main.js
    });
}

export function updateUI(game) {
    document.getElementById('health').textContent = `Health: ${Math.floor(game.player.health)}`;
    document.getElementById('score').textContent = `Score: ${game.player.score}`;
}
>>>>>>> 51d78df38af49148ba66bd4e87d3814938161f5e
