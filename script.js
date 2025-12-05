// script.js  (simple / classic 両対応版)

// ===============================
//  共通設定
// ===============================
const CANVAS_W = 1244;
const CANVAS_H = 1904;

// simple デザイン（従来）の枠情報
const CONFIG_SIMPLE = {
  canvasW: CANVAS_W,
  canvasH: CANVAS_H,

  /* ▼ テキスト枠 ▼ */
  name:       { x:417, y:280,  w:732, h:94  },
  playerId:   { x:420, y:460,  w:729, h:87  },
  guild:      { x:66,  y:932,  w:618, h:74  },
  playStyle:  { x:70,  y:1097, w:616, h:66  },
  playTime:   { x:724, y:1095, w:456, h:67  },
  freeComment:{ x:70,  y:1242, w:1106,h:120 },

  /* ▼ 画像枠 ▼ */
  userIcon:   { x:60,  y:213,  w:324, h:324 },
  freePhoto:  { x:387, y:1397, w:776, h:434 },

  /* ▼ チェックマーク枠 ▼ */
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

  basePath:  "base_simple.png",   // ★ リネーム後の simple 背景
  checkPath: "check.png"
};

// ===============================
// classic デザインの枠情報
// （sample_classic.png 解析済み）
// ===============================
const scaleX = CANVAS_W / 1600; // base_classic.png が 1600x1200 想定
const CX = px => Math.round(px * scaleX);
const CY = px => Math.round(px * scaleX);

const CONFIG_CLASSIC = {
  canvasW: CANVAS_W,
  canvasH: CANVAS_H,

  basePath: "base_classic.png",

  // テキスト枠
  name:       { x:CX(760),  y:CY(189), w:CX(766), h:CY(112) },
  playerId:   { x:CX(760),  y:CY(333), w:CX(766), h:CY(112) },
  guild:      { x:CX(760),  y:CY(475), w:CX(766), h:CY(112) },

  // Class 用の横長枠（最大3つ）
  classFrame: { x:CX(13),  y:CY(624), w:CX(397), h:CY(127) },

  // VC 最大2つ
  vcFrames: [
    { x:CX(441), y:CY(757), w:CX(118), h:CY(118) },
    { x:CX(611), y:CY(757), w:CX(118), h:CY(118) }
  ],

  // PlayTime 最大3つ（左から順）
  ptFrames: [
    { x:CX(1159), y:CY(757), w:CX(118), h:CY(118) },
    { x:CX(1299), y:CY(757), w:CX(118), h:CY(118) },
    { x:CX(1440), y:CY(757), w:CX(118), h:CY(118) }
  ],

  // PlayStyle 5段階
  psFrames: [
    { x:CX(760),  y:CY(663), w:CX(110), h:CY(66) },
    { x:CX(880),  y:CY(663), w:CX(110), h:CY(66) },
    { x:CX(1000), y:CY(663), w:CX(110), h:CY(66) },
    { x:CX(1120), y:CY(663), w:CX(110), h:CY(66) },
    { x:CX(1240), y:CY(663), w:CX(110), h:CY(66) }
  ],

  // コメント枠
  freeComment:{ x:CX(31),  y:CY(985), w:CX(1529), h:CY(167) },

  // アイコン
  userIcon:   { x:CX(13),  y:CY(208), w:CX(397), h:CY(397) }
};

// ===============================
//  アイコンパス
// ===============================
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

const PS_ICON_PATH = "icons2/ps.png";

// ===============================
//  simple 用フォント
// ===============================
const FONT_MAP = {
  "A": "'Noto Sans JP', sans-serif",
  "B": "'Yusei Magic', sans-serif",
  "C": "'DotGothic16', sans-serif",
  "D": "'M PLUS Rounded 1c', sans-serif"
};

// ===============================
//  DOM
// ===============================
const canvas     = document.getElementById("cardCanvas");
const ctx        = canvas.getContext("2d");

const designSelect = document.getElementById("designSelect");

