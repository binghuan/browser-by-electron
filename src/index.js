const { ipcRenderer } = require('electron')
console.log(">> ");

let btnThemeSystem = null;
let btnThemeDark = null;
let btnThemeLight = null;

// Event handlers for loading events.
// Use these to handle loading screens, transitions, etc
onload = () => {

    btnThemeSystem = document.getElementById('btn_theme_system');
    btnThemeSystem.addEventListener('click', async () => {
        console.log(">> oncick btn_theme_system");
        const isDarkMode = await ipcRenderer.invoke('dark-mode:system')
        checkMedia("system");
    })

    btnThemeLight = document.getElementById('btn_theme_light');
    btnThemeLight.addEventListener('click', async () => {
        console.log(">> oncick btn_theme_light");
        const isDarkMode = await ipcRenderer.invoke('dark-mode:light')
        checkMedia();
    })

    btnThemeDark = document.getElementById('btn_theme_dark');
    btnThemeDark.addEventListener('click', async () => {
        console.log(">> oncick btn_theme_dark");
        const isDarkMode = await ipcRenderer.invoke('dark-mode:dark')
        checkMedia();
    })

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

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        const newColorScheme = e.matches ? "dark" : "light";
        console.log("newColorScheme: ", newColorScheme, e);
    });
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
        const newColorScheme = e.matches ? "dark" : "light";
        console.log("newColorScheme: ", newColorScheme, e);
    });

    checkMedia();
}

function checkMedia(mode) {

    if (mode == "system") {
        console.log("system mode");
        btnThemeSystem.classList.add("active");
        btnThemeDark.classList.remove("active");
        btnThemeLight.classList.remove("active");
        return;
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        console.log("dark mode");
        btnThemeDark.classList.add("active");
        btnThemeLight.classList.remove("active");
        btnThemeSystem.classList.remove("active");
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        console.log("light mode");
        btnThemeLight.classList.add("active");
        btnThemeDark.classList.remove("active");
        btnThemeSystem.classList.remove("active");
    }
}
