//Set a custom stylesheet
if (typeof CUSTOM_CSS !== 'undefined') {
    fetch('https://raw.githubusercontent.com/VixelDevelopment/HaxballMobile/main/custom.css')
            .then(response => response.text())
            .then(cssText => {
                stylesheet.innerHTML += cssText;
            })
            .catch(error => {
                console.error('Error fetching CSS:', error);
            });
}