document.addEventListener('DOMContentLoaded', () => {

  // --- 1. MENÚ MÓVIL (HAMBURGUESA) ---
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      siteNav.classList.toggle('open');
    });
  }

  // --- 2. CALCULADORA DE ROI (CON ANIMACIÓN GSAP) ---
  const estructura = document.getElementById('estructura');
  const visibilidad = document.getElementById('visibilidad');
  const estructuraValue = document.getElementById('estructura-value');
  const visibilidadValue = document.getElementById('visibilidad-value');
  const resultadoAnual = document.getElementById('resultado-anual');
  const resultadoPotencial = document.getElementById('resultado-potencial');

  // Objeto base para que GSAP pueda animar los números (Motion Dev)
  let estadoCalculadora = { ahorro: 0 };

  function updateCalculator() {
    if (!estructura || !visibilidad || !resultadoAnual || !resultadoPotencial) return;

    const vEst = parseInt(estructura.value, 10);
    const vVis = parseInt(visibilidad.value, 10);

    estructuraValue.textContent = vEst;
    visibilidadValue.textContent = vVis + "h";

    const costeHora = 40;
    const ahorroEstimado = Math.round(vVis * 52 * costeHora * (0.3 + (vEst * 0.15)));
    
    // Animación de conteo fluido de euros
    if (typeof gsap !== "undefined") {
      gsap.to(estadoCalculadora, {
        ahorro: ahorroEstimado,
        duration: 0.8,
        ease: "power2.out",
        onUpdate: function() {
          resultadoAnual.textContent = `€ ${Math.round(estadoCalculadora.ahorro).toLocaleString()}`;
        }
      });
    } else {
      // Fallback si falla la librería
      resultadoAnual.textContent = `€ ${ahorroEstimado.toLocaleString()}`;
    }

    if (vEst > 3) {
      resultadoPotencial.textContent = "Limpieza & Migración";
    } else if (vVis > 10) {
      resultadoPotencial.textContent = "Dashboards / BI";
    } else {
      resultadoPotencial.textContent = "Modelo Machine Learning";
    }
  }

  if (estructura && visibilidad) {
    [estructura, visibilidad].forEach(input => {
      input.addEventListener('input', updateCalculator);
    });
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

  const cookieDecision = localStorage.getItem('nexus-cookie-decision');

  if (!cookieDecision && cookieBanner) {
    setTimeout(() => {
        cookieBanner.classList.add('show');
    }, 1500);
  }

  function handleCookieDecision(decision) {
    localStorage.setItem('nexus-cookie-decision', decision);
    if(cookieBanner) cookieBanner.classList.remove('show');
  }

  if (acceptCookiesBtn) acceptCookiesBtn.addEventListener('click', () => handleCookieDecision('accepted'));
  if (rejectCookiesBtn) rejectCookiesBtn.addEventListener('click', () => handleCookieDecision('rejected'));


  // --- 5. ANIMACIONES GSAP (SCROLL Y FLOAT) ---
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    // Animación de aparición de las tarjetas de Servicios
    gsap.from(".service-card", {
      scrollTrigger: {
        trigger: ".services-grid",
        start: "top 85%"
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2, // Cada tarjeta aparece una tras otra
      ease: "power3.out"
    });

    // Animación de aparición de las Herramientas/Demos
    gsap.from(".tool-card", {
      scrollTrigger: {
        trigger: ".tools-grid",
        start: "top 85%"
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: "power3.out"
    });

    // Animación flotante continua para el Tech Stack (Base de datos, Python, AWS...)
    gsap.utils.toArray(".stack-icon").forEach((icon, i) => {
      gsap.to(icon, {
        y: "-15px",
        duration: 2 + Math.random(), // Cada icono flota a una velocidad un poco diferente
        repeat: -1,
        yoyo: true, // Va y vuelve suavemente
        ease: "sine.inOut",
        delay: Math.random() * 2
      });
    });
  }

});
