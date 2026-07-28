
(() => {
  const body = document.body;
  const root = body.dataset.root || ".";
  const page = body.dataset.page || "";
  const path = (value) => `${root}/${value}`.replace("././", "./");

  const headerTarget = document.querySelector("[data-site-header]");
  const footerTarget = document.querySelector("[data-site-footer]");

  const navItem = (href, label, key) => {
    const current = page === key ? ' aria-current="page"' : "";
    return `<a class="nav-link" href="${path(href)}"${current}>${label}</a>`;
  };

  if (headerTarget) {
    headerTarget.innerHTML = `
      <div class="announcement">Entrena con intención · Progresa con método · Mejora cada día</div>
      <header class="site-header">
        <div class="container nav-shell">
          <a class="brand" href="${path("index.html")}" aria-label="FitCenter UH, inicio">
            <img src="${path("img/logo-fitcenter-uh.png")}" alt="" width="54" height="54">
            <span>FitCenter UH</span>
          </a>
          <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-navigation" aria-label="Abrir menú">
            <span class="menu-toggle-lines" aria-hidden="true"></span>
          </button>
          <nav class="main-nav" id="main-navigation" aria-label="Navegación principal">
            ${navItem("index.html", "Inicio", "inicio")}
            ${navItem("nosotros.html", "Nosotros", "nosotros")}
            <details class="nav-dropdown"${page.startsWith("rutina") ? " open" : ""}>
              <summary class="nav-summary">Rutinas</summary>
              <div class="nav-submenu">
                <a href="${path("rutinas.html")}">Ver todas</a>
                <a href="${path("rutinas/bulking.html")}">Bulking</a>
                <a href="${path("rutinas/definicion.html")}">Definición</a>
                <a href="${path("rutinas/perdida-peso.html")}">Pérdida de peso</a>
              </div>
            </details>
            <details class="nav-dropdown"${page.startsWith("nutricionista") ? " open" : ""}>
              <summary class="nav-summary">Nutricionistas</summary>
              <div class="nav-submenu">
                <a href="${path("nutricionistas.html")}">Ver equipo</a>
                <a href="${path("nutricionistas/nutricionista-1.html")}">Lic. Daniela Mora</a>
                <a href="${path("nutricionistas/nutricionista-2.html")}">Lic. Andrés Quesada</a>
              </div>
            </details>
            ${navItem("preguntas-frecuentes.html", "Preguntas", "preguntas")}
            <a class="nav-cta" href="${path("contacto.html")}">Hablemos</a>
          </nav>
        </div>
      </header>
    `;
  }

  if (footerTarget) {
    footerTarget.innerHTML = `
      <footer class="site-footer">
        <div class="container footer-main">
          <div class="footer-brand">
            <img src="${path("img/logo-fitcenter-uh.png")}" alt="FitCenter UH — Entrena, mejora">
            <p>Rutinas con propósito y acompañamiento nutricional para convertir tus objetivos en progreso real.</p>
          </div>
          <div class="footer-column">
            <h2>Explorar</h2>
            <ul>
              <li><a href="${path("nosotros.html")}">Nosotros</a></li>
              <li><a href="${path("rutinas.html")}">Rutinas</a></li>
              <li><a href="${path("nutricionistas.html")}">Nutricionistas</a></li>
              <li><a href="${path("preguntas-frecuentes.html")}">Preguntas frecuentes</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h2>Programas</h2>
            <ul>
              <li><a href="${path("rutinas/bulking.html")}">Bulking</a></li>
              <li><a href="${path("rutinas/definicion.html")}">Definición</a></li>
              <li><a href="${path("rutinas/perdida-peso.html")}">Pérdida de peso</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h2>Contacto</h2>
            <ul>
              <li><a href="mailto:hola@fitcenteruh.com">hola@fitcenteruh.com</a></li>
              <li><a href="https://wa.me/50600000000" target="_blank" rel="noopener">WhatsApp</a></li>
              <li><a href="${path("contacto.html")}">Formulario de contacto</a></li>
              <li><a href="${path("contacto.html#privacidad")}">Privacidad</a></li>
            </ul>
          </div>
        </div>
        <div class="container footer-bottom">
          <p>© <span data-current-year></span> FitCenter UH. Todos los derechos reservados.</p>
          <p>Las rutinas son informativas y no sustituyen valoración médica o profesional.</p>
        </div>
      </footer>
    `;
  }

  const menuButton = document.querySelector(".menu-toggle");
  if (menuButton) {
    menuButton.addEventListener("click", () => {
      const isOpen = body.classList.toggle("nav-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
    });
  }

  document.querySelectorAll(".main-nav a").forEach((link) => {
    link.addEventListener("click", () => {
      body.classList.remove("nav-open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelectorAll("[data-current-year]").forEach((year) => {
    year.textContent = new Date().getFullYear();
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const filterButtons = document.querySelectorAll("[data-routine-filter]");
  const routineCards = document.querySelectorAll("[data-routine]");
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selected = button.dataset.routineFilter;
      filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
      routineCards.forEach((card) => {
        card.hidden = selected !== "all" && card.dataset.routine !== selected;
      });
    });
  });

  const form = document.querySelector("[data-contact-form]");
  const formMessage = document.querySelector("[data-form-message]");
  if (form && formMessage) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const firstName = new FormData(form).get("nombre") || "";
      formMessage.textContent = `¡Gracias${firstName ? `, ${firstName}` : ""}! Recibimos tu consulta. Te contactaremos dentro de nuestro horario de atención.`;
      formMessage.classList.add("is-visible");
      form.reset();
      formMessage.focus();
    });
  }
})();
