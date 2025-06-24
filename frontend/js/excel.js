import { months, getMonthlyData } from './data.js';

// Sets up the Excel export functionality
export function setupExcelExport() {
  // Add click event listener to the "download-excel" button
  document.getElementById('download-excel').addEventListener('click', function () {
    // Get income and expenses data for each month
    const { income, expenses } = getMonthlyData();
    // Prepare worksheet data: header row + data rows for each month
    const ws_data = [
      ['Month', 'Income', 'Expenses'],
      ...months.map((month, i) => [
        month.charAt(0).toUpperCase() + month.slice(1), // Capitalize month name
        income[i] || 0, // Use 0 if income is undefined
        expenses[i] || 0 // Use 0 if expenses is undefined
      ])
    ];
    // Create worksheet from data
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bucks2Bar Data");
    // Trigger file download as Excel file
    XLSX.writeFile(wb, "bucks2bar-data.xlsx");
  });
}

// Sets up the email sending functionality for the Excel file
export function setupEmailSend() {
  // Add click event listener to the "send-excel" button
  document.getElementById('send-excel').addEventListener('click', function () {
    // Get the email address from the input field
    const email = document.getElementById('email-input').value.trim();
    if (!email) {
      alert('Please enter a valid email address.');
      return;
    }
    // Get income and expenses data for each month
    const { income, expenses } = getMonthlyData();
    // Prepare worksheet data: header row + data rows for each month
    const ws_data = [
      ['Month', 'Income', 'Expenses'],
      ...months.map((month, i) => [
        month.charAt(0).toUpperCase() + month.slice(1), // Capitalize month name
        income[i] || 0, // Use 0 if income is undefined
        expenses[i] || 0 // Use 0 if expenses is undefined
      ])
    ];
    // Create worksheet from data
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    // Create a new workbook and append the worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Bucks2Bar Data");
    // Write workbook to a binary array
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    // Create a Blob from the binary array
    const file = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Prepare form data to send via fetch
    const formData = new FormData();
    formData.append('email', email);
    formData.append('file', file, 'bucks2bar-data.xlsx');

    // Send the Excel file and email address to the server
    fetch('/send-excel', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        alert('Email sent successfully!');
      } else {
        alert('this feature is not available yet.🥹');
      }
    })
    .catch(() => {
      alert('Error sending email.');
    });
  });
}