console.log("1");
import { initialUISetup } from "./UIHandler.js";
console.log("2");
initialUISetup();
console.log("3");

const urlParams = new URLSearchParams(window.location);
const src = urlParams.get('src');
if (src) {
    console.log("4");
    sendErrorMessage("Source non trouvée au " + src);
} else {
    console.log("5");
    send404Message();
}

function send404Message() {
    fetch(
        "https://cmr-webhooks.herokuapp.com/404" +
        "?pathname=" + encodeURIComponent(window.location.pathname) +
        "&useragent=" + encodeURIComponent(window.navigator.userAgent),
        { method: "POST" }
    );
}

function sendErrorMessage(errorDescription) {
    fetch(
        "https://cmr-webhooks.herokuapp.com/err?pathname=" + encodeURIComponent(window.location.pathname) + "&src=" + encodeURIComponent(URLUtilities.getSrc()),
        {
            method: "POST",
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            body: errorDescription,
        }
    );
}