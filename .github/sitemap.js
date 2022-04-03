// MIT License

// Copyright (c) 2022 DaRealRomz

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const fs = require("fs");
const path = require("path");
const child_process = require("child_process");

const ROOT_PATH = path.join(__dirname, "..");
const CNAME_FILE = path.join(ROOT_PATH, "CNAME");

let HOST = "https://";
if (fs.existsSync(CNAME_FILE)) {
    HOST += fs.readFileSync(CNAME_FILE, "utf8");
} else {
    const baseName = path.basename(ROOT_PATH);
    if (!baseName.endsWith(".github.io")) {
        baseName += ".github.io";
    }
    HOST += baseName;
}

const getLastMod = (filePath) => {
    const gitLog = child_process.execSync(`git log -n 1 --format=%at "${filePath}"`, { encoding: "utf8" });
    const lastMod = new Date(Number.parseInt(gitLog, 10) * 1000);
    return lastMod.toISOString().substring(0, 10);
};

const urlToXml = ({ location, lastMod }) => {
    return `<url><loc>${location}</loc><lastmod>${lastMod}</lastmod></url>`;
};

const urls = [];

const navigatePage = (contentsFileRelativePath, root) => {
    const contentsFilePath = path.join(ROOT_PATH, contentsFileRelativePath);
    const { cells } = JSON.parse(fs.readFileSync(contentsFilePath, "utf8"));
    if (cells) {
        urls.push({
            location: HOST + (root ? "/" : "/?src=" + contentsFileRelativePath),
            lastMod: getLastMod(contentsFilePath),
        });
        cells.forEach((cell) => {
            if (cell.link && cell.link.endsWith(".json")) {
                if (cell.link.startsWith(HOST)) {
                    cell.link = cell.link.substring(HOST.length);
                }
                navigatePage(cell.link);
            }
        });
    }
};

navigatePage(process.argv[2], true);

const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
const urlSet = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(urlToXml).join("")}</urlset>`;
console.log(xmlHeader + urlSet);
