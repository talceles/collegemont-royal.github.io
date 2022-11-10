export var shouldAnimate = false;

export function slideLeft() {
    var elements = [...document.getElementsByClassName("cell"), ...document.getElementsByClassName("categorie")];
    for (let i = 0; i < elements.length; i++) {
        elements[i].classList.remove("transitionLeft");
        elements[i].classList.add("transitionLeft");
    }
}

export function fadeIn() {
    window.scrollTo(0, 0);
    if (shouldAnimate) {
        shouldAnimate = false;
        var elements = [...document.getElementsByClassName("cell"), ...document.getElementsByClassName("categorie")];
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove("fadeIn");
            elements[i].classList.add("fadeIn");
        }
    }
}

export function setShouldAnimate(value) {
    shouldAnimate = value;
}