if (typeof VIRTUAL_JOYSTICK !== 'undefined') {
    const joystick = document.createElement("div");
    const joystickPanel = document.createElement("div");
    const kickPanel = document.createElement("div");
    const stick = document.createElement("div");

    joystick.setAttribute("id", "joystick");
    joystickPanel.setAttribute("id", "joystick-panel");
    kickPanel.setAttribute("id", "kick-panel");
    stick.setAttribute("id", "stick");
    joystick.style.visibility = 'hidden';

    document.body.appendChild(kickPanel);
    document.body.appendChild(joystickPanel);
    joystickPanel.appendChild(joystick)
    joystick.appendChild(stick);

    let joystickStylesheet = document.createElement("style");
    joystickStylesheet.innerHTML = `:root {
                                        --joystick-size: 40vh;
                                        --joystick-opacity: 1
                                    }

                                    #joystick,
                                    #stick {
                                        touch-action: none;
                                        background-color:#c2c2c255;
                                        box-shadow:6px 6px 10px 0 #a5abb133,-5px -5px 9px 0 #a5abb133;
                                        color:#dedede55;
                                        font-weight:bolder;
                                        font-size:1.5rem;
                                        border-radius: 50%;
                                    }

                                    #joystick {
                                        width: var(--joystick-size);
                                        height: var(--joystick-size);
                                        opacity: var(--joystick-opacity);
                                        position: absolute;
                                        left: 0;
                                        bottom: 0;
                                    }

                                    #joystick-panel {
                                        width: 35%;
                                        height: 70%;
                                        position: absolute;
                                        left: 0;
                                        bottom: 0;
                                        display:none;
                                    }

                                    #kick-panel {
                                        width: 35%;
                                        height: 70%;
                                        position: absolute;
                                        right: 0;
                                        bottom: 0;
                                        display:none;
                                    }

                                    #stick {
                                        width: calc(var(--joystick-size) * .45);
                                        height: calc(var(--joystick-size) * .45);
                                        position: absolute;
                                        top: 50%;
                                        left: 50%;
                                        transform: translate(-50%, -50%)
                                    }`;
    document.head.appendChild(joystickStylesheet);

    let isDragging = false;

    let joystickAngle, joystickForce

    const frequency = 40;
    let dutyCicle = { "W": 0, "A": 0, "S": 0, "D": 0 }

    const period = 1 / frequency * 1000;

    let activeTime = period * dutyCicle;
    let inactiveTime = period - activeTime;

    joystickPanel.addEventListener('mousedown', startDrag);
    joystickPanel.addEventListener('touchstart', startDrag);

    joystickPanel.addEventListener('mouseup', endDrag);
    joystickPanel.addEventListener('touchend', endDrag);

    joystickPanel.addEventListener('mousemove', moveStick);
    joystickPanel.addEventListener('touchmove', moveStick);

    kickPanel.addEventListener('mousedown', startKick);
    kickPanel.addEventListener('touchstart', startKick);

    kickPanel.addEventListener('mouseup', endKick);
    kickPanel.addEventListener('touchend', endKick);

    function startDrag(e) {
        isDragging = true;
        const joystickRect = joystick.getBoundingClientRect();

        let x = e.touches[0].clientX - joystickRect.left;
        let y = e.touches[0].clientY - joystickRect.top;

        const centerX = joystick.offsetWidth / 2;
        const centerY = joystick.offsetHeight / 2;

        x -= centerX;
        y -= centerY;

        joystick.style.transform = `translate(${x}px,${y}px)`;
        joystick.style.visibility = 'visible';
        e.preventDefault();
    }

    function endDrag(e) {
        isDragging = false;
        joystick.style.transform = '';
        joystick.style.visibility = 'hidden';
        resetStick();
    }

    function moveStick(e) {
        if (!isDragging) return;

        const joystickRect = joystick.getBoundingClientRect();
        const stickRect = stick.getBoundingClientRect();

        let x = e.clientX - joystickRect.left;
        let y = e.clientY - joystickRect.top;

        if (e.type === 'touchmove') {
            x = e.touches[0].clientX - joystickRect.left;
            y = e.touches[0].clientY - joystickRect.top;
        }

        const centerX = joystick.offsetWidth / 2;
        const centerY = joystick.offsetHeight / 2;

        let distanceX = (x - centerX) / (joystick.offsetWidth / 2);
        let distanceY = (y - centerY) / (joystick.offsetHeight / 2);

        // Clipping between -1 and 1
        distanceX = Math.min(1, Math.max(-1, distanceX));
        distanceY = Math.min(1, Math.max(-1, distanceY));

        let angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
        let distance = Math.min(joystick.offsetWidth / 2, Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)));

        stick.style.transition = 'none';
        stick.style.transform = `translate(${distance * Math.cos(angle * (Math.PI / 180))-centerX/2}px, ${distance * Math.sin(angle * (Math.PI / 180))-centerY/2}px)`;

        dutyCicle["D"] = distanceX
        dutyCicle["A"] = distanceX * -1
        dutyCicle["S"] = distanceY
        dutyCicle["W"] = distanceY * -1
    }

    function resetStick() {
        stick.style.transition = 'transform 0.1s ease-out';
        stick.style.transform = 'translate(-50%, -50%)';
        joystickForce = 0
        dutyCicle["W"] = 0
        dutyCicle["A"] = 0
        dutyCicle["S"] = 0
        dutyCicle["D"] = 0
    }

    function joystickTick(key) {
        activeTime = period * dutyCicle[key];
        inactiveTime = period - activeTime;

        if (dutyCicle[key] > 0.1) {
            emulateKey("Key" + [key], true)
        }

        setTimeout(() => {
            if (dutyCicle[key] < 0.85) {
                emulateKey("Key" + [key], false)
            }
            setTimeout(function() { joystickTick(key) }, inactiveTime);
        }, activeTime);
    }

    function emulateKey(key, type) {
        if (type) {
            gameFrame.document.dispatchEvent(new KeyboardEvent("keydown", { code: key }));
        } else {
            gameFrame.document.dispatchEvent(new KeyboardEvent("keyup", { code: key }));
        }
    }

    // Inicia la emulación
    joystickTick("W");
    joystickTick("A");
    joystickTick("S");
    joystickTick("D");

    function startKick(){
        emulateKey("KeyX", true)
    }

    function endKick(){
        emulateKey("KeyX", false)
    }

    function showControls(v) {
        if (v) {
            joystickPanel.style.display = "block";
            kickPanel.style.display = "block";
        } else {
            joystickPanel.style.display = "none";
            kickPanel.style.display = "none";
        }
    }
}