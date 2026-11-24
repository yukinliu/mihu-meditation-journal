// Local preview: fixed-size sheets with chapter entries and un-tabbed inner pages.
const main = document.getElementById("page");
const sheet = document.querySelector(".notebook > .sheet");
const cover = document.getElementById("book-cover");
const tabs = [...document.querySelectorAll("[data-page]")];
const roots = ["about", "group", "individual", "life", "training"];
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
const introTop=el('div','','intro-top');const identity=el('div','','intro-identity');identity.append(el('h1','你好，我是刘迷糊。'),el('p','浙江大学心理系硕士在读，研究方向正念冥想，持续实践冥想带练。'));const portrait=clone(about.querySelector('.portrait'));portrait.querySelector('img').src='assets/portrait-cutout.png';portrait.querySelector('figcaption')?.remove();identity.append(el('p','2013 年起冥想便成为了我生活的一部分。','intro-bridge'));introTop.append(identity,portrait);intro.append(introTop);
const map = el("nav", "", "home-journey");
map.setAttribute("aria-label", "冥想历程");
function artworkCrop(left, top, width, height, className) {
  const crop = el("span", "", className);
  crop.style.aspectRatio = width + " / " + height;
  crop.style.backgroundSize = (1536 / width * 100) + "% " + (1024 / height * 100) + "%";
  crop.style.backgroundPosition = (left / (1536 - width) * 100) + "% " + (top / (1024 - height) * 100) + "%";
  crop.setAttribute("aria-hidden", "true");
  return crop;
}
const hills = el("img", "", "home-hills");
hills.src = "assets/home-mist.png";
hills.alt = "";
map.append(hills);
const journeyRoute = document.createElementNS("http://www.w3.org/2000/svg", "svg");
journeyRoute.setAttribute("viewBox", "0 0 600 400");
journeyRoute.setAttribute("preserveAspectRatio", "none");
journeyRoute.setAttribute("aria-hidden", "true");
journeyRoute.classList.add("home-route");
journeyRoute.innerHTML = `<defs>
  <filter id="journey-paper-wear" x="-5%" y="-8%" width="110%" height="116%">
    <feTurbulence type="fractalNoise" baseFrequency=".25 .38" numOctaves="3" seed="12" result="paperGrain"/>
    <feDisplacementMap in="SourceGraphic" in2="paperGrain" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="softEdge"/>
    <feColorMatrix in="paperGrain" type="matrix"
      values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  2.7 0 0 0 -.55" result="grainMask"/>
    <feComposite in="softEdge" in2="grainMask" operator="in"/>
  </filter>
</defs>`;
const routePath = document.createElementNS(journeyRoute.namespaceURI, "path");
routePath.setAttribute("d", "M18 385 C61 340 109 342 155 326 C221 302 248 258 361 258 C438 258 479 229 441 204 C411 183 333 189 277 186 C199 182 139 166 132 138 C123 105 232 115 297 93 C373 67 429 57 535 79 C428 66 379 75 303 100 C238 122 134 112 139 138 C144 163 203 176 279 180 C334 183 415 176 448 199 C493 231 446 266 361 265 C251 264 225 311 157 332 C106 347 64 344 18 385Z");
routePath.setAttribute("filter", "url(#journey-paper-wear)");
journeyRoute.append(routePath);
map.append(journeyRoute);
for (const [key, year, label] of [
  ["origin", "2013—2015", "初识与断断续续"],
  ["practice", "2015—2022", "规律练习与引导"],
  ["pause", "2023", "自我怀疑与搁浅"],
  ["research", "2024—至今", "科研与实践"],
]) {
  const stop = el("a", "", "home-journey-link");
  stop.href = "#" + key;
  stop.dataset.stop = key;
  const caption = el("span", "", "home-journey-caption");
  caption.append(el("b", year), el("span", label));
  const figure = el("img", "", "home-figure");
  figure.src = "assets/home-" + key + ".png";
  figure.alt = "";
  stop.append(figure, caption);
  map.append(stop);
}
const slow = el("section", "", "home-slow");
slow.setAttribute("aria-label", "SLOW");
slow.append(el("b", "SLOW", "home-slow-title"));
const values = el("ul", "", "home-slow-values");
for (const [chinese, english, crop] of [
  ["本自具足", "Self", [264, 799, 106, 74]],
  ["正念生活", "Life", [557, 795, 100, 80]],
  ["开放好奇", "Open", [824, 797, 142, 81]],
  ["丰盛幸福", "Well-being", [1148, 794, 90, 77]],
]) {
  const value = el("li");
  value.append(artworkCrop(...crop, "home-art-crop home-slow-icon"), el("span", chinese), el("small", english));
  values.append(value);
}
slow.append(values);
intro.append(map, slow);
add("about", "about", "初次见面", [intro]);
for(const [id,label,text] of [['prev','上一页','‹'],['next','下一页','›']]){const b=document.getElementById(id);b.textContent=text;b.setAttribute('aria-label',label);}
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
const group = original.group;
const meditationSheet = el("section", "", "meditation-sheet");
const meditationHeader = el("header", "", "meditation-header");
meditationHeader.append(el("h1", "科学冥想"),
  el("p", "理论与实践结合 · 掌握方法 · 连接日常生活"));
