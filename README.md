# SubhankarAssignment
This project is a robust end-to-end automation suite, built using **Playwright**, **JavaScript**, and **Faker.js**. It covers both **UI automation** and **REST API validation**, enabling full coverage from registration to transaction verification.

---

## Features Covered

###UI Test Scenarios
- User Registration with randomized credentials
- Login with newly created credentials
- Account creation (Savings account)
- Fund Transfer between accounts
- Bill Payment from an account
- Balance validation after each transaction
- Capturing and storing:
  - Default & newly created account numbers
  - Transfer amount
  - Bill amount
  - Session Cookie (`JSESSIONID`)

### API Test Scenarios
- Retrieve transactions using **amount-based filtering**
- Validate:
  - Response status
  - Account number match
  - Transaction amount match (from previous UI steps)

---

##Project Structure

```bash
parabanakAutomation/
├── CommonMethods/
│   └── commonFunctions.js         # Utility functions (launch, write-to-file, etc.)
├── helper/
│   └── apiHelper.js              # Reusable API request methods
├── pageObjects/
│   ├── landingPage.js
│   ├── registrationPage.js
│   ├── overviewPage.js
│   ├── openNewAccountPage.js
│   ├── transferFundsPage.js
│   └── billPayPage.js
├── testData/
│   ├── EnvironmentConfig.json     # Config for multiple environments
│   └── transactionDetails.json    # Stores test-generated runtime data (cookie, account numbers, etc.)
├── tests/
│   ├── uiTestScenarios.spec.js
│   └── apiTestScenarios.spec.js
├── playwright.config.js           # Playwright configuration (video, screenshots)
└── README.md
