import { writeFile } from 'fs/promises';
import path from 'path';

export class CommonFunctions{

    /** @param {import('@playwright/test').Page} page */
    constructor(page){
        this.page = page;
    }


    async launchUrl(URL){
        await this.page.goto(URL)
        await this.page.waitForLoadState('networkidle')
    }

    async  writeTestDataToFile(data, fileName = 'transactionDetails.json') {
        const filePath = path.resolve('testData', fileName);
        try {
            await writeFile(filePath, JSON.stringify(data, null, 2));
            console.log(`Test data written to ${filePath}`);
        } catch (err) {
            console.error('Error writing test data file:', err);
        }
    }
}