const customCards = el("div", "", "custom-cards meditation-services");
const groupCard = el("button", "", "custom-card meditation-group-card");
groupCard.type = "button";
groupCard.dataset.project = "meditation-group";
groupCard.setAttribute("aria-haspopup", "dialog");
const groupArtwork = clone(group.querySelector(".scene img"));
groupArtwork.alt = "";
const groupCopy = el("span", "", "custom-card-copy");
groupCopy.append(el("strong", "团体冥想"), el("span", "安坐观己 · 共练链接 · 众行致远"),
  el("span", "加入团体共练", "meditation-card-action"));
groupCard.append(groupArtwork, groupCopy);
customCards.append(groupCard);
const meditationActions = el("footer", "", "meditation-actions");
const designLink = el("a", "", "meditation-design-link");
designLink.href = "#meditation-design";
const pageArrow = el("span", "↗");
pageArrow.setAttribute("aria-hidden", "true");
designLink.append(el("strong", "设计理念"), el("small", "练习层次 · 觉察与接纳"), pageArrow);
meditationActions.append(designLink);
meditationSheet.append(meditationHeader, customCards, meditationActions);
add("meditation", "meditation", "冥想练习", [meditationSheet]);

const designSheet = el("section", "", "meditation-sheet meditation-design");
designSheet.append(el("h1", "科学冥想 · 设计理念"),
  el("p", "理论与实践结合 · 掌握方法 · 连接日常生活", "design-subtitle"));
const designHero = el("figure", "", "design-hero");
const seatedFigure = artworkCrop(132, 8, 493, 474, "design-warm-crop design-seated-art");
const pathFigure = artworkCrop(666, 0, 774, 417, "design-warm-crop design-stage-art");
const journeyCaption = el("figcaption", "", "design-path-labels");
for (const label of ["跟随引导", "掌握方法", "自主练习"]) journeyCaption.append(el("span", label));
designHero.append(seatedFigure, pathFigure, journeyCaption);
designSheet.append(designHero);
const principles = el("div", "", "design-principles");
for (const [style, title, copy, crop] of [
  ["steps", "循序渐进", "从应对练习障碍开始，安顿身心，逐步探索更丰富的冥想体验。", [103, 490, 651, 226]],
  ["focus", "掌握方法", "采用聚焦注意与开放监控冥想，理解练习的目的，逐渐辨别并选择适合自己的方法。", [837, 392, 539, 323]],
  ["awareness", "觉察与接纳并重", "两者共同作用，支持我们在练习和生活中更从容地回应。", [95, 718, 610, 300]],
  ["notes", "持续迭代", "100 余场带练与 4 轮重要迭代。结合实践、研究和参与者反馈，持续深化与拓展。", [751, 713, 640, 306]],
]) {
  const entry = el("section", "", "design-principle");
  const art = el("div", "", "design-art");
  art.append(artworkCrop(...crop, "design-warm-crop design-principle-art design-crop-" + style));
  const text = el("div");
  text.append(el("h2", title), el("p", copy));
  entry.append(art, text);
  principles.append(entry);
}
const freeQuestions = el("button", "", "meditation-free-questions");
freeQuestions.type = "button";
freeQuestions.dataset.contact = "";
freeQuestions.setAttribute("aria-haspopup", "dialog");
freeQuestions.append(el("strong", "免费答疑解惑"), document.createTextNode("　对冥想好奇？练习遇到问题？都可以。唠个有关冥想的嗑。"));
designSheet.append(principles, freeQuestions);
add("meditation-design", "meditation", "设计理念", [designSheet]);

