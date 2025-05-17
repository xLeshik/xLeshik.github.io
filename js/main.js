(function() {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Game initialized');
        
        const startGameBtn = document.getElementById('startGameBtn');
        const mainMenuBtn = document.getElementById('mainMenuBtn');
        const mainMenu = document.getElementById('mainMenu');
        const gameScreen = document.getElementById('gameScreen');
        const gameOverlay = document.getElementById('gameOverlay');
        
        let gameInstance = null;

        function startNewGame() {
            console.log('Starting new game');
            mainMenu.classList.remove('visible');
            gameScreen.classList.add('visible');
            gameInstance = new Game();
            gameInstance.init();
        }

        function returnToMainMenu() {
            console.log('Returning to main menu');
            gameOverlay.classList.remove('visible');
            gameScreen.classList.remove('visible');
            mainMenu.classList.add('visible');
            if (gameInstance) {
                gameInstance.destroy();
                gameInstance = null;
            }
        }

        startGameBtn.addEventListener('click', startNewGame);
        mainMenuBtn.addEventListener('click', returnToMainMenu);
        
        // Показываем главное меню при загрузке
        mainMenu.classList.add('visible');
        
        // Для Telegram
        if (window.Telegram && window.Telegram.WebApp) {
            Telegram.WebApp.setHeaderColor('#222');
            Telegram.WebApp.setBackgroundColor('#222');
        }
    });
})();
