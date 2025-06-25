export const months = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

/**
 * Retrieves monthly income and expenses data from input fields in the DOM.
 *
 * Iterates over a predefined list of months, extracts the values from input fields
 * with IDs in the format `${month}-income` and `${month}-expenses`, parses them as floats,
 * and defaults to 0 if the value is not a valid number.
 *
 * @returns {{ income: number[], expenses: number[] }} An object containing two arrays:
 *   - income: Array of monthly income values.
 *   - expenses: Array of monthly expenses values.
 */
export function getMonthlyData() {
  const income = [];
  const expenses = [];
  months.forEach(month => {
    income.push(parseFloat(document.getElementById(`${month}-income`).value) || 0);
    expenses.push(parseFloat(document.getElementById(`${month}-expenses`).value) || 0);
  });
  return { income, expenses };
}