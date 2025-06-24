import { months } from './data.js';
import { initChart, updateChart } from './chart.js';
import { setupExcelExport, setupEmailSend } from './excel.js';

// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', function () {
    // Initialize chart when the Chart tab is shown
    document.getElementById('chart-tab').addEventListener('shown.bs.tab', function () {
        // Only initialize the chart once
        if (!window.chartInitialized) {
            initChart();
            window.chartInitialized = true;
        }
        // Always update the chart when the tab is shown
        updateChart();
    });

    // Add input event listeners to all income and expenses fields for each month
    months.forEach(month => {
        ['income', 'expenses'].forEach(type => {
            const input = document.getElementById(`${month}-${type}`);
            if (input) {
                input.addEventListener('input', updateChart); // Update chart on input change
            }
        });
    });

    // Set up Excel export functionality
    setupExcelExport();
    // Set up email sending functionality
    setupEmailSend();
});