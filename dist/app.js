// Local preview: fixed-size sheets with chapter entries and un-tabbed inner pages.
const main = document.getElementById("page");
const sheet = document.querySelector(".notebook > .sheet");
const cover = document.getElementById("book-cover");
const tabs = [...document.querySelectorAll("[data-page]")];
const roots = ["about", "group", "individual", "life", "training"];
const names = ["我与冥想", "团体冥想", "一对一冥想", "正念生活", "合作与培训"];
const original = Object.fromEntries(
  roots.map((id) => [id, document.getElementById(id)]),
);
const sources = [],
  pages = [];
const clone = (el) => el?.cloneNode(true);
const el = (tag, text, cls) => {
  const n = document.createElement(tag);
  n.textContent = text;
  if (cls) n.className = cls;
  return n;
};
function links(items) {
  const n = document.createElement("div");
  n.className = "reader-links";
  items.forEach(([id, label]) => {
    const a = el("a", label + " ↗", "text-link");
    a.href = "#" + id;
    n.append(a);
  });
  return n;
}
function add(id, root, title, nodes) {
  sources.push({ id, root, title, nodes: nodes.filter(Boolean) });
}
function blocks(node) {
  if (!node) return [];
  const out = [];
  for (const child of node.children) {
    if (child.matches("details")) {
      out.push(
        ...blocks(
          child.querySelector(".detail-body") ||
            child.querySelector(".timeline-content") ||
            child,
        ),
      );
    } else if (child.matches("summary")) {
      const h = child.querySelector("h2");
      if (h) out.push(clone(h));
    } else if (
      child.matches(
        ".milestones,.milestone,.detail-body,.timeline-content,section,.slow",
      )
    )
      out.push(...blocks(child));
    else if (child.matches("ol,ul")) {
      for (const li of child.children) {
        const n = el("div", "", "reader-step");
        n.innerHTML = li.innerHTML;
        out.push(n);
      }
    } else out.push(clone(child));
  }
  return out;
}
const about = original.about;
const hero = clone(about.querySelector(".hero"));
hero.querySelector(".hero-actions").replaceWith(
  links([
    ["story", "我的冥想经历"],
    ["group", "了解团体冥想"],
    ["individual", "了解一对一冥想"],
  ]),
);
hero.querySelectorAll("p").forEach((p) => {
  if (p.textContent.includes("往下看")) p.remove();
});
add("about", "about", "初次见面", [hero]);
const timeline = about.querySelector(".story-timeline");
const stages = [...timeline.children];
const overview = el("div", "", "reader-timeline");
[
  ["2024—至今", "research", "把实践中的好奇带进研究"],
  ["2023", "pause", "怀疑、暂停与重新选择"],
  ["2015—2022", "practice", "规律练习与引导实践"],
  ["2013—2015", "origin", "从好奇开始"],
].forEach(([year, id, title]) => {
  const row = el("div", "", "reader-era");
  row.append(el("span", year, "reader-year"), links([[id, title]]));
  overview.append(row);
});
add("story", "about", "我与冥想的这些年", [
  el("h1", "我的冥想经历。"),
  el(
    "p",
    "2013年接触冥想，2015年起规律练习并开始带领。经历过怀疑与暂停，如今我在浙江大学心理系研究正念冥想。",
    "reader-story-intro",
  ),
  overview,
]);
const research = stages[0];
add("research", "about", "研究里的好奇", [
  ...blocks(research).filter(
    (n) => !n.matches(".milestone-intro") && !n.querySelector?.(".milestone"),
  ),
  links([
    ["works", "论文与原创项目"],
    ["story", "回到经历"],
  ]),
]);
// Research achievements have their own leaves, rather than expanding the overview.
sources.find((s) => s.id === "research").nodes = blocks(research)
  .filter(
    (n) =>
      !n.matches(".milestone-intro,.eyebrow,h3") &&
      !n.textContent.includes("2026年浙江大学") &&
      !n.textContent.includes("共同第一作者") &&
      !n.textContent.includes("查看发表信息") &&
      !n.textContent.includes("近400人"),
  )
  .slice(0, 6)
  .concat([
    links([
      ["works", "论文与原创项目"],
      ["story", "回到经历"],
    ]),
  ]);
