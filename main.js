const gameFrame = document.querySelector('.gameframe').contentWindow;

let stylesheet = document.createElement("style");
gameFrame.document.head.appendChild(stylesheet);

let body = document.querySelector('.gameframe').contentWindow.document.body;

document.querySelector("meta[name=viewport]").setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=0');
var metaTag = document.createElement('meta');

metaTag.setAttribute('http-equiv', 'X-UA-Compatible');
metaTag.setAttribute('content', 'ie=edge');
gameFrame.document.head.appendChild(metaTag);

/* ONLY COMMENT TO DISABLE*/
const VIRTUAL_JOYSTICK = true;
const JOYSTICK = true;
const HIDE_HEADER = true;
const ADBLOCK = true;
const ROOM_SEARCH = true;
const CLIPBOARD_ROOM = true;
const STORE_BUTTON = true;
const ROOM_ADMIN_SETTINGS = true;
const SHIRTS_BUTTON = true;
const PASSWORD_BUTTON = true;
const CUSTOM_CSS = "https://raw.githubusercontent.com/VixelDevelopment/HaxballMobile/main/custom.css";
const CUSTOM_LOGO = { "url": "https://seeklogo.com/images/A/argentine-football-association-afa-2018-logo-BDF55D25F3-seeklogo.com.png", "height": "100px" };
const CUSTOM_FONT = { "name": "Inter", "type": "sans-serif", "url": "https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" };

const observer = new MutationObserver(onDOMChange);

const observerConfig = { childList: true, subtree: true };
observer.observe(body, observerConfig);

function onDOMChange(mutationsList, observer) {
    if (!getByDataHook("loader-view")) {
        if (body.querySelector('.roomlist-view')) {
            if (!getByDataHook('search')) createSearchbar();
            if (!getByDataHook('url-room')) createURLButton();
            filterRooms(getByDataHook("search").value)
            showControls(false)
        } else if (body.querySelector('.settings-view')) {
            if (!getByDataHook('inputopacity-value')) {
                createInputSettings()
                showControls(false)
            }
        } else if (body.querySelector('.room-view') || body.querySelector('.showing-room-view')) {
            if (!getByDataHook('store')) createStoreButton();
            if (body.querySelector('.room-view .admin')) {
                body.querySelectorAll('.player-list-item').forEach(roomAdminSettings);
                if (!getByDataHook('shirt-btn')) createShirtButtons();
                if (!getByDataHook('password-btn')) createPasswordButton();
            }
            handleFPSText()
            showControls(false)
        } else if (body.querySelector('.game-view') && !body.querySelector('.showing-room-view') && !body.querySelector('.settings-view')) {
            showControls(true)
            handleFPSText()
        }
    }
}

if (typeof ADBLOCK !== 'undefined') {
    document.querySelector('.rightbar').remove();
}

function showChatInput(focused = true) {
    const inputContainer = body.querySelector('.chatbox-view').querySelector('.input');
    const input = inputContainer.querySelector('input')

    inputContainer.style = 'display: block !important;';

    if (focused) {
        input.focus()
    }
    input.addEventListener('blur', hideChatInput);
}

function hideChatInput() {
    const inputContainer = body.querySelector('.chatbox-view').querySelector('.input');
    const input = inputContainer.querySelector('input')
    inputContainer.style = '';
}

const chatJoystick = document.createElement("div");
const chatJoystickPanel = document.createElement("div");
const chatStick = document.createElement("div");
const chatJoystickLabel = document.createElement("p");

let chatSelectedMessage = ["",0];

chatJoystick.setAttribute("id", "chat-joystick");
chatJoystickPanel.setAttribute("id", "chat-joystick-panel");
chatStick.setAttribute("id", "chat-stick");
chatStick.innerHTML = '<svg id="chat-svg" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path d="M5.8 12.2V6H2C.9 6 0 6.9 0 8v6c0 1.1.9 2 2 2h1v3l3-3h5c1.1 0 2-.9 2-2v-1.82a.943.943 0 0 1-.2.021h-7zM18 1H9c-1.1 0-2 .9-2 2v8h7l3 3v-3h1c1.1 0 2-.899 2-2V3c0-1.1-.9-2-2-2"/></svg>';

chatJoystickLabel.setAttribute("id", "chat-joystick-label");
chatJoystickLabel.innerText = "GG!"