const customOptions = [
  ["individual-practice", "一对一冥想", "匹配时间 · 定制内容"],
  ["individual-extension", "心力发展", "建立主体性 · 重塑心理秩序 · 发展内在力量"],
];
const lifeSheet = el("section", "", "life-sheet jianji-sheet");
function jianjiImage(file, alt = "") {
  const img = el("img");
  img.src = "assets/jianji-" + file + ".png";
  img.alt = alt;
  img.loading = "lazy";
  return img;
}
const lifeHeading = el("div", "", "jianji-heading");
lifeHeading.append(jianjiImage("logo"), el("h1", "见己 · 自我觉察与成长记录"));
const lifeIntro = el("p", "见己是一款电脑端记录工具。把感受、想法与经历留下来，按日期和项目回看。");
const lifeGallery = makePosterGallery("见己图文", "jianji-poster-original", [
  "见己简介",
  "写作、学习、工作与生活记录",
  "记录、汇总、保存、搜索与回看，附见己下载二维码",
]);
const downloadQR = jianjiImage("download-sticker", "见己软件下载二维码，扫码下载，免费使用");
downloadQR.loading = "eager";
downloadQR.className = "jianji-download-sticker";
lifeGallery.querySelector(".jianji-poster-controls").append(downloadQR);
lifeSheet.append(lifeHeading, lifeIntro, lifeGallery);
add("life", "life", "正念生活", [lifeSheet]);

function makePosterGallery(label, filePrefix, descriptions) {
  const gallery = el("div", "", "jianji-gallery");
  const frame = el("div", "", "jianji-poster-frame");
  frame.tabIndex = 0;
  frame.setAttribute("aria-label", label + "，使用左右方向键切换");
  descriptions.forEach((description, index) => {
    const poster = filePrefix ? el("img") : el("div", "", "poster-placeholder");
    if (filePrefix) {
      poster.src = "assets/" + filePrefix + "-" + (index + 1) + ".png";
      poster.alt = description;
      poster.draggable = false;
    } else {
      poster.append(el("strong", description), el("small", "介绍图待补"));
    }
    const card = el("div", "", "jianji-poster-card");
    card.dataset.depth = index;
    card.setAttribute("aria-hidden", String(index !== 0));
    card.append(poster);
    frame.append(card);
  });
  const controls = el("div", "", "jianji-poster-controls");
  const count = el("span", "1 / " + descriptions.length);
  count.setAttribute("aria-live", "polite");
  for (const [buttonLabel, arrow, direction] of [["上一张图", "上张", -1], ["下一张图", "下张", 1]]) {
    const button = el("button", arrow);
    button.type = "button";
    button.setAttribute("aria-label", buttonLabel);
    button.dataset.posterStep = direction;
    if (direction > 0) controls.append(count);
    controls.append(button);
  }
  gallery.append(frame, controls);
  return gallery;
}

const posterViewer = el("dialog", "", "poster-viewer");
posterViewer.setAttribute("aria-label", "海报原图");
const viewerImage = el("img");
const viewerClose = el("button", "", "poster-viewer-image");
viewerClose.type = "button";
viewerClose.setAttribute("aria-label", "返回海报切换");
viewerClose.append(viewerImage);
const viewerSave = el("a", "保存原图", "poster-viewer-save");
viewerClose.onclick = () => posterViewer.close();
posterViewer.append(viewerClose, viewerSave);
document.body.append(posterViewer);
posterViewer.addEventListener("click", event => {
  if (event.target === posterViewer) posterViewer.close();
});
function openPosterViewer(poster, returnFocus) {
  viewerImage.src = poster.src;
  viewerImage.alt = poster.alt;
  viewerSave.href = poster.src;
  viewerSave.download = new URL(poster.src).pathname.split("/").pop();
  posterViewer.showModal();
  posterViewer.addEventListener("close", () => {
    if (returnFocus.isConnected) returnFocus.focus({ preventScroll: true });
  }, { once: true });
}

