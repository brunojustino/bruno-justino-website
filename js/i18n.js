/**
 * Portuguese and English UI strings.
 */
const translations = {
  pt: {
    intro_credit: "© 2026 BRUNO JUSTINO",
    intro_sub: "SUPORTE TI & DESENVOLVEDOR",
    press_start: "PRESS START",
    intro_hint: "ENTER · ESPAÇO · CLIQUE",
    site_title: "BRUNO JUSTINO",
    nav_about: "SOBRE",
    nav_work: "TRABALHO",
    nav_projects: "PROJETOS",
    nav_skills: "SKILLS",
    nav_contact: "CONTATO",
    nav_hint: "← → NAVEGAR · ENTER SELECIONAR",
    about_title: "▶ SOBRE",
    about_p1:
      "Olá! Sou Bruno Justino, profissional de Suporte de TI e Desenvolvimento de Software na Proinfo Sistemas desde 2011.",
    about_p2:
      "Gosto de resolver problemas, construir sites e manter sistemas funcionando — com estilo retrô quando possível.",
    work_title: "▶ TRABALHO",
    work_company: "Proinfo Sistemas",
    work_role: "Suporte de TI & Desenvolvimento de Software",
    work_period: "2011 — presente",
    projects_title: "▶ PROJETOS",
    skills_title: "▶ SKILLS",
    contact_title: "▶ CONTATO",
    contact_text: "Quer falar comigo? Envie um e-mail:",
    contact_btn: "ENVIAR E-MAIL",
    footer_text: "Feito com HTML, CSS e JavaScript.",
    music_label: "BRUNO RADIO",
    music_volume: "VOL",
    music_no_tracks: "Adicione MP3 em assets/audio/",
    music_play: "▶",
    music_pause: "❚❚",
    music_mute_on: "🔇",
    music_mute_off: "🔊",
    aria_play: "Reproduzir",
    aria_pause: "Pausar",
  },
  en: {
    intro_credit: "© 2026 BRUNO JUSTINO",
    intro_sub: "IT SUPPORT & DEVELOPER",
    press_start: "PRESS START",
    intro_hint: "ENTER · SPACE · CLICK",
    site_title: "BRUNO JUSTINO",
    nav_about: "ABOUT",
    nav_work: "WORK",
    nav_projects: "PROJECTS",
    nav_skills: "SKILLS",
    nav_contact: "CONTACT",
    nav_hint: "← → NAVIGATE · ENTER SELECT",
    about_title: "▶ ABOUT",
    about_p1:
      "Hi! I'm Bruno Justino, IT Support & Software Developer at Proinfo Sistemas since 2011.",
    about_p2:
      "I enjoy solving problems, building websites, and keeping systems running — with a retro style when I can.",
    work_title: "▶ WORK",
    work_company: "Proinfo Sistemas",
    work_role: "IT Support & Software Development",
    work_period: "2011 — present",
    projects_title: "▶ PROJECTS",
    skills_title: "▶ SKILLS",
    contact_title: "▶ CONTACT",
    contact_text: "Want to get in touch? Send me an email:",
    contact_btn: "SEND EMAIL",
    footer_text: "Built with HTML, CSS, and JavaScript.",
    music_label: "BRUNO RADIO",
    music_volume: "VOL",
    music_no_tracks: "Add MP3 files to assets/audio/",
    music_play: "▶",
    music_pause: "❚❚",
    music_mute_on: "🔇",
    music_mute_off: "🔊",
    aria_play: "Play",
    aria_pause: "Pause",
  },
};

function t(key, lang) {
  const l = lang || currentLang;
  return (translations[l] && translations[l][key]) || key;
}

let currentLang = "pt";

function detectLanguage() {
  const stored = localStorage.getItem("lang");
  if (stored === "pt" || stored === "en") return stored;
  const nav = (navigator.language || "pt").toLowerCase();
  if (nav.startsWith("en")) return "en";
  if (nav.startsWith("pt")) return "pt";
  return "pt";
}

function setLanguage(lang) {
  if (lang !== "pt" && lang !== "en") return;
  currentLang = lang;
  document.documentElement.lang = lang;
  localStorage.setItem("lang", lang);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (translations[lang][key] !== undefined) {
      el.textContent = translations[lang][key];
    }
  });

  const toggle = document.getElementById("lang-toggle");
  if (toggle) {
    toggle.textContent = lang === "pt" ? "PT | EN" : "EN | PT";
    toggle.setAttribute(
      "aria-label",
      lang === "pt" ? "Switch to English" : "Mudar para português"
    );
  }

  if (typeof window.onLanguageChange === "function") {
    window.onLanguageChange(lang);
  }
}

function initI18n() {
  currentLang = detectLanguage();
  setLanguage(currentLang);
}