document.body.appendChild(chatJoystickPanel);
chatJoystickPanel.appendChild(chatJoystick)
chatJoystick.appendChild(chatJoystickLabel);
chatJoystick.appendChild(chatStick);

let chatJoystickStylesheet = document.createElement("style");
chatJoystickStylesheet.innerHTML = `#chat-joystick,
                                    #chat-stick {
                                        /*touch-action: none;*/
                                        color:#dedede55;
                                        font-weight:bolder;
                                        font-size:1.5rem;
                                        border-radius: 50%;
                                    }

                                    #chat-joystick {
                                        width: 100px;
                                        height: 100px;
                                        opacity: 1;
                                        position: absolute;
                                        right: 0;
                                        top: 0;
                                        margin: 30px
                                    }

                                    #chat-joystick-panel {
                                        width: min-content;
                                        height: min-content;
                                        position: absolute;
                                        right: 0;
                                        top: 35px;
                                        display: none;
                                    }
                                    
                                    #chat-stick {
                                        width: calc(100px * .45);
                                        height: calc(100px * .45);
                                        position: absolute;
                                        top: 50%;
                                        left: 50%;
                                        transform: translate(-50%, -50%);
                                        background-color:#244967;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                    }

                                    #chat-svg{
                                        fill: #FFFFFF;
                                    }

                                    #chat-joystick-label{
                                            color: white;
                                            position: absolute;
                                            text-align: center;
                                            top: 50%;
                                            left: 50%;
                                            transform: translate(-50%, -50%);
                                            font-size: 0.8em;
                                            font-family: 'Inter';
                                            font-weight: normal;
                                    }


                                    `;

let chatJoystickRootStylesheet = document.createElement("style");
document.head.appendChild(chatJoystickStylesheet);
document.head.appendChild(chatJoystickRootStylesheet);

let isDraggingChatJoystick = false;

chatJoystickPanel.addEventListener('mousedown', startDrag);
chatJoystickPanel.addEventListener('touchstart', startDrag);
chatJoystickPanel.addEventListener('touchstart', chatToubleTouch);

chatJoystickPanel.addEventListener('mouseup', endDrag);
chatJoystickPanel.addEventListener('touchend', endDrag);

chatJoystickPanel.addEventListener('mousemove', moveStick);
chatJoystickPanel.addEventListener('touchmove', moveStick);

resetStick()

var chatTapedTwice = false;

function chatToubleTouch(event) {
    if (!chatTapedTwice) {
        chatTapedTwice = true;
        setTimeout(function() { chatTapedTwice = false; }, 300);
        return false;
    }
    event.preventDefault();
    showChatInput()
}

function startDrag(e) {
    isDraggingChatJoystick = true;
    e.preventDefault();
}

function endDrag(e) {
    isDraggingChatJoystick = false;

    if(chatSelectedMessage[1] > 30){
        prefabMessage(chatSelectedMessage[0])
    }
    resetStick();
}

function moveStick(e) {
    if (!isDraggingChatJoystick) return;

    const chatJoystickRect = chatJoystick.getBoundingClientRect();
    const chatStickRect = chatStick.getBoundingClientRect();

    let x = e.clientX - chatJoystickRect.left;
    let y = e.clientY - chatJoystickRect.top;

    if (e.type === 'touchmove') {
        x = e.touches[0].clientX - chatJoystickRect.left;
        y = e.touches[0].clientY - chatJoystickRect.top;
    }

    const centerX = chatJoystick.offsetWidth / 2;
    const centerY = chatJoystick.offsetHeight / 2;

    let distanceX = (x - centerX) / (chatJoystick.offsetWidth / 2);
    let distanceY = (y - centerY) / (chatJoystick.offsetHeight / 2);

    // Clipping between -1 and 1
    distanceX = Math.min(1, Math.max(-1, distanceX));
    distanceY = Math.min(1, Math.max(-1, distanceY));

    let angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
    let distance = Math.min(chatJoystick.offsetWidth / 2, Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)));

    chatStick.style.transition = 'none';
    chatStick.style.transform = `translate(${distance * Math.cos(angle * (Math.PI / 180))-centerX/2}px, ${distance * Math.sin(angle * (Math.PI / 180))-centerY/2}px)`;

    const offset = 25
    //let angleDegrees = parseInt(Math.atan2(distanceY, distanceX) * 180 / Math.PI);

    if (distance > 30) {
        if (angle > 0 - offset && angle < 0 + offset) {
            //Right
            chatSelectedMessage[0] = "GG!"
        } else if (angle > 90 - offset && angle < 90 + offset) {
            //Up
            chatSelectedMessage[0] = "Defending"
        } else if (angle > (-90) - offset && angle < (-90) + offset) {
            //Down
            chatSelectedMessage[0] = "Pass to me!"
        } else if (angle < (-180) + offset || angle > 180 - offset) {
            //Left
            chatSelectedMessage[0] = "Teamwork!"
        }
        chatSelectedMessage[1] = distance
    }
    else{
        chatSelectedMessage[0] = ""
        chatSelectedMessage[1] = 0
    }
    
    chatJoystickLabel.innerText = chatSelectedMessage[0]
    chatJoystickLabel.style.opacity = distance / 50
}

