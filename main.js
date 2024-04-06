const gameFrame = document.querySelector('.gameframe').contentWindow;

let stylesheet = document.createElement("style");
gameFrame.document.head.appendChild(stylesheet);

let body = document.querySelector('.gameframe').contentWindow.document.body;

document.querySelector("meta[name=viewport]").setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=0');

/* ONLY COMMENT TO DISABLE*/
const VIRTUAL_JOYSTICK = true;
const JOYSTICK = true;
const HIDE_HEADER = true;
const ADBLOCK = true;
const ROOM_SEARCH = true;
const CLIPBOARD_ROOM = true;
const STORE_BUTTON = true;
const ROOM_ADMIN_SETTINGS = true;
const CUSTOM_CSS = true;
const CUSTOM_LOGO = { "url": "https://seeklogo.com/images/A/argentine-football-association-afa-2018-logo-BDF55D25F3-seeklogo.com.png", "height": "100px" };
const CUSTOM_FONT = { "name": "Inter", "type": "sans-serif", "url": "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" };

const observer = new MutationObserver(onDOMChange);

const observerConfig = { childList: true, subtree: true };
observer.observe(body, observerConfig);



function onDOMChange(mutationsList, observer) {
    mutationsList.forEach(mutation => {
        if (mutation.type === 'childList') {
            if (!getByDataHook("loader-view")) {
                if (body.querySelector('.roomlist-view')) {
                    if (!getByDataHook('search')) createSearchbar();
                    if (!getByDataHook('url-room')) createURLButton();
                    filterRooms(getByDataHook("search").value)
                    showControls(false)
                } else if (body.querySelector('.room-view') || body.querySelector('.showing-room-view')) {
                    if (!getByDataHook('store')) createStoreButton();
                    if (body.querySelector('.room-view .admin')) {
                        body.querySelectorAll('.player-list-item').forEach(roomAdminSettings);
                    }
                    showControls(false)
                } else if (body.querySelector('.game-view') && !body.querySelector('.showing-room-view')) {
                    showControls(true)
                }
            }
        }
    });
}

//<div class="inputrow"><div>Joystick</div><div>Enabled<i class="icon-ok"></i></div></div>

if (typeof ADBLOCK !== 'undefined') {
    document.querySelector('.rightbar').remove();
}

function createURLButton() {
    if (typeof CLIPBOARD_ROOM !== 'undefined') {
        let button = document.createElement("button");
        button.setAttribute("data-hook", "url-room");
        button.innerHTML = '<i class="icon-link"></i><div>Paste Room</div>';

        button.addEventListener("click", function() {
            navigator.clipboard.readText().then(cliptext => openHaxballURL(cliptext),err => console.log(err));
        });
        insertAfter(getByDataHook('join'), button)
    }
}

//Set a custom stylesheet
if (typeof CUSTOM_CSS !== 'undefined') {
    stylesheet.innerHTML += '.game-view>.top-section,.room-view{margin-top:0}body{background:#1a2125}[data-hook=leave-btn]{background:#c13535!important;margin-right:6px}.chatbox-view,.roomlist-view>.dialog>.splitter>.buttons>.file-btn,.sound-button-container,[data-hook=rec-btn],[data-hook=tvideo-lowlatency],[data-hook=tvideo-showavatars],[data-hook=tvideo-showindicators],[data-hook=tvideo-teamcol],div:has(>[data-hook=chatbgmode]),div:has(>[data-hook=chatfocusheight-range]),div:has(>[data-hook=chatopacity-range]),div:has(>[data-hook=fps]){display:none!important}.game-view>[data-hook=popups]{background-color:#1a212585!important}h1{border-bottom-color:#fec45b!important}.room-view{margin-bottom:0;height:100%}.room-view>.container{margin-top:auto!important;max-width:none;max-height:none;border-radius:0;width:100%;margin-bottom:30px}.room-view>.container>.header-btns{bottom:0;top:auto;display:flex;flex-flow:row-reverse;left:10px;right:auto}[data-hook=stadium-pick]{position:fixed!important;background:0 0!important;color:transparent!important;width:300px;height:20px}[data-hook=stadium-name]{text-decoration:underline}.room-view>.container>.controls{display:flex;align-self:center;position:absolute;bottom:0;right:10px;top:auto;margin-bottom:15px!important;z-index:1}.settings-view{width:100%;height:100%;max-height:unset;border-radius:0}.settings-view .tabcontents{width:100%;text-align:-webkit-center}.settings-view .section.selected{display:flex;width:max-content}.choose-nickname-view{flex-direction:row-reverse}.fade-out{opacity:0;transition:opacity 10s ease-out}.game-view>.bottom-section{position:absolute;bottom:0;left:0}.roomlist-view>.dialog,.view-wrapper>.dialog{max-width:calc(100vw - 2vw);max-height:calc(100vh - 2vw)}.showing-room-view>.gameplay-section{display:none}[data-hook=ok]{text-transform:uppercase}.filters::after{content:"\A\A © Vixel Dev 2024 - HaxBall Mobile for InjecThor";white-space:pre;font-style:italic}'
}

