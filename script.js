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
// CLASSIC：座標（すべて base_classic.png の赤枠解析済み）
// 背景画像 1600x1200 → canvas 1244px 横フィットで描画
// ===================================================

// スケール（横方向のみで 1244 に合わせる）
const scaleX = CANVAS_W / 1600; // 約0.7775
const CX = px => Math.round(px * scaleX);
const CY = px => Math.round(px * scaleX); // 同率縮尺（縦は933px程度になる）

const CONFIG_CLASSIC = {
  canvasW: CANVAS_W,
  canvasH: CANVAS_H,

  basePath: CLASSIC_BASE,
  checkPath: "", // classicは check.png を使わない

  name:       { x:CX(760),  y:CY(189), w:CX(766), h:CY(112) },
  playerId:   { x:CX(760),  y:CY(333), w:CX(766), h:CY(112) },
  guild:      { x:CX(760),  y:CY(475), w:CX(766), h:CY(112) },

  // Class 用の赤枠（1つの長い枠に最大3個）
  classFrame: { x:CX(13), y:CY(624), w:CX(397), h:CY(127) },

  // VC の赤枠（2つ）
  vcFrames: [
    { x:CX(441), y:CY(757), w:CX(118), h:CY(118) },
    { x:CX(611), y:CY(757), w:CX(118), h:CY(118) }
  ],

  // PlayTime の赤枠（3つ）
  ptFrames: [
    { x:CX(1159), y:CY(757), w:CX(118), h:CY(118) },
    { x:CX(1299), y:CY(757), w:CX(118), h:CY(118) },
    { x:CX(1440), y:CY(757), w:CX(118), h:CY(118) }
  ],

  // PlayStyle の赤枠（5つ）
  psFrames: [
    { x:CX(760),  y:CY(663), w:CX(110), h:CY(66) },
    { x:CX(880),  y:CY(663), w:CX(110), h:CY(66) },
    { x:CX(1000), y:CY(663), w:CX(110), h:CY(66) },
    { x:CX(1120), y:CY(663), w:CX(110), h:CY(66) },
    { x:CX(1240), y:CY(663), w:CX(110), h:CY(66) }
  ],

  // FreeComment
  freeComment:{ x:CX(31),   y:CY(985), w:CX(1529),h:CY(167) },

  // User Icon
  userIcon:   { x:CX(13),   y:CY(208), w:CX(397), h:CY(397) }
};


// ===================================================
// CLASSIC 各アイコンのマッピング
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

// PlayStyle は共通アイコン1種
const PS_ICON = "icons2/ps.png";


// ===================================================
// UI 要素
// ===================================================
const canvas = document.getElementById("cardCanvas");
const ctx = canvas.getContext("2d");

const designSelect = document.getElementById("designSelect");
const formSimple  = document.getElementById("formSimple");
const formClassic = document.getElementById("formClassic");

const btnDownload = document.getElementById("btnDownload");


// ===================================================
// デザイン切替
// ===================================================
designSelect.addEventListener("change", ()=>{
  const d = designSelect.value;

  if (d === "simple") {
    formSimple.classList.remove("hide");
    formClassic.classList.add("hide");
  } else {
    formSimple.classList.add("hide");
    formClassic.classList.remove("hide");
  }

  drawPreview(); // 再描画
});


// ===================================================
// ファイル読込（simple / classic 共通）
// ===================================================
let userIcon_s = null;
let freePhoto_s = null;

let userIcon_c = null;

function loadImageFile(file, callback){
  if (!file){
    callback(null);
    return;
  }
  const reader = new FileReader();
  reader.onload = e=>{
    const img = new Image();
    img.onload = ()=> callback(img);
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// simple
document.getElementById("fileIcon_s").onchange = e=>{
  loadImageFile(e.target.files[0], img=>{ userIcon_s = img; drawPreview(); });
};
document.getElementById("fileFree_s").onchange = e=>{
  loadImageFile(e.target.files[0], img=>{ freePhoto_s = img; drawPreview(); });
};

// classic（freePhotoなし）
document.getElementById("fileIcon_c").onchange = e=>{
  loadImageFile(e.target.files[0], img=>{ userIcon_c = img; drawPreview(); });
};


// ===================================================
// ボタン（描画）
// ===================================================
document.querySelectorAll(".btnRender").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    drawPreview();
  });
});


