// ===================================================
//   STAR RESONANCE ID MAKER - simple / classic 両対応
// ===================================================

// ---------------------------
// 背景パス
// ---------------------------
const SIMPLE_BASE = "base_simple.png";
const CLASSIC_BASE = "base_classic.png";

// ---------------------------
// Canvas 基本サイズ（共通）
// ---------------------------
const CANVAS_W = 1244;
const CANVAS_H = 1904;

// ---------------------------
// simple の描画用 CONFIG（元のまま）
// ---------------------------
const CONFIG_SIMPLE = {
  canvasW: CANVAS_W,
  canvasH: CANVAS_H,

  name:       { x:417, y:280,  w:732, h:94  },
  playerId:   { x:420, y:460,  w:729, h:87  },
  guild:      { x:66,  y:932,  w:618, h:74  },
  playStyle:  { x:70,  y:1097, w:616, h:66  },
  playTime:   { x:724, y:1095, w:456, h:67  },
  freeComment:{ x:70,  y:1242, w:1106,h:120 },

  userIcon:   { x:60,  y:213,  w:324, h:324 },
  freePhoto:  { x:387, y:1397, w:776, h:434 },

  classChecks: [
    { x:100,  y:782, w:47, h:47 },
    { x:241,  y:782, w:47, h:47 },
    { x:382,  y:782, w:47, h:47 },
    { x:523,  y:782, w:47, h:47 },
    { x:663,  y:782, w:47, h:47 },
    { x:803,  y:782, w:47, h:47 },
    { x:944,  y:782, w:47, h:47 },
    { x:1083, y:782, w:47, h:47 }
  ],

  vcChecks: [
    { x:857, y:967, w:47, h:47 },
    { x:980, y:967, w:47, h:47 },
    { x:1096,y:968, w:47, h:47 }
  ],

  basePath:  SIMPLE_BASE,
  checkPath: "check.png"
};


// ===================================================
// CLASSIC：座標（解析済）
// 背景画像 1600x1200 → canvas1244px 横フィット描画
// ===================================================

const scaleX = CANVAS_W / 1600;
const CX = px => Math.round(px * scaleX);
const CY = px => Math.round(px * scaleX);

const CONFIG_CLASSIC = {
  canvasW: CANVAS_W,
  canvasH: CANVAS_H,

  basePath: CLASSIC_BASE,
  checkPath: "",

  name:       { x:CX(760),  y:CY(189), w:CX(766), h:CY(112) },
  playerId:   { x:CX(760),  y:CY(333), w:CX(766), h:CY(112) },
  guild:      { x:CX(760),  y:CY(475), w:CX(766), h:CY(112) },

  classFrame: { x:CX(13), y:CY(624), w:CX(397), h:CY(127) },

  vcFrames: [
    { x:CX(441), y:CY(757), w:CX(118), h:CY(118) },
    { x:CX(611), y:CY(757), w:CX(118), h:CY(118) }
  ],

  ptFrames: [
    { x:CX(1159), y:CY(757), w:CX(118), h:CY(118) },
    { x:CX(1299), y:CY(757), w:CX(118), h:CY(118) },
    { x:CX(1440), y:CY(757), w:CX(118), h:CY(118) }
  ],

  psFrames: [
    { x:CX(760),  y:CY(663), w:CX(110), h:CY(66) },
    { x:CX(880),  y:CY(663), w:CX(110), h:CY(66) },
    { x:CX(1000), y:CY(663), w:CX(110), h:CY(66) },
    { x:CX(1120), y:CY(663), w:CX(110), h:CY(66) },
    { x:CX(1240), y:CY(663), w:CX(110), h:CY(66) }
  ],

  freeComment:{ x:CX(31), y:CY(985), w:CX(1529), h:CY(167) },

  userIcon:   { x:CX(13), y:CY(208), w:CX(397), h:CY(397) }
};


// ===================================================
// CLASSIC アイコン対応表
// ===================================================

const CLASS_ICON_MAP = {
  "ストームブレイド":     "icons2/class_storm.png",
  "ヘヴィガーディアン":   "icons2/class_heavy.png",
  "ディバインアーチャー": "icons2/class_divine.png",
  "ゲイルランサー":       "icons2/class_gale.png",
  "シールドファイター":   "icons2/class_shield.png",
  "ヴァーダントオラクル": "icons2/class_verdan.png",
  "フロストメイジ":       "icons2/class_frost.png",
  "ビートパフォーマー":   "icons2/class_beat.png"
};

const VC_ICON_MAP = {
  "Discord": "icons2/vc_discord.png",
  "LINE":    "icons2/vc_line.png",
  "NG":      "icons2/vc_ng.png"
};

