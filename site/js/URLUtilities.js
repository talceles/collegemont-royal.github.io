export function getUrl() {
    const src = new URLSearchParams(window.location.search).get('src');
    if (history.state != null) {
        return history.state;
    } else if (src != null) {
        return src;
    } else {
        return 'files/cells.json';
    }
}

export function getSrc() {
    return new URLSearchParams(window.location.search).get('src') || "";
}

export function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}