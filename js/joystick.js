export function initJoystick(game) {
    const joystickOuter = document.getElementById('joystickOuter');
    const joystickInner = document.getElementById('joystickInner');
    let joystickActive = false;
    let joystickCenter = { x: 0, y: 0 };
    let joystickPosition = { x: 0, y: 0 };
    let activeTouchId = null;
    let lastDirection = { x: 0, y: 0 };

    // Оптимизация для предотвращения скролла страницы
    document.addEventListener('touchmove', e => {
        if (joystickActive) e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchstart', e => {
        if (game.gamePaused) return;
        
        // Игнорируем касания в верхней зоне (где кнопки UI)
        if (e.touches[0].clientY < 100) return;
        
        const touch = e.touches[0];
        activeTouchId = touch.identifier;
        joystickCenter = { x: touch.clientX, y: touch.clientY };
        joystickPosition = { ...joystickCenter };
        
        joystickOuter.style.display = 'block';
        joystickOuter.style.left = `${joystickCenter.x}px`;
        joystickOuter.style.top = `${joystickCenter.y}px`;
        joystickActive = true;
    });

    document.addEventListener('touchmove', e => {
        if (!joystickActive || game.gamePaused) return;
        
        // Находим наш касание по идентификатору
        const touch = Array.from(e.touches).find(t => t.identifier === activeTouchId);
        if (!touch) return;

        const dx = touch.clientX - joystickCenter.x;
        const dy = touch.clientY - joystickCenter.y;
        const distance = Math.hypot(dx, dy);
        const maxDist = 50;

        // Ограничиваем радиус джойстика
        const angle = Math.atan2(dy, dx);
        const effectiveDistance = Math.min(distance, maxDist);
        
        joystickPosition = {
            x: joystickCenter.x + Math.cos(angle) * effectiveDistance,
            y: joystickCenter.y + Math.sin(angle) * effectiveDistance
        };

        joystickInner.style.left = `${joystickPosition.x - joystickCenter.x}px`;
        joystickInner.style.top = `${joystickPosition.y - joystickCenter.y}px`;

        // Сохраняем направление для плавного движения
        lastDirection = {
            x: dx / distance,
            y: dy / distance
        };
    });

    document.addEventListener('touchend', (e) => {
        if (e.changedTouches[0].identifier === activeTouchId) {
            joystickActive = false;
            joystickOuter.style.display = 'none';
            activeTouchId = null;
            lastDirection = { x: 0, y: 0 };
        }
    });

    // Обновляем движение игрока в игровом цикле
    game.player.updateWithJoystick = function() {
        if (joystickActive) {
            this.x += lastDirection.x * this.speed;
            this.y += lastDirection.y * this.speed;
            
            // Ограничиваем игрока в пределах canvas
            this.x = Math.max(this.size, Math.min(this.x, game.canvas.width/game.scaleFactor - this.size));
            this.y = Math.max(this.size, Math.min(this.y, game.canvas.height/game.scaleFactor - this.size));
        }
    };
}