// ===================================================
// 描画メイン
// ===================================================
async function drawPreview(){

  const design = designSelect.value;

  // 背景を読み込む
  const bgPath = (design === "simple") ? SIMPLE_BASE : CLASSIC_BASE;
  const bg = await loadImagePromise(bgPath);

  // キャンバス初期化
  canvas.width  = CANVAS_W;
  canvas.height = CANVAS_H;
  ctx.clearRect(0,0,CANVAS_W,CANVAS_H);

  // -------------------------------------------------
  // 背景描画
  // -------------------------------------------------
  if (design === "simple") {
    ctx.drawImage(bg, 0,0, CANVAS_W, CANVAS_H);
  } else {
    // classic → 横幅フィット
    const drawW = CANVAS_W;
    const drawH = Math.round(1200 * (CANVAS_W / 1600)); // 約933
    ctx.drawImage(bg, 0, 0, drawW, drawH);
  }


  // -------------------------------------------------
  // simple モード
  // -------------------------------------------------
  if (design === "simple") {

    const C = CONFIG_SIMPLE;

    // FreePhoto
    if (freePhoto_s){
      drawImageCover(ctx, freePhoto_s, C.freePhoto.x, C.freePhoto.y, C.freePhoto.w, C.freePhoto.h);
    }

    // User Icon
    if (userIcon_s){
      drawImageCover(ctx, userIcon_s, C.userIcon.x, C.userIcon.y, C.userIcon.w, C.userIcon.h);
    }

    // Class（check.png）
    const classChecks = [...document.querySelectorAll('#classList_s input[type=checkbox]')];
    for (let i=0; i<classChecks.length; i++){
      if (classChecks[i].checked && C.classChecks[i]){
        drawCheckMark(C.classChecks[i]);
      }
    }

    // VC（check.png）
    const vcChecks = [...document.querySelectorAll('#vcList_s input[type=checkbox]')];
    for (let i=0; i<vcChecks.length; i++){
      if (vcChecks[i].checked && C.vcChecks[i]){
        drawCheckMark(C.vcChecks[i]);
      }
    }

    // テキスト各種
    drawCenteredText(inpValue("inpName_s"),      C.name);
    drawCenteredText(inpValue("inpPlayerId_s"),  C.playerId);
    drawCenteredText(inpValue("inpGuild_s"),     C.guild);
    drawCenteredText(inpValue("inpPlayStyle_s"), C.playStyle);
    drawCenteredText(inpValue("inpPlayTime_s"),  C.playTime);

    drawWrappedText(inpValue("inpComment_s"), C.freeComment);
  }

  // -------------------------------------------------
  // classic モード
  // -------------------------------------------------
  else {

    const C = CONFIG_CLASSIC;

    // User Icon
    if (userIcon_c){
      drawImageCover(ctx, userIcon_c, C.userIcon.x, C.userIcon.y, C.userIcon.w, C.userIcon.h);
    }

    // ----- CLASS 最大3 -----
    const classBoxes = [...document.querySelectorAll('#classList_c input[type=checkbox]')]
      .filter(cb=>cb.checked)
      .map(cb=> CLASS_ICON_MAP[cb.value])
      .slice(0,3);

    drawIconArray(classBoxes, C.classFrame);

    // ----- VC 最大2 -----
    const vcBoxes = [...document.querySelectorAll('#vcList_c input[type=checkbox]')]
      .filter(cb=>cb.checked)
      .map(cb=> VC_ICON_MAP[cb.value])
      .slice(0,2);

    for (let i=0; i<vcBoxes.length; i++){
      const frame = C.vcFrames[i];
      drawIcon(vcBoxes[i], frame);
    }

    // ----- PlayTime 最大3 -----
    const ptBoxes = [...document.querySelectorAll('#ptList_c input[type=checkbox]')]
      .filter(cb=>cb.checked)
      .map(cb=> PT_ICON_MAP[cb.value])
      .slice(0,3);

    for (let i=0; i<ptBoxes.length; i++){
      const frame = C.ptFrames[i];
      drawIcon(ptBoxes[i], frame);
    }

    // ----- PlayStyle 1 -----
    const psVal = document.querySelector('input[name="ps_c"]:checked');
    if (psVal){
      const idx = Number(psVal.value) - 1; // 0〜4
      const frame = C.psFrames[idx];
      drawIcon(PS_ICON, frame);
    }

    // ----- テキスト -----
    drawCenteredText(inpValue("inpName_c"),     C.name);
    drawCenteredText(inpValue("inpPlayerId_c"), C.playerId);
    drawCenteredText(inpValue("inpGuild_c"),    C.guild);

    drawWrappedText(inpValue("inpComment_c"), C.freeComment);
  }

}

