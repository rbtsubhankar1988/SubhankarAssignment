const { expect } = require('@playwright/test');
export class BillPayPage{

    /** @param {import('@playwright/test').Page} page */
    constructor(page){
        this.page = page;

        this.BillPayPageHeader = page.getByRole('heading', { name: 'Bill Payment Service' })
        this.payeeNameField = page.locator(`input[name="payee.name"]`);
        this.payeeAddressField = page.locator(`input[name="payee.address.street"]`);
        this.payeeCityField = page.locator(`input[name="payee.address.city"]`);
        this.payeeStateField = page.locator(`input[name="payee.address.state"]`);
        this.payeeZipCodeField = page.locator(`input[name="payee.address.zipCode"]`);
        this.payeePhoneField = page.locator(`input[name="payee.phoneNumber"]`);
        this.payeeAccountNumberField = page.locator(`input[name="payee.accountNumber"]`);
        this.verifyAccountNumberField = page.locator(`input[name="verifyAccount"]`);
        this.paymentAmountField = page.locator(`input[name="amount"]`);
        this.fromAccountDropdown = page.locator(`select[name="fromAccountId"]`);
        this.sendPaymentButton = page.getByRole('button', { name: 'Send Payment' });

        //Bill Pay success message locators
        this.successHeader = page.locator('#billpayResult h1.title');
        this.successPayeeName = page.locator('#billpayResult #payeeName');
        this.successAmount = page.locator('#billpayResult #amount');
        this.successFromAccountId = page.locator('#billpayResult #fromAccountId');
        this.successMessageParagraph = page.locator('#billpayResult p');
    }

    async verifyBillPayPageHeaderVisibility(){
        await this.BillPayPageHeader.waitFor({state:'visible'})
        await expect(this.BillPayPageHeader).toBeVisible()
    }

    async payBillUsingAccount(payeeName, address, city, state, zipCode, phone, accountNumber, amount, fromAccount) {
        await this.payeeNameField.fill(payeeName);
        await this.payeeAddressField.fill(address);
        await this.payeeCityField.fill(city);
        await this.payeeStateField.fill(state);
        await this.payeeZipCodeField.fill(zipCode);
        await this.payeePhoneField.fill(phone);

        await this.payeeAccountNumberField.fill(accountNumber);
        await this.verifyAccountNumberField.fill(accountNumber);

        await this.paymentAmountField.fill(amount);
        await this.fromAccountDropdown.selectOption({ label: fromAccount });
        
        await this.page.waitForTimeout(2000)
        await this.sendPaymentButton.click();

        console.log(`Bill paid using account: ${fromAccount} with amount: $${amount}`);
    }

    async verifyBillPaymentSuccess(expectedPayeeName, expectedAmount, expectedFromAccountId) {
        await this.successHeader.waitFor({ state: 'visible' });

        await expect(this.successHeader).toHaveText('Bill Payment Complete');
        await expect(this.successPayeeName).toHaveText(expectedPayeeName);
        await expect(this.successAmount).toHaveText(`$${expectedAmount}`);
        await expect(this.successFromAccountId).toHaveText(expectedFromAccountId);

        const expectedMessage = `Bill Payment to ${expectedPayeeName} in the amount of $${expectedAmount} from account ${expectedFromAccountId} was successful.`;
        await expect(this.successMessageParagraph.first()).toHaveText(expectedMessage);
    }

}  