//Set a custom font to the whole site
if (typeof CUSTOM_FONT !== 'undefined') {
    let e = document.createElement("link");
    e.href = CUSTOM_FONT["url"];
    e.rel = 'stylesheet';
    gameFrame.document.head.appendChild(e);
    stylesheet.innerHTML += `* {font-family: '${CUSTOM_FONT["name"]}', ${CUSTOM_FONT["type"]} !important;}`;
}

//Set a custom logo for the change nick view
if (typeof CUSTOM_LOGO !== 'undefined') {
    stylesheet.innerHTML += `.choose-nickname-view>img {content: url("${CUSTOM_LOGO["url"]}");height:${CUSTOM_LOGO["height"]||"auto"};width:${CUSTOM_LOGO["width"]||"auto"}}`;
}

//Hide the header
if (typeof HIDE_HEADER !== 'undefined') {
    document.querySelector('.header').remove();
}

function roomAdminSettings(element) {
    if (typeof ROOM_ADMIN_SETTINGS !== 'undefined') {
        var tapedTwice = false;

        function openPlayerSettings() {
            var event = new MouseEvent("contextmenu", { bubbles: true, cancelable: true, view: window, button: 2 });
            element.dispatchEvent(event);
        }

        function doubleTouch(event) {
            if (!tapedTwice) {
                tapedTwice = true;
                setTimeout(function() { tapedTwice = false; }, 300);
                return false;
            }
            event.preventDefault();
            openPlayerSettings()
            //emulateDragAndDrop(element, gameFrame.document.querySelector("body > div:nth-child(1) > div > div.top-section > div > div > div.teams > div.player-list-view.t-blue > div.list.thin-scrollbar"), element.querySelector('[data-hook="name"]').innerHTML);
        }

        /*function() {
            const sourceElement = gameFrame.document.querySelector("body > div:nth-child(1) > div > div.top-section > div > div > div.teams > div.player-list-view.t-spec > div.list.thin-scrollbar > div");
            const targetElement = gameFrame.document.querySelector("body > div:nth-child(1) > div > div.top-section > div > div > div.teams > div.player-list-view.t-blue > div.list.thin-scrollbar")

            const dataTransfer = new DataTransfer();

            const dragStartEvent = new Event('dragstart', {
                bubbles: true,
                cancelable: true,
            });
            const dropEvent = new Event('drop', {
                bubbles: true,
                cancelable: true,
            });

            dragStartEvent.dataTransfer = dataTransfer;
            //dropEvent.dataTransfer = dataTransfer;

            sourceElement.dispatchEvent(dragStartEvent);
            targetElement.dispatchEvent(dropEvent);
        }*/
        element.addEventListener('touchstart', doubleTouch)
    }
}

//Roomlist search bar and button

function filterRooms(str) {
    if (typeof ROOM_SEARCH !== 'undefined') {
        const e = str;
        body.querySelectorAll("tr").forEach((t => {
            const o = t.querySelector('span[data-hook="name"]');
            o && !o.textContent.toLowerCase().includes(e) ? t.style.display = "none" : t.removeAttribute("style")
        }));
    }
}

function createSearchbar() {
    if (typeof ROOM_SEARCH !== 'undefined') {
        const inputContainer = document.createElement("div");
        inputContainer.className = "label-input";
        inputContainer.style.backgroundColor = "transparent";
        inputContainer.style.padding = "0";
        inputContainer.innerHTML = '<label>Search a room:</label><br><input data-hook="search" placeholder="Type here..." type="text">';

        const secondParagraph = body.querySelector("div.dialog>p:nth-child(2)");

        insertAfter(secondParagraph, inputContainer);
        const input = inputContainer.querySelector('input');
        input.addEventListener("input", function() { filterRooms(input.value) });
    }
}

function createStoreButton() {
    if (typeof STORE_BUTTON !== 'undefined') {
        let store = document.createElement("button");
        store.setAttribute("data-hook", "store");
        store.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 407 407" fill="white" style="height:0.85em; width: auto"><path d="M402 84 323 5c-3-3-7-5-12-5H17C8 0 0 8 0 17v373c0 9 8 17 17 17h373c9 0 17-8 17-17V96c0-4-2-9-5-12zm-101 80H67V39h234v125z"></path><path d="M214 148h43c3 0 6-2 6-6V60c0-4-3-6-6-6h-43c-3 0-6 2-6 6v82c0 4 3 6 6 6z"></path></svg> Store';
        insertAfter(getByDataHook('rec-btn'), store);
        store.addEventListener("click", function() {
            prefabMessage("/store")
        });
    }
}

function getByDataHook(dataHook) {
    return body.querySelector('[data-hook="' + dataHook + '"]');
}

function insertAfter(e, n) {
    e.parentNode.insertBefore(n, e.nextSibling);
}

function openHaxballURL(uri) {
    const code = uri.replace(/^https?:\/\/(www\.)?haxball\.com\/play\?c=/, "");

    if (code.length > 0) {
        window.location.replace("https://www.haxball.com/play?c=" + code);
    }
}

function prefabMessage(msg) {
    const chatbox = body.querySelector('.chatbox-view');
    const input = chatbox.querySelector('input');
    input.focus();
    input.value = msg;

    input.dispatchEvent(new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        cancelable: true,
        keyCode: 13,
        which: 13,
    }));
}

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
