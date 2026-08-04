import "./style.css";
import {
  ArrowUp,
  Camera,
  CalendarDays,
  Check,
  ChevronsDown,
  CirclePlay,
  Clapperboard,
  Download,
  Info,
  MapPin,
  Medal,
  Music2,
  Share2,
  Store,
  Ticket,
  createIcons,
} from "lucide";

const header = document.getElementById("site-header");
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const planInput = document.getElementById("plan");
const planButtons = document.querySelectorAll("[data-plan]");
const sponsorForm = document.getElementById("sponsor-form");
const formMessage = document.getElementById("form-message");
const hero = document.getElementById("inicio");
const heroLayers = document.querySelectorAll("[data-hero-layer]");
const heroOverlay = document.querySelector("[data-hero-overlay]");
const heroCopy = document.querySelector("[data-hero-copy]");
const heroScrollIndicator = document.querySelector(".hero-scroll-indicator");
const productTrack = document.querySelector(".product-track");
const productGroup = productTrack?.querySelector(".product-group");
const emailInput = sponsorForm?.querySelector('input[name="email"]');
const phoneInput = sponsorForm?.querySelector('input[name="telefono"]');
const benefitTypeInput = document.getElementById("tipo-beneficio");
const benefitDynamic = document.getElementById("beneficio-dinamico");
const benefitHidden = document.getElementById("beneficio-hidden");
const benefitWrapper = document.getElementById("beneficio-wrapper");
const storyInput = sponsorForm?.querySelector('textarea[name="historia"]');
const badgeRadios = sponsorForm?.querySelectorAll('input[name="quiereInsignia"]');
const storyLinkField = document.getElementById("asociar-historia-field");
const storyLinkInput = sponsorForm?.querySelector('input[name="asociarHistoriaInsignia"]');
const sponsorSubmitButton = sponsorForm?.querySelector('button[type="submit"]');
const scrollTopButton = document.getElementById("scroll-top");
const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
let scrollAnimationFrame = null;
const API = (import.meta.env.VITE_API_URL || "http://localhost:3333").replace(
  /\/$/,
  ""
);

createIcons({
  icons: {
    ArrowUp,
    Camera,
    CalendarDays,
    Check,
    ChevronsDown,
    CirclePlay,
    Clapperboard,
    Download,
    Info,
    MapPin,
    Medal,
    Music2,
    Share2,
    Store,
    Ticket,
  },
});

if (productTrack && productGroup) {
  const repeatedProducts = productGroup.cloneNode(true);
  repeatedProducts.setAttribute("aria-hidden", "true");
  productTrack.appendChild(repeatedProducts);

  const baseWidth = productGroup.getBoundingClientRect().width;
  productTrack.style.setProperty("--marquee-distance", `-${baseWidth}px`);
}

function closeMobileMenu() {
  if (!menuToggle || !mobileMenu) return;

  menuToggle.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  mobileMenu.classList.add("hidden");
}

function updateHeader() {
  if (!header) return;

  const isScrolled = window.scrollY > 24;
  header.classList.toggle("shadow-sm", isScrolled);
}

function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(edgeA, edgeB, value) {
  const progress = clamp((value - edgeA) / (edgeB - edgeA));
  return progress * progress * (3 - 2 * progress);
}

function updateHeroParallax() {
  if (!hero || !heroLayers.length) return;

  const scrollableDistance = hero.offsetHeight - window.innerHeight;
  const progress = scrollableDistance > 0
    ? clamp(-hero.getBoundingClientRect().top / scrollableDistance)
    : 0;

  const layerOpacity = {
    day: 1 - smoothstep(0.18, 0.42, progress),
    sunset:
      smoothstep(0.18, 0.42, progress) *
      (1 - smoothstep(0.56, 0.78, progress)),
    night: smoothstep(0.56, 0.78, progress),
  };

  heroLayers.forEach((layer) => {
    const layerName = layer.dataset.heroLayer;
    const opacity = layerOpacity[layerName] ?? 0;
    const direction = layerName === "day" ? -1 : layerName === "sunset" ? 0.35 : 1;
    const translateY = (progress - 0.5) * 22 * direction;
    const scale = 1.06 + progress * 0.035;

    layer.style.opacity = opacity.toFixed(3);
    layer.style.transform = `scale(${scale.toFixed(3)}) translateY(${translateY.toFixed(2)}px)`;
  });

  const isNight = progress > 0.58;
  heroOverlay?.classList.toggle("is-night", isNight);
  heroCopy?.classList.toggle("is-night", isNight);
  header?.classList.toggle("header-night", isNight);

  if (heroScrollIndicator) {
    heroScrollIndicator.style.opacity = String(1 - smoothstep(0.1, 0.34, progress));
  }
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.classList.toggle("menu-open", !isOpen);
  mobileMenu?.classList.toggle("hidden", isOpen);
});