function bindPosterGallery(root) {
  const gallery = root.querySelector(".jianji-gallery");
  if (!gallery) return;
  const frame = gallery.querySelector(".jianji-poster-frame");
  const posters = [...frame.children];
  const count = gallery.querySelector("[aria-live]");
  const hasArtwork = Boolean(posters[0].querySelector("img"));
  let index = 0;
  let start;
  let swipedAt = -Infinity;
  if (hasArtwork) {
    frame.classList.add("can-enlarge");
    frame.setAttribute("aria-label", frame.getAttribute("aria-label") + "，按回车放大当前海报");
    frame.addEventListener("click", event => {
      if (performance.now() - swipedAt < 380) return;
      const image = posters[index].querySelector("img");
      if (event.target === image) openPosterViewer(image, frame);
    });
  }
  function step(direction) {
    index = (index + direction + posters.length) % posters.length;
    posters.forEach((poster, position) => {
      poster.dataset.depth = (position - index + posters.length) % posters.length;
      poster.setAttribute("aria-hidden", String(position !== index));
    });
    if (!reduced()) {
      posters[index].animate([
        { translate: (direction * 28) + "px 8px", rotate: (direction * 4) + "deg" },
        { translate: "0 0", rotate: "0deg" },
      ], { duration: 340, easing: "cubic-bezier(.2,.7,.25,1)" });
    }
    count.textContent = (index + 1) + " / " + posters.length;
    frame.scrollTop = 0;
  }
  gallery.querySelectorAll("[data-poster-step]").forEach(button => {
    button.onclick = () => step(Number(button.dataset.posterStep));
  });
  frame.onkeydown = event => {
    if (hasArtwork && ["Enter", " "].includes(event.key)) {
      event.preventDefault();
      event.stopPropagation();
      openPosterViewer(posters[index].querySelector("img"), frame);
      return;
    }
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    step(event.key === "ArrowRight" ? 1 : -1);
  };
  frame.addEventListener("touchstart", event => {
    start = event.touches.length === 1 ? event.touches[0] : null;
  }, { passive: true });
  frame.addEventListener("touchend", event => {
    if (!start) return;
    const dx = event.changedTouches[0].clientX - start.clientX;
    const dy = event.changedTouches[0].clientY - start.clientY;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      swipedAt = performance.now();
      step(dx < 0 ? 1 : -1);
    }
    start = null;
  }, { passive: true });
}
const trainingSheet = el("section", "", "training-sheet");
const collaboration = el("section", "", "collaboration-section");
collaboration.append(el("p", "想把正念练习带给你们的团队，或把日常记录融入正在做的项目？可以从下面几个方向聊起。"));
const collaborationCards = el("div", "", "collaboration-cards");
for (const [key, title, summary, imageFile] of [
  ["merp", "21 天正念情绪调节", "每天 15 分钟，把情绪觉察与调节练进日常。", "project-vignette-merp.png"],
  ["family", "4 周正念亲子团体", "从家长的情绪觉察入手，把练习带回亲子相处。", "project-vignette-family.png"],
  ["custom-group", "定制团体活动", "为团队或机构设计贴合场景的练习。", "practice-v3.png"],
  ["jianji-collaboration", "见己软件", "把日常记录与回看融入课程和团体项目。", "collaboration-jianji.png"],
]) {
  const card = el("button", "", "collaboration-card");
  card.type = "button";
  card.dataset.project = key;
  card.setAttribute("aria-haspopup", "dialog");
  const arrow = el("span", "↗", "collaboration-arrow");
  arrow.setAttribute("aria-hidden", "true");
  const artwork = el("img", "", "collaboration-art");
  artwork.src = "assets/" + imageFile;
  artwork.alt = "";
  const copy = el("span", "", "collaboration-copy");
  copy.append(el("strong", title), el("span", summary));
  card.append(artwork, copy, arrow);
  collaborationCards.append(card);
}
collaboration.append(collaborationCards);
const trainingPlan = el("section", "", "training-plan");
const trainingCopy = el("div");
const trainingArt = el("img", "", "training-art");
trainingArt.src = "assets/training-books.png";
trainingArt.alt = "";
trainingCopy.append(el("h2", "冥想带领者培训"), el("span", "筹备中", "status"),
  el("p", "从一段引导怎么设计，到走神、昏沉和坐姿不适时怎么调整。我正在把这些带练现场的问题，整理成可以一起学习和练习的内容。"));