// simple フォーム
const inpName      = document.getElementById("inpName");
const inpPlayerId  = document.getElementById("inpPlayerId");
const inpGuild     = document.getElementById("inpGuild");
const inpPlayStyle = document.getElementById("inpPlayStyle");
const inpPlayTime  = document.getElementById("inpPlayTime");
const inpComment   = document.getElementById("inpComment");

const fileIcon = document.getElementById("fileIcon");
const fileFree = document.getElementById("fileFree");

// ボタン（共通）
const btnRender   = document.getElementById("btnRender");
const btnDownload = document.getElementById("btnDownload");
const btnShareX   = document.getElementById("btnShareX");

// classic フォーム
const inpName_c      = document.getElementById("inpName_c");
const inpPlayerId_c  = document.getElementById("inpPlayerId_c");
const inpGuild_c     = document.getElementById("inpGuild_c");
const inpComment_c   = document.getElementById("inpComment_c");
const fileIcon_c     = document.getElementById("fileIcon_c");

// simple / classic フォームコンテナ
const formSimple  = document.getElementById("formSimple");
const formClassic = document.getElementById("formClassic");

// ===============================
//  画像キャッシュ
// ===============================
const imageCache = {};
function loadImage(src) {
  if (!src) return Promise.resolve(null);
  if (imageCache[src]) return imageCache[src];
  imageCache[src] = new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
  return imageCache[src];
}

// ユーザーアップロード画像
let userIconImg_simple = null;
let freePhotoImg_simple = null;
let userIconImg_classic = null;

// ===============================
//  ファイル入力イベント
// ===============================
fileIcon?.addEventListener("change", e => {
  readImageFile(e.target.files[0], img => { userIconImg_simple = img; drawPreview(); });
});
fileFree?.addEventListener("change", e => {
  readImageFile(e.target.files[0], img => { freePhotoImg_simple = img; drawPreview(); });
});
fileIcon_c?.addEventListener("change", e => {
  readImageFile(e.target.files[0], img => { userIconImg_classic = img; drawPreview(); });
});

// ===============================
//  デザイン切替
// ===============================
designSelect?.addEventListener("change", () => {
  const d = designSelect.value;
  if (d === "classic") {
    formSimple?.classList.add("hide");
    formClassic?.classList.remove("hide");
  } else {
    formSimple?.classList.remove("hide");
    formClassic?.classList.add("hide");
  }
  drawPreview();
});

// ===============================
//  ボタン
// ===============================
btnRender?.addEventListener("click", () => { drawPreview(); });

btnDownload?.addEventListener("click", () => { downloadPNG(); });

btnShareX?.addEventListener("click", () => {
  const tweet =
    "(下記ハッシュタグは消さずに保存した画像を添付して使用してね)\n" +
    "　\n" +
    "#スタレゾ #スタレゾ自己紹介カード\n" +
    "作成はコチラから👇\n" +
    "https://zeroone91.github.io/star-resonance-id-maker/";

  const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweet);
  window.open(url, "_blank");
});

// ===============================
//  メイン描画
// ===============================
async function drawPreview() {
  const design = designSelect ? designSelect.value : "simple";

  canvas.width  = CANVAS_W;
  canvas.height = CANVAS_H;
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  if (design === "classic") {
    await drawClassic();
  } else {
    await drawSimple();
  }
}

