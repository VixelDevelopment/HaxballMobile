//Set a custom logo for the change nick view
if (typeof CUSTOM_LOGO !== 'undefined') {
    stylesheet.innerHTML += `.choose-nickname-view>img {content: url("${CUSTOM_LOGO["url"]}");height:${CUSTOM_LOGO["height"]||"auto"};width:${CUSTOM_LOGO["width"]||"auto"}}`;
}