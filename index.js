// Event handlers for loading events.
// Use these to handle loading screens, transitions, etc
onload = () => {
    const webview = document.getElementById('webview')
    const indicator = document.getElementById('indicator')

    const btnReload = document.getElementById('button_reload')
    btnReload.onclick = () => {
        webview.src = webview.src;
    }
    const btnBack = document.getElementById('button_back')
    btnBack.onclick = () => {
        webview.goBack();
    }

    const urlField = document.getElementById('url_field')
    urlField.addEventListener("keyup", (event) => {
        if (event.keyCode === 13) {
            let url = urlField.value;
            if (!urlField.value.startsWith("http://") &&
                !urlField.value.startsWith("https://")) {
                url = `https://${url}`
            }

            event.preventDefault();
            webview.src = url;
            urlField.value = url;
        }
    })

    const loadstart = () => {
        indicator.innerText = 'loading...'
    }

    const loadstop = () => {
        console.log("webview.src:", webview.src);
        if (urlField.value.trim() != webview.src) {
            urlField.value = webview.src;
        }
        indicator.innerText = ''
    }

    webview.addEventListener('did-start-loading', loadstart)
    webview.addEventListener('did-stop-loading', loadstop)
}