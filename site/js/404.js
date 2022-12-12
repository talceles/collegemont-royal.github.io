import { initialUISetup } from "./UIHandler.js";
import { getSrc } from "./URLUtilities.js";
initialUISetup();

var url = new URL(window.location);
var src = url.searchParams.get("src");
if (src) {
    sendErrorMessage("Source non trouvée au " + src);
} else {
    send404Message();
}

function send404Message() {
    fetch(
        "https://cmr-webhooks.romz.xyz/404" +
        "?pathname=" + encodeURIComponent(window.location.pathname) +
        "&useragent=" + encodeURIComponent(window.navigator.userAgent),
        { method: "POST" }
    );
}

function sendErrorMessage(errorDescription) {
    fetch(
        "https://cmr-webhooks.romz.xyz/err?pathname=" + encodeURIComponent(window.location.pathname) + "&src=" + encodeURIComponent(getSrc()),
        {
            method: "POST",
            headers: { "Content-Type": "text/plain; charset=utf-8" },
            body: errorDescription,
        }
    );
}