document.querySelectorAll("#mobile-menu a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

function animateScrollTo(targetY) {
  if (scrollAnimationFrame) {
    cancelAnimationFrame(scrollAnimationFrame);
  }

  const startY = window.scrollY;
  const distance = targetY - startY;

  if (reduceMotionQuery.matches || Math.abs(distance) < 2) {
    window.scrollTo(0, targetY);
    return;
  }

  const duration = Math.min(3400, Math.max(1200, Math.abs(distance) * 0.5));
  const startTime = performance.now();
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";

  function step(currentTime) {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const easedProgress = -(Math.cos(Math.PI * progress) - 1) / 2;

    window.scrollTo(0, startY + distance * easedProgress);

    if (progress < 1) {
      scrollAnimationFrame = requestAnimationFrame(step);
      return;
    }

    root.style.scrollBehavior = previousScrollBehavior;
    scrollAnimationFrame = null;
  }

  scrollAnimationFrame = requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = targetId === "#inicio"
      ? document.documentElement
      : document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();
    const headerOffset = targetId === "#inicio" ? 0 : (header?.offsetHeight || 0) + 16;
    const targetY =
      targetId === "#inicio"
        ? 0
        : Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerOffset);

    if (window.location.hash !== targetId) {
      window.history.pushState(null, "", targetId);
    }

    animateScrollTo(targetY);
  });
});

planButtons.forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("is-selected")));

  button.addEventListener("click", () => {
    const selectedPlan = button.dataset.plan || "1 mes";
    planInput.value = selectedPlan;

    planButtons.forEach((currentButton) => {
      const isSelected = currentButton === button;
      currentButton.classList.toggle("is-selected", isSelected);
      currentButton.setAttribute("aria-pressed", String(isSelected));
    });
  });
});

function validateEmail() {
  if (!emailInput) return true;

  const value = emailInput.value.trim();
  const isValid = !value || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  emailInput.setCustomValidity(
    isValid ? "" : "Ingresá un email válido, por ejemplo contacto@comercio.com."
  );
  return isValid;
}

function validatePhone() {
  if (!phoneInput) return true;

  const value = phoneInput.value.trim();
  const digitCount = value.replace(/\D/g, "").length;
  const isValid = !value || (digitCount >= 8 && digitCount <= 15);
  phoneInput.setCustomValidity(
    isValid ? "" : "Ingresá un teléfono válido de entre 8 y 15 números."
  );
  return isValid;
}

function crearBotonesOpciones(opciones, onSelect, valorActivo = "") {
  const wrapper = document.createElement("div");
  wrapper.className = "flex flex-wrap gap-2";

  opciones.forEach((opcion) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = opcion.label;
    button.dataset.value = opcion.value;

    const seleccionado = valorActivo === opcion.value;

    button.className = seleccionado
      ? "rounded-full border border-morado bg-morado text-crema px-4 py-2 text-sm font-bold shadow-sm transition"
      : "rounded-full border border-uva/10 bg-crema px-4 py-2 text-sm font-bold text-uva transition hover:border-morado hover:bg-morado/10";

    button.addEventListener("click", () => onSelect(opcion.value));
    wrapper.appendChild(button);
  });

  return wrapper;
}

function actualizarBeneficioHidden(valor) {
  if (!benefitHidden) return;
  benefitHidden.value = valor || "";
}

