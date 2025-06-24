/**
 * @jest-environment jsdom
 */

import { setupExcelExport } from '../js/excel.js';


// Mock XLSX global
global.XLSX = {
  utils: {
    aoa_to_sheet: jest.fn(() => 'sheet'),
    book_new: jest.fn(() => 'workbook'),
    book_append_sheet: jest.fn(),
  },
  writeFile: jest.fn(),
};

jest.mock('../js/data.js', () => ({
  months: [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ],
  getMonthlyData: jest.fn(() => ({
    income: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
    expenses: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160]
  }))
}));

describe('setupExcelExport', () => {
  beforeEach(() => {
    document.body.innerHTML = '<button id="download-excel"></button>';
    jest.clearAllMocks();
  });

  it('attaches a click event to the download-excel button', () => {
    setupExcelExport();
    const btn = document.getElementById('download-excel');
    expect(btn).not.toBeNull();
    // Simulate click
    btn.click();
    // XLSX utils should be called with correct data
    expect(XLSX.utils.aoa_to_sheet).toHaveBeenCalled();
    expect(XLSX.utils.book_new).toHaveBeenCalled();
    expect(XLSX.utils.book_append_sheet).toHaveBeenCalledWith(
      'workbook',
      'sheet',
      'Bucks2Bar Data'
    );
    expect(XLSX.writeFile).toHaveBeenCalledWith(
      'workbook',
      'bucks2bar-data.xlsx'
    );
  });

  it('generates worksheet data with correct header and values', () => {
    setupExcelExport();
    const btn = document.getElementById('download-excel');
    btn.click();
    const ws_data = XLSX.utils.aoa_to_sheet.mock.calls[0][0];
    expect(ws_data[0]).toEqual(['Month', 'Income', 'Expenses']);
    expect(ws_data[1]).toEqual(['January', 100, 50]);
    expect(ws_data[12]).toEqual(['December', 1200, 160]);
  });
});