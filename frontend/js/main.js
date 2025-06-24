document.addEventListener('DOMContentLoaded', function () {
    // Holds the Chart.js instance so it can be updated later
    let chartInstance = null;

    // Array of month names for input IDs and chart labels
    const months = [
        'january', 'february', 'march', 'april', 'may', 'june',
        'july', 'august', 'september', 'october', 'november', 'december'
    ];

    // Collects income and expenses values from the input fields for each month
    function getMonthlyData() {
        const income = [];
        const expenses = [];
        months.forEach(month => {
            income.push(parseFloat(document.getElementById(`${month}-income`).value) || 0);
            expenses.push(parseFloat(document.getElementById(`${month}-expenses`).value) || 0);
        });
        return { income, expenses };
    }

    // Updates the chart with the latest input values
    function updateChart() {
        if (chartInstance) {
            const data = getMonthlyData();
            chartInstance.data.datasets[0].data = data.income;
            chartInstance.data.datasets[1].data = data.expenses;
            chartInstance.update();
        }
    }

    // Listen for tab shown event to initialize chart
    const chartTab = document.getElementById('chart-tab');
    chartTab.addEventListener('shown.bs.tab', function () {
        // Only create the chart once
        if (!chartInstance) {
            const ctx = document.getElementById('barChart').getContext('2d');
            const data = getMonthlyData();
            // Initialize the Chart.js bar chart
            chartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: months.map(m => m.charAt(0).toUpperCase() + m.slice(1)), // Capitalize month names
                    datasets: [
                        {
                            label: 'Income',
                            data: data.income,
                            backgroundColor: 'rgba(54, 162, 235, 0.7)'
                        },
                        {
                            label: 'Expenses',
                            data: data.expenses,
                            backgroundColor: 'rgba(255, 99, 132, 0.7)'
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { position: 'top' },
                        title: { display: true, text: 'Monthly Income vs Expenses' }
                    }
                }
            });
        }
        // Update the chart in case input values changed before tab was shown
        updateChart();
    });

    // Add event listeners to all income and expenses inputs for dynamic chart updates
    months.forEach(month => {
        ['income', 'expenses'].forEach(type => {
            const input = document.getElementById(`${month}-${type}`);
            if (input) {
                input.addEventListener('input', updateChart);
            }
        });
    });
        // ...existing code...
    
    // Download Excel functionality
    document.getElementById('download-excel').addEventListener('click', function () {
        // Prepare data for Excel
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const { income, expenses } = (typeof getMonthlyData === 'function') ? getMonthlyData() : { income: [], expenses: [] };
    
        // Build worksheet data
        const ws_data = [
            ['Month', 'Income', 'Expenses'],
            ...months.map((month, i) => [month, income[i] || 0, expenses[i] || 0])
        ];
    
        // Create worksheet and workbook
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Bucks2Bar Data");
    
        // Trigger download
        XLSX.writeFile(wb, "bucks2bar-data.xlsx");
    });
});