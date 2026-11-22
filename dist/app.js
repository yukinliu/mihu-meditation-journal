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
const intro=el('div','','intro-sheet');
const introTop=el('div','','intro-top');const identity=el('div','','intro-identity');identity.append(el('h1','你好，我是刘迷糊。'),el('p','浙江大学心理系硕士在读，研究方向正念冥想，持续实践冥想带练。'));const portrait=clone(about.querySelector('.portrait'));portrait.querySelector('img').src='assets/portrait-cutout.png';portrait.querySelector('figcaption')?.remove();introTop.append(identity,portrait);intro.append(introTop,el('p','2013 年起冥想便成为了我生活的一部分。','intro-bridge'));
const map=el('nav','','journey-map');map.setAttribute('aria-label','冥想历程');
const routeLine=document.createElementNS('http://www.w3.org/2000/svg','svg');routeLine.setAttribute('viewBox','0 0 600 230');routeLine.setAttribute('preserveAspectRatio','none');routeLine.classList.add('journey-line');routeLine.innerHTML='<path d="M110 184 C195 215 352 188 448 158 C550 97 44 157 156 82 C245 15 349 70 468 48" fill="none" stroke="#a28b65" stroke-width="2" stroke-dasharray="4 7" stroke-linecap="round"/>';map.append(routeLine);
[['2024—至今','research','科研与实践','#78968a'],['2023','pause','自我怀疑与搁浅','#bc987d'],['2015—2022','practice','规律练习与引导','#a99b6f'],['2013—2015','origin','初识与断断续续','#8faaa9']].forEach(([year,id,label,color],i)=>{const a=el('a','','journey-stop');a.href='#'+id;const image=el('img');image.src='assets/journey-'+id+'-scene.png';image.alt='';image.width=100;image.height=100;a.append(image);a.append(el('span',year,'journey-year'),el('span',label,'journey-caption'));map.append(a);});
intro.append(map,links([['group','了解团体冥想'],['individual','了解一对一冥想']]));add('about','about','初次见面',[intro]);
for(const [id,label,text] of [['prev','上一页','←'],['next','下一页','→']]){const b=document.getElementById(id);b.textContent=text;b.setAttribute('aria-label',label);}
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
// Confirmed opening three leaves, in chronological reading order.
const originCopy = [
 '2013 年，我接触了冥想。起初练习断断续续，也说不清自己在寻找什么，只记得练习结束后，整个人很明亮、很舒服。',
 '最初两年，有几个片段一直留在记忆里。',
 '一次练习结束，老师在一旁弹起吉他，我忽然没来由地流了眼泪。',
 '一次呼吸法进修学习营里，我是年龄最小的一个，和老师、姐姐阿姨们一起，在山中学习。',
 '还有坐不了多久就酸痛的脚踝、久坐后发麻的双腿、烛光冥想时忍不住想眨眼的冲动……',
 '那时，我还不能理解这些体验。但这些瞬间，让我带着好奇，一次次靠近冥想。'
];
const originSheet=el('div','','origin-sheet memory-leaf scrapbook-leaf');
const originHeader=el('div','','memory-intro');originHeader.append(el('h1','最初，是一次没有预料到的触动。'),el('p',originCopy[0]));
const memoryScenes=el('div','','memory-scenes');
[['吉他声里',originCopy[2]],['山中的学习',originCopy[3]],['身体的记忆',originCopy[4]]].forEach(([title,text])=>{const note=el('section','','memory-note');note.append(el('h2',title),el('p',text));memoryScenes.append(note);});
const memoryArt=el('img','','memory-art');memoryArt.src='assets/memory-guitar-candle.png';memoryArt.alt='吉他、烛光、山的轮廓与一本练习手记';
originSheet.append(originHeader,el('p',originCopy[1],'memory-preface'),memoryScenes,memoryArt,el('p',originCopy[5],'memory-ending'));
Object.assign(sources.find(s=>s.id==='origin'),{title:'2013—2015',nodes:[originSheet]});
const practiceCopy=[
 '从 2015 年起，我开始规律练习，也逐渐带领线上、线下的团体与一对一冥想。那八年里，我没有系统记录带领过多少人、多少小时，只是全心投入其中：一边学习和练习，一边把理解带进引导，再从实际带领中继续学习。',
 '冥想对我的影响，也逐渐进入更广的生活：怎样看待自己、怎样与人相处，以及怎样面对那些不如意的时刻。',
 '我更容易觉察自己的念头和情绪，也多了一些选择怎样回应的空间。觉察、接纳、慈悲……慢慢地从几个词，成为我理解和对待生活的方式。'
];
const practiceSheet=el('div','','practice-sheet'),practiceText=el('div','','practice-copy journal-writing'),practiceAlbum=clone(album);practiceAlbum.querySelector('.album-heading')?.remove();practiceText.append(el('h1','从自己练习，到带领他人。'),...practiceCopy.map(t=>el('p',t)));practiceSheet.append(practiceAlbum,practiceText);
Object.assign(sources.find(s=>s.id==='practice'),{title:'2015—2022',nodes:[practiceSheet]});
const pauseCopy=[
'2023 年，现实中的变动与挑战，让我开始怀疑自己，也怀疑把冥想继续做下去的可能。我暂停了带领，一边备考浙江大学心理系研究生，一边做产品经理的工作。',
'冥想没有完全离开。图书馆里学累了、注意力散了，我就静静地坐一会儿。没有复杂的安排，只让自己歇一歇，再继续眼前的生活。',
'后来选择研究方向，我还是犹豫：喜欢冥想，却又被过去的经历牵住。直到一个晚上，从图书馆回家的路上，经过停车场，一个念头突然清楚起来。',
'那一刻，我很激动，也有些想哭。经历了怀疑和暂停，我还是想回到这件事上。'
];
const pauseSheet=el('div','','pause-sheet scrapbook-leaf');const pauseArt=el('img','','pause-art');pauseArt.src='assets/journey-pause-scene.png';pauseArt.alt='桌前思考的自己，身边是书、杯子和计划本';
const pauseTop=el('div','','pause-top');pauseTop.append(el('h1','停下来，也重新选择。'),pauseArt);
const pauseDiary=el('div','','pause-diary journal-writing');pauseDiary.append(el('p',pauseCopy[0]),el('p',pauseCopy[1]),el('p',pauseCopy[2]));pauseSheet.append(pauseTop,pauseDiary,el('blockquote','“我就是要去学正念冥想，我什么都不管，我就只学它。”'),el('p',pauseCopy[3],'pause-ending'));
Object.assign(sources.find(s=>s.id==='pause'),{title:'2023',nodes:[pauseSheet]});
const order=['about','origin','practice','pause','research','works'];
const extras=sources.filter(s=>!['story','memories','practice-change',...order].includes(s.id));
const first=order.map(id=>sources.find(s=>s.id===id));sources.splice(0,sources.length,...first,...extras);
const aliases={story:'about',memories:'practice','practice-change':'practice'};
for(const source of sources)for(const node of source.nodes)node.querySelectorAll?.('a[href]').forEach(a=>{const id=a.hash.slice(1);if(aliases[id])a.hash=aliases[id];});
// Click cues without turning the vignette into a boxed button.
map.querySelectorAll('.journey-stop').forEach(a=>{a.setAttribute('aria-label',a.textContent+'，翻开这一段经历');});
intro.querySelectorAll(':scope>.reader-links a').forEach(a=>a.textContent=a.textContent.replace(/\s*↗$/,''));
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
  key=aliases[key]||key;
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
  show(0);
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
