import { months, getMonthlyData } from './data.js';

let chartInstance = null;

export function initChart() {
  const ctx = document.getElementById('barChart').getContext('2d');
  const { income, expenses } = getMonthlyData();
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months.map(m => m.charAt(0).toUpperCase() + m.slice(1)),
      datasets: [
        {
          label: 'Income',
          data: income,
          backgroundColor: 'rgba(54, 162, 235, 0.7)'
        },
        {
          label: 'Expenses',
          data: expenses,
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

export function updateChart() {
  if (chartInstance) {
    const { income, expenses } = getMonthlyData();
    chartInstance.data.datasets[0].data = income;
    chartInstance.data.datasets[1].data = expenses;
    chartInstance.update();
  }
}

const chartCanvas = document.getElementById('barChart');
const pngDataUrl = chartCanvas.toDataURL('image/png');