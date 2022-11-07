import { loadCurrentPage } from "./index.js";
import * as Animations from "./Animations.js";

export function addPopstateEventListener() {
    window.addEventListener('popstate', () => {
        document.getElementsByClassName("headerSubtitle")[0].innerHTML = "Application CMR";
        loadCurrentPage();
    })
}

export function setClickEvents(page) {
    for (let i = 0; i < page.data.cells.length; i++) {
        _addHoverEvent(page, i);
        if (page.data.cells[i].newPage) {
            _addNewPageEvent(page, i);
        } else {
            _addClickEvent(page, i);
        }
    }
}

function _addClickEvent(page, i) {
    if (page.data.cells[i].babillard) { return }
    var element = document.getElementById(i);
    let link = page.data.cells[i].link;
    if (link) {
        element.onclick = function () {
            if (!page.data.cells[i].openURL && !_iOS()) {
                window.open(`./site/fileview/?t=${page.data.cells[i].title}&s=${page.data.cells[i].link}`);
            } else {
                window.open(link);
            }

        }
    }
}

function _addNewPageEvent(page, i) {
    var element = document.getElementById(i);
    element.onclick = function () {
        history.pushState(page.data.cells[i].link, page.data.cells[i].title, "./?src=" + page.data.cells[i].link);
        Animations.slideLeft()
        Animations.setShouldAnimate(true);
        setTimeout(function () {
            loadCurrentPage();
        }, 300)
    }
}

function _addHoverEvent(page, i) {
    if (page.data.cells[i].babillard) { return }
    var element = document.getElementById(i);
    if (page.data.cells[i].link) {
        element.style.cursor = "pointer";
        element.classList.add("hovers");
    }
}


export function addInformationButtonEvent() {
    document.getElementsByClassName("i")[0].onclick = function () {
        window.popupwindow("./?src=files/infos.json", 'Application CMR - Informations', 400, 600)
    };
}

function _iOS() {
    if (/iPad|iPhone|iPod/.test(navigator.platform)) {
        return true;
    } else if (_isIpadOS()) {
        return true;
    } else {
        return navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform);
    }
}

function _isIpadOS() {
    return navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform);
}