add("works", "about", "论文与原创项目", [
  el("h1", "一些具体的工作。"),
  ...blocks(research.querySelector(".milestones")),
  links([["story", "回到经历"]]),
]);
add("pause", "about", "怀疑与暂停", [
  ...blocks(stages[1]),
  links([["story", "回到经历"]]),
]);
const practice = stages[2],
  album = clone(practice.querySelector(".history-album"));
add("practice", "about", "规律练习与带领", [
  el("h1", "规律练习，也开始带领。"),
  clone(practice.querySelector(".timeline-content > p")),
  links([
    ["memories", "翻翻练习里的旧时光"],
    ["practice-change", "冥想给我带来的变化"],
    ["story", "回到经历"],
  ]),
]);
add("memories", "about", "练习里的旧时光", [
  album,
  links([["practice", "回到练习经历"]]),
]);
const ps = practice.querySelectorAll(".timeline-content > p");
add("practice-change", "about", "冥想带来的变化", [
  el("h1", "对我而言，冥想……"),
  clone(ps[ps.length - 1]),
  links([["practice", "回到练习经历"]]),
]);
add("origin", "about", "从好奇开始", [
  ...blocks(stages[3]),
  links([["story", "回到经历"]]),
]);
const group = original.group,
  gs = [...group.querySelectorAll(":scope > section")];
add("group", "group", "团体冥想", [
  clone(group.querySelector("h1")),
  clone(group.querySelector(".lead")),
  clone(group.querySelector(".scene")),
  links([
    ["group-plan", "安排与费用"],
    ["group-process", "怎样一起练习"],
    ["group-thoughts", "带领时我在意什么"],
  ]),
]);
add("group-plan", "group", "安排与费用", [
  ...blocks(gs[0]),
  links([["group", "回到团体冥想"]]),
]);
add("group-process", "group", "怎样一起练习", [
  ...blocks(gs[1]),
  links([["group", "回到团体冥想"]]),
]);
add("group-thoughts", "group", "练习与生活", [
  ...blocks(gs[2]),
  links([["group", "回到团体冥想"]]),
]);
const individual = original.individual,
  ins = [...individual.querySelectorAll(":scope > section")];
add("individual", "individual", "一对一冥想", [
  clone(individual.querySelector("h1")),
  clone(individual.querySelector(".lead")),
  clone(individual.querySelector(".personal-note")),
  links([
    ["individual-practice", "冥想练习"],
    ["individual-questions", "独立冥想答疑"],
    ["individual-extension", "练习的延伸 · 心力发展"],
    ["individual-fees", "费用与开始"],
  ]),
]);
add("individual-practice", "individual", "一对一练习", [
  ...ins.slice(0, 3).flatMap(blocks),
  links([["individual", "回到一对一冥想"]]),
]);
add("individual-questions", "individual", "独立冥想答疑", [
  ...blocks(individual.querySelector(".meditation-questions")),
  links([["individual", "回到一对一冥想"]]),
]);
add("individual-extension", "individual", "心力发展", [
  ...blocks(individual.querySelector(".extension")),
  links([["individual", "回到一对一冥想"]]),
]);
add("individual-fees", "individual", "费用与开始", [
  ...blocks(ins[ins.length - 1]),
  links([["individual", "回到一对一冥想"]]),
]);
const life = original.life;
add("life", "life", "正念生活", [
  el("h1", "练习之外，也看见生活。"),
  clone(life.querySelector("p")),
  links([["jianji", "了解见己记录软件"]]),
]);
add("jianji", "life", "见己记录软件", [
  ...blocks(life.querySelector("#jianji")),
  links([["life", "回到正念生活"]]),
]);
const training = original.training;
add("training", "training", "合作与培训", [
  clone(training.querySelector("h1")),
  clone(training.querySelector(".lead")),
  links([
    ["cooperation", "已有项目与定制合作"],
    ["training-plan", "培训筹备"],
  ]),
]);
const ts = [...training.querySelectorAll(":scope > section")];
add("cooperation", "training", "合作交流", [
  ...blocks(ts[0]),
  links([["training", "回到合作与培训"]]),
]);
add("training-plan", "training", "培训筹备", [
  ...blocks(ts[1]),
  links([["training", "回到合作与培训"]]),
]);
// Render only one physical leaf; text that exceeds its capacity continues on another leaf.
main.replaceChildren();
const content = el("article", "", "reader-content");
main.append(content);
document
  .querySelectorAll(".desk-caption,.desk-bottom,.sheet>.contact-section")
  .forEach((n) => n.remove());
