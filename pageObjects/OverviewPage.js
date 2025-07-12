const { expect } = require('@playwright/test');
export class OverviewPage {

    /** @param {import('@playwright/test').Page} page */
    constructor(page) {
        this.page = page;

        this.accountsOverviewPageHeader = page.locator(`h1`, { hasText: 'Accounts Overview' })

        this.defaultAccountNumberCell = page.locator('#accountTable tbody tr td:nth-child(1)').first();
        this.balanceCell = page.locator('#accountTable tbody tr td:nth-child(2)').first();
        this.availableAmountCell = page.locator('#accountTable tbody tr td:nth-child(3)').first();
        this.totalAmountCell = page.locator('#accountTable tbody tr:nth-child(2) td:nth-child(2) b');
        this.OpenNewAccountLink = page.getByRole('link', { name: 'Open New Account' })
        this.accountsOverviewLink = page.getByRole('link', { name: 'Accounts Overview' })
        this.fundTransferLink = page.getByRole('link', { name: 'Transfer Funds' })
        this.billPayLink = page.getByRole('link', { name: 'Bill Pay' })
    }

    async verifyAccountsOverviewHeaderVisibility() {
        await this.accountsOverviewPageHeader.waitFor({ state: 'visible' })
        await expect(this.accountsOverviewPageHeader).toBeVisible()
    }

    async verifyBalanceDetailsForSpecificAccount(specificAccountNumber, expectedBalance, expectedAvailable, expectedTotal) {
        await expect(this.page.locator(`a`, { hasText: specificAccountNumber }).locator('..').locator('..').locator('td:nth-child(2)')).toHaveText(expectedBalance);
        await expect(this.page.locator(`a`, { hasText: specificAccountNumber }).locator('..').locator('..').locator('td:nth-child(3)')).toHaveText(expectedBalance);
        await expect(this.page.locator(`b`, { hasText: 'Total' }).locator('..').locator('..').locator('td:nth-child(2)')).toHaveText(expectedTotal);

        console.log(`Verified amounts - Balance: ${expectedBalance}, Available: ${expectedAvailable}, Total: ${expectedTotal} for account number: ${specificAccountNumber}`);
    }

    async verifyAccountOverviewAmounts(expectedBalance, expectedAvailable, expectedTotal) {
        await expect(this.balanceCell).toHaveText(expectedBalance);
        await expect(this.availableAmountCell).toHaveText(expectedAvailable);
        await expect(this.totalAmountCell).toHaveText(expectedTotal);

        console.log(`Verified amounts - Balance: ${expectedBalance}, Available: ${expectedAvailable}, Total: ${expectedTotal}`);
    }

    async verifyGlobalMenuNavigation() {
        const globalMenuItems = [
            { name: 'About Us', urlPart: 'about.htm' },
            { name: 'Services', urlPart: 'services.htm' },
            { name: 'Products', urlPart: 'products' },
            { name: 'Locations', urlPart: 'solutions' },
            { name: 'Admin Page', urlPart: 'admin.htm' },
        ];
        for (const item of globalMenuItems) {
            const link = this.page.locator(`ul.leftmenu >> text=${item.name}`);
            await expect(link).toBeVisible();

            const [newPage] = await Promise.all([
                this.page.waitForNavigation(),
                link.click()
            ]);
            await expect(this.page).toHaveURL(new RegExp(item.urlPart));
            await this.page.goBack();
        }
        console.log('Global Navigation menu verified successfully');
    }

    async clickOnOpenNewAccountLink() {
        await this.OpenNewAccountLink.waitFor({ state: 'visible' })
        await this.OpenNewAccountLink.click()
        await expect(this.page.getByRole('heading', { name: 'Open New Account' })).toBeVisible()
    }

    async getDefaultAccountNumber() {
        await this.defaultAccountNumberCell.waitFor({ state: 'visible' })
        const accountNumber = await this.defaultAccountNumberCell.innerText();
        return accountNumber;
    }

    async clickOnAccountsOverviewLink() {
        await this.accountsOverviewLink.waitFor({ state: 'visible' })
        await this.accountsOverviewLink.click()
        await this.verifyAccountsOverviewHeaderVisibility()
    }

    async clickOnFundTransferLink() {
        await this.fundTransferLink.waitFor({ state: 'visible' })
        await this.fundTransferLink.click()
        await expect(this.page.getByRole('heading', { name: 'Transfer Funds' })).toBeVisible()
    }

    async clickOnBillPayLink() {
        await this.billPayLink.waitFor({ state: 'visible' })
        await this.billPayLink.click()
        await expect(this.page.getByRole('heading', { name: 'Bill Payment Service' })).toBeVisible()
    }
}