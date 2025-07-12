// @ts-check
import { request, expect } from '@playwright/test';
import environmentData from '../testData/EnvironmentConfig.json'

const env = `${process.env.ENVIRONMENT}`;
console.log(`env`)
const testData = environmentData[env]

export async function fetchTransactionsByAmount(cookie, accountId, amount) {
  const endpoint = `/parabank/services_proxy/bank/accounts/${accountId}/transactions/amount/${amount}?timeout=30000`;
  const apiContext = await request.newContext({
    baseURL: testData.URL,
    extraHTTPHeaders: {
      'accept': '*/*',
      'x-requested-with': 'XMLHttpRequest',
      'cookie': cookie,
    }
  });

  const response = await apiContext.get(endpoint);
  console.log(`Sending GET request to: ${testData.URL}${endpoint}`);
  console.log(`Headers:`, {
    'accept': '*/*',
    'x-requested-with': 'XMLHttpRequest',
    'cookie': cookie,
  });
  console.log(response)
  expect(response.status()).toBe(200);

  const jsonData = await response.json();
  expect(Array.isArray(jsonData)).toBeTruthy();

  for (const tx of jsonData) {
    expect(tx.accountId).toBe(Number(accountId));
    expect(tx.amount).toBeCloseTo(Number(amount), 2);
    console.log(`Validated transaction ID ${tx.id} - Account: ${tx.accountId}, Amount: ${tx.amount}`);
  }

  console.log(`Transactions found for account ${accountId} and amount ${amount}:`, jsonData);
  return jsonData;
}
