
// JavaScript básico para comportamiento de glucosa (solo para ejemplo)
document.addEventListener("DOMContentLoaded", function () {
  let log = JSON.parse(localStorage.getItem("glucoseLog")) || [];

  function getAverage() {
    if (!log.length) return 0;
    return (log.reduce((a, b) => a + b.glucose, 0) / log.length).toFixed(1);
  }

  function renderChart() {
    const ctx = document.getElementById('glucoseChart').getContext('2d');
    if (window.glucoseChart) window.glucoseChart.destroy();
    window.glucoseChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: log.map(e => e.timestamp),
        datasets: [{
          label: 'Nivel de Glucosa',
          data: log.map(e => e.glucose),
          borderColor: '#0a1f44',
          backgroundColor: 'rgba(10,31,68,0.2)',
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  renderChart();
});
