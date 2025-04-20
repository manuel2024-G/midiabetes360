
import Chart from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.min.mjs';

const user = JSON.parse(localStorage.getItem("userSession"));
if (user?.name) {
  document.getElementById("userGreeting").textContent = "Hola " + user.name + " 👋";
}
if (user?.foto) {
  const img = new Image();
  img.src = user.foto.match(/src="([^"]*)"/)?.[1] || "";
  img.style.width = "100%";
  img.style.height = "100%";
  img.style.objectFit = "cover";
  document.getElementById("userPhoto").appendChild(img);
}

let log = JSON.parse(localStorage.getItem('glucoseLog')) || [];

document.getElementById('feeling').addEventListener('change', e => {
  document.getElementById('feeling-other').style.display = e.target.value === 'otro' ? 'block' : 'none';
});
document.getElementById('meal').addEventListener('change', e => {
  document.getElementById('meal-other').style.display = e.target.value === 'otro' ? 'block' : 'none';
});
document.getElementById('activity').addEventListener('change', e => {
  document.getElementById('activity-other').style.display = e.target.value === 'otro' ? 'block' : 'none';
});

function getStatus(glucose) {
  if (glucose <= 99) return '✅ Normal';
  if (glucose <= 125) return '⚠️ Alerta';
  return '🚨 Alto';
}

function getRecommendation(avg) {
  if (avg <= 99) return "✅ Todo en orden. Mantén una dieta balanceada, hidrátate bien, haz ejercicio suave y monitorea tu glucosa cada 48 horas.";
  if (avg <= 125) return "⚠️ Estás en un rango de alerta. Evita alimentos procesados, bebe infusiones de canela y camina al menos 30 minutos diarios.";
  return "🚨 Nivel crítico. Considera atención médica inmediata. Evita carbohidratos simples y registra tus valores cada 6-8 horas.";
}

function getAverage() {
  if (!log.length) return 0;
  return (log.reduce((a, b) => a + b.glucose, 0) / log.length).toFixed(1);
}

window.addLog = function () {
  const glucose = parseInt(document.getElementById("glucose").value);
  if (!glucose) return alert("Ingresa un nivel de glucosa válido.");

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
    timestamp: new Date().toLocaleString(),
    glucose,
    feeling,
    meal,
    activity
  };

  log.push(entry);
  localStorage.setItem('glucoseLog', JSON.stringify(log));
  renderLog();
  renderChart();
};

function renderLog() {
  const container = document.getElementById('history');
  container.innerHTML = '';
  log.slice().reverse().forEach(e => {
    container.innerHTML += `
      <div class="entry">
        <strong>${e.timestamp}</strong><br>
        Glucosa: ${e.glucose} mg/dL (${getStatus(e.glucose)})<br>
        Estado: ${e.feeling}<br>
        Comida: ${e.meal}<br>
        Actividad: ${e.activity}
      </div>`;
  });

  const avg = getAverage();
  document.getElementById("avgValue").textContent = avg;
  document.getElementById("recommendationBox").textContent = getRecommendation(avg);
}

function renderChart() {
  const ctx = document.getElementById('glucoseChart').getContext('2d');
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
      maintainAspectRatio: false
    }
  });
}

window.generatePDF = function () {
  import('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js').then(jsPDF => {
    const { jsPDF: PDF } = jsPDF;
    const doc = new PDF();
    const avg = getAverage();
    const msg = getRecommendation(avg);
    doc.setFontSize(16);
    doc.text("Reporte Diario - MiDiabetes360", 20, 20);
    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleString()}`, 20, 35);
    doc.text(`Promedio de Glucosa: ${avg} mg/dL`, 20, 45);
    doc.text("Recomendación médica:", 20, 55);
    doc.text(msg, 20, 65, { maxWidth: 170 });
    doc.save("MiDiabetes360_Reporte.pdf");
  });
};

renderLog();
renderChart();
