import * as EventHandler from "./EventHandler.js";

export function setupDarkMode() {
    // Setup unitial du mode sombre
    _setDarkMode();
    // Si le navigateur est compatible, on change le mode quand il est changé pour le système
    let darkModeStatus = window.matchMedia("(prefers-color-scheme: dark)");
    try { // Pas tous les appareils sont compatibles avec le dark mode, on vérifie.
        darkModeStatus.addEventListener("change", function () {
            // Quand le système change de mode, on change le dark mode
            _setDarkMode();
        });
    } catch {}
}

function _setDarkMode() {
    let root = document.documentElement.style;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // DARK
        root.setProperty('--background', '#000000');
        root.setProperty('--text', '#ffffff');
        root.setProperty('--subtext', '#a4a4a4');
        root.setProperty('--hover', '#161616');
        root.setProperty('--accent', '#161616');
        root.setProperty('--hilight', '#282828');
    } else {
        // LIGHT
        root.setProperty('--background', '#ffffff');
        root.setProperty('--text', '#000000');
        root.setProperty('--subtext', '#666666');
        root.setProperty('--hover', '#f0f0f0');
        root.setProperty('--accent', '#f0f0f0');
        root.setProperty('--hilight', '#e5e5e5');
    }
}

export function setupHeaderFor(page) {
    _setTitles(page);
    _setHeaderColor(page);
    _hideIButton(page);
}

function _setTitles(page) {
    let title = page.data.title || "Application CMR";
    document.getElementsByClassName("title")[0].innerHTML = title;

    let topsubtitle = page.data.topsubtitle || "Application CMR";
    document.getElementsByClassName("headerSubtitle")[0].innerHTML = topsubtitle;

    if (title != "" && title != "Application CMR") {
        document.title = "Application CMR - " + title
    } else {
        document.title = "Application CMR | Collège Mont-Royal"
    }
}

function _setHeaderColor(page) {
    let header = document.querySelector("div.header");
    let color = page.data.header_color || "#1D2953";
    document.querySelector("meta[name=theme-color]").setAttribute("content", color);
    header.style.backgroundColor = color;
}

function _hideIButton(page) {
    if (page.url == "files/infos.json") {
        document.getElementsByClassName("i")[0].id = "hidden";
    } else {
        document.getElementsByClassName("i")[0].id = "";
    }
}

export function initialUISetup() {
    document.body.style.transform = 'scale(1)';
    setupDarkMode();
    EventHandler.addPopstateEventListener();
    EventHandler.addInformationButtonEvent();
}

window.popupwindow = function (url, title, w, h) {
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
} 