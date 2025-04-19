
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

function getStatus(glucose) {
  if (glucose <= 99) return { class: 'status-normal', text: '✅ Nivel normal' };
  if (glucose <= 125) return { class: 'status-alerta', text: '⚠️ Nivel de alerta' };
  return { class: 'status-alto', text: '🚨 Nivel alto, consulte a su médico' };
}

function clearForm() {
  document.getElementById('glucose').value = '';
  document.getElementById('feeling').value = 'muy bien';
  document.getElementById('meal').value = 'arepa con queso';
  document.getElementById('activity').value = 'sedentario';
  document.getElementById('feeling-other').value = '';
  document.getElementById('meal-other').value = '';
  document.getElementById('activity-other').value = '';
  document.getElementById('feeling-other').style.display = 'none';
  document.getElementById('meal-other').style.display = 'none';
  document.getElementById('activity-other').style.display = 'none';
}

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
  clearForm();
}

function deleteEntry(id) {
  if (confirm('¿Estás seguro que deseas eliminar este registro?')) {
    log = log.filter(e => e.id !== id);
    localStorage.setItem('glucoseLog', JSON.stringify(log));
    renderLog();
    renderChart();
  }
}

function renderLog() {
  const history = document.getElementById('history');
  history.innerHTML = '';
  log.slice().reverse().forEach(entry => {
    const status = getStatus(entry.glucose);
    const div = document.createElement('div');
    div.className = 'entry';
    div.innerHTML = `
      <button class="delete-btn" onclick="deleteEntry(${entry.id})">🗑️</button>
      <strong>${entry.timestamp}</strong> 
      <span class="status ${status.class}">${status.text}</span><br>
      Glucosa: <span>${entry.glucose} mg/dL</span><br>
      Estado: ${entry.feeling}<br>
      Comida reciente: ${entry.meal}<br>
      Actividad: ${entry.activity}
    `;
    history.appendChild(div);
  });
}

function renderChart() {
  const canvas = document.getElementById('glucoseChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (window.glucoseChart && typeof window.glucoseChart.destroy === 'function') {
    window.glucoseChart.destroy();
  }
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
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true },
        title: { display: false }
      },
      scales: {
        y: { beginAtZero: false }
      }
    }
  });
}

function exportPDF() {
  const canvas = document.getElementById('glucoseChart');
  const imgData = canvas.toDataURL('image/png');
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  pdf.text('MiDiabetes360 - Gráfico de Glucosa', 10, 10);
  pdf.addImage(imgData, 'PNG', 10, 20, 180, 100);
  pdf.save('glucosa.pdf');
}

renderLog();
renderChart();
