/**
 * @jest-environment jsdom
 */
import { months, getMonthlyData } from '../js/data.js';


// Helper to create and append input elements to the DOM
function setupInputs(values = {}) {
  months.forEach(month => {
    // Income input
    const incomeInput = document.createElement('input');
    incomeInput.type = 'number';
    incomeInput.id = `${month}-income`;
    incomeInput.value = values[`${month}-income`] !== undefined ? values[`${month}-income`] : '';
    document.body.appendChild(incomeInput);

    // Expenses input
    const expensesInput = document.createElement('input');
    expensesInput.type = 'number';
    expensesInput.id = `${month}-expenses`;
    expensesInput.value = values[`${month}-expenses`] !== undefined ? values[`${month}-expenses`] : '';
    document.body.appendChild(expensesInput);
  });
}

// Helper to clean up inputs after each test
function cleanupInputs() {
  months.forEach(month => {
    const incomeInput = document.getElementById(`${month}-income`);
    const expensesInput = document.getElementById(`${month}-expenses`);
    if (incomeInput) incomeInput.remove();
    if (expensesInput) expensesInput.remove();
  });
}

describe('getMonthlyData', () => {
  afterEach(() => {
    cleanupInputs();
  });

  it('returns zeros when all inputs are empty', () => {
    setupInputs();
    const { income, expenses } = getMonthlyData();
    expect(income).toHaveLength(months.length);
    expect(expenses).toHaveLength(months.length);
    expect(income.every(val => val === 0)).toBe(true);
    expect(expenses.every(val => val === 0)).toBe(true);
  });

  it('returns correct values for filled inputs', () => {
    const values = {};
    months.forEach((month, i) => {
      values[`${month}-income`] = (i + 1) * 100;
      values[`${month}-expenses`] = (i + 1) * 10;
    });
    setupInputs(values);
    const { income, expenses } = getMonthlyData();
    expect(income).toEqual(months.map((_, i) => (i + 1) * 100));
    expect(expenses).toEqual(months.map((_, i) => (i + 1) * 10));
  });

  it('parses float values and defaults to 0 for invalid numbers', () => {
    const values = {
      'january-income': '123.45',
      'january-expenses': '67.89',
      'february-income': 'not-a-number',
      'february-expenses': '',
    };
    setupInputs(values);
    const { income, expenses } = getMonthlyData();
    expect(income[0]).toBeCloseTo(123.45);
    expect(expenses[0]).toBeCloseTo(67.89);
    expect(income[1]).toBe(0);
    expect(expenses[1]).toBe(0);
  });
});