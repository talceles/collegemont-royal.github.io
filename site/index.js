let link = getUrl()
let str = get(link)
let cells = JSON.parse(str).cells
let slides = false;
loadTableView();

setDarkMode();

// EVENTS

window.addEventListener('popstate', e => {
    parseCells(e.state)
})

function addClickEvent(i) {
    var element = document.getElementById(i); //grab the element
    if (cells[i].link) {
        element.onclick = function() { //asign a function
            window.open(cells[i].link);
        }
    }
}

function addNewPageEvent(i) {
    var element = document.getElementById(i)
    element.onclick = function() {
        history.pushState(cells[i].link, cells[i].title, "https://collegemont-royal.github.io?src=" + cells[i].link);
        slideLeft()
        slides = true;
        setTimeout(function() {
            parseCells(cells[i].link)
        }, 300)
    }
}

function addHoverEvent(i) {
    var element = document.getElementById(i); //grab the element
    if (cells[i].link) {
        element.onmouseover = function() { //asign a function
            element.classList.remove("mouseOut", "mouseOver")
            element.classList.add("mouseOver")
        }
        element.onmouseout = function() { //asign a function
            element.classList.remove("mouseOut", "mouseOver")
            element.classList.add("mouseOut")
        }
    }
}

document.getElementsByClassName("i")[0].onclick = function() {
    popupwindow("https://collegemont-royal.github.io/?src=https://collegemont-royal.github.io/files/infos.json", 'CMR - Informations', 400, 600)
};

// CELLS

function parseCells(url) {
    link = getUrl()
    str = get(link)
    cells = JSON.parse(str).cells
    loadTableView();
}

function loadTableView() {
    document.getElementsByClassName("cells")[0].innerHTML = "";

    setTitle();

    for (let i = 0; i < cells.length; i++) {
        let classe = "mouseOut"
        if (cells[i].notification) { classe = classe + " notification" }
        if (cells[i].article) { classe = classe + " article" }
        cells[i].subtitle = markDown(cells[i].subtitle)

        document.getElementsByClassName("cells")[0].insertAdjacentHTML("beforeend", GenerateHTMLCell(cells[i].title, cells[i].subtitle, cells[i].image, i, classe));
        
        addHoverEvent(i);

        if (cells[i].newPage) {
            addNewPageEvent(i);
        } else {
            addClickEvent(i);
        }
    }
    fadeIn();
}

function slideLeft() {
    var elements = document.getElementsByTagName("cell")
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove("transitionLeft", "mouseOver", "mouseOut");
        elements[i].classList.add("transitionLeft", "mouseOut");
    }
}

function fadeIn() {
    if (slides) {
        slides = false;
        var elements = document.getElementsByTagName("cell")
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove("fadeIn");
            elements[i].classList.add("fadeIn");
        }
    }
}

function GenerateHTMLCell(title, subtitle, image, i, cellClass) {

    title = title || ""
    subtitle = subtitle || ""
    image = image || "🎆"

    if (image.indexOf(".") > 0) {
        // IMAGE IS LINK
        return `<cell id = ${i} class="${cellClass}"><img-container><img src="${image}" id=${image}/></img-container><description><cell-title>${title}</cell-title><cell-subtitle>${subtitle}</cell-subtitle></description></cell>`
    } else {
        // IMAGE IS EMOJI
        return `<cell id = ${i} class="${cellClass}"><emoji>${image}</emoji><description><cell-title>${title}</cell-title><cell-subtitle>${subtitle}</cell-subtitle></description></cell>`
    }
}

// UI

function setDarkMode() {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add("dark");
    }
}

function setTitle() {
    let title = JSON.parse(str).title || "";
    document.getElementsByClassName("title")[0].innerHTML = title;
    if (title != "") {
        document.title = "CMR - " + title
    } else {
        document.title = "CMR"
    }
}

// UTILITIES

function getUrl() {
    const src = new URLSearchParams(window.location.search).get('src');
    if (history.state != null) {
        return history.state;
    } else if (src != null) {
        return src;
    } else {
        return 'https://collegemont-royal.github.io/files/cells.json';
    }
}

function get(yourUrl) {
    var Httpreq = new XMLHttpRequest(); // a new request
    Httpreq.open("GET",yourUrl,false);
    Httpreq.send(null);
    return Httpreq.responseText;          
}

function isEmoji(str) {
    var ranges = ['(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32-\ude3a]|[\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])'];
    if (str.match(ranges.join('|'))) {
        return true;
    } else {
        return false;
    }
}

function markDown(str) {
    if (str) {
        var boldParameters = /\*\*(.*?)\*\*/gm;
        var bold = str.replace(boldParameters, '<b>$1</b>');
        var italicParameters = /\*(.*?)\*/gm;
        var italic = bold.replace(italicParameters, '<i>$1</i>');
        var enters = italic.replace(/\n/g, "<br>");
        return enters;
    }
}

function popupwindow(url, title, w, h) {
    var left = (screen.width/2)-(w/2);
    var top = (screen.height/2)-(h/2);
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
  } 
