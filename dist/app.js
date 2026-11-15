const ids = ["about", "group", "individual", "life", "training"];
const labels = ["我与冥想", "团体冥想", "一对一冥想", "正念生活", "合作与培训"];
let current = "about";
const positions = {};
const cover = document.getElementById("book-cover"),
  sheet = document.querySelector(".sheet");
const reduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let coverAnimation = null;
function showCover() {
  document.querySelectorAll(".outgoing-paper").forEach((n) => n.remove());
  pageTurning = false;
  queuedPage = null;
  cover.getAnimations().forEach((a) => a.cancel());
  coverAnimation?.cancel();
  coverAnimation = null;
  cover.style.height = "";
  cover.classList.remove("opening");
  cover.hidden = false;
  sheet.hidden = true;
  document.body.classList.add("cover-mode");
  document.querySelectorAll("[data-page]").forEach((a) => {
    a.classList.remove("active");
    a.removeAttribute("aria-current");
  });
  window.scrollTo({ top: 0, behavior: "instant" });
  document.title = "刘迷糊｜我与冥想";
}
function openBook(initial) {
  if (!document.body.classList.contains("cover-mode")) return false;
  const height = cover.getBoundingClientRect().height;
  sheet.hidden = false;
  document.body.classList.remove("cover-mode");
  if (initial || reduced()) {
    cover.hidden = true;
    return true;
  }
  cover.style.height = height + "px";
  cover.classList.add("opening");
  coverAnimation = cover.animate(
    [
      { transform: "perspective(1500px) rotateY(0deg)", opacity: 1 },
      { transform: "perspective(2200px) rotateY(-150deg)", opacity: 1 },
    ],
    { duration: 850, easing: "cubic-bezier(.22,.6,.2,1)", fill: "forwards" },
  );
  coverAnimation.onfinish = () => {
    const finished = coverAnimation;
    cover.hidden = true;
    finished?.cancel();
    cover.classList.remove("opening");
    cover.style.height = "";
    coverAnimation = null;
  };
  return true;
}
let pageTurning = false,
  queuedPage = null;
function turnToPage(id) {
  if (pageTurning) {
    queuedPage = id;
    return;
  }
  if (reduced()) {
    showPage(id, true);
    window.scrollTo({ top: 0, behavior: "instant" });
    return;
  }
  pageTurning = true;
  positions[current] = window.scrollY;
  const rect = sheet.getBoundingClientRect();
  const outgoing = sheet.cloneNode(true);
  outgoing.classList.add("outgoing-paper");
  outgoing.setAttribute("aria-hidden", "true");
  outgoing.inert = true;
  outgoing
    .querySelectorAll(".contact-section,footer,.chapter[hidden]")
    .forEach((n) => n.remove());
  outgoing.querySelectorAll("[id]").forEach((n) => {
    if (n.id === "about") n.classList.add("snapshot-about");
    n.removeAttribute("id");
  });
  Object.assign(outgoing.style, {
    position: "fixed",
    left: rect.left + "px",
    top: Math.min(64, Math.max(0, rect.top + window.scrollY)) + "px",
    width: rect.width + "px",
    height: rect.height + "px",
    margin: "0",
    transformOrigin: "left " + innerHeight / 2 + "px",
    zIndex: "30",
    pointerEvents: "none",
  });
  document.body.append(outgoing);
  showPage(id, true);
  window.scrollTo({ top: 0, behavior: "instant" });
  const turn = outgoing.animate(
    [
      { transform: "perspective(2400px) rotateY(0deg)" },
      { transform: "perspective(2400px) rotateY(-105deg)" },
    ],
    { duration: 1000, easing: "cubic-bezier(.35,0,.25,1)", fill: "forwards" },
  );
  turn.onfinish = () => {
    outgoing.remove();
    pageTurning = false;
    document.getElementById("page").focus({ preventScroll: true });
    const next = queuedPage;
    queuedPage = null;
    if (next && next !== current) showPage(next);
  };
}
cover.addEventListener("click", () => {
  location.hash = "about";
});

