// Estado simple de la app (guarda el tema y lo que está pasando).
const state = { // Guarda datos en memoria para que la web sepa “en qué estado está”.
  theme: localStorage.getItem("theme") || "dark", // Recuerda el tema aunque cierres el navegador (sirve para comodidad del usuario).
}; // Fin del objeto: acá guardamos configuración básica.

const dom = { // Acá guardamos “atajos” a cosas del HTML para usarlas fácil desde JS.
  btnTema: document.getElementById("btnTema"), // Botón que cambia el tema (sirve para modo claro/oscuro).
  modal: document.getElementById("videoModal"), // Contenedor del modal (sirve para mostrar el video encima).
  modalTitle: document.getElementById("modalTitle"), // Título del modal (sirve para poner el nombre del proyecto).
  modalVideo: document.getElementById("modalVideo"), // Etiqueta <video> (sirve para reproducir el mp4).
  modalSource: document.getElementById("modalSource"), // <source> del video (sirve para cambiar el archivo mp4).
  openButtons: document.querySelectorAll("[data-open-video]"), // Todos los botones “Ver demo” (sirve para abrir el modal con el video correcto).
}; // Fin del objeto: son referencias a elementos del DOM.

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme); // Cambia variables CSS según tema (sirve para look & feel).
  state.theme = theme; // Guardamos el tema actual (sirve para saber qué viene después).
  localStorage.setItem("theme", theme); // Lo guardamos en el navegador (sirve para que quede igual la próxima vez).
}

function openModal({ title, src }) {
  dom.modalTitle.textContent = title; // Pone el título del video (sirve para contexto).
  dom.modalSource.src = src; // Cambia el archivo mp4 que se va a reproducir (sirve para mostrar el demo correcto).
  dom.modalVideo.load(); // Le dice al navegador “recarga el video” (sirve para que tome el nuevo src).
  dom.modal.classList.add("is-open"); // Muestra el modal (sirve para overlay).
  dom.modal.setAttribute("aria-hidden", "false"); // Accesibilidad (sirve para lectores de pantalla).
}

function closeModal() {
  dom.modal.classList.remove("is-open"); // Oculta el modal (sirve para volver a la página).
  dom.modal.setAttribute("aria-hidden", "true"); // Accesibilidad (sirve para indicar que está cerrado).
  dom.modalVideo.pause(); // Pausa el video (sirve para que no siga sonando/reproduciendo).
  dom.modalSource.src = ""; // Limpia el src (sirve para evitar cache raro en algunos navegadores).
  dom.modalVideo.load(); // Recarga vacío (sirve para “resetear”).
}

function wireEvents() {
  // Botón de tema
  dom.btnTema.addEventListener("click", () => {
    const next = state.theme === "dark" ? "light" : "dark"; // Decide el próximo tema (sirve para alternar).
    applyTheme(next);
  });

  // Botones “Ver demo”
  dom.openButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      openModal({
        title: btn.getAttribute("data-title"), // Toma el título desde el HTML (sirve para no hardcodear).
        src: btn.getAttribute("data-src"), // Toma la ruta del video desde el HTML (sirve para que sea escalable).
      }); // Fin del objeto: le pasamos título y src al modal.
    });
  });

  // Cerrar modal (click en backdrop o botón X)
  dom.modal.addEventListener("click", (e) => {
    const closeEl = e.target.closest("[data-close]"); // Busca si clickeaste algo que cierra (sirve para UX).
    if (closeEl) closeModal();
  });

  // Cerrar con tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && dom.modal.classList.contains("is-open")) {
      closeModal();
    }
  });
}

function init() {
  applyTheme(state.theme); // Aplica el tema guardado (sirve para que arranque como lo dejaste).
  wireEvents(); // Conecta los botones (sirve para que la página reaccione).
}

init(); // Arranca todo (sirve para inicializar la app).
