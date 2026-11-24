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
const introTop=el('div','','intro-top');const identity=el('div','','intro-identity');identity.append(el('h1','你好，我是刘迷糊。'),el('p','浙江大学心理系硕士在读，研究方向正念冥想，持续实践冥想带练。'));const portrait=clone(about.querySelector('.portrait'));portrait.querySelector('img').src='assets/portrait-cutout.png';portrait.querySelector('figcaption')?.remove();introTop.append(identity,portrait);intro.append(introTop,el('p','2013 年起冥想便成为了我生活的一部分。','intro-bridge'));
const map=el('nav','','journey-map');map.setAttribute('aria-label','冥想历程');
const routeLine=document.createElementNS('http://www.w3.org/2000/svg','svg');routeLine.setAttribute('viewBox','0 0 600 230');routeLine.setAttribute('preserveAspectRatio','none');routeLine.classList.add('journey-line');routeLine.innerHTML='<path d="M110 184 C195 215 352 188 448 158 C550 97 44 157 156 82 C245 15 349 70 468 48" fill="none" stroke="#a28b65" stroke-width="2" stroke-dasharray="4 7" stroke-linecap="round"/>';map.append(routeLine);
[['2024—至今','research','科研与实践','#78968a'],['2023','pause','自我怀疑与搁浅','#bc987d'],['2015—2022','practice','规律练习与引导','#a99b6f'],['2013—2015','origin','初识与断断续续','#8faaa9']].forEach(([year,id,label,color],i)=>{const a=el('a','','journey-stop');a.href='#'+id;const image=el('img');image.src='assets/journey-'+id+'-scene.png';image.alt='';image.width=100;image.height=100;a.append(image);a.append(el('span',year,'journey-year'),el('span',label,'journey-caption'));map.append(a);});
const slow = el('section', '', 'slow-values');
slow.setAttribute('aria-label', 'SLOW');
const slowItems = el('ul');
for (const [english, chinese] of [['Self','本自具足'], ['Life','正念生活'], ['Open','开放好奇'], ['Well-being','丰盛幸福']]) {
  const item = el('li');
  item.append(el('span', chinese), el('small', english));
  slowItems.append(item);
}
slow.append(el('b', 'SLOW'), slowItems);
intro.append(map, slow);add('about','about','初次见面',[intro]);
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
groupCopy.append(el("strong", "团体冥想"), el("span", "想把冥想练成习惯，可以和大家定期共练，练完聊聊体验、问问卡住的地方。"));
groupCard.append(groupArtwork, groupCopy);
customCards.append(groupCard);
const meditationActions = el("footer", "", "meditation-actions");
const designLink = el("a", "", "meditation-design-link");
designLink.href = "#meditation-design";
const pageArrow = el("span", "↗");
pageArrow.setAttribute("aria-hidden", "true");
designLink.append(el("strong", "设计理念"), pageArrow);
const meditationContact = el("button", "微信联系刘迷糊", "meditation-contact");
meditationContact.type = "button";
meditationContact.dataset.contact = "";
meditationContact.setAttribute("aria-haspopup", "dialog");
meditationActions.append(designLink, meditationContact);
meditationSheet.append(meditationHeader, customCards, meditationActions);
add("meditation", "meditation", "冥想练习", [meditationSheet]);

const designSheet = el("section", "", "meditation-sheet meditation-design");
designSheet.append(el("h1", "科学冥想 · 设计理念"),
  el("p", "这套方案以冥想体验的不同层次为线索，结合科学研究与带练实践，帮助你从跟随引导，逐渐走向自主练习。"));
