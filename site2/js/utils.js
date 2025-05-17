export function initControls(game) {
    const state = {
        left: false,
        right: false,
        jump: false,
        shoot: false
    };

    // Обработчики для кнопок
    const setupButton = (element, control) => {
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            state[control] = true;
        });
        
        element.addEventListener('touchend', (e) => {
            e.preventDefault();
            state[control] = false;
        });
    };

    setupButton(document.querySelector('.left'), 'left');
    setupButton(document.querySelector('.right'), 'right');
    setupButton(document.querySelector('.jump'), 'jump');
    setupButton(document.querySelector('.shoot'), 'shoot');

    // Обработка стрельбы
    document.querySelector('.shoot').addEventListener('touchstart', (e) => {
        e.preventDefault();
        game.weaponSystem.shoot(game.player.direction > 0 ? 0 : Math.PI);
    });

    // Игровой цикл управления
    const updateControls = () => {
        if (state.left) game.player.move(-1);
        if (state.right) game.player.move(1);
        if (state.jump) game.player.jump();
        
        requestAnimationFrame(updateControls);
    };
    
    updateControls();
}