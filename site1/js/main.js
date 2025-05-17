(function() {
    document.addEventListener('DOMContentLoaded', function() {
        function requestFullscreen() {
            if (document.documentElement.requestFullscreen) {
                document.documentElement.requestFullscreen();
            } else if (document.documentElement.webkitRequestFullscreen) {
                document.documentElement.webkitRequestFullscreen();
            } else if (document.documentElement.msRequestFullscreen) {
                document.documentElement.msRequestFullscreen();
            }
        }

        if (window.Telegram && window.Telegram.WebApp) {
            Telegram.WebApp.ready();
            Telegram.WebApp.expand();
            requestFullscreen();
            Telegram.WebApp.setHeaderColor('#222');
            Telegram.WebApp.setBackgroundColor('#222');
        }

        const startGameBtn = document.getElementById('startGameBtn');
        const mainMenuBtn = document.getElementById('mainMenuBtn');
        const mainMenu = document.getElementById('mainMenu');
        const gameScreen = document.getElementById('gameScreen');
        const gameOverlay = document.getElementById('gameOverlay');
        
        let gameInstance = null;

        function startNewGame() {
            mainMenu.classList.remove('visible');
            gameScreen.classList.add('visible');
            gameInstance = new Game();
            gameInstance.init();
        }

        function returnToMainMenu() {
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
        
        mainMenu.classList.add('visible');
    });
})();