trainingPlan.append(trainingCopy, trainingArt);
const collaborationContact = el("button", "一起聊聊你的项目", "meditation-contact collaboration-contact");
collaborationContact.type = "button";
collaborationContact.dataset.contact = "";
collaborationContact.setAttribute("aria-haspopup", "dialog");
trainingSheet.append(el("h1", "合作与培训"), collaboration, collaborationContact, trainingPlan);
add("training", "training", "合作与培训", [trainingSheet]);
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
const memoryScenes = el("div", "", "memory-scenes");
for (const [title, copy, file] of [
  ["吉他声里", originCopy[2], "memory-guitar.png"],
  ["冥想呼吸法进修", originCopy[3], "memory-breathing-circle.png"],
  ["身体的记忆", originCopy[4], "memory-cushion.png"],
]) {
  const pair = el("section", "", "memory-pair");
  const note = el("div", "", "memory-note");
  note.append(el("h2", title), el("p", copy));
  const illustration = el("img", "", "memory-vignette");
  illustration.src = "assets/" + file;
  illustration.alt = "";
  pair.append(note, illustration);
  memoryScenes.append(pair);
}
originSheet.append(originHeader, el("p", originCopy[1], "memory-preface"), memoryScenes, el("p", originCopy[5], "memory-ending"));
Object.assign(sources.find(s=>s.id==='origin'),{title:'2013 初识冥想',nodes:[originSheet]});
const practiceCopy=[
 '从 2015 年起，我开始规律练习，也逐渐带领线上、线下的团体与一对一冥想。在学习、练习与实际引导之间，持续积累自己的理解。',
 '那八年里，我没有系统记录带领过多少人、多少小时，只是全心投入其中。',
 '怎样看待自己、怎样与人相处、怎样面对不如意——冥想的影响，慢慢进入更广的生活。我更容易觉察念头和情绪，也多了一些选择怎样回应的空间。',
 '觉察、接纳、慈悲……从几个词，慢慢成为我理解和对待生活的方式。'
];
const practiceSheet=el('div','','practice-sheet'),practiceText=el('div','','practice-copy journal-writing'),practiceAlbum=clone(album);
practiceAlbum.querySelector('.album-heading')?.remove();
practiceText.append(el('h2','练习，也在带领中学习。','practice-subhead'),el('p',practiceCopy[0]),el('p',practiceCopy[1],'practice-aside'),el('h2','慢慢进入生活。','practice-subhead'),el('p',practiceCopy[2]),el('blockquote',practiceCopy[3],'practice-takeaway'));
const albumControls = el("div", "", "practice-album-controls");
const albumCounter = practiceAlbum.querySelector(".album-count");
for (const [direction, label, glyph] of [[-1, "上一张照片", "‹"], [1, "下一张照片", "›"]]) {
  const button = el("button", glyph);
  button.type = "button";
  button.dataset.albumStep = direction;
  button.setAttribute("aria-label", label);
  if (direction === 1) albumControls.append(albumCounter);
  albumControls.append(button);
}
practiceAlbum.append(albumControls);
practiceSheet.append(el("h1", "从自己练习，到带领他人。"), practiceAlbum, practiceText);
Object.assign(sources.find(s=>s.id==='practice'),{title:'八年实践',nodes:[practiceSheet]});
const pauseCopy=[
 '现实中的变动与挑战，让我开始怀疑把冥想继续做下去的可能。我暂停了带领，一边备考浙江大学心理系研究生，一边做产品经理的工作。',
 '冥想在这段时间更多地是自我调节，图书馆里学累了、注意力散了，静静地坐一会儿。'
];
const pauseSheet=el('div','','pause-sheet scrapbook-leaf stranded-sheet');const pauseArt=el('img','','pause-art');pauseArt.src='assets/home-pause.png';pauseArt.alt='桌前思考的自己，身边是书、杯子和计划本';
const pauseTop=el('div','','pause-top');pauseTop.append(el('h1','搁浅'),pauseArt);
const pauseDiary=el('div','','pause-diary journal-writing');pauseDiary.append(...pauseCopy.map(t=>el('p',t)));const pauseStillLife = el("img", "", "pause-still-life");
pauseStillLife.src = "assets/pause-desk-vignette.png";
pauseStillLife.alt = "";
pauseDiary.append(pauseStillLife);
pauseSheet.append(pauseTop, pauseDiary);
Object.assign(sources.find(s=>s.id==='pause'),{title:'2023搁浅',nodes:[pauseSheet]});
const restartCopy=[
 '进入浙江大学心理系，选择研究方向时，我仍然纠结：喜欢冥想，也担心过去实践中遇到的现实问题。直到一个晚上，从图书馆回家的路上，我忽然清楚地知道：“还是选择正念冥想。”那一刻，心里涌起了与初识冥想时相似的触动。',
 '我把多年练习和带领中积累的好奇带进研究：不同的练习方法与设计，会怎样影响注意、觉察、接纳和情绪体验？练习里的变化，能否保留下来，进入日常生活？',
 '我希望把研究中的理解带回引导与方案设计，让练习更清楚地回应人的需要，也让自己的设计有更充分的依据、能更清楚地解释。'
];
const restartSheet=el('div','','restart-sheet scrapbook-leaf');restartSheet.append(el('h1','重新选择，带着这些年的问题。'));
const restartDiary=el('div','','restart-diary');
[['重新确认选择',restartCopy[0]],['把问题带进研究',restartCopy[1]],['再把理解带回实践',restartCopy[2]]].forEach(([title,text])=>{const part=el('section','','restart-part');part.append(el('h2',title),el('p',text));restartDiary.append(part);});
const projectStrip=el('div','','project-strip illustrated-projects');projectStrip.setAttribute('aria-label','展开研究与原创项目');
const projectSpecs=[
 {key:'vr',label:'VR 冥想论文',title:'VR 冥想中的体验与变化',paragraphs:[
 '研究成果以第一作者身份，发表在 Computers in Human Behavior Reports（五年影响因子 7.3）。',
 '这项研究比较了普通音频引导、VR 场景，以及加入实时脑电反馈的 VR 冥想。94 位初学者完成 4 周练习，并在 3 个月后接受追踪；研究同时关注练习体验、脑电记录与日常正念倾向的变化。',
 '在这项研究中，三种方式下的日常正念倾向均有改善，但 VR 与脑电反馈没有表现出额外优势。技术带来的沉浸体验，是否能转化为日常生活中的变化，是我希望继续理解的问题。'
 ],links:[['查看发表信息 ↗','https://doi.org/10.1016/j.chbr.2026.101376'],['备用链接 ↗','https://www.sci-hub.vg/10.1016/j.chbr.2026.101376']]},
 {key:'family',label:'4 周正念亲子团辅',title:'4 周正念亲子团体辅导',paragraphs:[
 '独立原创设计，旨在通过正念冥想与团体辅导，提高家长的情绪觉察与调节能力，并带入亲子互动中，进而促进亲子关系。',
 '项目受参与家长的一致好评，并获 2026 年浙江大学心理系应用心理大赛三等奖。'
 ]},
 {key:'merp',label:'21 天正念情绪调节',title:'21 天正念情绪调节（MERP）',paragraphs:[
 '独立原创设计，通过每天 15 分钟的冥想练习，旨在提高情绪调节能力，促进主观幸福感。',
 '截至 2026 年 11 月，近 400 人加入练习。该项目获 2026 年浙江大学心理系应用心理大赛三等奖。'
 ]}
];
const projectContent={};
const customGroupNote = el("section", "", "project-entry custom-detail");
customGroupNote.append(el("h2", "定制团体活动"),
  el("p", "如果你想为团队、机构或已有团体安排一次冥想或专题活动，我们可以先聊聊参与者是谁、希望回应什么需要，再一起确定活动的主题与形式。"),
  el("p", "活动环节可以结合现场安排，留出引导练习、交流和答疑的时间。"));
