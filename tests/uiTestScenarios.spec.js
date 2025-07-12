// @ts-check
import { test, expect } from '@playwright/test';
import { CommonFunctions } from '../CommonMethods/commonFunctions';
import environmentData from '../testData/EnvironmentConfig.json'
import { LandingPage } from '../pageObjects/landingPage';
import { RegistrationPage } from '../pageObjects/RegistrationPage';
import { OverviewPage } from '../pageObjects/OverViewPage';
import { OpenNewAccountPage } from '../pageObjects/OpenNewAccountPage';
import { TransferFunds } from '../pageObjects/TransferFundsPage';
import { BillPayPage } from '../pageObjects/BillPayPage';
import { faker } from '@faker-js/faker';

test.describe('Para Bank Automation Scenarios', async () => {

  let regUserDetails, defaultAccountNumber, newAccountOpeningAmount, depositedAmount, newlyCreatedAccountNumber, transferAmount, billAmount;
  let randomNum = Math.floor(100000 + Math.random() * 900000);
  //Here Switching the data sets between different Environments
  const env = `${process.env.ENVIRONMENT}`;
  console.log(`env`)
  const testData = environmentData[env]

  test('Para bank UI Test scenarios:', async ({ page }) => {
    const commFunc = new CommonFunctions(page);
    const landingPage = new LandingPage(page)
    const registrationPage = new RegistrationPage(page)
    const overviewPage = new OverviewPage(page)
    const openNewAccountPage = new OpenNewAccountPage(page)
    const transferFunds = new TransferFunds(page)
    const billPayPage = new BillPayPage(page)

    await test.step('User navigate to Para bank application', async () => {
      await commFunc.launchUrl(testData.URL);
      await landingPage.verifyCustomerLoginHeaderVisibility()
    });

    await test.step('User clicks on Register link and navigate to the Registration page', async () => {
      await landingPage.userClickOnRegisterLink()
      await registrationPage.verifyRegistrationPageHeaderVisibility()
    });

    await test.step('Create a new user with random username', async () => {
      let firstName = faker.person.firstName()
      regUserDetails = {
        firstName: firstName,
        lastName: faker.person.lastName(),
        address: faker.location.street(),
        city: faker.location.city(),
        state: faker.location.state(),
        zipCode: faker.location.zipCode(),
        phone: faker.phone.number({ style: 'international' }),
        ssn: `${faker.number.int({ min: 100, max: 999 })}-${faker.number.int({ min: 10, max: 99 })}-${faker.number.int({ min: 1000, max: 9999 })}`,
        userName: `APB${firstName}${randomNum}`,
        password: 'ParabankBanking@1234'
      };
      await registrationPage.registerUserWithDetails(
        regUserDetails.firstName, regUserDetails.lastName,
        regUserDetails.address, regUserDetails.city, regUserDetails.state,
        regUserDetails.zipCode, regUserDetails.phone, regUserDetails.ssn,
        regUserDetails.userName, regUserDetails.password)

      console.log(`The UserName and Password is: ${regUserDetails.userName}, ${regUserDetails.password}`)

      await registrationPage.verifyWelcomePageHeader(regUserDetails.userName)
      await landingPage.clickOnLogout()
    });


    await test.step('Login with the newly created user', async () => {
      await landingPage.insertUserNamePassswordAndClickOnLoginButton(regUserDetails.userName, regUserDetails.password)
      await overviewPage.verifyAccountsOverviewHeaderVisibility()
    });

    await test.step('Verify the Accounts overview page is displaying the balance details as expected', async () => {
      depositedAmount = "$515.50"
      defaultAccountNumber = await overviewPage.getDefaultAccountNumber()
      console.log(` Default account number is: ${defaultAccountNumber}`);
      await overviewPage.verifyBalanceDetailsForSpecificAccount(defaultAccountNumber, depositedAmount, depositedAmount, depositedAmount)//Currently assuming an example amount as balance, availableamout & total amount
    })

    await test.step('Verify Global navigation menu', async () => {
      await overviewPage.verifyGlobalMenuNavigation()
    });

    await test.step('Create a savings account and capture account number', async () => {
      await overviewPage.clickOnOpenNewAccountLink()
      await openNewAccountPage.verifyPageHeaderVisibility()
      await openNewAccountPage.selectSpecificAccountType("SAVINGS")
      await openNewAccountPage.clickOnOpenNewAccountButton()
      newlyCreatedAccountNumber = await openNewAccountPage.getNewlyCreatedAccountNumber()
      console.log(` New account number is: ${newlyCreatedAccountNumber}`);
    });

    await test.step('Validate account balance in Accounts Overview page', async () => {
      await overviewPage.clickOnAccountsOverviewLink()
      newAccountOpeningAmount = "$100.00"
      depositedAmount = "$515.50"
      const depositedAmountNum = parseFloat(depositedAmount.replace('$', ''));
      const openingAmountNum = parseFloat(newAccountOpeningAmount.replace('$', ''));

      const expectedAmountAfterNewAccountCreation = depositedAmountNum - openingAmountNum;
      const amountAsString = `$${expectedAmountAfterNewAccountCreation.toFixed(2).toString()}`;
      await overviewPage.verifyBalanceDetailsForSpecificAccount(defaultAccountNumber, amountAsString, amountAsString, depositedAmount)//Currently assuming an example amount as balance, availableamout & total amount
      await overviewPage.verifyBalanceDetailsForSpecificAccount(newlyCreatedAccountNumber, newAccountOpeningAmount, newAccountOpeningAmount, depositedAmount)//Currently assuming an example amount as balance, availableamout & total amount

    });

    await test.step('Transfer funds from the new account to another', async () => {
      transferAmount = (Math.random() * 9 + 1).toFixed(2);
      await overviewPage.clickOnFundTransferLink()
      await transferFunds.transferFundsWithDetails(transferAmount, newlyCreatedAccountNumber, defaultAccountNumber)
    });

    await test.step('Pay a bill using the new account', async () => {
      let payeeName = faker.person.fullName()
      billAmount = (Math.random() * 9 + 1).toFixed(2);
      await overviewPage.clickOnBillPayLink()
      await billPayPage.verifyBillPayPageHeaderVisibility()
      await billPayPage.payBillUsingAccount(
        payeeName, faker.location.street(), faker.location.city(),
        faker.location.state(), faker.location.zipCode(), faker.phone.number({ style: 'international' }),
        faker.finance.accountNumber(), billAmount, newlyCreatedAccountNumber)

      await billPayPage.verifyBillPaymentSuccess(payeeName, billAmount, newlyCreatedAccountNumber)
    });


    await test.step('Saving data for API Scenario', async () => {
      const userName = regUserDetails.userName
      const password = regUserDetails.password
      const transactionData = {
        userName,
        password,
        newlyCreatedAccountNumber,
        billAmount
      };

      await commFunc.writeTestDataToFile(transactionData);
    });

  });
})
