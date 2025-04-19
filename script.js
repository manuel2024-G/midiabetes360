let log = JSON.parse(localStorage.getItem('glucoseLog')) || [];

document.getElementById('meal').addEventListener('change', (e) => {
  document.getElementById('meal-other').style.display = e.target.value === 'otro' ? 'block' : 'none';
});
document.getElementById('feeling').addEventListener('change', (e) => {
  document.getElementById('feeling-other').style.display = e.target.value === 'otro' ? 'block' : 'none';
});
document.getElementById('activity').addEventListener('change', (e) => {
  document.getElementById('activity-other').style.display = e.target.value === 'otro' ? 'block' : 'none';
});

function addLog() {
  const glucose = parseInt(document.getElementById('glucose').value);
  if (!glucose) return alert('Por favor, ingresa tu nivel de glucosa.');

  const feeling = document.getElementById('feeling').value === 'otro'
    ? document.getElementById('feeling-other').value
    : document.getElementById('feeling').value;

  const meal = document.getElementById('meal').value === 'otro'
    ? document.getElementById('meal-other').value
    : document.getElementById('meal').value;

  const activity = document.getElementById('activity').value === 'otro'
    ? document.getElementById('activity-other').value
    : document.getElementById('activity').value;

  const entry = {
    id: Date.now(),
    glucose,
    feeling,
    meal,
    activity,
    timestamp: new Date().toLocaleString()
  };

  log.push(entry);
  localStorage.setItem('glucoseLog', JSON.stringify(log));
  renderLog();
  renderChart();
}

function renderLog() {
  const history = document.getElementById('history');
  history.innerHTML = '';
  log.slice().reverse().forEach(entry => {
    const div = document.createElement('div');
    div.className = 'entry';
    div.innerHTML = `
      <strong>${entry.timestamp}</strong><br>
      Glucosa: <span>${entry.glucose} mg/dL</span><br>
      Estado: ${entry.feeling}<br>
      Comida reciente: ${entry.meal}<br>
      Actividad: ${entry.activity}
    `;
    history.appendChild(div);
  });
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
      plugins: {
        legend: { display: true },
        title: { display: false }
      }
    }
  });
}

renderLog();
renderChart();