// ===================================================
// 共通：テキスト処理
// ===================================================
function inpValue(id){ return document.getElementById(id).value.trim(); }

function drawCenteredText(text, box){
  if (!text) return;

  const padX = 12;
  const padY = 8;
  const maxW = box.w - padX*2;
  const maxH = box.h - padY*2;

  let size = Math.min(60, maxH);
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  while (size > 12){
    ctx.font = size + "px 'Noto Sans JP', sans-serif";
    if (ctx.measureText(text).width <= maxW) break;
    size--;
  }

  ctx.fillStyle = "#fff";
  const cx = box.x + box.w/2;
  const cy = box.y + box.h/2;
  ctx.fillText(text, cx, cy);
}


function drawWrappedText(text, box){
  if (!text) return;

  const padX = 12;
  const padY = 8;
  const maxW = box.w - padX*2;
  const maxH = box.h - padY*2;

  ctx.textBaseline = "top";
  ctx.textAlign = "left";

  let size = 28;
  while (size > 10){
    ctx.font = size + "px 'Noto Sans JP', sans-serif";
    const lines = wrapText(text, maxW);
    if (lines.length * (size + 6) <= maxH) break;
    size--;
  }

  ctx.fillStyle = "#fff";
  const lines = wrapText(text, maxW);
  let y = box.y + padY;
  const x = box.x + padX;

  lines.forEach(line=>{
    ctx.fillText(line, x, y);
    y += (size + 6);
  });
}

function wrapText(text, maxW){
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";

  for (const w of words){
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW && line){
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}


// ===================================================
// 共通：画像描画
// ===================================================
function drawImageCover(ctx, img, x, y, w, h){
  const iw = img.width;
  const ih = img.height;

  const boxRatio = w / h;
  const imgRatio = iw / ih;

  let sx, sy, sw, sh;
  if (imgRatio > boxRatio){
    sh = ih;
    sw = sh * boxRatio;
    sx = (iw - sw)/2;
    sy = 0;
  } else {
    sw = iw;
    sh = sw / boxRatio;
    sx = 0;
    sy = (ih - sh)/2;
  }

  ctx.drawImage(img, sx,sy, sw,sh, x,y, w,h);
}

async function drawIcon(path, frame){
  if (!path) return;
  const img = await loadImagePromise(path);
  if (!img) return;

  const size = Math.min(frame.w, frame.h);
  const cx = frame.x + frame.w/2 - size/2;
  const cy = frame.y + frame.h/2 - size/2;

  ctx.drawImage(img, cx, cy, size, size);
}

// Class の場合：複数を1つの長い枠に均等配置
async function drawIconArray(paths, frame){
  const n = paths.length;
  if (n === 0) return;

  const perW = frame.w / n;

  for (let i=0; i<n; i++){
    const img = await loadImagePromise(paths[i]);
    if (!img) continue;

    const size = Math.min(perW*0.8, frame.h*0.8);
    const cx = frame.x + perW*i + perW/2 - size/2;
    const cy = frame.y + frame.h/2 - size/2;

    ctx.drawImage(img, cx, cy, size, size);
  }
}


// ===================================================
// チェックマーク（simple 用）
// ===================================================
let checkImg = null;
loadImagePromise("check.png").then(img=> checkImg = img);

function drawCheckMark(rect){
  if (!checkImg) return;
  const size = Math.min(rect.w, rect.h) - 4;
  const cx = rect.x + rect.w/2 - size/2;
  const cy = rect.y + rect.h/2 - size/2;
  ctx.drawImage(checkImg, cx, cy, size, size);
}


// ===================================================
// 画像読み込み Promise 化
// ===================================================
function loadImagePromise(src){
  return new Promise(resolve=>{
    const img = new Image();
    img.onload  = ()=> resolve(img);
    img.onerror = ()=> resolve(null);
    img.src = src;
  });
}


// ===================================================
// DL
// ===================================================
btnDownload.onclick = ()=>{
  drawPreview();
  const link = document.createElement("a");
  link.download = "STAR_RESONANCE_ID.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};


// 初期描画
drawPreview();