// -------------------------------
//  simple 描画
// -------------------------------
async function drawSimple() {
  const C = CONFIG_SIMPLE;

  // 背景
  const baseImg = await loadImage(C.basePath);
  if (baseImg) {
    ctx.drawImage(baseImg, 0, 0, C.canvasW, C.canvasH);
  }

  // フリーフォト
  if (freePhotoImg_simple) {
    drawImageCover(ctx, freePhotoImg_simple, C.freePhoto.x, C.freePhoto.y, C.freePhoto.w, C.freePhoto.h);
  }

  // アイコン
  if (userIconImg_simple) {
    drawImageCover(ctx, userIconImg_simple, C.userIcon.x, C.userIcon.y, C.userIcon.w, C.userIcon.h);
  }

  // チェックマーク画像
  const checkImg = await loadImage(C.checkPath);

  // Class チェック
  const classCheckboxes = Array.from(document.querySelectorAll('#classList input[type="checkbox"]'));
  classCheckboxes.forEach((cb, idx) => {
    if (cb.checked && C.classChecks[idx]) {
      drawCheckAt(ctx, C.classChecks[idx], checkImg);
    }
  });

  // VC チェック
  const vcCheckboxes = Array.from(document.querySelectorAll('#vcList input[type="checkbox"]'));
  vcCheckboxes.forEach((cb, idx) => {
    if (cb.checked && C.vcChecks[idx]) {
      drawCheckAt(ctx, C.vcChecks[idx], checkImg);
    }
  });

  // フォント & 文字色
  const fontVal    = document.querySelector('input[name="font"]:checked')?.value || "A";
  const fontFamily = FONT_MAP[fontVal] || FONT_MAP["A"];
  const colorHex   = document.querySelector('input[name="color"]:checked')?.value || "#000000";

  // テキスト
  drawAutoCenteredText(ctx, inpName.value.trim(),      C.name,      fontFamily, colorHex);
  drawAutoCenteredText(ctx, inpPlayerId.value.trim(),  C.playerId,  fontFamily, colorHex);
  drawAutoCenteredText(ctx, inpGuild.value.trim(),     C.guild,     fontFamily, colorHex);
  drawAutoCenteredText(ctx, inpPlayStyle.value.trim(), C.playStyle, fontFamily, colorHex);
  drawAutoCenteredText(ctx, inpPlayTime.value.trim(),  C.playTime,  fontFamily, colorHex);

  // フリーコメント
  drawAutoWrappedLeftText(ctx, inpComment.value.trim(), C.freeComment, fontFamily, colorHex);
}

// -------------------------------
//  classic 描画
// -------------------------------
async function drawClassic() {
  const C = CONFIG_CLASSIC;

  // 背景（横幅フィット）
  const baseImg = await loadImage(C.basePath);
  if (baseImg) {
    const drawW = CANVAS_W;
    const drawH = Math.round(1200 * (CANVAS_W / 1600));
    ctx.drawImage(baseImg, 0, 0, drawW, drawH);
  }

  // アイコン
  if (userIconImg_classic) {
    drawImageCover(ctx, userIconImg_classic, C.userIcon.x, C.userIcon.y, C.userIcon.w, C.userIcon.h);
  }

  // Class 最大3つ
  const classChecks = Array
    .from(document.querySelectorAll('#classList_c input[type="checkbox"]'))
    .filter(cb => cb.checked)
    .map(cb => CLASS_ICON_MAP[cb.value])
    .filter(Boolean)
    .slice(0, 3);
  await drawIconArray(classChecks, C.classFrame);

  // VC 最大2つ
  const vcChecks = Array
    .from(document.querySelectorAll('#vcList_c input[type="checkbox"]'))
    .filter(cb => cb.checked)
    .map(cb => VC_ICON_MAP[cb.value])
    .filter(Boolean)
    .slice(0, 2);
  for (let i = 0; i < vcChecks.length; i++) {
    await drawIcon(vcChecks[i], C.vcFrames[i]);
  }

  // PlayTime 最大3つ
  const ptChecks = Array
    .from(document.querySelectorAll('#ptList_c input[type="checkbox"]'))
    .filter(cb => cb.checked)
    .map(cb => PT_ICON_MAP[cb.value])
    .filter(Boolean)
    .slice(0, 3);
  for (let i = 0; i < ptChecks.length; i++) {
    await drawIcon(ptChecks[i], C.ptFrames[i]);
  }

  // PlayStyle（1つだけ）
  const psChecked = document.querySelector('input[name="ps_c"]:checked');
  if (psChecked) {
    const idx = Number(psChecked.value) - 1;
    if (idx >= 0 && idx < C.psFrames.length) {
      await drawIcon(PS_ICON_PATH, C.psFrames[idx]);
    }
  }

  // テキスト（classic は Noto Sans + 白固定）
  const fontFamily = FONT_MAP["A"];
  const colorHex   = "#ffffff";

  drawAutoCenteredText(ctx, inpName_c.value.trim(),     C.name,      fontFamily, colorHex);
  drawAutoCenteredText(ctx, inpPlayerId_c.value.trim(), C.playerId,  fontFamily, colorHex);
  drawAutoCenteredText(ctx, inpGuild_c.value.trim(),    C.guild,     fontFamily, colorHex);
  drawAutoWrappedLeftText(ctx, inpComment_c.value.trim(), C.freeComment, fontFamily, colorHex);
}

