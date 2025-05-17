export function initControls(game) {
    const controls = {
        left: false,
        right: false,
        jump: false,
        shoot: false
    };

    // Touch Events
    const handleTouch = (control, state) => {
        return e => {
            e.preventDefault();
            controls[control] = state;
            if (control === 'shoot' && state) game.weaponSystem.shoot(0);
        };
    };

    document.querySelector('.left').addEventListener('touchstart', handleTouch('left', true));
    document.querySelector('.left').addEventListener('touchend', handleTouch('left', false));
    document.querySelector('.right').addEventListener('touchstart', handleTouch('right', true));
    document.querySelector('.right').addEventListener('touchend', handleTouch('right', false));
    document.querySelector('.jump').addEventListener('touchstart', handleTouch('jump', true));
    document.querySelector('.shoot').addEventListener('touchstart', handleTouch('shoot', true));

    // Keyboard Events
    const keyMap = {
        ArrowLeft: 'left',
        ArrowRight: 'right',
        ArrowUp: 'jump',
        Space: 'shoot'
    };

    window.addEventListener('keydown', e => {
        const control = keyMap[e.code];
        if (control) {
            controls[control] = true;
            e.preventDefault();
        }
    });

    window.addEventListener('keyup', e => {
        const control = keyMap[e.code];
        if (control) {
            controls[control] = false;
            e.preventDefault();
        }
    });

    // Update player movement
    setInterval(() => {
        if (controls.left) game.player.move(-1);
        if (controls.right) game.player.move(1);
        if (controls.jump) game.player.jump();
    }, 16);
}

export function saveProgress(level) {
    if (window.Telegram.WebApp.initDataUnsafe.user) {
        const userId = window.Telegram.WebApp.initDataUnsafe.user.id;
        localStorage.setItem(`progress_${userId}`, JSON.stringify({
            level,
            timestamp: Date.now()
        }));
    }
}