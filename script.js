const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const form = document.querySelector('.contact-form');
const formStatus = document.getElementById('form-status');
const cookieBanner = document.getElementById('cookie-banner');
const acceptCookies = document.getElementById('accept-cookies');
const rejectCookies = document.getElementById('reject-cookies');

const estructura = document.getElementById('estructura');
const visibilidad = document.getElementById('visibilidad');
const prediccion = document.getElementById('prediccion');
const estructuraValue = document.getElementById('estructura-value');
const visibilidadValue = document.getElementById('visibilidad-value');
const prediccionValue = document.getElementById('prediccion-value');
const resultadoAnual = document.getElementById('resultado-anual');
const resultadoPotencial = document.getElementById('resultado-potencial');
const calcBarFill = document.getElementById('calc-bar-fill');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    siteNav.classList.toggle('open');
  });

  siteNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function updateCalculator() {
  const e = Number(estructura.value);
  const v = Number(visibilidad.value);
  const p = Number(prediccion.value);
  const score = ((e + v + p) / 3).toFixed(1);

  estructuraValue.textContent = `${e} / 10`;
  visibilidadValue.textContent = `${v} / 10`;
  prediccionValue.textContent = `${p} / 10`;

  let level = 'Inicial';
  let priority = 'Estructurar y unificar';
  let width = 24;

  if (score >= 4.5 && score < 7) {
    level = 'Intermedia';
    priority = 'Mejorar visibilidad y análisis';
    width = 56;
  } else if (score >= 7) {
    level = 'Avanzada';
    priority = 'Escalar predicción y optimización';
    width = 84;
  }

  resultadoAnual.textContent = level;
  resultadoPotencial.textContent = priority;
  calcBarFill.style.width = `${width}%`;
}

[estructura, visibilidad, prediccion].forEach(input => {
  input?.addEventListener('input', updateCalculator);
});

updateCalculator();

if (form) {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    formStatus.textContent = 'Enviando solicitud...';

    const data = new FormData(form);
    data.append('Madurez de datos', resultadoAnual.textContent);
    data.append('Prioridad recomendada', resultadoPotencial.textContent);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });

      const result = await response.json();

      if (result.success) {
        formStatus.textContent = 'Solicitud enviada correctamente. Te responderemos lo antes posible.';
        form.reset();
        updateCalculator();
      } else {
        formStatus.textContent = 'No se pudo enviar el formulario. Revisa los campos e inténtalo de nuevo.';
      }
    } catch (error) {
      formStatus.textContent = 'Ha ocurrido un error al enviar. Comprueba tu conexión e inténtalo de nuevo.';
    }
  });
}

const cookieDecision = sessionStorage.getItem('nexus-cookie-choice');
if (!cookieDecision && cookieBanner) {
  cookieBanner.classList.add('show');
}

function closeCookieBanner(choice) {
  sessionStorage.setItem('nexus-cookie-choice', choice);
  cookieBanner?.classList.remove('show');
}

acceptCookies?.addEventListener('click', () => closeCookieBanner('accepted'));
rejectCookies?.addEventListener('click', () => closeCookieBanner('rejected'));
