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

// Remove or disable the Excel email sending functionality
export function setupEmailSend() {
  // Disable the send-excel button
  const btn = document.getElementById('send-excel');
  if (btn) {
    btn.disabled = true;
    btn.title = 'This feature is currently unavailable.';
    btn.addEventListener('click', function () {
      alert('Sending Excel by email is currently unavailable.');
    });
  }
}

// Utility to convert dataURL to Blob
function dataURLtoBlob(dataurl) {
  const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
  for (let i = 0; i < n; i++) u8arr[i] = bstr.charCodeAt(i);
  return new Blob([u8arr], { type: mime });
}

// Function to capture chart as PNG and trigger download
export function setupChartScreenshotDownload() {
  const btn = document.getElementById('download-chart-png');
  if (!btn) return;
  btn.addEventListener('click', function () {
    const canvas = document.getElementById('barChart');
    if (!canvas) {
      alert('Chart canvas not found!');
      return;
    }
    const pngDataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = pngDataUrl;
    link.download = 'chart.png';
    link.click();
  });
}

// Sets up the email sending functionality for the chart PNG
export function setupChartEmailSend() {
  document.getElementById('send-chart').addEventListener('click', function () {
    const email = document.getElementById('email-input').value.trim();
    if (!email) {
      alert('Please enter a valid email address.');
      return;
    }
    // Get the chart as a PNG data URL
    const chartCanvas = document.getElementById('barChart');
    const pngDataUrl = chartCanvas.toDataURL('image/png');
    const pngBlob = dataURLtoBlob(pngDataUrl);

    // Prepare form data
    const formData = new FormData();
    formData.append('email', email);
    formData.append('file', pngBlob, 'chart.png');

    // Send the PNG file and email address to the server
    fetch('/api/send-chart', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (response.ok) {
        alert('Chart image sent successfully!');
      } else {
        alert('Failed to send chart image.');
      }
    })
    .catch(() => {
      alert('Error sending chart image.');
    });
  });
}