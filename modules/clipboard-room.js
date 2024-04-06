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