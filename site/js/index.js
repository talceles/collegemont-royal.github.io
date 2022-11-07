import { Page } from "./Page.js";
import * as UIHandler from "./UIHandler.js";
import * as EventHandler from "./EventHandler.js";
import * as URLUtilities from "./URLUtilities.js";
import * as Animations from "./Animations.js";
import { Babillard } from "./Babillard.js";

UIHandler.initialUISetup();

let page;

loadCurrentPage();

export async function loadCurrentPage() {
    let link = URLUtilities.getUrl();
    page = await Page.fetch(link);
    loadTableView()
}

async function loadTableView() {
    document.getElementsByClassName("cells")[0].innerHTML = await page.html();
    Babillard.populateAllCellsWithAnnonces(page.data);
    UIHandler.setupHeaderFor(page);
    EventHandler.setClickEvents(page);
    Animations.fadeIn();
}