/* Quest Breed Schools: menu, motion and forms.
   The school's WhatsApp number and email used by the enquiry forms: */
const SCHOOL = {
  whatsapp: "2348024412737",
  email: "questbreedschools@gmail.com",
};

(() => {
  const doc = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktop = () => window.matchMedia("(min-width: 1021px)").matches;

  /* ---------- Header ---------- */
  const header = document.querySelector(".site-header");
  // the bar is always white; it only gains a soft shadow once the page scrolls
  const onScrollHeader = () => {
    if (header) header.classList.toggle("is-solid", window.scrollY > 10);
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector(".mobile-menu");
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    menu.setAttribute("aria-hidden", String(!open));
  };
  if (toggle && menu) {
    toggle.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("menu-open")) setMenu(false);
    });
  }

  /* ---------- Videos: load when near, play only while visible ---------- */
  const videos = [...document.querySelectorAll("video[data-src]")];
  const isShown = (el) => el.offsetParent !== null || getComputedStyle(el).position === "fixed";
  const loadVideo = (v) => {
    if (v.dataset.loaded) return;
    v.src = v.dataset.src;
    v.dataset.loaded = "1";
  };
  const playVideo = (v) => {
    if (reduceMotion || !isShown(v)) return;
    loadVideo(v);
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  };
  if ("IntersectionObserver" in window) {
    const vio = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) playVideo(target);
          else if (!target.paused) target.pause();
        });
      },
      { rootMargin: "200px 0px" }
    );
    videos.forEach((v) => vio.observe(v));
  } else {
    videos.forEach(playVideo);
  }
  window.addEventListener("resize", () => videos.forEach((v) => isShown(v) && v.paused && v.dataset.loaded && playVideo(v)));

  /* ---------- Hero word rotator ---------- */
  document.querySelectorAll(".rotator").forEach((rot) => {
    const words = [...rot.children];
    if (words.length < 2 || reduceMotion) return;
    let i = 0;
    setInterval(() => {
      const cur = words[i];
      cur.classList.remove("is-in");
      cur.classList.add("is-out");
      i = (i + 1) % words.length;
      const next = words[i];
      next.classList.remove("is-out");
      next.classList.add("is-in");
      setTimeout(() => cur.classList.remove("is-out"), 900);
    }, 2800);
  });

  /* ---------- Split headings into words ---------- */
  const splitWords = (root) => {
    let n = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const parts = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(" "));
              return;
            }
            const wd = document.createElement("span");
            wd.className = "wd";
            const inner = document.createElement("span");
            inner.textContent = part;
            inner.style.setProperty("--i", n++);
            wd.appendChild(inner);
            frag.appendChild(wd);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.tagName !== "BR") {
          walk(child);
        }
      });
    };
    walk(root);
  };
  document.querySelectorAll(".split-words").forEach(splitWords);

  /* ---------- Statement: words light up with scroll ---------- */
  const statements = [...document.querySelectorAll(".statement")];
  statements.forEach((st) => {
    const walk = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.appendChild(document.createTextNode(" "));
            else {
              const w = document.createElement("span");
              w.className = "w";
              w.textContent = part;
              frag.appendChild(w);
            }
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) walk(child);
      });
    };
    walk(st);
    st._words = [...st.querySelectorAll(".w")];
  });
  const lightStatements = () => {
    statements.forEach((st) => {
      const r = st.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
      const count = Math.round(progress * st._words.length);
      st._words.forEach((w, i) => w.classList.toggle("lit", i < count));
    });
  };

  /* ---------- Films: pinned horizontal scroll on desktop ---------- */
  const pin = document.querySelector(".films-pin");
  const track = pin && pin.querySelector(".films-track");
  const bar = pin && pin.querySelector(".films-progress span");
  const sizeFilms = () => {
    if (!pin || !track) return;
    if (!desktop() || reduceMotion) {
      pin.style.height = "";
      track.style.transform = "";
      return;
    }
    const distance = Math.max(0, track.scrollWidth - window.innerWidth);
    pin.dataset.distance = distance;
    pin.style.height = window.innerHeight + distance + "px";
  };
  const moveFilms = () => {
    if (!pin || !track || !desktop() || reduceMotion) return;
    const r = pin.getBoundingClientRect();
    const distance = +pin.dataset.distance || 0;
    const p = Math.min(1, Math.max(0, -r.top / Math.max(1, distance)));
    track.style.transform = `translate3d(${-p * distance}px,0,0)`;
    if (bar) bar.style.transform = `scaleX(${p})`;
  };

  /* ---------- One scroll loop ---------- */
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      lightStatements();
      moveFilms();
      ticking = false;
    });
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    sizeFilms();
    onScroll();
  });
  window.addEventListener("load", () => {
    sizeFilms();
    onScroll();
  });
  sizeFilms();
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  const revealables = document.querySelectorAll(".reveal, .reveal-img, .split-words, .bloom");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Floating petals ---------- */
  const tones = ["#fcaf17", "#ec176b", "#e526d8", "#a73db2", "#17c98f", "#7de7ca"];
  document.querySelectorAll(".petal-field").forEach((field) => {
    const count = +field.dataset.petals || 8;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("i");
      const s = 10 + Math.random() * 22;
      p.style.cssText = [
        `left:${Math.random() * 100}%`,
        `top:${Math.random() * 100}%`,
        `--s:${s}px`,
        `--c:${tones[i % tones.length]}`,
        `--o:${(0.12 + Math.random() * 0.2).toFixed(2)}`,
        `--r:${Math.round(Math.random() * 180)}deg`,
        `--x:${Math.round(Math.random() * 80 - 40)}px`,
        `--y:${Math.round(Math.random() * -90 - 20)}px`,
        `--d:${(10 + Math.random() * 10).toFixed(1)}s`,
        `animation-delay:${(-Math.random() * 10).toFixed(1)}s`,
      ].join(";");
      field.appendChild(p);
    }
  });

  /* ---------- Did you know? ---------- */
  document.querySelectorAll("[data-dyk]").forEach((box) => {
    const facts = [...box.querySelectorAll(".dyk-fact")];
    const dots = box.querySelector(".dyk-dots");
    if (!facts.length) return;
    facts.forEach(() => dots && dots.appendChild(document.createElement("i")));
    let i = 0;
    let timer;
    const show = (n) => {
      i = (n + facts.length) % facts.length;
      facts.forEach((f, k) => f.classList.toggle("is-on", k === i));
      if (dots) [...dots.children].forEach((d, k) => d.classList.toggle("is-on", k === i));
    };
    const auto = () => {
      clearInterval(timer);
      if (!reduceMotion) timer = setInterval(() => show(i + 1), 5200);
    };
    box.querySelector("[data-next]")?.addEventListener("click", () => { show(i + 1); auto(); });
    box.querySelector("[data-prev]")?.addEventListener("click", () => { show(i - 1); auto(); });
    show(0);
    auto();
  });

  /* ---------- Gallery filter + lightbox ---------- */
  const gallery = document.querySelector(".gallery");
  if (gallery) {
    const items = [...gallery.querySelectorAll("button")];
    document.querySelectorAll(".filters button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const f = btn.dataset.filter;
        document.querySelectorAll(".filters button").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
        items.forEach((it) => it.classList.toggle("is-hidden", f !== "all" && it.dataset.cat !== f));
      });
    });

    const lb = document.querySelector(".lightbox");
    const lbImg = lb.querySelector("img");
    const lbCap = lb.querySelector("p");
    let current = 0;
    let lastFocus = null;
    const visible = () => items.filter((it) => !it.classList.contains("is-hidden"));
    const open = (idx) => {
      const list = visible();
      current = (idx + list.length) % list.length;
      const img = list[current].querySelector("img");
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = img.alt;
      lb.classList.add("is-open");
      lb.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      lb.querySelector(".lb-close").focus();
    };
    const close = () => {
      lb.classList.remove("is-open");
      lb.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    };
    items.forEach((it) =>
      it.addEventListener("click", () => {
        lastFocus = it;
        open(visible().indexOf(it));
      })
    );
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelector(".lb-next").addEventListener("click", () => open(current + 1));
    lb.querySelector(".lb-prev").addEventListener("click", () => open(current - 1));
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    document.addEventListener("keydown", (e) => {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") open(current + 1);
      if (e.key === "ArrowLeft") open(current - 1);
    });
  }

  /* ---------- Enquiry forms (open WhatsApp or email, nothing stored) ---------- */
  document.querySelectorAll("form[data-enquiry]").forEach((form) => {
    const note = form.querySelector(".form-note");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const lines = [form.dataset.enquiry];
      for (const [key, value] of data.entries()) {
        if (String(value).trim()) lines.push(`${key}: ${String(value).trim()}`);
      }
      const text = lines.join("\n");
      const via = e.submitter && e.submitter.dataset.via;
      if (via === "email") {
        window.location.href = `mailto:${SCHOOL.email}?subject=${encodeURIComponent(form.dataset.enquiry)}&body=${encodeURIComponent(text)}`;
      } else {
        window.open(`https://wa.me/${SCHOOL.whatsapp}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
      }
      if (note) note.textContent = "Your message is ready. Press send in WhatsApp or your email app to reach the school.";
    });
  });

  /* ---------- Year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
