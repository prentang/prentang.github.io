/* =========================================================
   PRENTICE TANG — CYBERPUNK PORTFOLIO  ·  interactions
   ========================================================= */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const finePointer = window.matchMedia("(pointer: fine)").matches;

  // shared smooth-scroll instance (set by initSmoothScroll)
  let lenis = null;

  document.addEventListener("DOMContentLoaded", function () {
    initBoot();
    initNav();
    initReveal();
    initRoleCycler();
    initScrollUp();
    initScrollProgress();
    initActiveNav();
    initHud();
    initKonami();
    initBreachProtocol();
    if (!reduceMotion) initSmoothScroll();
    if (!reduceMotion) initScrollFX();
    if (!reduceMotion) initCanvas();
    if (!reduceMotion) initHeroDecode();
    if (!reduceMotion) initParallax();
    if (!reduceMotion) initScanCards();
    if (!reduceMotion && finePointer) {
      initCursor();
      initTilt();
      initMagnetic();
    }
  });

  /* ---------- boot sequence overlay ---------- */
  function initBoot() {
    const boot = document.getElementById("boot");
    const text = document.getElementById("boot-text");
    if (!boot || !text) return;

    const lines = [
      "> initializing rick_roll.os ...",
      "> mounting /dev/portfolio ........ OK",
      "> loading profile: PRENTICE_TANG",
      "> decrypting credentials ......... OK",
      "> establishing uplink ........... DONE",
      "> ACCESS GRANTED",
    ];

    if (reduceMotion) {
      boot.classList.add("done");
      return;
    }

    document.body.classList.add("boot-lock");
    let li = 0;
    let buf = "";

    function typeLine() {
      if (li >= lines.length) {
        setTimeout(() => {
          boot.classList.add("done");
          document.body.classList.remove("boot-lock");
        }, 380);
        return;
      }
      const line = lines[li];
      let ci = 0;
      const timer = setInterval(() => {
        buf += line[ci] || "";
        text.textContent = buf + "█";
        ci++;
        if (ci > line.length) {
          clearInterval(timer);
          buf += "\n";
          li++;
          setTimeout(typeLine, 90);
        }
      }, 14);
    }
    typeLine();

    function dismiss() {
      boot.classList.add("done");
      document.body.classList.remove("boot-lock");
    }
    // safety + let the user skip the intro by interacting
    setTimeout(dismiss, 4000);
    window.addEventListener("wheel", dismiss, { once: true, passive: true });
    window.addEventListener("touchstart", dismiss, { once: true, passive: true });
    window.addEventListener("keydown", dismiss, { once: true });
  }

  /* ---------- nav: burger + hide on scroll-down ---------- */
  function initNav() {
    const burger = document.getElementById("burger-menu");
    const list = document.getElementById("nav-list");
    const nav = document.getElementById("nav");
    if (!burger || !list || !nav) return;

    burger.addEventListener("click", () => {
      const open = list.classList.toggle("show");
      burger.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("menu-open", open);
    });

    list.querySelectorAll(".nav-link").forEach((link) =>
      link.addEventListener("click", () => {
        list.classList.remove("show");
        burger.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
      })
    );

    let lastY = window.scrollY;
    window.addEventListener(
      "scroll",
      () => {
        const y = window.scrollY;
        if (y > lastY && y > 180 && !list.classList.contains("show")) {
          nav.classList.add("nav-hidden");
        } else {
          nav.classList.remove("nav-hidden");
        }
        lastY = y;
      },
      { passive: true }
    );
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    // small stagger between siblings sharing a parent
    items.forEach((el) => {
      const idx = Array.prototype.indexOf.call(
        el.parentElement.children,
        el
      );
      el.style.transitionDelay = Math.min(idx * 70, 280) + "ms";
      obs.observe(el);
    });
  }

  /* ---------- rotating role text w/ glitch scramble ---------- */
  function initRoleCycler() {
    const el = document.getElementById("role");
    if (!el) return;

    const roles = [
      "Software Engineering",
      "DevOps Enthusiast",
      "CS Student",
      "Cloud Automation",
      "Security Tooling",
    ];
    const glyphs = "!<>-_\\/[]{}=+*^?#01";

    if (reduceMotion) {
      let i = 0;
      setInterval(() => {
        i = (i + 1) % roles.length;
        el.textContent = roles[i];
      }, 2600);
      return;
    }

    let idx = 0;
    function scrambleTo(next) {
      const from = el.textContent;
      const len = Math.max(from.length, next.length);
      let frame = 0;
      const total = 26;
      const timer = setInterval(() => {
        let out = "";
        for (let i = 0; i < len; i++) {
          const progress = frame / total;
          const reveal = i / len < progress;
          if (reveal) {
            out += next[i] || "";
          } else {
            out += glyphs[Math.floor(Math.random() * glyphs.length)];
          }
        }
        el.textContent = out;
        frame++;
        if (frame > total) {
          clearInterval(timer);
          el.textContent = next;
        }
      }, 32);
    }

    setInterval(() => {
      idx = (idx + 1) % roles.length;
      scrambleTo(roles[idx]);
    }, 2800);
  }

  /* ---------- scroll-to-top button ---------- */
  function initScrollUp() {
    const btn = document.getElementById("scroll-up");
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (lenis) {
        lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      }
    });
    window.addEventListener(
      "scroll",
      () => btn.classList.toggle("show", window.scrollY > 600),
      { passive: true }
    );
  }

  /* ---------- ambient particle / data-stream canvas ---------- */
  function initCanvas() {
    const canvas = document.getElementById("bg-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, particles;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = Math.min(70, Math.floor((w * h) / 26000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vy: 0.25 + Math.random() * 0.9,
        len: 8 + Math.random() * 26,
        a: 0.1 + Math.random() * 0.35,
        cyan: Math.random() > 0.35,
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.y += p.vy;
        if (p.y - p.len > h) {
          p.y = -p.len;
          p.x = Math.random() * w;
        }
        ctx.strokeStyle = p.cyan
          ? "rgba(0,240,255," + p.a + ")"
          : "rgba(252,238,10," + p.a * 0.8 + ")";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y - p.len);
        ctx.stroke();
      }
      requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);
    tick();
  }

  /* ---------- scroll progress bar ---------- */
  function initScrollProgress() {
    const bar = document.querySelector(".scroll-progress");
    if (!bar) return;
    const update = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ---------- active-section nav highlight ---------- */
  function initActiveNav() {
    const links = Array.prototype.slice
      .call(document.querySelectorAll(".nav-link"))
      .filter((a) => (a.getAttribute("href") || "").charAt(0) === "#");
    if (!links.length || !("IntersectionObserver" in window)) return;

    const map = new Map();
    links.forEach((a) => {
      const sec = document.getElementById(a.getAttribute("href").slice(1));
      if (sec) map.set(sec, a);
    });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            links.forEach((l) => l.classList.remove("active"));
            const a = map.get(e.target);
            if (a) a.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    map.forEach((_, sec) => obs.observe(sec));
  }

  /* ---------- live HUD readouts (clock / fps / coords) ---------- */
  function initHud() {
    const left = document.getElementById("hud-left");
    const right = document.getElementById("hud-right");
    if (!left || !right) return;

    let frames = 0;
    let fps = 60;
    let last = performance.now();
    function fpsLoop(t) {
      frames++;
      if (t - last >= 1000) {
        fps = frames;
        frames = 0;
        last = t;
      }
      requestAnimationFrame(fpsLoop);
    }
    if (!reduceMotion) requestAnimationFrame(fpsLoop);

    const pad = (n) => String(n).padStart(2, "0");
    function tick() {
      const d = new Date();
      const time = pad(d.getHours()) + ":" + pad(d.getMinutes()) + ":" + pad(d.getSeconds());
      left.innerHTML =
        '<span class="dim">SYS</span> ONLINE &nbsp;·&nbsp; <span class="dim">UPLINK</span> STABLE' +
        (reduceMotion ? "" : ' &nbsp;·&nbsp; <span class="dim">FPS</span> ' + fps);
      right.innerHTML =
        '<span class="dim">LAT</span> 42.3128&deg; &nbsp; <span class="dim">LON</span> -71.0064&deg; &nbsp;·&nbsp; ' + time;
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- cursor accent (soft trailing ring, native cursor kept) ---------- */
  function initCursor() {
    const ring = document.querySelector(".cursor-ring");
    if (!ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let seen = false;

    window.addEventListener(
      "mousemove",
      (e) => {
        mx = e.clientX;
        my = e.clientY;
        if (!seen) {
          seen = true;
          rx = mx;
          ry = my;
        }
      },
      { passive: true }
    );

    const hov = "a, button, .tilt, .chips span, .nav-link, .xp-logo";
    window.addEventListener("mouseover", (e) => {
      if (e.target.closest && e.target.closest(hov)) ring.classList.add("hover");
    });
    window.addEventListener("mouseout", (e) => {
      if (e.target.closest && e.target.closest(hov)) ring.classList.remove("hover");
    });
    window.addEventListener("mousedown", () => ring.classList.add("click"));
    window.addEventListener("mouseup", () => ring.classList.remove("click"));
    document.addEventListener("mouseleave", () => (ring.style.opacity = "0"));
    document.addEventListener("mouseenter", () => (ring.style.opacity = ""));

    (function loop() {
      rx += (mx - rx) * 0.4;
      ry += (my - ry) * 0.4;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- 3D tilt + glare on cards ---------- */
  function initTilt() {
    const cards = document.querySelectorAll(".skill-card, .project, .lead-card");
    cards.forEach((card) => {
      card.classList.add("tilt");
      const glare = document.createElement("span");
      glare.className = "glare";
      card.appendChild(glare);

      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rotX = (0.5 - py) * 9;
        const rotY = (px - 0.5) * 9;
        card.style.transform =
          "perspective(720px) rotateX(" + rotX + "deg) rotateY(" + rotY + "deg) translateY(-4px)";
        glare.style.setProperty("--gx", px * 100 + "%");
        glare.style.setProperty("--gy", py * 100 + "%");
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ---------- magnetic buttons ---------- */
  function initMagnetic() {
    document.querySelectorAll(".btn").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + x * 0.3 + "px," + y * 0.45 + "px)";
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- hero name decode-on-load ---------- */
  function initHeroDecode() {
    const el = document.querySelector(".hero .glitch");
    if (!el) return;
    const final = el.textContent;
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@%&/\\<>01";
    el.classList.add("decoding");
    let frame = 0;
    const total = 26;
    const timer = setInterval(() => {
      const prog = frame / total;
      let out = "";
      for (let i = 0; i < final.length; i++) {
        if (final[i] === " ") {
          out += " ";
        } else if (i / final.length < prog) {
          out += final[i];
        } else {
          out += glyphs[Math.floor(Math.random() * glyphs.length)];
        }
      }
      el.textContent = out;
      frame++;
      if (frame > total) {
        clearInterval(timer);
        el.textContent = final;
        el.classList.remove("decoding");
      }
    }, 45);
  }

  /* ---------- mouse parallax on hero grid ---------- */
  function initParallax() {
    const grid = document.querySelector(".hero-grid");
    const hero = document.querySelector(".hero");
    if (!grid || !hero) return;
    hero.addEventListener(
      "pointermove",
      (e) => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        grid.style.transform =
          "perspective(420px) rotateX(58deg) translate(" + x * -34 + "px," + (-6 + y * -20) + "%)";
      },
      { passive: true }
    );
  }

  /* ---------- konami code: overdrive mode ---------- */
  function initKonami() {
    const seq = [
      "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
      "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a",
    ];
    let i = 0;
    window.addEventListener("keydown", (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      i = key === seq[i] ? i + 1 : 0;
      if (i === seq.length) {
        i = 0;
        document.body.classList.add("overdrive");
        setTimeout(() => document.body.classList.remove("overdrive"), 3500);
      }
    });
  }

  /* ---------- Apple-style smooth (inertial) scrolling via Lenis ---------- */
  function initSmoothScroll() {
    if (typeof window.Lenis === "undefined") return; // CDN blocked -> native scroll
    try {
      lenis = new window.Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.9,
      });
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // route in-page anchors through Lenis for buttery section jumps
      document.querySelectorAll('a[href^="#"]').forEach((a) => {
        const href = a.getAttribute("href");
        if (href.length < 2) return;
        a.addEventListener("click", (e) => {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            lenis.scrollTo(target, { offset: -78 });
          }
        });
      });
    } catch (err) {
      lenis = null; // fall back silently to native scrolling
    }
  }

  /* ---------- scroll-linked parallax / depth ---------- */
  function initScrollFX() {
    const heroInner = document.querySelector(".hero-inner");
    const grid = document.querySelector(".hero-grid");

    // give section numbers a gentle parallax drift
    document.querySelectorAll(".block-num").forEach((el) => {
      el.setAttribute("data-speed", "-0.06");
    });
    const depthEls = Array.prototype.slice.call(
      document.querySelectorAll("[data-speed]")
    );

    let ticking = false;
    function apply() {
      const y = window.scrollY || window.pageYOffset;
      const vh = window.innerHeight;

      // hero recedes + fades as you scroll away (Apple-like depth)
      if (heroInner) {
        const p = Math.min(y / vh, 1);
        heroInner.style.transform = "translateY(" + p * -64 + "px)";
        heroInner.style.opacity = String(1 - p * 0.9);
      }
      if (grid) {
        const p = Math.min(y / vh, 1);
        grid.style.opacity = String(0.6 * (1 - p));
      }

      // generic depth elements
      for (let i = 0; i < depthEls.length; i++) {
        const el = depthEls[i];
        const r = el.getBoundingClientRect();
        const offset = r.top + r.height / 2 - vh / 2;
        const speed = parseFloat(el.getAttribute("data-speed")) || 0;
        el.style.transform = "translateY(" + offset * speed + "px)";
      }
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(apply);
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", apply);
    apply();
  }

  /* ---------- netrunner scan-to-reveal on project cards ---------- */
  function initScanCards() {
    const cards = document.querySelectorAll(".project");
    cards.forEach((card, i) => {
      const details = card.querySelector(".project-details");
      const topRow = card.querySelector(".project-top");
      if (!details || !topRow) return;

      const redacted = document.createElement("p");
      redacted.className = "scan-redacted";
      const source = details.textContent.trim();
      redacted.textContent =
        source.replace(/[a-zA-Z0-9]/g, "█").slice(0, 90) + "...";
      details.insertAdjacentElement("beforebegin", redacted);

      const prompt = document.createElement("p");
      prompt.className = "scan-prompt";
      prompt.textContent = "> hover to scan";
      details.insertAdjacentElement("afterend", prompt);

      const sweep = document.createElement("div");
      sweep.className = "scanline-sweep";
      card.appendChild(sweep);

      const tags = document.createElement("span");
      tags.className = "scan-top-tags";
      tags.innerHTML = '<span class="scan-flag">ENCRYPTED</span>';
      topRow.appendChild(tags);
      const flag = tags.querySelector(".scan-flag");

      card.classList.add("scan-armed");

      let scanned = false;
      let scanning = false;
      function runScan() {
        if (scanned || scanning) return;
        scanning = true;
        card.classList.add("scanning");
        setTimeout(() => {
          card.classList.remove("scanning");
          card.classList.add("scanned");
          flag.textContent = "DECRYPTED";
          flag.classList.add("done");
          scanned = true;
        }, 900);
      }
      card.addEventListener("mouseenter", runScan);
      card.addEventListener("focus", runScan);
    });
  }

  /* ---------- breach protocol minigame ---------- */
  function initBreachProtocol() {
    const trigger = document.getElementById("breach-trigger");
    const modal = document.getElementById("breach-modal");
    if (!trigger || !modal) return;

    const HEX = ["1C", "55", "BD", "E9", "7A", "FF"];
    const SIZE = 5;
    const BUFFER_SIZE = 6;
    const DAEMONS = [
      { name: "DATAMINE_V1", seq: ["1C", "BD"], desc: "Basic data shard extraction." },
      { name: "DATAMINE_V2", seq: ["55", "E9", "7A"], desc: "Deep shard extraction. Reveals contact channel." },
    ];

    const gridEl = document.getElementById("breach-grid");
    const bufferSlotsEl = document.getElementById("buffer-slots");
    const stateLabel = document.getElementById("breach-state-label");
    const axisHint = document.getElementById("breach-axis-hint");
    const statusEl = document.getElementById("breach-status");
    const timerText = document.getElementById("breach-timer-text");
    const timerFill = document.getElementById("breach-timer-fill");
    const daemonsList = document.getElementById("daemons-list");
    const resetBtn = document.getElementById("breach-reset");

    let grid = [];
    let buffer = [];
    let usedCells = {};
    let constraint = "free";
    let axisIndex = null;
    let lastCell = null;
    let timer = 45;
    let timerHandle = null;
    let gameOver = false;
    let daemonsDone = {};

    function randHex() {
      return HEX[Math.floor(Math.random() * HEX.length)];
    }
    function buildGrid() {
      grid = [];
      for (let r = 0; r < SIZE; r++) {
        const row = [];
        for (let c = 0; c < SIZE; c++) row.push(randHex());
        grid.push(row);
      }
    }
    function allDaemonsDone() {
      return DAEMONS.every((_, i) => daemonsDone[i]);
    }
    function renderDaemons() {
      daemonsList.innerHTML = "";
      DAEMONS.forEach((d, i) => {
        const el = document.createElement("div");
        el.className = "daemon" + (daemonsDone[i] ? " done" : "");
        el.innerHTML =
          '<div class="daemon-name"><span>' + d.name + '</span><span class="daemon-check">✓</span></div>' +
          '<div class="daemon-seq">' + d.seq.map((h) => "<span>" + h + "</span>").join("") + "</div>" +
          '<div class="daemon-desc">' + d.desc + "</div>";
        daemonsList.appendChild(el);
      });
    }
    function renderBuffer() {
      bufferSlotsEl.innerHTML = "";
      for (let i = 0; i < BUFFER_SIZE; i++) {
        const slot = document.createElement("div");
        slot.className = "buffer-slot" + (i < buffer.length ? " filled" : "");
        slot.textContent = i < buffer.length ? buffer[i] : "";
        bufferSlotsEl.appendChild(slot);
      }
    }
    function cellValid(r, c) {
      if (gameOver) return false;
      if (usedCells[r + "," + c]) return false;
      if (buffer.length >= BUFFER_SIZE) return false;
      if (constraint === "free") return true;
      if (constraint === "row") return r === axisIndex;
      if (constraint === "col") return c === axisIndex;
      return false;
    }
    function renderGrid() {
      gridEl.innerHTML = "";
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          const cell = document.createElement("div");
          const used = usedCells[r + "," + c];
          const valid = cellValid(r, c);
          cell.className = "breach-cell" + (used ? " used" : valid ? " valid" : " disabled");
          if (lastCell && lastCell.r === r && lastCell.c === c) cell.className += " lastpick";
          cell.textContent = grid[r][c];
          if (used) {
            const order = document.createElement("span");
            order.className = "used-order";
            order.textContent = used;
            cell.appendChild(order);
          }
          if (valid) {
            cell.addEventListener("click", (function (rr, cc) {
              return function () { pick(rr, cc); };
            })(r, c));
          }
          gridEl.appendChild(cell);
        }
      }
    }
    function updateStateLabel() {
      if (gameOver) {
        stateLabel.textContent = allDaemonsDone() ? "BREACH SUCCESSFUL" : "BREACH COMPLETE";
        return;
      }
      if (buffer.length >= BUFFER_SIZE) {
        stateLabel.textContent = "BUFFER FULL";
        return;
      }
      stateLabel.textContent =
        constraint === "free" ? "SELECT ANY CELL" :
        constraint === "row" ? "SELECT FROM ROW " + (axisIndex + 1) :
        "SELECT FROM COLUMN " + (axisIndex + 1);
      axisHint.innerHTML =
        constraint === "free"
          ? 'First pick is <span class="hl">free</span> — any cell on the grid.'
          : constraint === "row"
          ? 'Next pick must come from <span class="hl">row ' + (axisIndex + 1) + "</span>."
          : 'Next pick must come from <span class="hl">column ' + (axisIndex + 1) + "</span>.";
    }
    function checkDaemons() {
      DAEMONS.forEach((d, i) => {
        if (daemonsDone[i]) return;
        const seq = d.seq;
        for (let start = 0; start <= buffer.length - seq.length; start++) {
          let match = true;
          for (let k = 0; k < seq.length; k++) {
            if (buffer[start + k] !== seq[k]) { match = false; break; }
          }
          if (match) { daemonsDone[i] = true; break; }
        }
      });
    }
    function endGame() {
      gameOver = true;
      clearInterval(timerHandle);
      updateStateLabel();
      renderGrid();
      const doneCount = DAEMONS.filter((_, i) => daemonsDone[i]).length;
      const cls = doneCount === DAEMONS.length ? "success" : doneCount > 0 ? "partial" : "fail";
      let text;
      if (doneCount === DAEMONS.length) {
        text = "&gt; ALL DAEMONS UPLOADED. CONNECTION SECURE.<br />Decrypted channel: <a href=\"mailto:prenticetang@gmail.com\">prenticetang@gmail.com</a>";
      } else if (doneCount > 0) {
        text = "&gt; " + doneCount + " OF " + DAEMONS.length + " DAEMONS UPLOADED. BUFFER EXHAUSTED.";
      } else {
        text = "&gt; BREACH FAILED. TRACE DETECTED.";
      }
      statusEl.innerHTML = '<div class="msg ' + cls + '">' + text + "</div>";
      renderDaemons();
    }
    function pick(r, c) {
      if (!cellValid(r, c)) return;
      buffer.push(grid[r][c]);
      usedCells[r + "," + c] = buffer.length;
      lastCell = { r: r, c: c };
      if (constraint === "free" || constraint === "row") { constraint = "col"; axisIndex = c; }
      else { constraint = "row"; axisIndex = r; }

      checkDaemons();
      renderBuffer();
      renderDaemons();
      renderGrid();
      updateStateLabel();

      if (allDaemonsDone() || buffer.length >= BUFFER_SIZE) endGame();
    }
    function tick() {
      if (gameOver) return;
      timer--;
      const mm = Math.floor(timer / 60), ss = timer % 60;
      timerText.textContent = mm + ":" + (ss < 10 ? "0" : "") + ss;
      const pct = Math.max(0, (timer / 45) * 100);
      timerFill.style.width = pct + "%";
      timerFill.classList.toggle("low", timer <= 10);
      if (timer <= 0) endGame();
    }
    function resetGame() {
      buildGrid();
      buffer = [];
      usedCells = {};
      constraint = "free";
      axisIndex = null;
      lastCell = null;
      timer = 45;
      gameOver = false;
      daemonsDone = {};
      clearInterval(timerHandle);
      timerHandle = setInterval(tick, 1000);
      timerText.textContent = "0:45";
      timerFill.style.width = "100%";
      timerFill.classList.remove("low");
      statusEl.innerHTML = "";
      renderBuffer();
      renderDaemons();
      renderGrid();
      updateStateLabel();
    }

    function openModal() {
      modal.hidden = false;
      document.body.classList.add("breach-open");
      resetGame();
    }
    function closeModal() {
      modal.hidden = true;
      document.body.classList.remove("breach-open");
      clearInterval(timerHandle);
    }

    trigger.addEventListener("click", openModal);
    resetBtn.addEventListener("click", resetGame);
    modal.querySelectorAll("[data-breach-close]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });
  }
})();
