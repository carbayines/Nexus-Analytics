document.addEventListener('DOMContentLoaded', () => {

  // --- 1. MENÚ MÓVIL (HAMBURGUESA) ---
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      siteNav.classList.toggle('open');
    });
  }

  // --- 2. CALCULADORA DE ROI ---
  const estructura = document.getElementById('estructura');
  const visibilidad = document.getElementById('visibilidad');
  const estructuraValue = document.getElementById('estructura-value');
  const visibilidadValue = document.getElementById('visibilidad-value');
  const resultadoAnual = document.getElementById('resultado-anual');
  const resultadoPotencial = document.getElementById('resultado-potencial');

  function updateCalculator() {
    if (!estructura || !visibilidad || !resultadoAnual || !resultadoPotencial) return;

    const vEst = parseInt(estructura.value, 10);
    const vVis = parseInt(visibilidad.value, 10);

    // Actualizar etiquetas UI
    estructuraValue.textContent = vEst;
    visibilidadValue.textContent = vVis + "h";

    // Lógica de Cálculo de Ahorro (Estimación: vVis * 52 semanas * coste h * factor desorden)
    // Supongamos un coste hora promedio desperdiciada de 40€
    const costeHora = 40;
    const ahorroEstimado = Math.round(vVis * 52 * costeHora * (0.3 + (vEst * 0.15)));
    
    resultadoAnual.textContent = `€ ${ahorroEstimado.toLocaleString()}`;

    // Lógica de producto sugerido
    if (vEst > 3) {
      resultadoPotencial.textContent = "Limpieza & Migración";
    } else if (vVis > 10) {
      resultadoPotencial.textContent = "Dashboards / BI";
    } else {
      resultadoPotencial.textContent = "Modelo Machine Learning";
    }
  }

  // Listeners de los rangos
  if (estructura && visibilidad) {
    [estructura, visibilidad].forEach(input => {
      input.addEventListener('input', updateCalculator);
    });
    // Llamada inicial para establecer valores
    updateCalculator();
  }


  // --- 3. FORMULARIO CONTACTO (FORMSPREE) ---
  const form = document.querySelector('.contact-form');
  const formStatus = document.getElementById('form-status');

  if (form) {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      formStatus.textContent = 'Enviando...';
      formStatus.style.color = 'var(--text)';

      const data = new FormData(form);

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' }
        });

        if (response.ok) {
          formStatus.textContent = '✅ Mensaje enviado correctamente. Nos pondremos en contacto pronto.';
          formStatus.style.color = 'var(--primary)';
          form.reset();
        } else {
          formStatus.textContent = '❌ Ocurrió un error al enviar el mensaje. Inténtalo de nuevo.';
          formStatus.style.color = '#ff4b4b';
        }
      } catch (error) {
        formStatus.textContent = '❌ Error de conexión al enviar el mensaje.';
        formStatus.style.color = '#ff4b4b';
      }
    });
  }


  // --- 4. BANNER DE COOKIES ---
  const cookieBanner = document.getElementById('cookie-banner');
  const acceptCookiesBtn = document.getElementById('accept-cookies');
  const rejectCookiesBtn = document.getElementById('reject-cookies');

  // Comprobar si ya se tomó una decisión (sessionStorage para esta sesión o localStorage para siempre)
  const cookieDecision = localStorage.getItem('nexus-cookie-decision');

  if (!cookieDecision && cookieBanner) {
    // Si no hay decisión, mostrar banner con un pequeño delay
    setTimeout(() => {
        cookieBanner.classList.add('show');
    }, 1500);
  }

  function handleCookieDecision(decision) {
    localStorage.setItem('nexus-cookie-decision', decision);
    if(cookieBanner) cookieBanner.classList.remove('show');
    // Aquí se activarían/desactivarían scripts de seguimiento (analytics, ads, etc.)
  }

  if (acceptCookiesBtn) acceptCookiesBtn.addEventListener('click', () => handleCookieDecision('accepted'));
  if (rejectCookiesBtn) rejectCookiesBtn.addEventListener('click', () => handleCookieDecision('rejected'));

});
