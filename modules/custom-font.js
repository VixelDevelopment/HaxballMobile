//Set a custom font to the whole site
if (typeof CUSTOM_FONT !== 'undefined') {
    let e = document.createElement("link");
    e.href = CUSTOM_FONT["url"];
    e.rel = 'stylesheet';
    gameFrame.document.head.appendChild(e);
    stylesheet.innerHTML += `* {font-family: '${CUSTOM_FONT["name"]}', ${CUSTOM_FONT["type"]} !important;}`;
}