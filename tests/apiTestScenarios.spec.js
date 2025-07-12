import { test, expect } from '@playwright/test';
import { fetchTransactionsByAmount } from '../CommonMethods/apiHelper.js';
import transactiondetails from '../testData/transactionDetails.json'
import environmentData from '../testData/EnvironmentConfig.json'
import { LandingPage } from '../pageObjects/landingPage';
import { CommonFunctions } from '../CommonMethods/commonFunctions';

let JSESSIONID;

const env = `${process.env.ENVIRONMENT}`;
console.log(`env`)
const testData = environmentData[env]

test('API Test Scenarios', async ({ page }) => {

  const commFunc = new CommonFunctions(page);
  const landingPage = new LandingPage(page)

  await test.step('User navigate to Para bank application', async () => {
    await commFunc.launchUrl(testData.URL);
    await landingPage.verifyCustomerLoginHeaderVisibility()
  });

  await test.step('Login with the newly created user', async () => {
    await landingPage.insertUserNamePassswordAndClickOnLoginButton(transactiondetails.userName, transactiondetails.password)

    //Saving JSESSIONID cookie data here
    const cookies = await page.context().cookies();
    const jsessionCookie = cookies.find(cookie => cookie.name === 'JSESSIONID');
    JSESSIONID = jsessionCookie?.value
  });

  await test.step('Search Transaction by amount', async () => {
    const cookie = `JSESSIONID=${JSESSIONID}`;
    const accountId = transactiondetails.newlyCreatedAccountNumber;
    const amount = transactiondetails.billAmount;

    const transactions = await fetchTransactionsByAmount(cookie, accountId, amount);

    expect(transactions.length).toBeGreaterThan(0);
  })

});