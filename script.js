const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const form = document.querySelector('.contact-form');
const formStatus = document.getElementById('form-status');
const cookieBanner = document.getElementById('cookie-banner');
const acceptCookies = document.getElementById('accept-cookies');
const rejectCookies = document.getElementById('reject-cookies');

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

if (form) {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    formStatus.textContent = 'Enviando solicitud...';

    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });

      const result = await response.json();

      if (result.success) {
        formStatus.textContent = 'Solicitud enviada correctamente. Revisa tu correo y te responderemos lo antes posible.';
        form.reset();
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