projectContent["custom-group"] = customGroupNote;
const jianjiCollaboration = el("section", "", "project-entry illustrated-detail");
const jianjiDetailArt = el("img", "", "project-detail-art");
jianjiDetailArt.src = "assets/collaboration-jianji.png";
jianjiDetailArt.alt = "";
const jianjiDetailCopy = el("div", "", "project-detail-copy");
const jianjiLifeLink = el("a", "看看见己怎么用", "text-link");
jianjiLifeLink.href = "#life";
jianjiDetailCopy.append(
  el("span", "自我觉察与成长记录", "project-kicker"),
  el("h2", "见己软件"),
  el("p", "见己是一款电脑端记录工具，可以记下每天的感受、想法和练习体验，之后按日期、项目或关键词找回来。"),
  el("p", "如果你的课程或团体项目有练后记录的环节，也可以把见己作为记录工具，让参与者回看自己在一段时间里的变化。", "project-detail-highlight"),
  jianjiLifeLink
);
jianjiCollaboration.append(jianjiDetailArt, jianjiDetailCopy);
projectContent["jianji-collaboration"] = jianjiCollaboration;
const groupNote = el("section", "", "custom-detail service-poster-detail");
const groupSignup = el("button", "微信了解本期安排", "meditation-contact group-signup");
groupSignup.type = "button";
groupSignup.dataset.contact = "";
groupSignup.setAttribute("aria-haspopup", "dialog");
groupNote.append(makePosterGallery("团体冥想图文", null, ["适合谁", "怎么练", "安排与费用"]), groupSignup);
projectContent["meditation-group"] = groupNote;
projectSpecs.forEach(({key,label,title,paragraphs,links:refs=[]},i)=>{
 const note = el("section", "", "project-entry illustrated-detail");
 const detailCopy = el("div", "", "project-detail-copy");
 detailCopy.append(el("span", i === 0 ? "研究手记" : "原创方案", "project-kicker"), el("h2", title));
 paragraphs.forEach((text,j)=>{const p=el('p',text);if(key==='vr'&&j===0){p.textContent='研究成果以第一作者身份，发表在 ';p.append(el('em','Computers in Human Behavior Reports'),document.createTextNode('（五年影响因子 7.3）。'));}if(j===paragraphs.length-1)p.classList.add('project-detail-highlight');detailCopy.append(p);});
 if(refs.length){const row=el('div','','project-references');refs.forEach(([label,url])=>{const a=el('a',label,'text-link');a.href=url;a.target='_blank';a.rel='noopener noreferrer';row.append(a);});detailCopy.append(row);}
 projectContent[key] = note;
 const button = el("button", "", "project-slip");
 button.type = "button";
 button.dataset.project = key;
 button.setAttribute("aria-haspopup", "dialog");
 const artwork = el("img");
 artwork.src = "assets/project-vignette-" + key + ".png";
 artwork.alt = "";
 const detailArt = clone(artwork);
 detailArt.className = "project-detail-art";
 note.append(detailArt, detailCopy);
 button.append(el("span", label), artwork);
 projectStrip.append(button);
});
for (const [index, [key, label, summary]] of customOptions.entries()) {
  const card = el("button", "", "custom-card");
  card.type = "button";
  card.dataset.project = key;
  card.setAttribute("aria-haspopup", "dialog");
  const artwork = el("img");
  artwork.src = key === "individual-extension"
    ? "assets/custom-meditation-2.png"
    : "assets/one-to-one-short-hair.png";
  artwork.alt = "";
  const copy = el("span", "", "custom-card-copy");
  copy.append(el("strong", label), el("span", summary));
  const illustration = el("span", "", "custom-illustration");
  if (index === 0) {
    card.classList.add("meditation-solo-card");
    copy.append(el("span", "开启冥想之旅", "meditation-card-action"));
  } else {
    card.classList.add("meditation-mind-card");
    const arrow = el("span", "→", "meditation-card-arrow");
    arrow.setAttribute("aria-hidden", "true");
    copy.append(arrow);
  }
  illustration.append(artwork);
  card.append(illustration, copy);
  customCards.append(card);

  const note = el("section", "", "project-entry custom-detail");
  if (key === "individual-extension") {
    note.classList.add("service-poster-detail");
    note.append(makePosterGallery("心力发展图文", "mind-poster", [
      "适合人群与收获",
      "服务流程与内容",
      "刘迷糊简介与常见问题",
      "价格与购买须知",
    ]), el("small", "版权登记：国作登字-2026-A-00067097", "registration-note"));
    projectContent[key] = note;
    continue;
  }
  note.className = "project-entry illustrated-detail";
  const soloArt = clone(artwork);
  soloArt.className = "project-detail-art";
  const soloCopy = el("div", "", "project-detail-copy");
  soloCopy.append(
    el("h2", "开启冥想之旅"),
    el("p", "如果你在团体共练之外，想针对一个具体的练习问题多试一试，我们可以一起看看一对一引导是否适合你。"),
    el("p", "从你当下的状态和想练的方向出发，选择合适的方法，在带领中根据你的体验调整。", "project-detail-highlight"),
    el("p", "有需要的话，可以在共练后告诉我，我会根据你的情况单独介绍。")
  );
  note.append(soloArt, soloCopy);
  projectContent[key] = note;
}
restartSheet.append(restartDiary,projectStrip);
Object.assign(sources.find(s=>s.id==='research'),{title:'2024 再出发',nodes:[restartSheet]});
const projectDialog = el("dialog", "", "project-dialog");
projectDialog.tabIndex = -1;
const projectPaper = el("div", "", "project-paper");
const projectBody = el("div", "", "project-body");
const projectDismiss = el("button", "返回手账", "project-dismiss");
projectDismiss.type = "button";
projectDismiss.onclick = () => projectDialog.close();
projectPaper.append(projectBody);
projectDialog.append(projectPaper);
document.body.append(projectDialog);

