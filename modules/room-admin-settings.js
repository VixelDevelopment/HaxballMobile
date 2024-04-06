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