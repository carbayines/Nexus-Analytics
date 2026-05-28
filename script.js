const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const form = document.querySelector('.contact-form');
const formStatus = document.getElementById('form-status');
const cookieBanner = document.getElementById('cookie-banner');
const acceptCookies = document.getElementById('accept-cookies');
const rejectCookies = document.getElementById('reject-cookies');

const empleados = document.getElementById('empleados');
const horas = document.getElementById('horas');
const coste = document.getElementById('coste');
const empleadosValue = document.getElementById('empleados-value');
const horasValue = document.getElementById('horas-value');
const costeValue = document.getElementById('coste-value');
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

function formatCurrency(value) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
}

function updateCalculator() {
  const e = Number(empleados.value);
  const h = Number(horas.value);
  const c = Number(coste.value);
  const annualCost = e * h * c * 52;

  empleadosValue.textContent = `${e} ${e === 1 ? 'persona' : 'personas'}`;
  horasValue.textContent = `${h} ${h === 1 ? 'hora' : 'horas'}`;
  costeValue.textContent = `${c} €/hora`;
  resultadoAnual.textContent = formatCurrency(annualCost);

  let level = 'Bajo';
  let width = 28;

  if (annualCost >= 15000 && annualCost < 40000) {
    level = 'Medio';
    width = 56;
  } else if (annualCost >= 40000) {
    level = 'Alto';
    width = 86;
  }

  resultadoPotencial.textContent = level;
  calcBarFill.style.width = `${width}%`;
}

[empleados, horas, coste].forEach(input => {
  input?.addEventListener('input', updateCalculator);
});

updateCalculator();

if (form) {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    formStatus.textContent = 'Enviando solicitud...';

    const data = new FormData(form);
    data.append('Estimación anual calculadora', resultadoAnual.textContent);
    data.append('Potencial de mejora', resultadoPotencial.textContent);

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