function renderBeneficioFields() {
  if (!benefitTypeInput || !benefitDynamic || !benefitHidden || !benefitWrapper) return;

  const tipo = benefitTypeInput.value;
  benefitDynamic.innerHTML = "";
  actualizarBeneficioHidden("");

  if (!tipo) {
    benefitWrapper.classList.add("hidden");
    return;
  }

  benefitWrapper.classList.remove("hidden");

  if (tipo === "descuento") {
    const titulo = document.createElement("p");
    titulo.className = "text-sm font-bold text-uva/75";
    titulo.textContent = "Elegí el porcentaje de descuento";
    benefitDynamic.appendChild(titulo);

    const opciones = [
      { value: "10", label: "10%" },
      { value: "15", label: "15%" },
      { value: "20", label: "20%" },
      { value: "25", label: "25%" },
    ];

    const botones = crearBotonesOpciones(opciones, (value) => {
      benefitTypeInput.dataset.selectedDetail = value;
      actualizarBeneficioHidden(`${value}% de descuento`);
      renderBeneficioFields();
    }, benefitTypeInput.dataset.selectedDetail || "");

    benefitDynamic.appendChild(botones);
    return;
  }

  if (tipo === "cortesia") {
    const titulo = document.createElement("p");
    titulo.className = "text-sm font-bold text-uva/75";
    titulo.textContent = "Especificá cuál sería el producto o beneficio de cortesía";
    benefitDynamic.appendChild(titulo);

    const input = document.createElement("input");
    input.type = "text";
    input.maxLength = 80;
    input.placeholder = "Ej: bebida sin alcohol, entrada gratis, accesorio de regalo";
    input.className =
      "w-full rounded-[1.1rem] border border-uva/10 bg-crema px-4 py-3 text-sm font-bold text-uva outline-none transition placeholder:text-uva/40 focus:border-morado focus:ring-4 focus:ring-morado/10";
    input.value = benefitTypeInput.dataset.selectedDetail || "";

    input.addEventListener("input", (event) => {
      const valor = event.target.value.trim();
      benefitTypeInput.dataset.selectedDetail = valor;
      actualizarBeneficioHidden(valor ? `${valor} de cortesía` : "");
    });

    benefitDynamic.appendChild(input);

    actualizarBeneficioHidden(
      benefitTypeInput.dataset.selectedDetail?.trim()
        ? `${benefitTypeInput.dataset.selectedDetail.trim()} de cortesía`
        : ""
    );

    return;
  }

  if (tipo === "primera_visita") {
    const titulo = document.createElement("p");
    titulo.className = "text-sm font-bold text-uva/75";
    titulo.textContent = "Elegí qué beneficio se desbloquea en la primera visita";
    benefitDynamic.appendChild(titulo);

    const opciones = [
      { value: "10% de descuento en la primera visita", label: "10% off" },
      { value: "15% de descuento en la primera visita", label: "15% off" },
      { value: "20% de descuento en la primera visita", label: "20% off" },
      { value: "Producto de cortesía en la primera visita", label: "Cortesía" },
    ];

    const botones = crearBotonesOpciones(
      opciones,
      (value) => {
        benefitTypeInput.dataset.selectedDetail = value;
        actualizarBeneficioHidden(value);
        renderBeneficioFields();
      },
      benefitTypeInput.dataset.selectedDetail || ""
    );

    benefitDynamic.appendChild(botones);
    return;
  }
  if (tipo === "contacto_equipo") {
    const ayuda = document.createElement("p");
    ayuda.className = "text-sm font-bold text-uva/75";
    ayuda.textContent =
      "Si necesitás una propuesta personalizada, nuestro equipo se va a comunicar con vos.";
    benefitDynamic.appendChild(ayuda);

    const textarea = document.createElement("textarea");
    textarea.rows = 3;
    textarea.maxLength = 180;
    textarea.placeholder = "Contanos brevemente qué te gustaría ofrecer.";
    textarea.className =
      "w-full rounded-[1.1rem] border border-uva/10 bg-crema px-4 py-3 text-sm font-bold text-uva outline-none transition placeholder:text-uva/40 focus:border-morado focus:ring-4 focus:ring-morado/10";
    textarea.value = benefitTypeInput.dataset.selectedComment || "";

    textarea.addEventListener("input", (event) => {
      const comentario = event.target.value.trim();
      benefitTypeInput.dataset.selectedComment = comentario;
      actualizarBeneficioHidden(
        comentario
          ? `Solicita contacto del equipo: ${comentario}`
          : "Solicita contacto del equipo"
      );
    });

    benefitDynamic.appendChild(textarea);

    actualizarBeneficioHidden(
      benefitTypeInput.dataset.selectedComment?.trim()
        ? `Solicita contacto del equipo: ${benefitTypeInput.dataset.selectedComment.trim()}`
        : "Solicita contacto del equipo"
    );
  }
}

function validateStoryAssociation() {
  if (!storyInput || !storyLinkInput) return true;

  const needsStory = storyLinkInput.checked;
  const isValid = !needsStory || storyInput.value.trim().length > 0;
  storyInput.setCustomValidity(
    isValid ? "" : "Escribí la historia o leyenda que querés asociar a la insignia."
  );
  return isValid;
}