const PT_ICON_MAP = {
  "早朝": "icons2/pt_morning.png",
  "昼間": "icons2/pt_day.png",
  "夕方": "icons2/pt_evening.png",
  "夜間": "icons2/pt_night.png",
  "深夜": "icons2/pt_late.png"
};

const PS_ICON = "icons2/ps.png";


// ===================================================
// DOM
// ===================================================
const canvas = document.getElementById("cardCanvas");
const ctx = canvas.getContext("2d");

const designSelect = document.getElementById("designSelect");
const formSimple = document.getElementById("formSimple");
const formClassic = document.getElementById("formClassic");

const btnDownload = document.getElementById("btnDownload");


// ===================================================
// デザイン切替
// ===================================================
designSelect.addEventListener("change", () => {
  const d = designSelect.value;

  if (d === "simple") {
    formSimple.classList.remove("hide");
    formClassic.classList.add("hide");
  } else {
    formSimple.classList.add("hide");
    formClassic.classList.remove("hide");
  }

  drawPreview();
});


// ===================================================
// ファイル読込
// ===================================================
let userIcon_s = null;
let freePhoto_s = null;
let userIcon_c = null;

function loadImageFile(file, callback) {
  if (!file) { callback(null); return; }
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => callback(img);
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

document.getElementById("fileIcon_s").onchange = e => {
  loadImageFile(e.target.files[0], img => { userIcon_s = img; drawPreview(); });
};
document.getElementById("fileFree_s").onchange = e => {
  loadImageFile(e.target.files[0], img => { freePhoto_s = img; drawPreview(); });
};

document.getElementById("fileIcon_c").onchange = e => {
  loadImageFile(e.target.files[0], img => { userIcon_c = img; drawPreview(); });
};


// ===================================================
// 描画ボタン
// ===================================================
document.querySelectorAll(".btnRender").forEach(btn => {
  btn.addEventListener("click", () => drawPreview());
});


// ===================================================
// メイン描画処理
// ===================================================
async function drawPreview() {

  const design = designSelect.value;
  const bgPath = design === "simple" ? SIMPLE_BASE : CLASSIC_BASE;
  const bg = await loadImagePromise(bgPath);

  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  // 背景描画
  if (design === "simple") {
    ctx.drawImage(bg, 0, 0, CANVAS_W, CANVAS_H);
  } else {
    const drawW = CANVAS_W;
    const drawH = Math.round(1200 * (CANVAS_W / 1600));
    ctx.drawImage(bg, 0, 0, drawW, drawH);
  }

  // -------------------------------
  // SIMPLE
  // -------------------------------
  if (design === "simple") {

    const C = CONFIG_SIMPLE;

    // free photo
    if (freePhoto_s) {
      drawImageCover(ctx, freePhoto_s, C.freePhoto.x, C.freePhoto.y, C.freePhoto.w, C.freePhoto.h);
    }

    // icon
    if (userIcon_s) {
      drawImageCover(ctx, userIcon_s, C.userIcon.x, C.userIcon.y, C.userIcon.w, C.userIcon.h);
    }

    // class check
    const classChecks = [...document.querySelectorAll("#classList_s input[type=checkbox]")];
    for (let i = 0; i < classChecks.length; i++) {
      if (classChecks[i].checked && C.classChecks[i]) drawCheckMark(C.classChecks[i]);
    }

    // vc check
    const vcChecks = [...document.querySelectorAll("#vcList_s input[type=checkbox]")];
    for (let i = 0; i < vcChecks.length; i++) {
      if (vcChecks[i].checked && C.vcChecks[i]) drawCheckMark(C.vcChecks[i]);
    }

    drawCenteredText(inp("inpName_s"),      C.name);
    drawCenteredText(inp("inpPlayerId_s"),  C.playerId);
    drawCenteredText(inp("inpGuild_s"),     C.guild);
    drawCenteredText(inp("inpPlayStyle_s"), C.playStyle);
    drawCenteredText(inp("inpPlayTime_s"),  C.playTime);
    drawWrappedText(inp("inpComment_s"),    C.freeComment);
  }

  // -------------------------------
  // CLASSIC
  // -------------------------------
  else {

    const C = CONFIG_CLASSIC;

    if (userIcon_c) drawImageCover(ctx, userIcon_c, C.userIcon.x, C.userIcon.y, C.userIcon.w, C.userIcon.h);

    // CLASS 最大3つ
    const classBoxes = [...document.querySelectorAll("#classList_c input[type=checkbox]")]
      .filter(cb => cb.checked)
      .map(cb => CLASS_ICON_MAP[cb.value])
      .slice(0, 3);
    drawIconArray(classBoxes, C.classFrame);

    // VC 最大2つ
    const vcBoxes = [...document.querySelectorAll("#vcList_c input[type=checkbox]")]
      .filter(cb => cb.checked)
      .map(cb => VC_ICON_MAP[cb.value])
      .slice(0, 2);
    for (let i = 0; i < vcBoxes.length; i++) drawIcon(vcBoxes[i], C.vcFrames[i]);

    // PlayTime 最大3つ
    const ptBoxes = [...document.querySelectorAll("#ptList_c input[type=checkbox]")]
      .filter(cb => cb.checked)
      .map(cb => PT_ICON_MAP[cb.value])
      .slice(0, 3);
    for (let i = 0; i < ptBoxes.length; i++) drawIcon(ptBoxes[i], C.ptFrames[i]);

    // PlayStyle 1つ
    const psVal = document.querySelector("input[name=ps_c]:checked");
    if (psVal) {
      const idx = Number(psVal.value) - 1;
      drawIcon(PS_ICON, C.psFrames[idx]);
    }

    drawCenteredText(inp("inpName_c"),     C.name);
    drawCenteredText(inp("inpPlayerId_c"), C.playerId);
    drawCenteredText(inp("inpGuild_c"),    C.guild);
    drawWrappedText(inp("inpComment_c"),   C.freeComment);
  }
}


// ===================================================
// テキスト描画
// ===================================================
function inp(id){ return document.getElementById(id).value.trim(); }

function drawCenteredText(text, box) {
  if (!text) return;

  let size = Math.min(60, box.h);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const maxW = box.w * 0.9;
  while (size > 12) {
    ctx.font = `${size}px 'Noto Sans JP'`;
    if (ctx.measureText(text).width <= maxW) break;
    size--;
  }

  ctx.fillStyle = "#fff";
  ctx.fillText(text, box.x + box.w / 2, box.y + box.h / 2);
}


function wrapLines(str, maxW){
  const words = str.split(/(\s+)/);
  const lines = [];
  let line = "";

  for (let w of words) {
    const t = line + w;
    if (ctx.measureText(t).width > maxW && line) {
      lines.push(line);
      line = w.trim();
    } else {
      line = t;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawWrappedText(text, box){
  if (!text) return;

  let size = 28;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  const maxW = box.w * 0.9;
  const maxH = box.h * 0.95;

  while (size > 10) {
    ctx.font = `${size}px 'Noto Sans JP'`;
    const lines = wrapLines(text, maxW);
    if (lines.length * (size + 6) <= maxH) break;
    size--;
  }

  ctx.fillStyle = "#fff";
  const lines = wrapLines(text, maxW);
  let y = box.y + 4;

  for (let line of lines) {
    ctx.fillText(line, box.x + 6, y);
    y += size + 6;
  }
}


// ===================================================
// 画像描画
// ===================================================
function drawImageCover(ctx, img, x, y, w, h){
  const iw = img.width;
  const ih = img.height;

  const boxR = w / h;
  const imgR = iw / ih;

  let sw, sh, sx, sy;

  if (imgR > boxR) {
    sh = ih;
    sw = sh * boxR;
    sx = (iw - sw) / 2;
    sy = 0;
  } else {
    sw = iw;
    sh = sw / boxR;
    sx = 0;
    sy = (ih - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

async function drawIcon(path, frame){
  if (!path) return;
  const img = await loadImagePromise(path);
  if (!img) return;

  const size = Math.min(frame.w, frame.h);
  const ox = frame.x + (frame.w - size)/2;
  const oy = frame.y + (frame.h - size)/2;

  ctx.drawImage(img, ox, oy, size, size);
}

async function drawIconArray(paths, frame){
  const n = paths.length;
  if (n === 0) return;

  const perW = frame.w / n;

  for (let i = 0; i < n; i++) {
    const img = await loadImagePromise(paths[i]);
    if (!img) continue;
    const size = Math.min(perW * 0.8, frame.h * 0.8);

    const ox = frame.x + perW * i + (perW - size) / 2;
    const oy = frame.y + (frame.h - size) / 2;

    ctx.drawImage(img, ox, oy, size, size);
  }
}


// ===================================================
// check.png（simple 用）
// ===================================================
let checkImg = null;
loadImagePromise("check.png").then(img => checkImg = img);

function drawCheckMark(rect){
  if (!checkImg) return;
  const size = Math.min(rect.w, rect.h) - 4;
  const ox = rect.x + (rect.w - size)/2;
  const oy = rect.y + (rect.h - size)/2;
  ctx.drawImage(checkImg, ox, oy, size, size);
}


// ===================================================
// Image Loader
// ===================================================
function loadImagePromise(src){
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}


// ===================================================
// DL
// ===================================================
btnDownload.onclick = () => {
  drawPreview();
  const link = document.createElement("a");
  link.download = "スタレゾ自己紹介カード.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};


// ===================================================
// 初期描画
// ===================================================
drawPreview();
