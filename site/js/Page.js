import { Cell } from "./Cell.js";
import { Babillard } from "./Babillard.js";
import * as URLUtilities from "./URLUtilities.js";
import * as UIHandler from "./UIHandler.js";
import * as EventHandler from "./EventHandler.js";
import * as Animations from "./Animations.js";

export class Page {
    constructor(data, url) {
        this.data = data;
        this.url = url;
    }

    static async fetch(url) {
        const res = await fetch(url);
        const data = await res.json()
            .catch(e => {
                console.log("allo");
                window.location.replace("/404.html?src=" + url);
            });;
        return new Page(data, url);
    }

    async html() {
        let cells = this.data.cells.map(x => ({ ...x }));
        cells.forEach(function (cell, i) {
            cell.i = i;
            if (cell.babillard) {
                cells[i] = new Babillard(cell, i);
            } else {
                cells[i] = new Cell(cell);
            }
        });
        cells = cells.map((cell) => cell.html());
        cells = await Promise.all(cells);
        return cells.join("");
    }

    static async loadCurrentPage() {
        (await Page.getCurrentPage()).loadTableView();
    }

    static async getCurrentPage() {
        let page = null;
        let link = URLUtilities.getUrl();
        page = await Page.fetch(link);
        return page;
    }

    async loadTableView() {
        document.getElementsByClassName("cells")[0].innerHTML = await this.html();
        Babillard.populateAllCellsWithAnnonces(this.data);
        UIHandler.setupHeaderFor(this);
        EventHandler.setClickEvents(this);
        Animations.fadeIn();
    }
}