function updateBadgeOptions() {
  if (!badgeRadios || !storyLinkField || !storyLinkInput) return;

  const selectedBadgeOption = sponsorForm.querySelector(
    'input[name="quiereInsignia"]:checked'
  )?.value;
  const wantsBadge = selectedBadgeOption === "si";

  storyLinkField.classList.toggle("hidden", !wantsBadge);
  if (!wantsBadge) {
    storyLinkInput.checked = false;
    validateStoryAssociation();
  }
}

emailInput?.addEventListener("input", validateEmail);
phoneInput?.addEventListener("input", validatePhone);
benefitTypeInput?.addEventListener("change", () => {
  benefitTypeInput.dataset.selectedDetail = "";
  benefitTypeInput.dataset.selectedVisit = "";
  benefitTypeInput.dataset.selectedReward = "";
  benefitTypeInput.dataset.selectedComment = "";
  renderBeneficioFields();
});
storyInput?.addEventListener("input", validateStoryAssociation);
storyLinkInput?.addEventListener("change", validateStoryAssociation);
badgeRadios?.forEach((radio) => radio.addEventListener("change", updateBadgeOptions));

updateBadgeOptions();
renderBeneficioFields();

function setFormMessage(type, text) {
  if (!formMessage) return;

  formMessage.textContent = text;
  formMessage.classList.remove(
    "hidden",
    "bg-menta/40",
    "bg-rosa/30",
    "text-uva",
    "text-fucsia"
  );
  formMessage.classList.add(type === "success" ? "bg-menta/40" : "bg-rosa/30");
  formMessage.classList.add(type === "success" ? "text-uva" : "text-fucsia");
}

function getFormData(form) {
  const data = new FormData(form);
  return {
    plan: data.get("plan") || "1 mes",
    nombreComercio: data.get("nombreComercio") || "",
    rubro: data.get("rubro") || "",
    direccion: data.get("direccion") || "",
    email: data.get("email") || "",
    telefono: data.get("telefono") || "",
    redes: data.get("redes") || "",
    tipoBeneficio: data.get("tipoBeneficio") || "",
    beneficio: data.get("beneficio") || "",
    historia: data.get("historia") || "",
    quiereInsignia: data.get("quiereInsignia") || "no",
    asociarHistoriaInsignia: data.get("asociarHistoriaInsignia") === "on",
  };
}

function setFormSubmitting(isSubmitting) {
  if (!sponsorSubmitButton || !sponsorForm) return;

  sponsorSubmitButton.disabled = isSubmitting;
  sponsorSubmitButton.textContent = isSubmitting
    ? "Enviando solicitud..."
    : "Enviar solicitud";
  sponsorForm.setAttribute("aria-busy", String(isSubmitting));
}

sponsorForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  validateEmail();
  validatePhone();
  validateStoryAssociation();

  if (!sponsorForm.checkValidity()) {
    sponsorForm.reportValidity();
    setFormMessage("error", "Revisá los campos obligatorios para poder enviar la solicitud.");
    return;
  }

  const data = getFormData(sponsorForm);
  setFormSubmitting(true);

  try {
    const response = await fetch(`${API}/api/comercios/solicitudes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        responseData.message ||
          "No pudimos enviar la solicitud. Intentá nuevamente."
      );
    }

    setFormMessage(
      "success",
      responseData.message ||
        "Recibimos tu solicitud. Te vamos a contactar por email con los próximos pasos."
    );
    sponsorForm.reset();
    planInput.value = "1 mes";
    if (benefitTypeInput) {
      benefitTypeInput.dataset.selectedDetail = "";
      benefitTypeInput.dataset.selectedVisit = "";
      benefitTypeInput.dataset.selectedReward = "";
      benefitTypeInput.dataset.selectedComment = "";
    }
    renderBeneficioFields();
    planButtons.forEach((button, index) => {
      const isSelected = index === 0;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });
    updateBadgeOptions();
  } catch (error) {
    setFormMessage(
      "error",
      error.message ||
        "No pudimos enviar la solicitud. Intentá nuevamente en unos minutos."
    );
  } finally {
    setFormSubmitting(false);
  }
});

function updatePageEffects() {
  updateHeader();
  updateHeroParallax();
  scrollTopButton?.classList.toggle("is-visible", window.scrollY > 560);
}

scrollTopButton?.addEventListener("click", () => {
  animateScrollTo(0);
});

window.addEventListener("scroll", updatePageEffects, { passive: true });
window.addEventListener("resize", updatePageEffects);
updatePageEffects();