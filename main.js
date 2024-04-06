var scripts = [
    ["content.js", "body"],
    ["modules/adblock.js", "body"],
    ["modules/clipboard-room.js", "body"],
    ["modules/custom-css.js", "body"],
    ["modules/custom-font.js", "body"],
    ["modules/custom-logo.js", "body"],
    ["modules/hide-header.js", "body"],
    ["modules/room-admin-settings.js", "body"],
    ["modules/room-search.js", "body"],
    ["modules/store-button.js", "body"],
    ["modules/utils.js", "body"],
    ["modules/virtual-joystick.js", "body"]
]

scripts.forEach(function(element) {
    appendScript(element[0], element[1])
});

function appendScript(src, target, callback = null) {
    const script = document.createElement('script');
    script.src = "https://raw.githubusercontent.com/VixelDevelopment/HaxballMobile/main/" + src;

    if (callback) {
        script.onload = callback;
    }

    if (target === 'head') {
        document.head.appendChild(script);
    } else {
        document.body.appendChild(script);
    }
}