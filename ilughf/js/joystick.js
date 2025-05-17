(function() {
    function initJoystick(game) {
        const joystickOuter = document.getElementById('joystickOuter');
        const joystickInner = document.getElementById('joystickInner');
        let active = false;
        let touchId = null;
        const maxDistance = 40;
        let joystickCenter = null;

        function handleStart(e) {
            if (active) return;
            
            const touch = getTouch(e);
            if (!touch) return;
            
            active = true;
            touchId = touch.identifier;
            
            joystickOuter.style.display = 'block';
            joystickOuter.style.left = touch.clientX + 'px';
            joystickOuter.style.top = touch.clientY + 'px';
            
            const rect = game.canvas.getBoundingClientRect();
            const scaleX = game.canvas.width / game.scaleFactor / rect.width;
            const scaleY = game.canvas.height / game.scaleFactor / rect.height;
            
            joystickCenter = {
                x: (touch.clientX - rect.left) * scaleX,
                y: (touch.clientY - rect.top) * scaleY
            };
            
            game.player.joystickCenter = joystickCenter;
            game.player.startAutoShooting();
            
            e.preventDefault();
        }

        function handleMove(e) {
            if (!active) return;
            
            const touch = getTouch(e, touchId);
            if (!touch) return;
            
            const outerRect = joystickOuter.getBoundingClientRect();
            const centerX = outerRect.left + outerRect.width/2;
            const centerY = outerRect.top + outerRect.height/2;
            
            let dx = touch.clientX - centerX;
            let dy = touch.clientY - centerY;
            const distance = Math.sqrt(dx*dx + dy*dy);
            
            if (distance > maxDistance) {
                dx = dx * maxDistance / distance;
                dy = dy * maxDistance / distance;
            }
            
            joystickInner.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)`;
            
            if (distance > 10) {
                game.player.direction.x = dx / maxDistance;
                game.player.direction.y = dy / maxDistance;
            } else {
                game.player.direction.x = 0;
                game.player.direction.y = 0;
            }
            
            e.preventDefault();
        }

        function handleEnd() {
            if (!active) return;
            
            active = false;
            touchId = null;
            joystickOuter.style.display = 'none';
            game.player.direction.x = 0;
            game.player.direction.y = 0;
            game.player.stopAutoShooting();
            game.player.joystickCenter = null;
        }

        function getTouch(e, id) {
            if (e.touches) {
                for (let i = 0; i < e.touches.length; i++) {
                    if (id === undefined || e.touches[i].identifier === id) {
                        return e.touches[i];
                    }
                }
                return null;
            } else {
                return e;
            }
        }

        document.addEventListener('touchstart', handleStart);
        document.addEventListener('touchmove', handleMove);
        document.addEventListener('touchend', handleEnd);
        document.addEventListener('mousedown', handleStart);
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
    }

    window.initJoystick = initJoystick;
})();