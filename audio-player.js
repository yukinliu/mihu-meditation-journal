(() => {
  const launch = document.querySelector(".audio-launch");
  const sheet = document.querySelector(".audio-sheet");
  const grip = sheet.querySelector(".audio-grip");
  const tracks = sheet.querySelector(".audio-tracks");
  const audio = sheet.querySelector("audio");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const entries = [
    ["morning", "清晨，跟着呼吸醒来", 372],
    ["afternoon", "午后犯困时，找回专注", 310],
    ["pressure", "压力大时，给自己一点空间", 318],
    ["self-kindness", "对自己苛刻时，试着温柔一点", 334],
    ["bedtime", "睡前，慢慢放下一天", 372],
  ];
  const formatTime = (seconds) =>
    String(Math.floor(seconds / 60)).padStart(2, "0") + ":" + String(Math.floor(seconds % 60)).padStart(2, "0");

  for (const [id, title, duration] of entries) {
    const row = el("li", "", "audio-track");
    const button = el("button", "", "audio-track-button");
    button.type = "button";
    button.dataset.track = id;
    button.setAttribute("aria-label", "播放 " + title);
    const icon = el("span", "", "audio-track-icon");
    icon.setAttribute("aria-hidden", "true");
    const wave = el("span", "", "audio-wave");
    wave.setAttribute("aria-hidden", "true");
    for (let bar = 0; bar < 27; bar++) wave.append(el("i"));
    button.append(icon, el("span", title, "audio-track-title"), el("span", formatTime(duration), "audio-track-duration"), wave);
    row.append(button);
    tracks.append(row);
  }

  const transport = el("div", "", "audio-transport");
  const seek = el("input", "", "audio-seek");
  seek.type = "range";
  seek.min = "0";
  seek.max = "0";
  seek.value = "0";
  seek.step = "0.1";
  seek.disabled = true;
  seek.setAttribute("aria-label", "播放进度");
  const time = el("span", "00:00");
  const status = el("p", "", "audio-status");
  status.setAttribute("role", "status");
  transport.append(seek, time, status);

  let selected;
  let playRequest = 0;
  let playing = false;

  function showPlayback() {
    if (!selected) return;
    const active = !audio.paused && !audio.ended;
    const title = selected.querySelector(".audio-track-title").textContent;
    selected.dataset.playing = String(active && playing);
    selected.dataset.active = String(active);
    selected.setAttribute("aria-label", (active ? "暂停 " : "播放 ") + title);
    launch.dataset.playing = String(active);
  }

  function showProgress() {
    const ready = Number.isFinite(audio.duration) && audio.duration > 0;
    seek.disabled = !ready;
    seek.max = ready ? audio.duration : 0;
    seek.value = audio.currentTime;
    seek.style.setProperty("--audio-progress", (ready ? audio.currentTime / audio.duration * 100 : 0) + "%");
    const elapsed = formatTime(audio.currentTime);
    time.textContent = elapsed;
    seek.setAttribute("aria-valuetext", ready ? elapsed + " / " + formatTime(audio.duration) : elapsed);
  }

  function showError() {
    playing = false;
    status.textContent = "音频暂时无法播放，请重试。";
    showPlayback();
  }

  tracks.addEventListener("click", event => {
    const button = event.target.closest("[data-track]");
    if (!button) return;
    const request = ++playRequest;
    if (button === selected && !audio.paused && !audio.ended) {
      audio.pause();
      status.textContent = "";
      return;
    }
    if (button !== selected) {
      if (selected) {
        selected.removeAttribute("data-active");
        selected.removeAttribute("data-playing");
        selected.setAttribute("aria-label", "播放 " + selected.querySelector(".audio-track-title").textContent);
        selected.parentElement.classList.remove("audio-track-selected");
      }
      playing = false;
      selected = button;
      selected.after(transport);
      selected.parentElement.classList.add("audio-track-selected");
      audio.src = "assets/life-audio/" + button.dataset.track + ".mp3";
    } else if (audio.error) {
      audio.load();
    }
    status.textContent = "";
    showProgress();
    audio.play().catch(error => {
      if (request === playRequest && error.name !== "AbortError") showError();
    });
  });

  audio.addEventListener("play", showPlayback);
  audio.addEventListener("playing", () => {
    playing = true;
    status.textContent = "";
    showPlayback();
  });
  for (const name of ["pause", "ended", "waiting"]) {
    audio.addEventListener(name, () => {
      playing = false;
      status.textContent = name === "waiting" && !audio.paused ? "音频加载中…" : "";
      showPlayback();
    });
  }
  for (const name of ["loadedmetadata", "durationchange", "timeupdate", "emptied"]) {
    audio.addEventListener(name, showProgress);
  }
  audio.addEventListener("error", showError);
  seek.addEventListener("input", () => { audio.currentTime = Number(seek.value); });

  let closing = false;
  let drag;
  let ignoreGripClick = false;
  let returnFocus = true;

  function dismiss() {
    if (!sheet.open || closing) return;
    if (reduceMotion.matches || !sheet.animate) {
      sheet.close();
      return;
    }
    closing = true;
    const y = drag?.offset || 0;
    const animation = sheet.animate([
      { transform: "translateY(" + y + "px)" },
      { transform: "translateY(103%)" },
    ], { duration: 190, easing: "ease-in", fill: "forwards" });
    animation.finished.then(() => {
      sheet.close();
      animation.cancel();
      closing = false;
    }, () => { closing = false; });
  }

  launch.addEventListener("click", () => {
    returnFocus = true;
    sheet.showModal();
    grip.focus({ preventScroll: true });
  });
  sheet.addEventListener("cancel", event => {
    event.preventDefault();
    dismiss();
  });
  sheet.addEventListener("click", event => {
    if (event.target === sheet) dismiss();
  });
  sheet.querySelector(".audio-follow-link").addEventListener("click", () => {
    returnFocus = location.hash === "#life";
    sheet.close();
  });
  sheet.addEventListener("close", () => {
    if (returnFocus && !sheet.open) launch.focus({ preventScroll: true });
  });

  grip.addEventListener("click", () => {
    if (!ignoreGripClick) dismiss();
  });
  grip.addEventListener("pointerdown", event => {
    if (!event.isPrimary || event.button !== 0 || closing) return;
    ignoreGripClick = false;
    drag = { id: event.pointerId, start: event.clientY, offset: 0 };
    grip.setPointerCapture(event.pointerId);
  });
  grip.addEventListener("pointermove", event => {
    if (drag?.id !== event.pointerId) return;
    drag.offset = Math.max(0, event.clientY - drag.start);
    sheet.style.setProperty("--audio-sheet-pull", drag.offset + "px");
  });
  for (const name of ["pointerup", "pointercancel"]) {
    grip.addEventListener(name, event => {
      if (drag?.id !== event.pointerId) return;
      ignoreGripClick = drag.offset > 7;
      if (name === "pointerup" && drag.offset >= 48) dismiss();
      sheet.style.removeProperty("--audio-sheet-pull");
      drag = null;
    });
  }
  grip.addEventListener("keydown", () => { ignoreGripClick = false; });
  launch.hidden = false;
})();
