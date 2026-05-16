/**
 * Bruno Justino — NES portfolio main script
 */
(function () {
  "use strict";

  const intro = document.getElementById("intro");
  const site = document.getElementById("site");
  const pressStart = document.getElementById("press-start");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  let navIndex = 0;
  let introDismissed = false;

  /* ——— Menu beep (Web Audio) ——— */
  let audioCtx = null;

  function playBeep() {
    if (!SITE_CONFIG.enableMenuBeeps) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "square";
      osc.frequency.value = 440;
      gain.gain.value = 0.06;
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.06);
    } catch (_) {
      /* ignore */
    }
  }

  /* ——— Intro ——— */
  function dismissIntro() {
    if (introDismissed) return;
    introDismissed = true;
    intro.classList.add("hidden");
    intro.setAttribute("aria-hidden", "true");
    site.hidden = false;
    site.classList.remove("hidden");
    navLinks[0]?.focus();
    musicPlayer?.onIntroDismissed?.();
  }

  pressStart.addEventListener("click", dismissIntro);

  document.addEventListener("keydown", (e) => {
    if (!introDismissed && (e.key === "Enter" || e.key === " ")) {
      if (document.activeElement === pressStart || !site.contains(document.activeElement)) {
        e.preventDefault();
        dismissIntro();
      }
    }
  });

  intro.addEventListener("click", (e) => {
    if (e.target === intro || e.target.closest(".intro-inner")) {
      dismissIntro();
    }
  });

  /* ——— i18n toggle ——— */
  document.getElementById("lang-toggle")?.addEventListener("click", () => {
    setLanguage(currentLang === "pt" ? "en" : "pt");
    playBeep();
  });

  initI18n();

  /* ——— Dynamic content from config ——— */
  function renderConfigContent(lang) {
    const emailEl = document.getElementById("contact-email");
    if (emailEl) {
      emailEl.href = "mailto:" + SITE_CONFIG.email;
    }

    const workBullets = document.getElementById("work-bullets");
    if (workBullets) {
      workBullets.innerHTML = "";
      (SITE_CONFIG.workBullets[lang] || []).forEach((text) => {
        const li = document.createElement("li");
        li.textContent = text;
        workBullets.appendChild(li);
      });
    }

    const projectList = document.getElementById("project-list");
    if (projectList) {
      projectList.innerHTML = "";
      SITE_CONFIG.projects.forEach((p) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = p.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = p.name;
        li.appendChild(a);
        const desc = document.createElement("span");
        desc.className = "project-desc";
        desc.textContent = " — " + (p.description[lang] || "");
        li.appendChild(desc);
        projectList.appendChild(li);
      });
    }

    const skillList = document.getElementById("skill-list");
    if (skillList) {
      skillList.innerHTML = "";
      SITE_CONFIG.skills.forEach((skill) => {
        const li = document.createElement("li");
        li.textContent = skill;
        skillList.appendChild(li);
      });
    }
  }

  let musicPlayer = null;

  window.onLanguageChange = function (lang) {
    renderConfigContent(lang);
    musicPlayer?.updateTrackLabel();
  };

  renderConfigContent(currentLang);

  /* ——— Avatar fallback ——— */
  const avatarImg = document.getElementById("avatar-img");
  const avatarFallback = document.getElementById("avatar-fallback");

  function showAvatarFallback() {
    avatarImg?.classList.add("hidden");
    avatarFallback?.classList.remove("hidden");
  }

  avatarImg?.addEventListener("error", showAvatarFallback);

  if (avatarImg?.complete && avatarImg.naturalWidth === 0) {
    showAvatarFallback();
  }

  /* ——— Nav keyboard + scroll ——— */
  function setNavActive(index) {
    navLinks.forEach((link, i) => {
      link.classList.toggle("active", i === index);
    });
    navIndex = index;
  }

  function scrollToSection(link) {
    const id = link.getAttribute("data-section") || link.getAttribute("href")?.slice(1);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  navLinks.forEach((link, i) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      setNavActive(i);
      scrollToSection(link);
      playBeep();
    });

    link.addEventListener("focus", () => {
      setNavActive(i);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (!introDismissed) return;
    if (e.target.closest("#music-player")) return;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = (navIndex + 1) % navLinks.length;
      navLinks[next].focus();
      playBeep();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev = (navIndex - 1 + navLinks.length) % navLinks.length;
      navLinks[prev].focus();
      playBeep();
    } else if (e.key === "Enter" && navLinks.includes(document.activeElement)) {
      e.preventDefault();
      scrollToSection(document.activeElement);
      playBeep();
    }
  });

  setNavActive(0);

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ——— Music player ——— */
  musicPlayer = createMusicPlayer();

  function createMusicPlayer() {
    const tracks = SITE_CONFIG.musicTracks || [];
    let index = 0;
    let muted = false;
    let availableTracks = [];
    let introDismissedForMusic = false;

    const audio = new Audio();
    audio.preload = "metadata";

    const el = {
      name: document.getElementById("music-track-name"),
      play: document.getElementById("music-play"),
      prev: document.getElementById("music-prev"),
      next: document.getElementById("music-next"),
      mute: document.getElementById("music-mute"),
      volume: document.getElementById("music-volume"),
      status: document.getElementById("music-status"),
      panel: document.getElementById("music-player"),
    };

    function updateTrackLabel() {
      if (!availableTracks.length) {
        el.name.textContent = "—";
        return;
      }
      const track = availableTracks[index];
      el.name.textContent = track.title[currentLang] || track.title.pt || "—";
    }

    function setPlayButton(playing) {
      const label = playing ? t("music_pause") : t("music_play");
      el.play.textContent = label;
      el.play.setAttribute(
        "aria-label",
        playing ? t("aria_pause") : t("aria_play")
      );
    }

    function setMuteButton() {
      el.mute.textContent = muted ? t("music_mute_on") : t("music_mute_off");
    }

    function showNoTracks(show) {
      el.status?.classList.toggle("hidden", !show);
      el.play.disabled = show;
      el.prev.disabled = show;
      el.next.disabled = show;
    }

    function tryAutoplay() {
      if (!SITE_CONFIG.musicAutoplay || !introDismissedForMusic || !availableTracks.length) {
        return;
      }
      if (audio.src) {
        audio.play().catch(() => setPlayButton(false));
      } else {
        loadTrack(0, true);
      }
    }

    async function probeTracks() {
      availableTracks = [];
      for (const track of tracks) {
        try {
          const ok = await canPlay(track.src);
          if (ok) availableTracks.push(track);
        } catch (_) {
          /* skip */
        }
      }
      showNoTracks(availableTracks.length === 0);
      if (availableTracks.length) {
        loadTrack(0, false);
        tryAutoplay();
      } else {
        updateTrackLabel();
      }
    }

    function canPlay(src) {
      return new Promise((resolve) => {
        const test = new Audio();
        test.preload = "metadata";
        const done = (val) => {
          test.src = "";
          resolve(val);
        };
        test.addEventListener("loadedmetadata", () => done(true), { once: true });
        test.addEventListener("error", () => done(false), { once: true });
        test.src = src;
        setTimeout(() => done(false), 3000);
      });
    }

    function loadTrack(i, autoplay) {
      if (!availableTracks.length) return;
      index = ((i % availableTracks.length) + availableTracks.length) % availableTracks.length;
      const track = availableTracks[index];
      const wasPlaying = !audio.paused;
      audio.src = track.src;
      updateTrackLabel();
      if (autoplay || wasPlaying) {
        audio.play().catch(() => setPlayButton(false));
      }
    }

    audio.addEventListener("play", () => setPlayButton(true));
    audio.addEventListener("pause", () => setPlayButton(false));
    audio.addEventListener("ended", () => {
      loadTrack(index + 1, true);
    });

    el.volume.addEventListener("input", () => {
      audio.volume = parseFloat(el.volume.value);
      muted = false;
      audio.muted = false;
      setMuteButton();
    });

    el.play.addEventListener("click", () => {
      if (!availableTracks.length) return;
      if (audio.paused) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }
      playBeep();
    });

    el.prev.addEventListener("click", () => {
      loadTrack(index - 1, true);
      playBeep();
    });

    el.next.addEventListener("click", () => {
      loadTrack(index + 1, true);
      playBeep();
    });

    el.mute.addEventListener("click", () => {
      muted = !muted;
      audio.muted = muted;
      setMuteButton();
      playBeep();
    });

    audio.volume = parseFloat(el.volume.value);
    setPlayButton(false);
    setMuteButton();
    probeTracks();

    return {
      updateTrackLabel,
      onIntroDismissed() {
        introDismissedForMusic = true;
        tryAutoplay();
      },
    };
  }
})();
