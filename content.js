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