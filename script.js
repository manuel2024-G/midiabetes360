
window.addEventListener('DOMContentLoaded', () => {
  const container = document.createElement('div');
  container.innerHTML = `
    <section class="card">
      <h2>Gráfico de prueba - Vercel Test</h2>
      <canvas id="testChart" width="400" height="200"></canvas>
    </section>
  `;
  document.body.appendChild(container);

  const ctx = document.getElementById('testChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
      datasets: [{
        label: 'Niveles de energía',
        data: [65, 59, 80, 81, 56],
        backgroundColor: ['rgba(54, 162, 235, 0.6)'],
        borderColor: ['rgba(54, 162, 235, 1)'],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
});