const principles = el("div", "", "design-principles");
for (const [style, title, caption, copy] of [
  ["steps", "循序渐进", "安顿身心，再深入", "方案结合冥想体验深度实践总结和研究发现。尊重冥想练习的一般规律，从克服练习障碍开始，安顿身心，探索更丰富的冥想体验。"],
  ["focus", "掌握方法", "聚焦注意 · 开放监控", "采用聚焦注意与开放监控冥想，让你知道自己在练什么、为什么这样练，逐渐学会辨别并选择适合自己的练习。"],
  ["awareness", "觉察与接纳并重", "看见当下，留一点空间", "觉察帮助我们发现正在发生的体验，接纳让我们有空间面对它们。两者共同作用，支持我们在练习和生活中更从容地回应。"],
  ["notes", "持续迭代", "近 3 年 · 100 余场 · 4 轮迭代", "方案经过近3年、100余场带练与4轮重要迭代。未来，我会继续结合冥想实践、研究学习与参与者反馈，持续深化内容，带来新的练习主题。"],
]) {
  const entry = el("section", "", "design-principle");
  const art = el("div", "", "design-art design-art-" + style);
  art.setAttribute("aria-hidden", "true");
  art.append(el("i"), el("i"), el("i"));
  const text = el("div");
  text.append(el("h2", title), el("p", copy));
  const figure = el("figure", "", "design-figure");
  figure.append(art, el("figcaption", caption));
  entry.append(figure, text);
  principles.append(entry);
}
const freeQuestions = el("button", "", "meditation-free-questions");
freeQuestions.type = "button";
freeQuestions.dataset.contact = "";
freeQuestions.setAttribute("aria-haspopup", "dialog");
freeQuestions.append(el("strong", "免费冥想答疑"),
  el("span", "对冥想有点好奇，或练习中遇到了问题？欢迎来问我。"));
designSheet.append(principles, freeQuestions);
add("meditation-design", "meditation", "设计理念", [designSheet]);

const customOptions = [
  ["individual-practice", "一对一冥想", "不知道哪种方法适合你？我们按你的状态一起试，找到平时也能自己练的方法。", "一对一冥想",
    "想开始冥想，却不知道先练什么；或者已经在练，反复遇到走神、昏沉、坐姿不适，想有人带着你具体试一试。",
    "带走一段平时能自己做的练习，知道怎么开始、把注意放在哪里，以及遇到困难时可以怎么调整。"],
  ["individual-extension", "心力发展", "当工作、关系或生活来到转折点，一起理清你真正在意什么，再想下一步怎么走。", "心力发展",
    "工作、关系或生活阶段发生变化，想理清感受和生活方向。也适合想辨认自己的需要，在面对他人的期待时建立更清楚的边界的人。",
    "一起梳理你在意的事、习惯的反应和可以尝试的选择。探索围绕清晰笃定、自我接纳、自我边界和内在稳定展开，会后提供探索小结。"],
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
  "记录、汇总、保存、搜索与回看",
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
  for (const [buttonLabel, arrow, direction] of [["上一张图", "←", -1], ["下一张图", "→", 1]]) {
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

function bindPosterGallery(root) {
  const gallery = root.querySelector(".jianji-gallery");
  if (!gallery) return;
  const frame = gallery.querySelector(".jianji-poster-frame");
  const posters = [...frame.children];
  const count = gallery.querySelector("[aria-live]");
  let index = 0;
  let start;
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
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) step(dx < 0 ? 1 : -1);
    start = null;
  }, { passive: true });
}
const trainingSheet = el("section", "", "training-sheet");
const collaboration = el("section", "", "collaboration-section");
collaboration.append(el("p", "想把正念练习带给你们的团队，或把日常记录融入正在做的项目？可以从下面几个方向聊起。"));
const collaborationCards = el("div", "", "collaboration-cards");
for (const [key, title, summary] of [
  ["merp", "21 天正念情绪调节", "每天 15 分钟，把情绪觉察与调节练进日常。"],
  ["family", "4 周正念亲子团体", "从家长自己的情绪觉察入手，把练习带回亲子相处。"],
  ["custom-group", "定制团体活动", "为你的团队或机构，设计一场贴合实际场景的练习。"],
  ["jianji-collaboration", "见己软件", "把日常记录与回看融入课程、练习或团体项目。"],
]) {
  const card = el("button", "", "collaboration-card");
  card.type = "button";
  card.dataset.project = key;
  card.setAttribute("aria-haspopup", "dialog");
  const arrow = el("span", "↗", "collaboration-arrow");
  arrow.setAttribute("aria-hidden", "true");
  card.append(el("strong", title), el("span", summary), arrow);
  collaborationCards.append(card);
}
const collaborationContact = el("button", "微信聊聊合作", "meditation-contact");
collaborationContact.type = "button";
collaborationContact.dataset.contact = "";
collaborationContact.setAttribute("aria-haspopup", "dialog");
collaboration.append(collaborationCards, collaborationContact);
const trainingPlan = el("section", "", "training-plan");
trainingPlan.append(el("h2", "培训"), el("span", "筹备中", "status"),
  el("p", "怎么把一段冥想带得清楚？练习者遇到走神、昏沉或坐姿不适时，又该怎样调整？我正在把多年带练经验与正念研究整理成培训内容，从这些现场常见的问题讲起。"));
