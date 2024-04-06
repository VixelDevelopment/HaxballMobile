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