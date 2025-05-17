import { Game } from './game.js';

window.addEventListener('DOMContentLoaded', () => {
    const startGameBtn = document.getElementById('startGameBtn');
    const mainMenuBtn = document.getElementById('mainMenuBtn');
    const mainMenu = document.getElementById('mainMenu');
    const gameScreen = document.getElementById('gameScreen');
    
    let game;

    function startGame() {
        mainMenu.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        
        game = new Game();
        game.init();
    }

    function returnToMainMenu() {
        document.getElementById('gameOverlay').classList.add('hidden');
        gameScreen.classList.add('hidden');
        mainMenu.classList.remove('hidden');
        
        if (game) {
            game.destroy();
            game = null;
        }
    }

    startGameBtn.addEventListener('click', startGame);
    mainMenuBtn.addEventListener('click', returnToMainMenu);

    // Fullscreen mode
    function requestFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        }
    }
    
    document.addEventListener('click', requestFullscreen);
});