let current = "cover",
  activeRoot = "about",
  transition = null;
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
function paginate() {
  const old = current;
  pages.length = 0;
  const hidden = sheet.hidden;
  sheet.hidden = false;
  document.body.classList.add("measuring");
  for (const source of sources) {
    let index = 0,
      page = { ...source, key: source.id, nodes: [] };
    content.replaceChildren();
    const queue = source.nodes.map(clone);
    while (queue.length) {
      const node = queue.shift();
      content.append(node);
      const overflow = content.scrollHeight > content.clientHeight + 2;
      if (overflow && page.nodes.length) {
        content.removeChild(node);
        pages.push(page);
        index++;
        page = { ...source, key: source.id + "~" + index, nodes: [] };
        content.replaceChildren();
        queue.unshift(node);
        continue;
      }
      if (overflow && node.matches("p") && node.textContent.length > 70) {
        const text = node.textContent;
        let cut = Math.floor(text.length * 0.6);
        const first = node.cloneNode(false),
          rest = node.cloneNode(false);
        first.textContent = text.slice(0, cut);
        rest.textContent = text.slice(cut);
        node.remove();
        queue.unshift(first, rest);
        continue;
      }
      page.nodes.push(node);
    }
    if (page.nodes.length) pages.push(page);
  }
  document.body.classList.remove("measuring");
  sheet.hidden = hidden;
  render(old, false);
}
function render(key, animate = true) {
  if (key === "cover" || !key) {
    transition?.cancel();
    transition = null;
    document.querySelectorAll(".outgoing-paper").forEach((n) => n.remove());
    current = "cover";
    sheet.hidden = true;
    cover.hidden = false;
    cover.getAnimations().forEach((a) => a.cancel());
    document.body.classList.add("cover-mode");
    tabs.forEach((t) => {
      t.classList.remove("active");
      t.removeAttribute("aria-current");
    });
    return;
  }
  let p = pages.find((p) => p.key === key);
  if (!p) p = pages.find((p) => p.key === "about");
  if (!p) return;
  const fromCover = current === "cover";
  let outgoing;
  if (animate && !reduced() && !fromCover && current !== p.key) {
    const rect = sheet.getBoundingClientRect();
    outgoing = sheet.cloneNode(true);
    outgoing.classList.add("outgoing-paper");
    outgoing.inert = true;
    outgoing.setAttribute("aria-hidden", "true");
    outgoing.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
    Object.assign(outgoing.style, {
      position: "fixed",
      left: rect.left + "px",
      top: rect.top + "px",
      width: rect.width + "px",
      height: rect.height + "px",
      margin: "0",
      transformOrigin: "left center",
      zIndex: "30",
    });
    document.body.append(outgoing);
  }
  sheet.hidden = false;
  document.body.classList.remove("cover-mode");
  content.replaceChildren(...p.nodes.map(clone));
  current = p.key;
  activeRoot = p.root;
  tabs.forEach((t) => {
    const active = t.dataset.page === p.root;
    t.classList.toggle("active", active);
    if (active) t.setAttribute("aria-current", "page");
    else t.removeAttribute("aria-current");
  });
  const n = pages.indexOf(p);
  document.getElementById("prev").disabled = n === 0;
  document.getElementById("next").disabled = n === pages.length - 1;
  document.getElementById("page-number").textContent =
    p.title + " · " + (n + 1) + " / " + pages.length;
  document.title = p.title + "｜刘迷糊";
  if (fromCover && animate && !reduced()) {
    cover.classList.add("opening");
    transition = cover.animate(
      [
        { transform: "perspective(1800px) rotateY(0)" },
        { transform: "perspective(1800px) rotateY(-150deg)" },
      ],
      { duration: 850, easing: "ease-in-out" },
    );
    transition.onfinish = () => {
      cover.hidden = true;
      cover.classList.remove("opening");
      transition = null;
    };
  } else cover.hidden = true;
  if (outgoing) {
    transition = outgoing.animate(
      [
        { transform: "perspective(2400px) rotateY(0)" },
        { transform: "perspective(2400px) rotateY(-105deg)" },
      ],
      { duration: 900, easing: "ease-in-out" },
    );
    transition.onfinish = () => {
      outgoing.remove();
      transition = null;
    };
  }
  bindAlbum();
  content.focus({ preventScroll: true });
}
function route() {
  const key = decodeURIComponent(location.hash.slice(1)) || "cover";
  if (transition) {
    transition.cancel();
    document.querySelectorAll(".outgoing-paper").forEach((n) => n.remove());
    cover.classList.remove("opening");
    transition = null;
  }
  render(key);
}
cover.onclick = () => (location.hash = "about");
document.getElementById("prev").onclick = () => {
  const i = pages.findIndex((p) => p.key === current);
  if (i > 0) location.hash = pages[i - 1].key;
};
document.getElementById("next").onclick = () => {
  const i = pages.findIndex((p) => p.key === current);
  if (i < pages.length - 1) location.hash = pages[i + 1].key;
};
const dialog = document.getElementById("contact-dialog");
let opener;
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-contact]");
  if (b) {
    opener = b;
    dialog.showModal();
  }
});
dialog.querySelector(".close").onclick = () => dialog.close();
dialog.addEventListener("close", () => opener?.focus());
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
function bindAlbum() {
  const album = content.querySelector(".history-album");
  if (!album) return;
  const slides = [...album.querySelectorAll(".album-slide")];
  let i = 0,
    start,
    last = 0;
  const show = (n) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, j) => (s.hidden = i !== j));
    album.querySelector(".album-count").textContent =
      String(i + 1).padStart(2, "0") +
      " / " +
      String(slides.length).padStart(2, "0");
  };
  album.querySelectorAll(".album-image").forEach(
    (b) =>
      (b.onclick = () => {
        if (Date.now() - last > 450) show(i + 1);
      }),
  );
  album.onkeydown = (e) => {
    if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      show(i + (e.key === "ArrowRight" ? 1 : -1));
      album
        .querySelector(".album-slide:not([hidden]) button")
        .focus({ preventScroll: true });
    }
  };
  album.addEventListener(
    "touchstart",
    (e) => (start = e.changedTouches[0].clientX),
    { passive: true },
  );
  album.addEventListener(
    "touchend",
    (e) => {
      const dx = e.changedTouches[0].clientX - start;
      if (Math.abs(dx) > 55) {
        last = Date.now();
        show(i + (dx < 0 ? 1 : -1));
      }
    },
    { passive: true },
  );
}
content.tabIndex = -1;
window.addEventListener("hashchange", route);
let resize;
window.addEventListener("resize", () => {
  clearTimeout(resize);
  resize = setTimeout(paginate, 180);
});
document.fonts.ready.then(() => {
  paginate();
  route();
});