trainingSheet.append(el("h1", "合作与培训"), collaboration, trainingPlan);
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
const memoryScenes=el('div','','memory-scenes');
[['吉他声里',originCopy[2]],['山中的学习',originCopy[3]],['身体的记忆',originCopy[4]]].forEach(([title,text])=>{const note=el('section','','memory-note');note.append(el('h2',title),el('p',text));memoryScenes.append(note);});
const memoryArt=el('img','','memory-art');memoryArt.src='assets/memory-guitar-candle.png';memoryArt.alt='吉他、烛光、山的轮廓与一本练习手记';
originSheet.append(originHeader,el('p',originCopy[1],'memory-preface'),memoryScenes,memoryArt,el('p',originCopy[5],'memory-ending'));
Object.assign(sources.find(s=>s.id==='origin'),{title:'2013 初识冥想',nodes:[originSheet]});
const practiceCopy=[
 '从 2015 年起，我开始规律练习，也逐渐带领线上、线下的团体与一对一冥想。在学习、练习与实际引导之间，持续积累自己的理解。',
 '那八年里，我没有系统记录带领过多少人、多少小时，只是全心投入其中。',
 '怎样看待自己、怎样与人相处、怎样面对不如意——冥想的影响，慢慢进入更广的生活。我更容易觉察念头和情绪，也多了一些选择怎样回应的空间。',
 '觉察、接纳、慈悲……从几个词，慢慢成为我理解和对待生活的方式。'
];
const practiceSheet=el('div','','practice-sheet'),practiceText=el('div','','practice-copy journal-writing'),practiceAlbum=clone(album);
practiceAlbum.querySelector('.album-heading')?.remove();
practiceText.append(el('h1','从自己练习，到带领他人。'),el('h2','练习，也在带领中学习。','practice-subhead'),el('p',practiceCopy[0]),el('p',practiceCopy[1],'practice-aside'),el('h2','慢慢进入生活。','practice-subhead'),el('p',practiceCopy[2]),el('blockquote',practiceCopy[3],'practice-takeaway'));
practiceSheet.append(practiceAlbum,practiceText);
Object.assign(sources.find(s=>s.id==='practice'),{title:'八年实践',nodes:[practiceSheet]});
const pauseCopy=[
 '现实中的变动与挑战，让我开始怀疑把冥想继续做下去的可能。我暂停了带领，一边备考浙江大学心理系研究生，一边做产品经理的工作。',
 '冥想在这段时间更多地是自我调节，图书馆里学累了、注意力散了，静静地坐一会儿。'
];
const pauseSheet=el('div','','pause-sheet scrapbook-leaf stranded-sheet');const pauseArt=el('img','','pause-art');pauseArt.src='assets/journey-pause-scene.png';pauseArt.alt='桌前思考的自己，身边是书、杯子和计划本';
const pauseTop=el('div','','pause-top');pauseTop.append(el('h1','搁浅'),pauseArt);
const pauseDiary=el('div','','pause-diary journal-writing');pauseDiary.append(...pauseCopy.map(t=>el('p',t)));pauseSheet.append(pauseTop,pauseDiary);
Object.assign(sources.find(s=>s.id==='pause'),{title:'2023搁浅',nodes:[pauseSheet]});
const restartCopy=[
 '进入浙江大学心理系，选择研究方向时，我仍然纠结：喜欢冥想，也担心过去实践中遇到的现实问题。直到一个晚上，从图书馆回家的路上，我忽然清楚地知道：“还是选择正念冥想。”那一刻，心里涌起了与初识冥想时相似的触动。',
 '我把多年练习和带领中积累的好奇带进研究：不同的练习方法与设计，会怎样影响注意、觉察、接纳和情绪体验？练习里的变化，能否保留下来，进入日常生活？',
 '我希望把研究中的理解带回引导与方案设计，让练习更清楚地回应人的需要，也让自己的设计有更充分的依据、能更清楚地解释。'
];
const restartSheet=el('div','','restart-sheet scrapbook-leaf');restartSheet.append(el('h1','重新选择，带着这些年的问题。'));
const restartDiary=el('div','','restart-diary');
[['重新确认选择',restartCopy[0]],['把问题带进研究',restartCopy[1]],['再把理解带回实践',restartCopy[2]]].forEach(([title,text])=>{const part=el('section','','restart-part');part.append(el('h2',title),el('p',text));restartDiary.append(part);});
const projectStrip=el('div','','project-strip');projectStrip.setAttribute('aria-label','展开研究与原创项目');
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
const jianjiCollaboration = el("section", "", "custom-detail service-poster-detail");
const jianjiCollaborationGallery = clone(lifeGallery);
jianjiCollaborationGallery.querySelector(".jianji-download-sticker").remove();
jianjiCollaboration.append(jianjiCollaborationGallery);
projectContent["jianji-collaboration"] = jianjiCollaboration;
const groupNote = el("section", "", "custom-detail service-poster-detail");
groupNote.append(makePosterGallery("团体冥想图文", null, ["适合谁", "怎么练", "安排与费用"]));
projectContent["meditation-group"] = groupNote;
projectSpecs.forEach(({key,label,title,paragraphs,links:refs=[]},i)=>{
 const note=el('section','','project-entry project-entry-'+key);note.append(el('span',['研究手记','原创方案','原创方案'][i],'project-kicker'),el('h2',title));
 paragraphs.forEach((text,j)=>{const p=el('p',text);if(key==='vr'&&j===0){p.textContent='研究成果以第一作者身份，发表在 ';p.append(el('em','Computers in Human Behavior Reports'),document.createTextNode('（五年影响因子 7.3）。'));}note.append(p);});
 if(refs.length){const row=el('div','','project-references');refs.forEach(([label,url])=>{const a=el('a',label,'text-link');a.href=url;a.target='_blank';a.rel='noopener noreferrer';row.append(a);});note.append(row);}
 projectContent[key]=note;const button=el('button',label,'project-slip');button.type='button';button.dataset.project=key;button.setAttribute('aria-haspopup','dialog');projectStrip.append(button);
});
for (const [index, [key, label, summary, title, audience, takeaway]] of customOptions.entries()) {
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
  if (index === 0) card.classList.add("meditation-solo-card");
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
  note.classList.add("solo-detail");
  const soloHeader = el("header", "", "solo-detail-header");
  soloHeader.append(clone(artwork), el("h2", title),
    el("p", "从一次真实的练习出发，找到你平时也能用的方法。"));
  note.append(soloHeader, el("h3", "适合这样的你"), el("p", audience));
  const example = el("aside", "", "solo-example");
  example.append(el("h3", "比如，走神时可以怎么做？"),
    el("p", "如果盯着呼吸反而觉得紧绷，我们可以试着把注意放在脚掌接触地面的感觉上。发现走神时，先感受脚底哪里有压力，再把注意轻轻带回来。"));
  note.append(example);
  note.append(el("h3", "一次练习怎么进行"));
  const session = el("ol", "", "solo-session");
  for (const [heading, description] of [
    ["微信沟通", "先了解你想练什么、平时怎么练，再确认安排和费用。"],
    ["腾讯会议带练", "一起试一段练习，按你的感受调整方法和节奏。"],
    ["练后回看", "聊聊刚才哪些做法适合你，确定接下来可以怎么练。"],
  ]) {
    const step = el("li");
    step.append(el("strong", heading), el("p", description));
    session.append(step);
  }
  note.append(session, el("h3", "可以带走什么"), el("p", takeaway), clone(meditationContact));
  projectContent[key] = note;
}
restartSheet.append(restartDiary,projectStrip);
Object.assign(sources.find(s=>s.id==='research'),{title:'2024再出发',nodes:[restartSheet]});
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
