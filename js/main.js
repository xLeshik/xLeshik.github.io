import { Game } from './game.js';

window.addEventListener('DOMContentLoaded', () => {
    // Запрашиваем полноэкранный режим при клике
    function requestFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        }
    }
    
    document.addEventListener('click', requestFullscreen);
    document.addEventListener('touchstart', requestFullscreen, { once: true });

    const game = new Game();
    game.init();
});