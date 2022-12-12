import * as URLUtilities from "./URLUtilities.js";

export class Babillard {
    static Type = {
        EMPTY: "site/templates/emptyBabillardCell.html",
        NORMAL: "site/templates/babillardCell.html"
    };

    static _cache = {};
    static annonces = [];
    /** @type { Promise | null } */
    #annonce = null;

    constructor(data, i) {
        this.data = data;
        this.i = i;
        this.prepareAnnonces();
    }

    async html() {
        const annonces = await this._getAnnonces();
        const template = await this._htmlTemplate();

        Babillard._sortAnnonces();
        if (Babillard.annonces[this.i].length > 0) {
            this.data.subtitle = Babillard.annonces[this.i].length + " annonce(s)"
        }

        return template.replaceAll(/{{(.+?)}}/g, (_, key) => {
            let replacing = this.data[key];
            if (!replacing && replacing !== 0) { return "" }
            return replacing;
        });
    }

    async prepareAnnonces() {
        Babillard.annonces[this.i] = await this._getAnnonces();
        this.type = this._getType();
    }

    async _htmlTemplate() {
        if (!Babillard._cache[this.type]) {
            const res = await fetch(this.type);
            Babillard._cache[this.type] = await res.text();
        }
        return Babillard._cache[this.type];
    }

    _getType() {
        if (Babillard.annonces[this.i].length > 0) return Babillard.Type.NORMAL;
        else return Babillard.Type.EMPTY;
    }

    static _sortAnnonces() {
        Babillard.annonces.forEach(function (_, i) {
            Babillard.annonces[i] = Babillard.annonces[i].filter(function (annonce) {
                let expiration = Date.parse(annonce.expiration || "2170-02-10")
                let now = new Date().getTime();
                return expiration > now;
            });
        })
    }

    _getAnnonces() {
        if (this.#annonce == null) {
            this.#annonce = fetch(this.data.link)
                .then(res => res.json())
                .then(annonce => {
                    Babillard.annonces[this.i] = annonce;
                    Babillard._sortAnnonces();
                    return annonce;
                });
        }
        return this.#annonce;
    }

    static populateAllCellsWithAnnonces(data) {
        data.cells.forEach(function (cell, i) {
            if (cell.babillard) Babillard._populateAnnonces(i);
        });
    }

    static _populateAnnonces(i) {
        let annoncesDiv = document.getElementById("annonces" + i);
        Babillard._sortAnnonces();
        Babillard.annonces[i].forEach(annonce => {

            let popUpCode = "";
            let contentCode = "";

            if (URLUtilities.isImage(annonce.contenu)) {
                popUpCode += `i=${encodeURIComponent(annonce.contenu).replaceAll("'", "\\'")}`;
                contentCode = `<img src="${annonce.contenu}"/>`;
            } else {
                popUpCode += `s=${encodeURIComponent(annonce.contenu).replaceAll("'", "\\'")}`;
                contentCode = `<div class="annonce-text"><textarea rows="1" readonly></textarea></div>`;
            }

            if (annonce.link) {
                popUpCode += `&l=${encodeURIComponent(annonce.link).replaceAll("'", "\\'")}`;
                contentCode += `<img class="openlink" src="site/ressources/openLink.png"/>`;
            }

            annoncesDiv.insertAdjacentHTML("beforeend", `<div class="annonce-wrapper"><div class="annonce" id=annonce${i} onclick="window.popupwindow('./site/popup/?${popUpCode}', 'Babillard', 500, 500);">${contentCode}</div></div>`);

            const annonceElement = annoncesDiv.lastElementChild.firstElementChild;
            const annonceTextElement = annonceElement.querySelector("textarea");

            const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
            annonceElement.style.width = clamp(window.innerWidth / window.innerHeight * 215, 115, 350) + "px";

            if (annonceTextElement) {
                annonceTextElement.value = annonce.contenu;
                annonceTextElement.rows = 1;
                while (annonceTextElement.scrollHeight > annonceTextElement.clientHeight) {
                    if (annonceTextElement.rows < 5) {
                        annonceTextElement.rows++;
                    } else {
                        const words = annonceTextElement.value.split(" ");
                        words.pop();
                        annonceTextElement.value = words.join(" ") + "...";
                    }
                }
            }
        });
    }
}
