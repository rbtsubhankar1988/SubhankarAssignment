const { expect } = require('@playwright/test');
export class LandingPage {

    /** @param {import('@playwright/test').Page} page */
    constructor(page) {
        this.page = page;

        this.customerLoginPageHeader = page.locator('h2', { hasText: 'Customer Login' })
        this.registerLink = page.getByText('Register', { exact: true })
        this.userNameField = page.locator(`input[name='username']`)
        this.passwordField = page.locator(`input[name='password']`)
        this.loginButton = page.locator(`input[value="Log In"]`)

        this.logoutLink = page.locator(`a`, { hasText: 'Log Out' })
    }

    async verifyCustomerLoginHeaderVisibility() {
        await this.customerLoginPageHeader.waitFor({ state: 'visible' })
        expect(this.customerLoginPageHeader).toBeVisible()
    }

    async userClickOnRegisterLink() {
        await this.registerLink.waitFor({ state: 'visible' })
        await this.registerLink.click()
    }

    async insertUserNamePassswordAndClickOnLoginButton(userName, password) {
        await this.userNameField.waitFor({ state: 'visible' })
        await this.userNameField.fill(userName)
        await this.passwordField.waitFor({ state: 'visible' })
        await this.passwordField.fill(password)

        await this.loginButton.waitFor({ state: 'visible' })
        await this.loginButton.click()
    }

    async clickOnLogout() {
        await this.logoutLink.waitFor({ state: 'visible' })
        await this.logoutLink.click()
        await this.verifyCustomerLoginHeaderVisibility()
    }
}