export function initJoystick(game) {
    const joystickOuter = document.getElementById('joystickOuter');
    const joystickInner = document.getElementById('joystickInner');
    let joystickActive = false;
    let joystickCenter = { x: 0, y: 0 };
    let joystickPosition = { x: 0, y: 0 };

    const handleTouchStart = (e) => {
        if (game.gamePaused) return;
        const touch = e.touches[0];
        joystickCenter = { x: touch.clientX, y: touch.clientY };
        joystickPosition = { ...joystickCenter };
        
        joystickOuter.style.display = 'block';
        joystickOuter.style.left = `${joystickCenter.x}px`;
        joystickOuter.style.top = `${joystickCenter.y}px`;
        joystickActive = true;
    };

    const handleTouchMove = (e) => {
        if (!joystickActive || game.gamePaused) return;
        const touch = Array.from(e.touches).find(t => 
            t.clientX === joystickPosition.x && 
            t.clientY === joystickPosition.y
        );
        if (!touch) return;

        const dx = touch.clientX - joystickCenter.x;
        const dy = touch.clientY - joystickCenter.y;
        const distance = Math.hypot(dx, dy);
        const maxDist = 50;

        joystickPosition = distance > maxDist ? {
            x: joystickCenter.x + (dx / distance) * maxDist,
            y: joystickCenter.y + (dy / distance) * maxDist
        } : { x: touch.clientX, y: touch.clientY };

        joystickInner.style.left = `${joystickPosition.x - joystickCenter.x}px`;
        joystickInner.style.top = `${joystickPosition.y - joystickCenter.y}px`;

        const speed = game.player.speed * (distance / 50);
        game.player.x += (dx / distance) * speed;
        game.player.y += (dy / distance) * speed;
    };

    const handleTouchEnd = () => {
        joystickActive = false;
        joystickOuter.style.display = 'none';
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
}