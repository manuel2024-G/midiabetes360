let log = JSON.parse(localStorage.getItem('glucoseLog')) || [];

function addLog() {
  const glucoseInput = document.getElementById('glucose');
  const notesInput = document.getElementById('notes');
  const glucose = parseInt(glucoseInput.value);
  const notes = notesInput.value;

  if (!glucose) return alert('Por favor, ingresa tu nivel de glucosa.');

  const entry = {
    id: Date.now(),
    glucose,
    notes,
    timestamp: new Date().toLocaleString()
  };

  log.push(entry);
  localStorage.setItem('glucoseLog', JSON.stringify(log));
  glucoseInput.value = '';
  notesInput.value = '';
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
      ${entry.notes ? `<p>"${entry.notes}"</p>` : ''}
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