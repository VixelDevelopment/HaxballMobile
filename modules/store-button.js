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