let projectOpener;
projectDialog.addEventListener("click", event => {
  if (event.target.closest(".custom-detail") && !event.target.closest("a")) return;
  projectDialog.close();
});
projectDialog.addEventListener("keydown", event => {
  if (event.target !== projectDialog || !["Enter", " "].includes(event.key)) return;
  event.preventDefault();
  projectDialog.close();
});
projectDialog.addEventListener("close", () => {
  if (projectOpener?.isConnected) projectOpener.focus({ preventScroll: true });
});
document.addEventListener("click", event => {
  const button = event.target.closest("[data-project]");
  const key = button?.dataset.project;
  const source = projectContent[key];
  if (!source) return;
  projectOpener = button;
  projectDialog.dataset.note = key;
  projectDialog.setAttribute("aria-label",
    source.querySelector("h2")?.textContent || source.querySelector(".jianji-poster-frame")?.getAttribute("aria-label") || "手账纸片");
  const note = clone(source);
  if (note.matches(".custom-detail:not(.service-poster-detail)")) note.prepend(projectDismiss);
  projectBody.replaceChildren(note);
  bindPosterGallery(projectBody);
  projectDialog.showModal();
  projectPaper.scrollTop = 0;
  projectDialog.focus();
});
const order=['about','origin','practice','pause','research'];
const extras=sources.filter(s=>!['story','memories','practice-change','works',...order].includes(s.id));
const first=order.map(id=>sources.find(s=>s.id===id));sources.splice(0,sources.length,...first,...extras);
const aliases={cooperation:'training','training-plan':'training',group:'meditation',individual:'meditation','individual-fees':'meditation','individual-questions':'meditation-design',jianji:'life',story:'about',memories:'practice','practice-change':'practice',works:'research','group-plan':'meditation','group-process':'meditation','group-thoughts':'meditation-design'};
for(const source of sources)for(const node of source.nodes)node.querySelectorAll?.('a[href]').forEach(a=>{const id=a.hash.slice(1);if(aliases[id])a.hash=aliases[id];});
// Click cues without turning the vignette into a boxed button.
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
  const customDeepLink = customOptions.some(([id]) => id === key) ? key : null;
  key = customDeepLink ? "meditation" : aliases[key] || key;
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
  content.scrollTop = 0;
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
  bindPosterGallery(content);
  if (customDeepLink && animate) {
    content.querySelector('[data-project="' + customDeepLink + '"]')?.click();
  }
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
dialog.addEventListener("close", () => opener?.focus());
dialog.addEventListener("click", event => {
  if (!event.target.closest(".qr-crop")) dialog.close();
});
function bindAlbum() {
  const album = content.querySelector(".history-album");
  if (!album) return;
  const slides = [...album.querySelectorAll(".album-slide")];
  let i = 0,
    start,
    last = 0;
  const show = (n, keepPhotoFocus = false) => {
    i = (n + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      const offset = (index - i + slides.length) % slides.length;
      const position = offset === 0 ? "current" : offset === 1 ? "next" : offset === slides.length - 1 ? "previous" : "";
      slide.dataset.position = position;
      slide.hidden = !position;
      slide.setAttribute("aria-hidden", String(position !== "current"));
      slide.querySelector("button").tabIndex = position === "current" ? 0 : -1;
    });
    album.querySelector(".album-count").textContent =
      String(i + 1).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0");
    if (keepPhotoFocus) slides[i].querySelector("button").focus({ preventScroll: true });
  };
  show(0);
  album.querySelectorAll(".album-image").forEach(button => {
    button.onclick = () => {
      if (Date.now() - last > 450) show(i + 1, document.activeElement === button);
    };
  });
  album.querySelectorAll("[data-album-step]").forEach(button => {
    button.onclick = () => show(i + Number(button.dataset.albumStep));
  });
  album.onkeydown = event => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    show(i + (event.key === "ArrowRight" ? 1 : -1), event.target.matches(".album-image"));
  };
  album.addEventListener(
    "touchstart",
    (e) => (start = e.touches.length === 1 ? e.touches[0] : null),
    { passive: true },
  );
  album.addEventListener(
    "touchend",
    (e) => {
      if (!start) return;
      const dx = e.changedTouches[0].clientX - start.clientX;
      const dy = e.changedTouches[0].clientY - start.clientY;
      start = null;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
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
