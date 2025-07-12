const { expect } = require('@playwright/test');
export class TransferFunds {

    /** @param {import('@playwright/test').Page} page */
    constructor(page) {
        this.page = page;

        this.transferFundsPageHeader = page.getByRole('heading', { name: 'Transfer Funds' })
        this.amountField = page.locator('#amount')
        this.formAccountDropdown = page.locator('#fromAccountId')
        this.toAccountDropdown = page.locator('#toAccountId')
        this.transferButton = page.getByRole('button', { name: 'Transfer' })
    }

    async verifyTransferFundsPageHeaderVisibility() {
        await this.transferFundsPageHeader.waitFor({ state: 'visible' })
        await expect(this.transferFundsPageHeader).toBeVisible()
    }

    async transferFundsWithDetails(amount, fromAcc, toAcc) {
        await this.amountField.waitFor({ state: 'visible' })
        await this.amountField.fill(amount)

        await this.formAccountDropdown.waitFor({ state: 'visible' })
        await this.formAccountDropdown.selectOption(fromAcc)

        await this.toAccountDropdown.waitFor({ state: 'visible' })
        await this.toAccountDropdown.selectOption(toAcc)

        await this.transferButton.waitFor({ state: 'visible' })
        await this.transferButton.click()
    }
}  