export class Cell {
    static Type = {
        BASIC: "site/templates/basicCell.html",
        NOTIFICATION: "site/templates/notificationCell.html",
        ARTICLE: "site/templates/articleCell.html",
        ACTION: "site/templates/actionCell.html",
        WEBVIEW: "site/templates/webViewCell.html",
        CATEGORIE: "site/templates/categorieCell.html"
    };

    static EMPTY_IMAGE = "data:image/gif;base64,R0lGODlhAQABAPcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAABAAEAAAgEAP8FBAA7";

    static _cache = {};

    constructor(data) {
        this.data = data;
        data.subtitle = Cell.markDown(data.subtitle)
        this.type = this._getType();
        data.imageCode = this._getImageCode();
    }

    async html() {
        const template = await this._htmlTemplate();
        return template.replaceAll(/{{(.+?)}}/g, (_, key) => {
            let replacing = this.data[key];
            if (!replacing && replacing !== 0) { return "" }
            return replacing;
        });
    }

    async _htmlTemplate() {
        if (!Cell._cache[this.type]) {
            const res = await fetch(this.type);
            Cell._cache[this.type] = await res.text();
        }
        return Cell._cache[this.type];
    }

    _getType() {
        if (this.data.notification) return Cell.Type.NOTIFICATION;
        else if (this.data.article) return Cell.Type.ARTICLE;
        else if (this.data.webView) return Cell.Type.WEBVIEW;
        else if (this.data.babillard) return Cell.Type.BABILLARD;
        else if (this.data.button_title) return Cell.Type.ACTION;
        else if (this._cellIsCategorie()) return Cell.Type.CATEGORIE;
        else return Cell.Type.BASIC;
    }

    _getImageCode() {
        let imageCode = "";
        let image = this.data?.image;
        if (image?.indexOf(".") > 0) {
            // IMAGE IS LINK
            if (this.data.tint && this.type != Cell.Type.ACTION) {
                // IMAGE IS TINTED
                imageCode = `<img class="maskedimage" src="${Cell.EMPTY_IMAGE}" style="-webkit-mask-image: url(${image}); mask-image: url(${image}); background-color: ${this.data.tint};" id=${image}/>`;
            } else {
                // NORMAL IMAGE URL
                imageCode = `<img src="${image}" id=${image}/>`;
            }
        } else if (image) {
            // IMAGE IS EMOJI
            imageCode = `<p class="emoji">${image}</p>`;
        }
        return imageCode;
    }

    _cellIsCategorie() {
        if (this.data.button_title) return false
        if (this.data.babillard) return false
        if (!this.data.image || this.data.image === "") {
            return true
        }
        return false
    }

    static markDown(str) {
        if (str) {
            var boldParameters = /\*\*(.*?)\*\*/gm;
            var bold = str.replace(boldParameters, '<b>$1</b>');
            var italicParameters = /\*(.*?)\*/gm;
            var italic = bold.replace(italicParameters, '<i>$1</i>');
            var enters = italic.replace(/\n/g, "<br>");
            return enters;
        }
    }
}
