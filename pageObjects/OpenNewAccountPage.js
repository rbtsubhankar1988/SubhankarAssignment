const { expect } = require('@playwright/test');
export class OpenNewAccountPage {

    /** @param {import('@playwright/test').Page} page */
    constructor(page) {
        this.page = page;
        this.pageHeader = page.getByRole('heading', { name: 'Open New Account' })
        this.accountTypeDropdown = page.locator('select#type')
        this.openNewAccountButton = page.locator(`input[value="Open New Account"]`)
        this.newAccountNumberLocator = page.locator(`a[id='newAccountId']`)
    }

    async verifyPageHeaderVisibility() {
        await this.pageHeader.waitFor({ state: 'visible' })
        await expect(this.pageHeader).toBeVisible()
    }

    async selectSpecificAccountType(specificAccountType) {
        await this.accountTypeDropdown.waitFor({ state: 'visible' })
        await this.accountTypeDropdown.selectOption(specificAccountType)
    }

    async clickOnOpenNewAccountButton() {
        await this.page.waitForTimeout(2000)
        await this.openNewAccountButton.waitFor({ state: 'visible' })
        await this.openNewAccountButton.isEnabled()
        await this.openNewAccountButton.click({ force: true })
    }

    async getNewlyCreatedAccountNumber() {
        await this.newAccountNumberLocator.waitFor({ state: 'visible' })
        const accountNumber = await this.newAccountNumberLocator.innerText();
        return accountNumber;
    }
}