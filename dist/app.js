// Local preview: fixed-size sheets with chapter entries and un-tabbed inner pages.
const main = document.getElementById("page");
const sheet = document.querySelector(".notebook > .sheet");
const cover = document.getElementById("book-cover");
const tabs = [...document.querySelectorAll("[data-page]")];
function setPointerFocus() {
  document.documentElement.setAttribute("data-pointer-focus", "");
}
document.addEventListener("pointerdown", setPointerFocus, true);
document.addEventListener("click", event => {
  if (event.detail > 0) setPointerFocus();
}, true);
document.addEventListener("keydown", event => {
  if (["Tab", "Enter", " ", "Escape", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
    document.documentElement.removeAttribute("data-pointer-focus");
  }
}, true);
const roots = ["about", "group", "individual", "life", "training"];
const original = Object.fromEntries(
  roots.map((id) => [id, document.getElementById(id)]),
);
const sources = [];
const clone = (el) => el?.cloneNode(true);
const el = (tag, text, cls) => {
  const n = document.createElement(tag);
  n.textContent = text;
  if (cls) n.className = cls;
  return n;
};
function entryCue() {
  const cue = el("span", "", "entry-cue");
  cue.setAttribute("aria-hidden", "true");
  return cue;
}
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
const introTop=el('div','','intro-top');const identity=el('div','','intro-identity');identity.append(el('h1','你好，我是刘迷糊'),el('p','浙江大学心理学硕士，正念冥想研究者、练习者与带领者。','intro-credentials'),el('p','关注：如何让冥想练习更科学有效，以及如何让冥想中的收获在日常生活中真正发挥作用。','intro-focus'));const portrait=clone(about.querySelector('.portrait'));portrait.querySelector('img').src='assets/portrait-cutout.png';portrait.querySelector('figcaption')?.remove();introTop.append(identity,portrait);intro.append(introTop);
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
  ["origin", "2013—2015", "带着好奇，初识冥想"],
  ["practice", "2015—2022", "规律练习与带领"],
  ["pause", "2023", "迷茫不定，暂停带练"],
  ["research", "2024—至今", "科研与实践结合"],
]) {
  const stop = el("a", "", "home-journey-link");
  stop.href = "#" + key;
  stop.dataset.stop = key;
  const caption = el("span", "", "home-journey-caption");
  caption.append(el("b", year), el("span", label));
  const figure = el("img", "", "home-figure");
  figure.src = "assets/home-" + key + ".png";
  figure.alt = "";
  const illustration = el("span", "", "home-journey-illustration");
  illustration.append(figure, entryCue());
  stop.append(illustration, caption);
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
  const translation = el("small", english);
  translation.lang = "en";
  value.append(artworkCrop(...crop, "home-art-crop home-slow-icon"), el("span", chinese), translation);
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
meditationHeader.append(el("h1", "由练习开始，慢慢丰盛日常"));
const customCards = el("div", "", "custom-cards meditation-services");
const groupCard = el("article", "", "custom-card meditation-group-card");
const groupAction = el("button", "加入共练", "group-reading-action");
groupAction.type = "button";
groupAction.dataset.project = "meditation-group";
groupAction.setAttribute("aria-haspopup", "dialog");
const groupQR = el("img", "", "group-wechat-qr");
groupQR.src = "assets/wechat-reading.png";
groupQR.alt = "扫码联系刘迷糊，加入团体冥想";
const groupArtwork = clone(group.querySelector(".scene img"));
groupArtwork.alt = "";
const groupCopy = el("span", "", "custom-card-copy");
groupCopy.append(el("strong", "团体冥想"), el("span", "在群体的抱持中，借由彼此的照见，慢慢建立稳定的练习节奏"),
  el("span", "适合：想开始冥想，或需要一点外在动力陪伴的你", "meditation-card-fit"));
const groupJoin = el("span", "", "group-join");
groupJoin.append(groupAction, groupQR);
groupCopy.append(groupJoin);
groupCard.append(groupArtwork, groupCopy);
customCards.append(groupCard);
const designLink = el("a", "了解练习设计理念", "meditation-method-link");
designLink.href = "#meditation-design";

meditationHeader.append(designLink);
const meditationFooter = el("div", "", "meditation-practice-footer");
meditationFooter.append(el("p", "每一次练习，都是回到自己的过程。"),
  el("p"));
const meditationContactHint = meditationFooter.lastElementChild;
meditationContactHint.append(el("strong", "还不确定怎么选？", "journal-emphasis"), " 点击右上角“联系刘迷糊”，讨论看看");
meditationSheet.append(meditationHeader, customCards, meditationFooter);
add("meditation", "meditation", "科学冥想", [meditationSheet]);

const designSheet = el("section", "", "meditation-sheet meditation-design");
designSheet.append(el("h1", "科学冥想 · 设计理念"),
  el("p", "理论与实践结合 · 掌握方法 · 连接日常生活。", "design-subtitle"));
const designHero = el("figure", "", "design-hero");
const seatedFigure = artworkCrop(132, 8, 493, 474, "design-warm-crop design-seated-art");
const pathFigure = artworkCrop(666, 0, 774, 417, "design-warm-crop design-stage-art");
const journeyCaption = el("figcaption", "", "design-path-labels");
for (const label of ["跟随引导", "熟悉方法", "逐步自主练习"]) journeyCaption.append(el("span", label));
designHero.append(seatedFigure, pathFigure, journeyCaption);
designSheet.append(designHero);
const principles = el("div", "", "design-principles");
for (const [style, title, copy, crop] of [
  ["steps", "循序渐进", "从走神、昏沉、身体不适等常见问题开始，逐步熟悉练习。根据自己的状态调整，不必急着追求某一种体验。", [103, 490, 651, 226]],
  ["focus", "理解方法", "结合“聚焦注意”与“开放监控”等经典冥想方法，说明练习目的、注意对象与调整方式，让你逐渐知道如何练习、如何选择。", [837, 392, 539, 323]],
  ["awareness", "觉察与接纳并重", "既练习看见正在发生什么，也练习给当下的体验留出空间，把这份理解带到日常的回应中。", [95, 718, 610, 300]],
  ["notes", "持续调整", "经过 100 余场带练与 4 轮重要迭代，结合研究、实际带领与参与者反馈，持续拓展练习内容和引导方式。", [751, 713, 640, 306]],
]) {
  const entry = el("section", "", "design-principle");
  const art = el("div", "", "design-art");
  art.append(artworkCrop(...crop, "design-warm-crop design-principle-art design-crop-" + style));
  const text = el("div");
  text.append(el("h2", title), el("p", copy));
  entry.append(art, text);
  principles.append(entry);
}
designSheet.append(principles);
add("meditation-design", "meditation", "设计理念", [designSheet]);

const customOptions = [
  ["individual-practice", "一对一冥想", "围绕你当下的具体卡点（如焦虑、走神），量身调整练习方案", "时间灵活，希望针对个人状态做深度探索的你", "了解定制"],
  ["individual-extension", "心力发展", "通过线上深度对话，结合正念、图卡与叙事，理清关系与选择。", "正经历人生转折，渴望梳理边界与内心秩序的你。", "启动心力发展"],
];
const coverPlate = cover.querySelector(".cover-plate");
const coverRecommendation = el("a", "", "cover-recommendation");
const recommendationTitle = el("span");
const recommendationArrow = el("span", "", "cover-chevron");
recommendationArrow.setAttribute("aria-hidden", "true");
coverRecommendation.append(recommendationTitle, recommendationArrow);
const tabRecommendation = el("span", "正好", "tab-recommendation");

const lifeSheet = el("div", "", "life-sheet");
const lifeIntro = el("div", "", "life-intro");
lifeIntro.append(
  el("h1", "期待与你，同频相遇"),
  el("p", "有些触动，不知与谁分享；有些安静，显得有些格格不入"),
  el("p", "在这里，不用解释，也不必假装，我们期待你来"),
);
function jianjiImage(file, alt = "") {
  const img = el("img");
  img.src = "assets/jianji-" + file + ".png";
  img.alt = alt;
  img.loading = "lazy";
  return img;
}
const lifeGallery = makePosterGallery("见己图文", "jianji-poster-original", [
  "见己简介",
  "写作、学习、工作与生活记录",
  "记录、汇总、保存、搜索与回看，附见己下载二维码",
  "见己实际界面：记录",
  "见己实际界面：明细",
  "见己实际界面：项目",
  "见己实际界面：统计",
]);
const downloadQR = jianjiImage("download-sticker", "见己软件下载二维码，扫码下载，免费使用");
downloadQR.className = "jianji-download-sticker";

const reading = el("section", "", "life-reading");
reading.id = "life-reading";
reading.setAttribute("aria-labelledby", "life-reading-title");
const readingTitle = el("h2", "正念共读");
readingTitle.id = "life-reading-title";
readingTitle.tabIndex = -1;
const readingTagline = el("p", "把书读厚，把生活过轻盈", "life-reading-tagline");
const readingIntro = el("div", "", "life-reading-intro");
const readingPlan = el("p");
readingPlan.append(
  el("strong", "邀你加入「正念共读计划」"),
  "。我们不追求读完多少本，而是借由文字的碰撞，把书里的智慧，慢慢带进真实的练习与生活里。",
);
readingIntro.append(
  el("p", "有些内容，一个人读会停在脑海；同频的人聊起，却能落进生活。"),
  readingPlan,
);
const readingFocus = el("aside", "", "life-reading-focus");
const readingFocusTitle = el("h2");
const readingFocusBook = el("span", "📖", "life-reading-symbol");
readingFocusBook.setAttribute("aria-hidden", "true");
readingFocusTitle.append(readingFocusBook, "本期聚焦：《成为自己》");
const readingFocusTopic = el("p");
const readingFocusChat = el("span", "💬", "life-reading-symbol");
readingFocusChat.setAttribute("aria-hidden", "true");
readingFocusTopic.append(readingFocusChat, "最近大家都在聊：“如何‘重置思维’，卸下‘必须完美’的包袱？”");
readingFocus.append(readingFocusTitle, readingFocusTopic);

const readingContact = el("div", "", "life-qr-row life-reading-contact");
const readingInvitation = el("div");
const readingJoinNote = el("p", "", "life-note");
readingJoinNote.append(el("span", "选书与安排群内公布｜"), el("span", "随时潜水也可以"));
readingInvitation.append(
  el("p", "微信备注「共读」免费加入", "life-invitation"),
  readingJoinNote,
);
const readingQR = el("img", "", "life-wechat-qr");
readingQR.src = "assets/wechat-reading.png";
readingQR.alt = "刘迷糊的个人微信二维码，备注「共读」免费加入";
readingQR.width = 287;
readingQR.height = 287;
readingContact.append(readingInvitation, readingQR);
const readingBooks = el("ul", "", "life-books");
readingBooks.setAttribute("role", "list");
readingBooks.setAttribute("aria-label", "共读书单");
for (const [title, author] of [
  ["《正念的奇迹》", "一行禅师"],
  ["《正念：此刻是一枝花》", "乔·卡巴金"],
  ["《观呼吸：平静的第一堂课》", "德宝法师"],
  ["《自我关怀的力量》", "克里斯廷·内夫"],
  ["《全然接受这样的我》", "塔拉·布莱克"],
]) {
  const item = el("li");
  item.append(el("span", title), el("small", author));
  readingBooks.append(item);
}
const readingArt = el("img", "", "life-reading-art");
readingArt.src = "assets/training-books.png";
readingArt.alt = "";
readingArt.width = 740;
readingArt.height = 493;
const readingList = el("figure", "", "life-reading-list");
readingList.append(
  readingBooks,
  readingArt,
  el("figcaption", "书单持续更新中，欢迎来群里一起选书…"),
);
reading.append(readingTitle, readingTagline, readingIntro, readingFocus, readingContact, readingList);

const lifeQuestions = el("section", "", "life-questions");
lifeQuestions.id = "life-questions";
const questionHeading = el("h2");
const freeQuestions = el("button", "问个问题", "meditation-contact");
freeQuestions.type = "button";
freeQuestions.dataset.contact = "";
freeQuestions.setAttribute("aria-haspopup", "dialog");
questionHeading.append(freeQuestions);
const questionsBody = el("p");
questionsBody.append(el("strong", "无论你是否购买了服务，都可以来找我聊聊。", "journal-emphasis"),
  "对我而言，解答这些问题也是梳理和精进的过程。");
lifeQuestions.append(questionHeading, el("p", "对冥想好奇？或者练习中遇到了卡点？"), questionsBody);
lifeSheet.append(lifeIntro, reading, lifeQuestions);
add("life", "life", "志同道合", [lifeSheet]);

function makePosterGallery(label, filePrefix, descriptions) {
  const gallery = el("div", "", "jianji-gallery");
  const frame = el("div", "", "jianji-poster-frame");
  frame.tabIndex = 0;
  frame.setAttribute("aria-label", label + "，使用左右方向键切换");
  descriptions.forEach((description, index) => {
    const poster = filePrefix ? el("img") : el("div", "", "poster-placeholder");
    if (filePrefix) {
      poster.src = "assets/" + filePrefix + "-" + (index + 1) + ".png";
      if (filePrefix === "online-meditation") {
        poster.src += "?v=group-posters-4";
      }
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
const viewerToolbar = el("div", "", "poster-viewer-tools");
viewerToolbar.tabIndex = -1;
viewerToolbar.setAttribute("autofocus", "");
const viewerCount = el("span");
viewerCount.setAttribute("aria-live", "polite");
let viewerStep;
let viewerTouch;
let viewerSwipedAt = -Infinity;

for (const [label, direction] of [["上张", -1], ["下张", 1]]) {
  const button = el("button", label, "poster-viewer-nav");
  button.type = "button";
  button.onclick = () => viewerStep?.(direction);
  if (direction === 1) viewerToolbar.append(viewerCount);
  viewerToolbar.append(button);
}
viewerToolbar.append(viewerSave);
viewerClose.onclick = () => {
  if (performance.now() - viewerSwipedAt > 380) posterViewer.close();
};
posterViewer.append(viewerClose, viewerToolbar);
document.body.append(posterViewer);
posterViewer.addEventListener("click", event => {
  if (event.target === posterViewer) posterViewer.close();
});
posterViewer.addEventListener("keydown", event => {
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  event.preventDefault();
  event.stopPropagation();
  viewerStep?.(event.key === "ArrowRight" ? 1 : -1);
});
viewerClose.addEventListener("touchstart", event => {
  viewerTouch = event.touches.length === 1 ? event.touches[0] : null;
}, { passive: true });
viewerClose.addEventListener("touchcancel", () => { viewerTouch = null; });
viewerClose.addEventListener("touchend", event => {
  if (!viewerTouch) return;
  const dx = event.changedTouches[0].clientX - viewerTouch.clientX;
  const dy = event.changedTouches[0].clientY - viewerTouch.clientY;
  viewerTouch = null;
  if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy) * 1.4) {
    viewerSwipedAt = performance.now();
    viewerStep?.(dx < 0 ? 1 : -1);
  }
}, { passive: true });
function openPosterViewer(currentPoster, step, count, returnFocus) {
  function refresh() {
    const poster = currentPoster();
    viewerImage.src = poster.src;
    viewerImage.alt = poster.alt;
    viewerSave.href = poster.src;
    viewerSave.download = new URL(poster.src).pathname.split("/").pop();
    viewerCount.textContent = count.textContent;
  }
  viewerStep = direction => { step(direction); refresh(); };
  viewerSwipedAt = -Infinity;
  refresh();
  posterViewer.showModal();
  posterViewer.addEventListener("close", () => {
    viewerStep = null;
    viewerTouch = null;
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
      if (event.target === image) openPosterViewer(() => posters[index].querySelector("img"), step, count, frame);
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
      openPosterViewer(() => posters[index].querySelector("img"), step, count, frame);
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
const collaborationIntro = el("p", "", "collaboration-intro");
collaborationIntro.append(
  el("strong", "我开放了原创的正念与心理活动方案授权，以及内容合作。", "journal-emphasis"),
  "如果你希望将成熟的课程引入你的平台，或联合开发新的内容，我们可以聊聊。",
);
collaboration.append(el("p", "面向团队、机构与项目组织者", "collaboration-audience"), collaborationIntro);
const collaborationCards = el("div", "", "collaboration-cards");
for (const [key, title, summary, imageFile] of [
  ["merp", "21 天正念情绪调节", "完整的每日引导与操作方案，支持机构获取授权，独立落地开展。", "project-vignette-merp.png"],
  ["family", "4 周正念养育团辅", "包含团体流程设计与正念工具包，支持机构获取内容授权。", "project-vignette-family.png"],
  ["content-development", "正念内容联合开发", "提供现成的活动设计包、引导词库与内容授权，或基于你的平台需求联合出品。", "collaboration-group.png"],
  ["jianji-collaboration", "见己记录软件", "为你们的课程与项目提供软件接入授权，作为学员日常记录与回顾的辅助工具。", "collaboration-jianji.png"],
]) {
  const card = el("button", "", "collaboration-card");
  card.type = "button";
  card.dataset.project = key;
  card.setAttribute("aria-haspopup", "dialog");
  const artwork = el("img", "", "collaboration-art");
  artwork.src = "assets/" + imageFile;
  artwork.alt = "";
  const copy = el("span", "", "collaboration-copy");
  copy.append(el("strong", title), el("span", summary));
  card.append(artwork, copy, entryCue());
  collaborationCards.append(card);
}
collaboration.append(collaborationCards);
const collaborationContact = el("button", "了解授权与内容开发", "meditation-contact collaboration-contact");
collaborationContact.type = "button";
collaborationContact.dataset.project = "content-development";
collaborationContact.setAttribute("aria-haspopup", "dialog");
trainingSheet.append(collaboration, collaborationContact);
add("training", "training", "授权与合作", [trainingSheet]);
// Confirmed opening three leaves, in chronological reading order.
const originCopy = [
  "起初练习断断续续，也说不清为什么练习。只记得结束后，整个人很明亮、很舒服。",
  "最初两年，有几个片段一直留在记忆里。",
  "一次练习结束，老师在一旁弹起吉他。我忽然流了眼泪，当时也不知道为什么。",
  "彼时，我是年龄最小的参与者。和老师、姐姐阿姨们在山中学习的几天，新鲜，也好奇。",
  "坐不了多久就酸痛的脚踝、久坐后发麻的双腿，还有烛光冥想时眨眼的冲动……",
  "有不适，有迷惑，也有中断。但最初的触动和好奇，让我一次次回来。",
  "后来带练，遇到各种各样的问题时，我会不断提醒自己：我们都会从这里走过。",
];
const originSheet=el('div','','origin-sheet memory-leaf scrapbook-leaf');
const originHeader=el('div','','memory-intro');originHeader.append(el('h1','预料之外的触动'),el('p',originCopy[0]));
const memoryScenes = el("div", "", "memory-scenes");
for (const [title, copy, file] of [
  ["吉他声里", originCopy[2], "memory-guitar.png"],
  ["呼吸法进修", originCopy[3], "memory-breathing-circle.png"],
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
originSheet.append(originHeader, el("p", originCopy[1], "memory-preface"), memoryScenes, el("p", originCopy[5], "memory-ending"), el("p", originCopy[6], "memory-ending memory-reflection"));
Object.assign(sources.find(s=>s.id==='origin'),{title:'2013 初识冥想',nodes:[originSheet]});
const practiceSheet = el("div", "", "practice-sheet");
const practiceText = el("div", "", "practice-copy journal-writing");
const practiceAlbum = clone(album);
practiceAlbum.querySelector(".album-heading")?.remove();
practiceAlbum.setAttribute("aria-label", "带领与进修时刻");
practiceText.append(
  el("h2", "教学相长", "practice-subhead"),
  el("p", "从 2015 年起，我开始规律练习，也带领线下冥想。"),
  el("p", "怎样把引导说清楚？遇到走神、昏沉或身体不适时，怎样调整？面对不同的人，同一种方法又会带来怎样的体验？", "journal-question"),
  el("p", "这些问题，陪着我在学习、练习与带领之间不断往返。"),
  el("p", "那八年里，我没有统计过带领的人数与时长，但那些相遇与实践，慢慢沉淀为后来生活、研究与方案设计的养分。", "practice-aside"),
  el("h2", "正念，进入生活", "practice-subhead"),
  el("p", "我开始更容易注意到自己的念头和情绪。在一些原本会立刻反应的时刻，也多了一点停下来、选择如何回应的空间。"),
  el("blockquote", "觉察、接纳、慈悲......从几个词，慢慢成为我理解自己、对待他人与生活的方式。", "practice-takeaway"),
);
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
const albumSection = el("section", "", "practice-album-section");
albumSection.append(el("h2", "带领与进修时刻", "practice-album-title"), practiceAlbum);
practiceSheet.append(el("h1", "从垫上到生活"), albumSection, practiceText);
Object.assign(sources.find(s=>s.id==='practice'),{title:'八年实践',nodes:[practiceSheet]});
const pauseCopy = [
  "生活里的变动与挑战，让我迷茫：是否还要继续走冥想带领这条路？",
  "我暂停了带领，一边做产品经理，一边备考浙江大学心理系研究生。",
  "那段时间，冥想停留在生活里。图书馆里学累了、注意力散了，就静静坐一会儿，再回到眼前的事情。",
  "暂停给了我一段空间，重新看待这些年的投入，也重新确认接下来想走的路。",
  "这段经历，也让我更尊重每个人的节奏——大到人生方向，小到练习中的搁置与重新开始。",
];
const pauseSheet = el("div", "", "pause-sheet scrapbook-leaf stranded-sheet");
const pauseArt = el("img", "", "pause-art");
pauseArt.src = "assets/home-pause.png";
pauseArt.alt = "桌前思考的自己，身边有一摞书";
const pauseTitle = el("div", "", "pause-heading");
pauseTitle.append(el("h1", "重新思考方向"));
const pauseTop = el("div", "", "pause-top");
pauseTop.append(pauseTitle, pauseArt);
const pauseDiary = el("div", "", "pause-diary journal-writing");
pauseDiary.append(...pauseCopy.map((text, index) => el("p", text, index === pauseCopy.length - 1 ? "journal-takeaway" : "")));
const pauseStillLife = el("img", "", "pause-still-life");
pauseStillLife.src = "assets/pause-desk-vignette.png";
pauseStillLife.alt = "";
pauseDiary.append(pauseStillLife);
pauseSheet.append(pauseTop, pauseDiary);
Object.assign(sources.find(s=>s.id==='pause'),{title:'2023 搁浅',nodes:[pauseSheet]});
const restartSheet = el("div", "", "restart-sheet scrapbook-leaf");
restartSheet.append(el("h1", "也许是冥想又一次选择了我"));
const restartDiary = el("div", "", "restart-diary");
for (const [title, ...paragraphs] of [
  ["重新出发", "进入浙大心理系后，选研究方向时，我经历了两个月的纠结、迷茫和焦虑。有太多让我换个方向的理由，但我无法忽视内心的悸动："],
  ["把经验回答不了的好奇，带进研究", "不同的练习方式，会怎样影响注意、觉察、接纳与情绪体验？", "练习当下的变化，能否延续到日常生活？", "这些来自多年练习与带领的问题，成了我继续探索的方向。"],
  ["把理解，带回实践", "我希望让每一种练习的预期更清晰，让引导与安排更贴近参与者的需要，也更坦诚地说明它能做什么，以及还有哪些问题值得继续探究。"],
]) {
  const part = el("section", "", "restart-part");
  part.append(el("h2", title), ...paragraphs.map(text =>
    el("p", text, text.endsWith("？") ? "journal-question" : "")));
  restartDiary.append(part);
}
const restartMemories = el("ul", "", "restart-memories");
const memoryHighlight = text => el("mark", text, "restart-highlight");
const firstMemory = el("li");
firstMemory.append("某天深夜，从图书馆回家的路上，初步决定",
  memoryHighlight("重拾冥想"), "时，莫名", memoryHighlight("感动落泪"), "；");
const secondMemory = el("li");
secondMemory.append(memoryHighlight("梦里选了冥想方向"), "，一位师兄带我一起做研究",
  el("small", "（后来事实果真如此，只是梦里的师兄做的是冥想在企业场景中的应用）"), "；");
const thirdMemory = el("li");
thirdMemory.append("见完导师、选定方向后，一切似乎都没变，但“",
  memoryHighlight("心"), "”里的一切都", memoryHighlight("顺畅"), "了。");
restartMemories.append(firstMemory, secondMemory, thirdMemory);
restartDiary.firstElementChild.append(restartMemories);
const projectStrip = el("div", "", "project-strip illustrated-projects");
projectStrip.setAttribute("aria-label", "研究项目与记录工具");
const projectSection = el("section", "", "restart-projects");
projectSection.append(projectStrip);
const award = "项目获 2026 年浙江大学心理系应用心理大赛三等奖。";
const projectSpecs = [
  {key:"vr", label:"VR 冥想研究", title:"VR 冥想：技术带来的体验，能否延续到日常？", paragraphs:[
    "相关成果以第一作者身份发表于",
    "研究比较了三种练习方式：普通音频引导、VR 场景冥想，以及加入实时脑电反馈的 VR 冥想。",
    "初学者完成 4 周练习，并在 3 个月后接受追踪；研究同时关注练习体验、脑电记录与日常正念倾向的变化。",
    "研究结果也让我继续思考：什么样的练习，能让冥想中的体验不只停留在当下，而更可能转化为日常生活里更持久的变化？",
  ], links:[["阅读文章","https://doi.org/10.1016/j.chbr.2026.101376"]]},
  {key:"family", label:"正念养育团辅", title:"从家长的觉察，走向亲子互动", paragraphs:[
    "这套为期 4 周的正念养育团辅方案，由我独立设计。",
    "通过正念冥想与团体交流，练习觉察自己的情绪与反应，探索怎样把觉察与调节带入亲子互动。",
  ], feedback:["我觉得我在慢慢学会接纳生活中的一些‘错误’和‘意外’","虽然有焦急，……而是耐心等待他完成，最终当他走出书房时，我很欣喜"], result:award},
  {key:"merp", label:"正念情绪调节", title:"每天 15 分钟，留意情绪，也练习如何回应。", paragraphs:[
    "正念情绪调节（MERP）是我独立设计的练习方案。",
    "通过每天 15 分钟的冥想练习，支持参与者觉察情绪与惯常反应，逐步探索更适合自己的回应方式。",
  ], feedback:["我注视到了身体的信号，我接受一些不舒服，内心仿佛更豁达了……","用很具体的方法，体会呼吸的深远和力度，……这样也可以减少走神的频次。"], result:"截至 2026 年 11 月，已有近 400 人加入练习。"+award},
];
function projectContact(action) {
  const contact = el("div", "", "project-contact");
  contact.append(el("span", action), clone(document.querySelector("#contact-dialog .qr-crop")));
  return contact;
}
const projectContent={};
const licensingNote = el("section", "", "project-entry illustrated-detail");
const licensingArt = el("img", "", "project-detail-art");
licensingArt.src = "assets/collaboration-group.png";
licensingArt.alt = "";
const licensingCopy = el("div", "", "project-detail-copy");
const licensingOptions = el("ul", "", "collaboration-detail-list");
for (const [title, description] of [
  ["原创方案授权", "如果你已有带领团队，可以围绕情绪调节、正念养育等原创方案，沟通可授权的内容和使用范围。"],
  ["正念内容联合开发", "根据你的平台、参与人群和项目目标，一起确定适合的练习主题、活动流程或引导词。"],
  ["见己软件接入", "如果课程或项目需要日常记录与回顾工具，可以一起讨论见己的使用方式。"],
]) {
  const item = el("li");
  item.append(el("strong", title + "：", "journal-emphasis"), description);
  licensingOptions.append(item);
}
licensingCopy.append(
  el("h2", "授权与内容开发"),
  el("p", "适合正在规划课程、活动或学员支持项目的团队与机构。"),
  licensingOptions,
  el("p", "联系时，可以简单介绍你的机构、参与者和希望开展的项目，我们再一起讨论合适的合作方式。"),
  projectContact("沟通授权与合作"),
);
licensingNote.append(licensingArt, licensingCopy);
projectContent["content-development"] = licensingNote;
const jianjiCollaboration = el("section", "", "project-entry illustrated-detail");
const jianjiDetailArt = el("img", "", "project-detail-art");
jianjiDetailArt.src = "assets/collaboration-jianji.png";
jianjiDetailArt.alt = "";
const jianjiDetailCopy = el("div", "", "project-detail-copy");
const jianjiFeatureButton = el("button", "查看见己功能", "text-link jianji-feature-button");
jianjiFeatureButton.type = "button";
jianjiFeatureButton.setAttribute("aria-haspopup", "dialog");
jianjiFeatureButton.setAttribute("aria-controls", "jianji-feature-dialog");
const jianjiIntro = el("p", "见己是一款本地优先的桌面记录工具（Mac / Windows），将工作、学习与生活记录融于一处。专为希望留下日常记录，积累灵感和素材、衔接进展与思路、复盘整理与自我成长的人设计。");
const jianjiFeatures = el("ul", "", "collaboration-detail-list");
for (const [title, description] of [
  ["轻量无压力", "主观体验与事实经历分开，随手记下灵感与日常，哪怕一句话"],
  ["隐私且克制", "纯本地存储（Markdown），不上云端，数据只属于你"],
  ["全局检索", "随时找回过去的素材、疑问与进展"],
  ["看见真实变化", "通过时间统计直观复盘，照见自己的状态"],
]) {
  const item = el("li");
  item.append(el("strong", title + "：", "journal-emphasis"), description);
  jianjiFeatures.append(item);
}
const jianjiDownload = el("div", "", "project-contact collaboration-download");
jianjiDownload.append(jianjiFeatureButton, clone(downloadQR));
jianjiDetailCopy.append(
  el("span", "见己 · 自我觉察与成长记录", "project-kicker"),
  el("h2", "让每一次积累，在未来依然有意义"), jianjiIntro,
  el("h3", "核心特点"), jianjiFeatures,
  jianjiDownload
);
jianjiCollaboration.append(jianjiDetailArt, jianjiDetailCopy);
projectContent["jianji-collaboration"] = jianjiCollaboration;
const groupNote = el("section", "", "custom-detail service-poster-detail");
groupNote.append(makePosterGallery("团体冥想图文", "online-meditation", [
  "线上冥想练习", "开始冥想", "你的冥想路径", "不只是练习", "刘迷糊与练习安排", "购买须知"
]), projectContact("了解本期安排"));
projectContent["meditation-group"] = groupNote;
projectSpecs.forEach(({key,label,title,paragraphs,links:refs=[],feedback,result},i)=>{
 const note = el("section", "", "project-entry illustrated-detail");
 const detailCopy = el("div", "", "project-detail-copy");
 detailCopy.append(el("span", i === 0 ? "研究手记" : "原创方案", "project-kicker"), el("h2", title));
 paragraphs.forEach((text, index) => {
   const p = el("p", text);
   if (key === "vr" && index === 0) p.append(" ", el("em", "Computers in Human Behavior Reports"), "。");
   detailCopy.append(p);
 });
 if (feedback) {
   const remarks = el("section", "", "practice-feedback");
   remarks.append(el("h3", "练习反馈"), ...feedback.map(text => el("blockquote", "“" + text + "”")));
   detailCopy.append(remarks, el("p", result, "project-detail-highlight"));
 }
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
 button.append(el("span", label), artwork, entryCue());
 projectStrip.append(button);
});
const journalSlip = el("button", "", "project-slip");
journalSlip.type = "button";
journalSlip.id = "jianji-record";
journalSlip.dataset.project = "jianji-collaboration";
journalSlip.setAttribute("aria-haspopup", "dialog");
journalSlip.append(el("span", "正念记录"), clone(jianjiDetailArt), entryCue());
projectStrip.append(journalSlip);
for (const [index, [key, label, summary, fit, action]] of customOptions.entries()) {
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
  copy.append(el("strong", label), el("span", summary),
    el("span", "适合：" + fit, "meditation-card-fit"),
    el("span", action, "meditation-card-action"));
  const illustration = el("span", "", "custom-illustration");
  card.classList.add(index === 0 ? "meditation-solo-card" : "meditation-mind-card");
  illustration.append(artwork);
  card.append(illustration, copy);
  customCards.append(card);

  const note = el("section", "", "project-entry custom-detail");
  if (key === "individual-extension") {
    note.classList.add("service-poster-detail");
    const consultation = el("button", "预约免费前置沟通", "meditation-contact practice-consultation");
    consultation.type = "button";
    consultation.dataset.contact = "";
    consultation.setAttribute("aria-haspopup", "dialog");
    note.append(makePosterGallery("心力发展图文", "mind-poster", [
      "适合人群与收获",
      "服务流程与内容",
      "刘迷糊简介与常见问题",
      "价格与购买须知",
    ]), consultation,
      el("small", "版权登记：国作登字-2026-A-00067097", "registration-note"));
    projectContent[key] = note;
    continue;
  }
  note.className = "project-entry illustrated-detail";
  const soloArt = clone(artwork);
  soloArt.className = "project-detail-art";
  const soloCopy = el("div", "", "project-detail-copy");
  const soloMethod = el("section", "", "solo-practice-method");
  soloMethod.append(el("h3", "会怎么练习？"), el("p", "从你当下的状态出发，一起选择合适的方法；在带领中，我也会根据你的实际体验随时调整。"));
  soloCopy.append(
    el("h2", "一对一冥想：为你量身调整"),
    el("p", "如果你想要更具体的针对性练习，我们可以试试一对一"),
    el("p", "每个人的卡点都不一样。如果你正面临特定的困扰（比如容易焦虑、注意力难以集中），或者时间比较碎片化，一对一的引导能为你提供更灵活、更个性化的支持。"),
    soloMethod,
    el("p", "如果你不确定这种形式是否适合自己，或者想先聊聊具体的练习困扰，欢迎随时联系我。我们聊聊，再决定下一步。", "solo-practice-invitation"),
    projectContact("了解定制")
  );
  note.append(soloArt, soloCopy);
  projectContent[key] = note;
}
restartSheet.append(projectSection, restartDiary);
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

const jianjiFeatureDialog = el("dialog", "", "jianji-feature-dialog");
jianjiFeatureDialog.id = "jianji-feature-dialog";
jianjiFeatureDialog.setAttribute("aria-labelledby", "jianji-feature-title");
const jianjiFeatureTitle = el("h2", "见己功能");
jianjiFeatureTitle.id = "jianji-feature-title";
jianjiFeatureTitle.tabIndex = -1;
jianjiFeatureTitle.setAttribute("autofocus", "");
const jianjiFeatureHeader = el("header", "", "jianji-feature-header");
jianjiFeatureHeader.append(jianjiFeatureTitle);
const jianjiFeatureStage = el("div", "", "jianji-sheet jianji-feature-stage");
jianjiFeatureStage.append(clone(lifeGallery));
jianjiFeatureDialog.append(jianjiFeatureHeader, jianjiFeatureStage);
document.body.append(jianjiFeatureDialog);
bindPosterGallery(jianjiFeatureStage);
jianjiFeatureDialog.addEventListener("click", event => {
  if (!event.target.closest(".jianji-poster-card, .jianji-poster-controls, .jianji-feature-header h2")) {
    jianjiFeatureDialog.close();
  }
});
let jianjiFeatureOpener;
function openJianjiFeatures(button) {
  jianjiFeatureOpener = button;
  jianjiFeatureDialog.showModal();
}
jianjiFeatureDialog.addEventListener("close", () => {
  if (jianjiFeatureOpener?.isConnected) jianjiFeatureOpener.focus({ preventScroll: true });
});

let projectOpener;
projectDialog.addEventListener("click", event => {
  const jianjiButton = event.target.closest(".jianji-feature-button");
  if (jianjiButton) {
    openJianjiFeatures(jianjiButton);
    return;
  }
  if (event.target.closest(".project-contact") && !event.target.closest("a")) return;
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
const aliases={cooperation:'training','training-plan':'training',group:'meditation',individual:'meditation','individual-fees':'meditation','individual-questions':'life-questions',jianji:'jianji-record',story:'about',memories:'practice','practice-change':'practice',works:'research','group-plan':'meditation','group-process':'meditation','group-thoughts':'meditation-design'};
for(const source of sources)for(const node of source.nodes)node.querySelectorAll?.('a[href]').forEach(a=>{const id=a.hash.slice(1);if(aliases[id])a.hash=aliases[id];});
// Click cues without turning the vignette into a boxed button.
intro.querySelectorAll(':scope>.reader-links a').forEach(a=>a.textContent=a.textContent.replace(/\s*↗$/,''));
// Each approved chapter is one leaf. Long entries scroll within the leaf.
const pages = sources.map(source => ({ ...source, key: source.id }));
const sectionPages = new Map();
for (const page of pages) {
  for (const node of page.nodes) {
    if (node.id) sectionPages.set(node.id, page);
    node.querySelectorAll("[id]").forEach(section => sectionPages.set(section.id, page));
  }
}

function applyRecommendation(activity) {
  if (typeof activity?.title !== "string" || !activity.title.trim()) return;
  const target = activity.target ?? { page: "life" };
  const page = pages.find(candidate => candidate.key === target.page);
  if (!page) return;
  const section = target.section;
  const destination = sectionPages.get(section) === page ? section : page.key;
  const tab = tabs.find(tab => tab.dataset.page === page.root);
  if (!tab) return;
  recommendationTitle.textContent = "近期活动：" + activity.title;
  coverRecommendation.href = "#" + encodeURIComponent(destination);
  if (!coverRecommendation.isConnected) coverPlate.append(coverRecommendation);
  if (tabRecommendation.parentElement !== tab) tab.append(tabRecommendation);
}

main.replaceChildren();
const content = el("article", "", "reader-content");
main.append(content);
document
  .querySelectorAll(".desk-caption,.desk-bottom,.sheet>.contact-section")
  .forEach((n) => n.remove());
const notebook = sheet.parentElement;
let current = null;
let turningLeaf = null;
let turnAnimation = null;
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const wechatOnIOS = /MicroMessenger/i.test(navigator.userAgent)
  && /iPhone|iPad|iPod/i.test(navigator.userAgent);

function clearPageTurn() {
  turnAnimation?.cancel();
  turningLeaf?.remove();
  turningLeaf = null;
  turnAnimation = null;
}

function snapshotLeaf(fromCover) {
  const source = fromCover ? cover.querySelector(".cover-plate") : sheet;
  const rect = source.getBoundingClientRect();
  const bookRect = notebook.getBoundingClientRect();
  const leaf = clone(source);
  leaf.classList.add("turning-leaf", fromCover ? "turning-cover" : "outgoing-paper");
  leaf.inert = true;
  leaf.setAttribute("aria-hidden", "true");
  leaf.querySelectorAll("[id]").forEach(node => node.removeAttribute("id"));
  Object.assign(leaf.style, {
    left: rect.left - bookRect.left - notebook.clientLeft + "px",
    top: rect.top - bookRect.top - notebook.clientTop + "px",
    width: rect.width + "px",
    height: rect.height + "px",
  });
  notebook.append(leaf);
  if (!fromCover) leaf.querySelector(".reader-content").scrollTop = content.scrollTop;
  return leaf;
}

function animatePageTurn(moving, backwards) {
  const flat = wechatOnIOS
    ? "translateX(-2%) skewY(-3deg) scaleX(.035)"
    : "perspective(1800px) rotateY(-87deg)";
  const folded = { transform: flat, opacity: 0, offset: backwards ? 0 : 1 };
  const flatPage = { transform: "none", opacity: 1, offset: backwards ? 1 : 0 };
  const middle = {
    transform: wechatOnIOS
      ? "translateX(-1%) skewY(-1.8deg) scaleX(.42)"
      : "perspective(1800px) rotateY(-65deg)",
    opacity: .96,
    offset: backwards ? .35 : .65,
  };
  turnAnimation = moving.animate(backwards ? [folded, middle, flatPage] : [flatPage, middle, folded], {
    duration: wechatOnIOS ? 430 : 520,
    easing: "cubic-bezier(.32,.05,.3,1)",
  });
  turnAnimation.onfinish = clearPageTurn;
}

function render(key, animate = true) {
  clearPageTurn();
  if (key === "cover" || !key) {
    current = "cover";
    sheet.hidden = true;
    cover.hidden = false;
    document.body.classList.add("cover-mode");
    tabs.forEach(tab => {
      tab.classList.remove("active");
      tab.removeAttribute("aria-current");
    });
    return;
  }
  const sectionKey = key;
  const customDeepLink = customOptions.some(([id]) => id === key) ? key : null;
  key = customDeepLink ? "meditation" : aliases[key] || key;
  const directPage = pages.find(candidate => candidate.key === key);
  const sectionPage = directPage ? null : sectionPages.get(sectionKey);
  const page = directPage || sectionPage || pages[0];
  const index = pages.indexOf(page);
  const previous = pages.findIndex(candidate => candidate.key === current);
  const fromCover = current === "cover";
  const shouldTurn = animate && !reduced() && (fromCover || (previous >= 0 && previous !== index));
  const backwards = shouldTurn && previous > index;
  if (shouldTurn) turningLeaf = snapshotLeaf(fromCover);

  cover.hidden = true;
  sheet.hidden = false;
  document.body.classList.remove("cover-mode");
  content.replaceChildren(...page.nodes.map(clone));
  content.scrollTop = 0;
  const targetSection = sectionPage ? content.querySelector("#" + CSS.escape(sectionKey)) : null;
  current = page.key;
  tabs.forEach(tab => {
    const active = tab.dataset.page === page.root;
    tab.classList.toggle("active", active);
    if (active) tab.setAttribute("aria-current", "page");
    else tab.removeAttribute("aria-current");
  });
  document.getElementById("prev").disabled = index === 0;
  document.getElementById("next").disabled = index === pages.length - 1;
  document.getElementById("page-number").textContent =
    page.title + " · " + (index + 1) + " / " + pages.length;

  if (turningLeaf) {
    turningLeaf.classList.toggle("backwards", backwards);
    animatePageTurn(backwards ? sheet : turningLeaf, backwards);
  }
  bindAlbum();
  bindPosterGallery(content);
  if (customDeepLink) {
    content.querySelector('[data-project="' + customDeepLink + '"]')?.click();
  } else if (targetSection) {
    content.scrollTop = targetSection.getBoundingClientRect().top - content.getBoundingClientRect().top;
    if (animate && !wechatOnIOS) targetSection.querySelector("h1, h2, h3")?.focus({ preventScroll: true });
  } else if (animate && !wechatOnIOS) {
    content.focus({ preventScroll: true });
  }
}
function route() {
  render(decodeURIComponent(location.hash.slice(1)) || "cover");
}
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
  if (!event.target.closest(".qr-crop, .qr-caption")) dialog.close();
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
applyRecommendation(window.journalRecommendation);
render(decodeURIComponent(location.hash.slice(1)) || "cover", false);
document.documentElement.classList.remove("opening-inner-page");
if (location.protocol === "http:" || location.protocol === "https:") {
  fetch("current-recommendation.json", { cache: "no-cache" })
    .then(response => response.ok ? response.json() : null)
    .then(applyRecommendation)
    .catch(() => { /* Keep the published local snapshot if the feed is unavailable. */ });
}
