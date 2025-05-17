import { Game } from './game.js';

class TelegramApp {
    static init() {
        if (window.Telegram?.WebApp) {
            Telegram.WebApp.expand();
            Telegram.WebApp.enableClosingConfirmation();
            return {
                platform: Telegram.WebApp.platform,
                themeParams: Telegram.WebApp.themeParams,
                viewport: Telegram.WebApp.viewportHeight
            };
        }
        return null;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const tgData = TelegramApp.init();
    const game = new Game(!!tgData);
    game.init(tgData);
});