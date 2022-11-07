import { Cell } from "./Cell.js";
import { Babillard } from "./Babillard.js";

export class Page {
    constructor(data, url) {
        this.data = data;
        this.url = url;
    }

    static async fetch(url) {
        const res = await fetch(url);
        const data = await res.json();
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
}