function showPage(id, initial = false) {
  if (!ids.includes(id)) return;
  const outgoingScroll = window.scrollY;
  const fromCover = openBook(initial);
  if (id !== current && !initial && !fromCover) {
    turnToPage(id);
    return;
  }
  positions[current] = outgoingScroll;
  const changed = id !== current;
  sheet.querySelectorAll(".chapter").forEach((p) => {
    p.hidden = p.id !== id;
  });

  document.querySelectorAll("[data-page]").forEach((a) => {
    const active = a.dataset.page === id;
    a.classList.toggle("active", active);
    if (active) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });

  current = id;
  const n = ids.indexOf(id);
  document.getElementById("page-number").textContent =
    labels[n] + " · 0" + (n + 1) + " / 05";
  document.getElementById("prev").disabled = n === 0;
  document.getElementById("next").disabled = n === ids.length - 1;
  document.title = labels[n] + "｜刘迷糊的个人手帐";
  if (!initial && (changed || fromCover)) {
    window.scrollTo({ top: positions[id] || 0, behavior: "instant" });
    document.getElementById("page").focus({ preventScroll: true });
  }
}
function route() {
  const hash = decodeURIComponent(location.hash.slice(1));
  if (!hash || hash === "cover") {
    showCover();
    return;
  }
  if (ids.includes(hash)) showPage(hash);
  else if (["jianji", "practice-album"].includes(hash)) {
    showPage(hash === "jianji" ? "life" : "about");
    const target = document.getElementById(hash);
    const parent = target.closest(".timeline-fold");
    if (parent) parent.open = true;
    requestAnimationFrame(() =>
      target.scrollIntoView({ behavior: reduced() ? "auto" : "smooth" }),
    );
  }
}
window.addEventListener("hashchange", route);
document.getElementById("prev").onclick = () => {
  const n = ids.indexOf(current);
  if (n > 0) location.hash = ids[n - 1];
};
document.getElementById("next").onclick = () => {
  const n = ids.indexOf(current);
  if (n < ids.length - 1) location.hash = ids[n + 1];
};
const dialog = document.getElementById("contact-dialog");
let opener;
document.querySelectorAll("[data-contact]").forEach(
  (b) =>
    (b.onclick = () => {
      opener = b;
      dialog.showModal();
    }),
);
dialog.querySelector(".close").onclick = () => dialog.close();
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
});
dialog.addEventListener("close", () => opener?.focus());
if (!location.hash || location.hash === "#cover") showCover();
else {
  showPage(
    ids.includes(location.hash.slice(1)) ? location.hash.slice(1) : "about",
    true,
  );
  if (["#jianji", "#practice-album"].includes(location.hash)) route();
}

// 点击图片、方向键和横向轻扫；不自动播放。
const album = document.querySelector(".history-album");
if (album) {
  const slides = [...album.querySelectorAll(".album-slide")];
  let index = 0,
    lastSwipe = 0;
  const renderAlbum = (n) => {
    index = (n + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.hidden = i !== index;
    });
    album.querySelector(".album-count").textContent =
      String(index + 1).padStart(2, "0") +
      " / " +
      String(slides.length).padStart(2, "0");
  };
  album.querySelectorAll(".album-image").forEach((button) =>
    button.addEventListener("click", (e) => {
      if (Date.now() - lastSwipe < 450) return;
      renderAlbum(index + 1);
      album
        .querySelector(".album-slide:not([hidden]) .album-image")
        .focus({ preventScroll: true });
    }),
  );
  album.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      renderAlbum(index + (e.key === "ArrowRight" ? 1 : -1));
      album
        .querySelector(".album-slide:not([hidden]) .album-image")
        .focus({ preventScroll: true });
    }
  });
  let start = null;
  album.addEventListener(
    "touchstart",
    (e) => {
      start = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };
    },
    { passive: true },
  );
  album.addEventListener(
    "touchend",
    (e) => {
      if (!start) return;
      const dx = e.changedTouches[0].clientX - start.x,
        dy = e.changedTouches[0].clientY - start.y;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        lastSwipe = Date.now();
        renderAlbum(index + (dx < 0 ? 1 : -1));
      }
      start = null;
    },
    { passive: true },
  );
}
