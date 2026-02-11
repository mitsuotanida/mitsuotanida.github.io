// ======================
// 1) CONFIGURACIÓN BÁSICA
// ======================

const profile = {
  name: "Mitsuo",
  email: "mtanidab@gmail.com",
  linkedin: "https://www.linkedin.com/in/mitsuotanida/",
  github: "https://github.com/mitsuotanida",
  stack: ["Python", "SQL", "Power BI", "R", "Power Automate", "Estadística"],
}; // Este objeto es tu “tarjeta de identidad”: sirve para mostrar tus links y tu stack sin tocar el HTML.

const projects = [
  {
    id: "proj-001",
    title: "Dashboard de Calidad Académica",
    year: 2026,
    type: "Datos",
    tags: ["data", "dashboard", "kpi", "etl"],
    summary: "Modelo de indicadores + pipeline de datos + visualización para seguimiento y toma de decisiones.",
    impact: "Reducción de tiempos de reportería y mejor visibilidad de alertas y tendencias.",
    links: {
      demo: "#",
      repo: "#",
    },
  }, // Proyecto 1: cada objeto representa una tarjeta. Solo lo duplicás y cambiás datos para sumar proyectos.

  {
    id: "proj-002",
    title: "Automatización de Ingesta (Email → Dataset)",
    year: 2026,
    type: "Automatización",
    tags: ["automation", "etl", "power-platform"],
    summary: "Flujo para recibir archivos por correo, validar estructura y actualizar el dataset automáticamente.",
    impact: "Menos trabajo manual y menos errores de carga.",
    links: {
      demo: "#",
      repo: "#",
    },
  }, // Proyecto 2: mismo formato. Así mantenés consistencia y el portafolio escala fácil.

  {
    id: "proj-003",
    title: "Simulación / Optimización de Procesos",
    year: 2025,
    type: "Analytics",
    tags: ["simulation", "optimization", "statistics"],
    summary: "Modelos para evaluar escenarios, riesgo y decisiones con enfoque cuantitativo.",
    impact: "Mejor planificación y decisiones con evidencia.",
    links: {
      demo: "#",
      repo: "#",
    },
  }, // Proyecto 3: podés mezclar temas (software, data, investigación, etc.) sin encasillarte.

  {
    id: "proj-004",
    title: "Web Portafolio (GitHub Pages)",
    year: 2026,
    type: "Web",
    tags: ["web", "frontend", "github-pages"],
    summary: "Sitio estático ligero, con filtro por tags y buscador, diseñado para crecer.",
    impact: "Presencia profesional y fácil actualización (agregar proyectos en 1 minuto).",
    links: {
      demo: "#",
      repo: "#",
    },
  }, // Proyecto 4: este mismo sitio; después reemplazás los links con los reales.
]; // Esta lista es tu “catálogo”: al agregar objetos aquí, se crean tarjetas automáticamente.

// ======================
// 2) ESTADO DE LA PÁGINA
// ======================

const state = {
  query: "",
  activeTag: "all",
  theme: localStorage.getItem("theme") || "dark",
}; // Este objeto guarda “cómo está la página ahora”: búsqueda, tag activo y tema.

const dom = {
  grid: document.getElementById("projectGrid"),
  empty: document.getElementById("emptyState"),
  tags: document.getElementById("tagContainer"),
  search: document.getElementById("txtBuscar"),
  clear: document.getElementById("btnLimpiar"),
  btnTema: document.getElementById("btnTema"),
  kpiTotal: document.getElementById("kpiTotal"),
  kpiTags: document.getElementById("kpiTags"),
  kpiFiltro: document.getElementById("kpiFiltro"),
  year: document.getElementById("year"),
  stackPills: document.getElementById("stackPills"),
  lnkEmail: document.getElementById("lnkEmail"),
  lnkLinkedIn: document.getElementById("lnkLinkedIn"),
  lnkGitHub: document.getElementById("lnkGitHub"),
}; // Este objeto es una “cajita de referencias”: guarda los elementos HTML para usarlos fácil.

// ======================
// 3) UTILIDADES (cosas pequeñas que ayudan)
// ======================

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
} // Esto “limpia” texto para que no rompa el HTML: sirve para mostrar contenido seguro.

function uniq(arr) {
  return [...new Set(arr)];
} // Esto saca repetidos: sirve para obtener tags únicos sin duplicados.

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme === "light" ? "light" : "dark");
  localStorage.setItem("theme", theme);
  state.theme = theme;
} // Esto cambia el modo oscuro/claro y lo guarda para la próxima vez.

