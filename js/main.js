import { Game } from './game.js';

document.addEventListener('DOMContentLoaded', () => {
    const startGameBtn = document.getElementById('startGameBtn');
    const mainMenuBtn = document.getElementById('mainMenuBtn');
    const mainMenu = document.getElementById('mainMenu');
    const gameScreen = document.getElementById('gameScreen');
    const gameOverlay = document.getElementById('gameOverlay');
    
    let gameInstance = null;

    function startNewGame() {
        // Скрываем главное меню и показываем игровой экран
        mainMenu.classList.remove('visible');
        gameScreen.classList.add('visible');
        
        // Создаем новую игру
        gameInstance = new Game();
        gameInstance.init();
    }

    function returnToMainMenu() {
        // Скрываем overlay и игровой экран
        gameOverlay.classList.remove('visible');
        gameScreen.classList.remove('visible');
        
        // Показываем главное меню
        mainMenu.classList.add('visible');
        
        // Уничтожаем текущую игру
        if (gameInstance) {
            gameInstance.destroy();
            gameInstance = null;
        }
    }

    // Обработчики событий
    startGameBtn.addEventListener('click', startNewGame);
    mainMenuBtn.addEventListener('click', returnToMainMenu);

    // Показываем главное меню при загрузке
    mainMenu.classList.add('visible');
});