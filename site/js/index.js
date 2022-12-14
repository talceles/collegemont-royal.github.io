import { Page } from './Page.js';
import * as UIHandler from './UIHandler.js';

try {
    UIHandler.initialUISetup();
    Page.loadCurrentPage();
} catch (e) {
    console.log("a");
}