// ======================
// 4) RENDER (dibujar la UI)
// ======================

function getAllTags() {
  const all = projects.flatMap(p => p.tags);
  return ["all", ...uniq(all).sort()];
} // Junta todos los tags de todos los proyectos y arma una lista única.

function renderTags() {
  const tags = getAllTags();
  dom.tags.innerHTML = tags.map(t => {
    const active = t === state.activeTag ? "tag tag--active" : "tag";
    const label = t === "all" ? "Todos" : t;
    return `<button class="${active}" type="button" data-tag="${escapeHtml(t)}">${escapeHtml(label)}</button>`;
  }).join("");
} // Dibuja los botones de tags arriba de la grilla.

function matchesFilters(p) {
  const q = state.query.trim().toLowerCase();
  const byQuery =
    !q ||
    p.title.toLowerCase().includes(q) ||
    p.summary.toLowerCase().includes(q) ||
    p.tags.some(t => t.toLowerCase().includes(q));

  const byTag = state.activeTag === "all" || p.tags.includes(state.activeTag);

  return byQuery && byTag;
} // Decide si un proyecto se muestra o no, según búsqueda y tag.

function renderProjects() {
  const filtered = projects.filter(matchesFilters);

  dom.grid.innerHTML = filtered.map(p => {
    const title = escapeHtml(p.title);
    const meta = `${escapeHtml(String(p.year))} · ${escapeHtml(p.type)}`;
    const desc = escapeHtml(p.summary);
    const impact = escapeHtml(p.impact);

    const pills = p.tags.map(t => `<span class="pill">${escapeHtml(t)}</span>`).join("");
    const demoLink = p.links.demo && p.links.demo !== "#" ? `<a class="link" href="${escapeHtml(p.links.demo)}" target="_blank" rel="noreferrer">Demo</a>` : "";
    const repoLink = p.links.repo && p.links.repo !== "#" ? `<a class="link" href="${escapeHtml(p.links.repo)}" target="_blank" rel="noreferrer">Repo</a>` : "";

    return `
      <article class="project">
        <div class="project__top">
          <div>
            <h3 class="project__title">${title}</h3>
            <div class="project__meta">${meta}</div>
          </div>
        </div>

        <p class="project__desc">${desc}</p>
        <p class="project__desc"><strong>Impacto:</strong> ${impact}</p>

        <div class="project__tags">${pills}</div>

        <div class="project__links">
          ${demoLink}
          ${repoLink}
        </div>
      </article>
    `;
  }).join("");

  dom.empty.hidden = filtered.length !== 0;
  dom.kpiFiltro.textContent = String(filtered.length);
} // Dibuja todas las tarjetas de proyecto y muestra “vacío” si no hay resultados.

function renderProfile() {
  dom.year.textContent = String(new Date().getFullYear());

  dom.stackPills.innerHTML = profile.stack.map(s => `<span class="pill">${escapeHtml(s)}</span>`).join("");

  dom.lnkEmail.href = `mailto:${profile.email}`;
  dom.lnkLinkedIn.href = profile.linkedin;
  dom.lnkGitHub.href = profile.github;
} // Rellena el pie, el stack y los links sin tocar el HTML.

function renderKpis() {
  dom.kpiTotal.textContent = String(projects.length);
  dom.kpiTags.textContent = String(getAllTags().length - 1);
} // Actualiza numeritos (KPIs) para que se vea más “pro”.

// ======================
// 5) EVENTOS (interacción)
// ======================

function wireEvents() {
  dom.search.addEventListener("input", (e) => {
    state.query = e.target.value || "";
    renderProjects();
  });

  dom.clear.addEventListener("click", () => {
    state.query = "";
    dom.search.value = "";
    state.activeTag = "all";
    renderTags();
    renderProjects();
  });

  dom.tags.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-tag]");
    if (!btn) return;
    state.activeTag = btn.getAttribute("data-tag");
    renderTags();
    renderProjects();
  });

  dom.btnTema.addEventListener("click", () => {
    const next = state.theme === "dark" ? "light" : "dark";
    setTheme(next);
  });
} // Conecta botones e inputs: cuando tocás algo, se actualiza la página.

// ======================
// 6) INICIO
// ======================

function init() {
  setTheme(state.theme);
  renderProfile();
  renderKpis();
  renderTags();
  renderProjects();
  wireEvents();
} // Arranca todo en el orden correcto: tema → contenido → UI → eventos.

init();