// ===============================
//  画像・テキスト描画ヘルパー
// ===============================
function readImageFile(file, cb) {
  if (!file) { cb(null); return; }
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => cb(img);
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function drawImageCover(ctx, img, x, y, w, h) {
  const iw = img.width;
  const ih = img.height;
  const boxRatio = w / h;
  const imgRatio = iw / ih;

  let sx, sy, sw, sh;

  if (imgRatio > boxRatio) {
    sh = ih;
    sw = sh * boxRatio;
    sx = (iw - sw) / 2;
    sy = 0;
  } else {
    sw = iw;
    sh = sw / boxRatio;
    sx = 0;
    sy = (ih - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

async function drawIcon(path, frame) {
  const img = await loadImage(path);
  if (!img) return;

  const size = Math.min(frame.w, frame.h);
  const x = frame.x + (frame.w - size) / 2;
  const y = frame.y + (frame.h - size) / 2;

  ctx.drawImage(img, x, y, size, size);
}

async function drawIconArray(paths, frame) {
  const n = paths.length;
  if (n === 0) return;

  const perW = frame.w / n;
  for (let i = 0; i < n; i++) {
    const img = await loadImage(paths[i]);
    if (!img) continue;

    const size = Math.min(perW * 0.8, frame.h * 0.8);
    const x = frame.x + perW * i + (perW - size) / 2;
    const y = frame.y + (frame.h - size) / 2;
    ctx.drawImage(img, x, y, size, size);
  }
}

function drawCheckAt(ctx, rect, checkImg) {
  if (!checkImg) return;
  const size = Math.min(rect.w, rect.h) - 4;
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  ctx.drawImage(checkImg, cx - size/2, cy - size/2, size, size);
}

function drawAutoCenteredText(ctx, text, box, fontFamily, colorHex) {
  if (!text) return;

  const padX = 12;
  const padY = 8;
  const maxW = box.w - padX * 2;
  const maxH = box.h - padY * 2;

  let size = Math.min(64, maxH + 12);

  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  while (size > 8) {
    ctx.font = size + "px " + fontFamily;
    if (ctx.measureText(text).width <= maxW && size <= maxH + 8) break;
    size--;
  }

  ctx.fillStyle = colorHex;
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  ctx.fillText(text, cx, cy);
}

function drawAutoWrappedLeftText(ctx, text, box, fontFamily, colorHex) {
  if (!text) return;

  const padX = 12;
  const padY = 8;
  const maxW = box.w - padX * 2;
  const maxH = box.h - padY * 2;

  let size = 36;
  ctx.textBaseline = "top";
  ctx.textAlign = "left";

  text = text.replace(/\r/g, "").trim();

  while (size > 8) {
    ctx.font = size + "px " + fontFamily;
    const lines = wrapText(ctx, text, maxW);
    if (lines.length * (size + 6) <= maxH) break;
    size--;
  }

  ctx.fillStyle = colorHex;
  const lines = wrapText(ctx, text, maxW);
  let y = box.y + padY;

  for (const line of lines) {
    ctx.fillText(line, box.x + padX, y);
    y += size + 6;
  }
}

function wrapText(ctx, text, maxW) {
  const words = text.split(/(\s+)/);
  const lines = [];
  let line = "";

  for (const w of words) {
    const test = line + w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w.trim();
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// ===============================
//  PNG ダウンロード
// ===============================
async function downloadPNG() {
  await drawPreview();
  const link = document.createElement("a");
  link.download = "スタレゾ自己紹介カード.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// ===============================
//  初期描画
// ===============================
drawPreview();
