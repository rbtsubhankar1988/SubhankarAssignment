const { expect } = require('@playwright/test');
export class RegistrationPage {

    /** @param {import('@playwright/test').Page} page */
    constructor(page) {
        this.page = page;

        this.registrationPageHeader = page.locator('h1', { hasText: 'Signing up is easy!' })

        //Registration form locators
        this.firstNameField = page.locator(`input[name='customer.firstName']`)
        this.lastNameField = page.locator(`input[name='customer.lastName']`)
        this.addressField = page.locator(`input[name='customer.address.street']`)
        this.cityField = page.locator(`input[name='customer.address.city']`)
        this.stateField = page.locator(`input[name='customer.address.state']`)
        this.zipCodeField = page.locator(`input[name='customer.address.zipCode']`)
        this.phoneField = page.locator(`input[name='customer.phoneNumber']`)
        this.SSNField = page.locator(`input[name='customer.ssn']`)
        this.userNameField = page.locator(`input[name='customer.username']`)
        this.passwordField = page.locator(`input[name='customer.password']`)
        this.confirmPasswordField = page.locator(`input[name='repeatedPassword']`)
        this.registerButton = page.locator(`input[value='Register']`)
    }


    async verifyRegistrationPageHeaderVisibility() {
        this.registrationPageHeader.waitFor({ state: 'visible' })
        expect(this.registrationPageHeader).toBeVisible()
    }

    async registerUserWithDetails(firstName, lastName, address, city, state, zipCode, phone, ssn, userName, password) {
        await this.firstNameField.fill(firstName);
        await this.lastNameField.fill(lastName);
        await this.addressField.fill(address);
        await this.cityField.fill(city);
        await this.stateField.fill(state);
        await this.zipCodeField.fill(zipCode);
        await this.phoneField.fill(phone);
        await this.SSNField.fill(ssn);
        await this.userNameField.fill(userName);
        await this.passwordField.fill(password);
        await this.confirmPasswordField.fill(password);
        await this.registerButton.click();
    }

    async verifyWelcomePageHeader(userName) {
        let pageHeader = this.page.locator('h1', { hasText: `Welcome ${userName}` })
        await pageHeader.waitFor({ state: 'visible' })
        await expect(pageHeader).toBeVisible()
    }


}