function resetStick() {
    chatStick.style.transition = 'transform 0.4s ease-out';
    chatStick.style.transform = 'translate(-50%, -50%)';
    chatSelectedMessage[0] = ""
    chatSelectedMessage[1] = 0
    chatJoystickLabel.style.opacity = '0'
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
    fetch(CUSTOM_CSS)
            .then(response => response.text())
            .then(cssText => {
                stylesheet.innerHTML += cssText;
            })
            .catch(error => {
                console.error('Error fetching CSS:', error);
            });
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

function createPasswordButton() {
    if (typeof PASSWORD_BUTTON !== 'undefined') {
        let button = document.createElement("button");
        button.setAttribute("data-hook", "password-btn");
        button.style.fontSize = '1em'
        button.style.padding = '5px 0'
        button.classList.add("admin-only");
        let icon = document.createElement("i");
        icon.classList.add('icon-lock')
        button.appendChild(icon)
        button.innerHTML += 'Password'
        insertAfter(getByDataHook('reset-all-btn'), button);
        button.addEventListener("click", function() {
            createPasswordPopup()
        });
    }
}

function createPasswordPopup() {
    // Crear el contenedor principal con el atributo de datos y estilo específico
    const popupsContainer = document.createElement("div");
    popupsContainer.setAttribute("data-hook", "popups");
    popupsContainer.style.display = "flex";

    // Crear el div de diálogo con la clase específica
    const dialogDiv = document.createElement("div");
    dialogDiv.classList.add("dialog", "basic-dialog", "admin-only");

    // Crear el encabezado h1 del diálogo
    const headerH1 = document.createElement("h1");
    headerH1.textContent = "Change password";

    // Crear el párrafo de explicación del diálogo
    const paragraphP = document.createElement("p");
    paragraphP.textContent = "Enter the new password or leave the input empty to set the room as public";

    // Crear el input para ingresar la contraseña con el atributo de datos
    const passInput = document.createElement("input");
    passInput.setAttribute("data-hook", "pass-input");
    passInput.setAttribute("type", "text");
    passInput.setAttribute("maxlength", "30");
    passInput.setAttribute("placeholder", "No password");

    // Crear el contenedor de botones
    const buttonsDiv = document.createElement("div");
    buttonsDiv.classList.add("buttons");

    // Crear el botón para cerrar el diálogo
    const closeButton = document.createElement("button");
    closeButton.setAttribute("data-hook", "close-pass");
    closeButton.textContent = "Close";

    // Crear el botón para establecer la contraseña
    const setButton = document.createElement("button");
    setButton.setAttribute("data-hook", "set-pass");
    setButton.textContent = "Set password";

    // Adjuntar elementos hijos al contenedor de botones
    buttonsDiv.appendChild(closeButton);
    buttonsDiv.appendChild(setButton);

    // Adjuntar elementos hijos al div de diálogo
    dialogDiv.appendChild(headerH1);
    dialogDiv.appendChild(paragraphP);
    dialogDiv.appendChild(passInput);
    dialogDiv.appendChild(buttonsDiv);

    // Agregar el contenedor principal al documento
    let popups = getByDataHook('popups')
    getByDataHook('popups').appendChild(dialogDiv);
    popups.style.display = 'flex';

    passInput.onkeydown = function(e) { e.stopPropagation(); }
    closeButton.onclick = function() { dialogDiv.remove();
        popups.style.display = 'none' }

    setButton.onclick = function() {
        if (passInput.value == '') {
            prefabMessage("/clear_password")
        } else {
            prefabMessage("/set_password " + passInput.value)
        }

        dialogDiv.remove();
        popups.style.display = 'none'
    }
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

const blueShirts = {
    "arg": "0 000000 FFFFFF 0D8ED9 FFFFFF",
    "fra": "0 E8B320 0F0D4D",
    "gbr": "90 151AA1 151AA1 FFFFFF FFFFFF",
    "ita": "180 D4BA91 2D4E9D",
    "hvr": "0 3A33FF EBE6FF DBDBDB FFFFFF",
    "jpn": "30 F2F2F2 1930FF 0066FF 101FA3",
}

const redShirts = {
    "bel": "0 000000 FF150D BD100A FF150D",
    "bra": "0 167010 FFFF26 F7FF19 FFFF26",
    "prt": "-60 FFCB21 0D3808 FF0D0D",
    "nld": "0 0D0D40 FF9124 FFAE0D FF9124",
    "esp": "0 EBC015 BF0000",
    "mar": "FFFFFF 046317 FF0000 FF0000"
}

function getNextShirt(color) {
    const shirts = color === 'red' ? redShirts : blueShirts;
    const countries = Object.keys(shirts);
    getNextShirt.currentIndex = getNextShirt.currentIndex || {};
    getNextShirt.currentIndex[color] = getNextShirt.currentIndex[color] || 0;
    const currentIndex = getNextShirt.currentIndex[color];
    getNextShirt.currentIndex[color] = (currentIndex + 1) % countries.length;
    return shirts[countries[currentIndex]];
}

function pickShirt(e) {
    if (typeof SHIRTS_BUTTON !== 'undefined') {
        const color = e.target.hasAttribute("red") ? 'red' : 'blue';
        const shirt = getNextShirt(color);
        prefabMessage(`/colors ${color} ${shirt}`);
    }
}

function createShirtButtons() {
    const redShirtButton = document.createElement("button");
    redShirtButton.setAttribute("data-hook", "shirt-btn");
    redShirtButton.classList.add("admin-only");
    redShirtButton.setAttribute("red", "");
    redShirtButton.onclick = pickShirt

    const blueShirtButton = document.createElement("button");
    blueShirtButton.setAttribute("data-hook", "shirt-btn");
    blueShirtButton.classList.add("admin-only");
    blueShirtButton.setAttribute("blue", "");
    blueShirtButton.onclick = pickShirt

    body.querySelector('.t-red > .buttons').appendChild(redShirtButton);
    body.querySelector('.t-blue > .buttons').appendChild(blueShirtButton);
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

function handleFPSText() {
    const showFPS = localStorage.getItem("show_fps") || 1

    if (showFPS == 1) {
        body.querySelector(".stats-view").style = ''
    } else {
        body.querySelector(".stats-view").style = 'opacity: 0 !important;'
    }

    body.querySelector(".stats-view").ontouchstart = function(e) {
        const i = localStorage.getItem("show_fps") || 1
        if (i == 1) {
            localStorage.setItem("show_fps", 0)
            e.target.style = 'opacity: 0 !important;'
        } else {
            localStorage.setItem("show_fps", 1)
            e.target.style = ''
        }
    }
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
    joystickStylesheet.innerHTML = `#joystick,
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
                                        left: var(--joystick-margin);
                                        bottom: var(--joystick-margin);
                                    }

                                    #joystick-panel {
                                        width: 45%;
                                        height: 70%;
                                        position: absolute;
                                        left: 0;
                                        bottom: 0;
                                        display:none;
                                    }

                                    #kick-panel {
                                        width: 45%;
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

    let joystickRootStylesheet = document.createElement("style");
    document.head.appendChild(joystickStylesheet);
    document.head.appendChild(joystickRootStylesheet);

    let isDragging = false;

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

        const storedFixed = localStorage.getItem('input_fixed') || 0

        if (storedFixed == 0) {
            const joystickRect = joystick.getBoundingClientRect();

            let x = e.touches[0].clientX - joystickRect.left;
            let y = e.touches[0].clientY - joystickRect.top;

            const centerX = joystick.offsetWidth / 2;
            const centerY = joystick.offsetHeight / 2;

            x -= centerX;
            y -= centerY;

            joystick.style.transform = `translate(${x}px,${y}px)`;
        }
        joystick.style.visibility = 'visible';
        e.preventDefault();
    }

    function endDrag(e) {
        isDragging = false;

        const storedFixed = localStorage.getItem('input_fixed') || 0

        if (storedFixed == 0) {
            joystick.style.transform = '';
            joystick.style.visibility = 'hidden';
        }
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

    joystickTick("W");
    joystickTick("A");
    joystickTick("S");
    joystickTick("D");

    function startKick() {
        emulateKey("KeyX", true)
    }

    function endKick() {
        emulateKey("KeyX", false)
    }

    function showControls(v) {
        if (typeof VIRTUAL_JOYSTICK !== 'undefined') {
            if (v) {
                const storedFixed = localStorage.getItem('input_fixed') || 0
                joystickPanel.style.display = "block";
                kickPanel.style.display = "block";
                document.body.querySelector('#chat-joystick-panel').style.display = 'block'

                if (storedFixed == 1) {
                    joystick.style.transform = '';
                    joystick.style.visibility = 'visible';
                }
                reloadJoystickRoot()
            } else {
                joystickPanel.style.display = "none";
                kickPanel.style.display = "none";
                joystick.style.transform = '';
                joystick.style.visibility = 'hidden';
                document.body.querySelector('#chat-joystick-panel').style.display = 'none'
            }
        }
    }

    function createInputSettings() {
        const inputSection = getByDataHook('inputsec');
        const storedOpacity = localStorage.getItem('input_opacity') || 0.8
        const storedSize = localStorage.getItem('input_size') || 40
        const storedFixed = localStorage.getItem('input_fixed') || 0
        const storedMargin = localStorage.getItem('input_margin') || 10

        const opacityRow = document.createElement("div");
        opacityRow.classList.add("option-row");
        const opacityName = document.createElement("div");
        opacityName.setAttribute("style", "margin-right: 10px; flex: 1; max-width: 115px;");
        opacityName.textContent = "Joystick Opacity";
        const opacityText = document.createElement("div");
        opacityText.setAttribute("style", "width: 40px");
        opacityText.setAttribute("data-hook", "inputopacity-value");
        const opacitySlider = document.createElement("input");
        opacitySlider.classList.add("slider");
        opacitySlider.setAttribute("type", "range");
        opacitySlider.setAttribute("min", "0.25");
        opacitySlider.setAttribute("max", "1");
        opacitySlider.setAttribute("step", "0.01");
        opacitySlider.setAttribute("data-hook", "inputopacity-range");
        opacitySlider.onchange = inputOpacityChange
        opacitySlider.oninput = inputOpacityChange
        opacitySlider.value = storedOpacity
        opacityText.innerText = opacitySlider.value
        opacityRow.appendChild(opacityName);
        opacityRow.appendChild(opacityText);
        opacityRow.appendChild(opacitySlider);

        const sizeRow = document.createElement("div");
        sizeRow.classList.add("option-row");
        const sizeName = document.createElement("div");
        sizeName.setAttribute("style", "margin-right: 10px; flex: 1; max-width: 115px;");
        sizeName.textContent = "Joystick Size";
        const sizeText = document.createElement("div");
        sizeText.setAttribute("style", "width: 40px");
        sizeText.setAttribute("data-hook", "inputsize-value");
        const sizeSlider = document.createElement("input");
        sizeSlider.classList.add("slider");
        sizeSlider.setAttribute("type", "range");
        sizeSlider.setAttribute("min", "30");
        sizeSlider.setAttribute("max", "50");
        sizeSlider.setAttribute("step", "1");
        sizeSlider.setAttribute("data-hook", "inputsize-range");
        sizeSlider.onchange = inputSizeChange
        sizeSlider.oninput = inputSizeChange
        sizeSlider.value = storedSize
        sizeText.innerText = sizeSlider.value
        sizeRow.appendChild(sizeName);
        sizeRow.appendChild(sizeText);
        sizeRow.appendChild(sizeSlider);

        const marginRow = document.createElement("div");
        marginRow.classList.add("option-row");
        const marginName = document.createElement("div");
        marginName.setAttribute("style", "margin-right: 10px; flex: 1; max-width: 115px;");
        marginName.textContent = "Joystick Margin";
        const marginText = document.createElement("div");
        marginText.setAttribute("style", "width: 40px");
        marginText.setAttribute("data-hook", "inputmargin-value");
        const marginSlider = document.createElement("input");
        marginSlider.classList.add("slider");
        marginSlider.setAttribute("type", "range");
        marginSlider.setAttribute("min", "0");
        marginSlider.setAttribute("max", "35");
        marginSlider.setAttribute("step", "1");
        marginSlider.setAttribute("data-hook", "inputmargin-range");
        marginSlider.onchange = inputMarginChange
        marginSlider.oninput = inputMarginChange
        marginSlider.value = storedMargin
        marginText.innerText = marginSlider.value
        marginRow.appendChild(marginName);
        marginRow.appendChild(marginText);
        marginRow.appendChild(marginSlider);

        const fixedRow = document.createElement("div");
        fixedRow.classList.add("toggle");
        const fixedIcon = document.createElement("i");
        if (storedFixed == 1) {
            fixedIcon.classList.add("icon-ok");
            marginRow.style.display = 'flex'
        } else {
            fixedIcon.classList.add("icon-cancel");
            marginRow.style.display = 'none'
        }
        fixedRow.appendChild(fixedIcon);
        fixedRow.innerHTML += "Fixed joystick"
        fixedRow.onclick = inputFixedChange

        inputSection.appendChild(fixedRow);
        inputSection.appendChild(marginRow);
        
        inputSection.appendChild(sizeRow);
        inputSection.appendChild(opacityRow);
        reloadJoystickRoot();
    }

    function inputOpacityChange(e) {
        localStorage.setItem("input_opacity", e.target.value)
        e.target.parentNode.children[1].innerText = e.target.value
        if (e.type == "input") {
            joystickPanel.style.display = "block";
            joystick.style.visibility = 'visible';
            joystick.style.transform = '';
        } else {
            joystickPanel.style.display = "none";
            joystick.style.visibility = 'hidden';
        }
        reloadJoystickRoot()
    }

    function inputMarginChange(e) {
        localStorage.setItem("input_margin", e.target.value)
        e.target.parentNode.children[1].innerText = e.target.value
        if (e.type == "input") {
            joystickPanel.style.display = "block";
            joystick.style.visibility = 'visible';
            joystick.style.transform = '';
        } else {
            joystickPanel.style.display = "none";
            joystick.style.visibility = 'hidden';
        }
        reloadJoystickRoot()
    }

    function inputFixedChange(e) {
        let icon = e.target.children[0]
        if (icon.classList.contains('icon-cancel')) {
            icon.classList.add("icon-ok");
            icon.classList.remove("icon-cancel");
            getByDataHook("inputmargin-range").parentNode.style.display = 'flex'
            localStorage.setItem("input_fixed", 1)
        } else {
            icon.classList.remove("icon-ok");
            icon.classList.add("icon-cancel");
            joystick.style.visibility = 'hidden';
            getByDataHook("inputmargin-range").parentNode.style.display = 'none'
            localStorage.setItem("input_fixed", 0)
        }
        reloadJoystickRoot()
    }

    function inputSizeChange(e) {
        localStorage.setItem("input_size", e.target.value)
        e.target.parentNode.children[1].innerText = e.target.value
        if (e.type == "input") {
            joystickPanel.style.display = "block";
            joystick.style.visibility = 'visible';
            joystick.style.transform = '';
        } else {
            joystickPanel.style.display = "none";
            joystick.style.visibility = 'hidden';
        }
        reloadJoystickRoot()
    }

    function reloadJoystickRoot() {
        const storedOpacity = localStorage.getItem('input_opacity') || 0.8
        const storedSize = localStorage.getItem('input_size') || 40
        const storedFixed = localStorage.getItem('input_fixed') || 0

        let storedMargin;

        if (storedFixed == 1) {
            storedMargin = localStorage.getItem('input_margin') || 10
        } else {
            storedMargin = 0
        }
        joystickRootStylesheet.innerHTML = ":root {--joystick-size: " + storedSize + "vh;--joystick-margin: " + storedMargin + "vh;--joystick-opacity: " + storedOpacity + "}"
    }
}
