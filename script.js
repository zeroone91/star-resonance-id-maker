// script.js - STAR RESONANCE ID MAKER (simple / classic)

const CANVAS_W = 1244;
const CANVAS_H = 1904;

// ---------- simple CONFIG (card_base_simple 1244x1904) ----------
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

  basePath:  "base_simple.png",
  checkPath: "check.png"
};

// ---------- classic CONFIG (base_classic 1600x1200 → 等比縮小で横フィット) ----------
const scaleX = CANVAS_W / 1600;
const CX = px => Math.round(px * scaleX);
const CY = px => Math.round(px * scaleX);

const CONFIG_CLASSIC = {
  canvasW: CANVAS_W,
  canvasH: CANVAS_H,
  basePath: "base_classic.png",

  name:       { x:CX(760),  y:CY(189), w:CX(766), h:CY(112) },
  playerId:   { x:CX(760),  y:CY(333), w:CX(766), h:CY(112) },
  guild:      { x:CX(760),  y:CY(475), w:CX(766), h:CY(112) },

  classFrame: { x:CX(13),   y:CY(624), w:CX(397), h:CY(127) },

  vcFrames: [
    { x:CX(441),  y:CY(758), w:CX(118), h:CY(118) },
    { x:CX(611),  y:CY(758), w:CX(118), h:CY(118) }
  ],

  ptFrames: [
    { x:CX(1160), y:CY(758), w:CX(118), h:CY(118) },
    { x:CX(1299), y:CY(758), w:CX(118), h:CY(118) },
    { x:CX(1440), y:CY(758), w:CX(118), h:CY(118) }
  ],

  // PlayStyle 5段階（sample_classic の赤枠から取得）
  psFrames: [
    { x:CX(817),  y:CY(663), w:CX(66), h:CY(66) }, // 1
    { x:CX(962),  y:CY(663), w:CX(66), h:CY(66) }, // 2
    { x:CX(1125), y:CY(663), w:CX(66), h:CY(66) }, // 3
    { x:CX(1288), y:CY(663), w:CX(66), h:CY(66) }, // 4
    { x:CX(1450), y:CY(663), w:CX(66), h:CY(66) }  // 5
  ],

  freeComment:{ x:CX(32),  y:CY(985), w:CX(1528), h:CY(167) },

  userIcon:   { x:CX(13),  y:CY(208), w:CX(397), h:CY(397) }
};

// ---------- アイコンパス ----------
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

// ---------- フォント設定 ----------
const FONT_MAP = {
  "A": "'Noto Sans JP', sans-serif",          // かっこいい系
  "B": "'Yusei Magic', cursive",             // かわいい系
  "C": "'DotGothic16', sans-serif",          // ゲーム系
  "D": "'M PLUS Rounded 1c', sans-serif"     // おしゃれ系
};

// =====================================================
// DOM 取得
// =====================================================
const canvas = document.getElementById("cardCanvas");
const ctx     = canvas.getContext("2d");

const designSelect = document.getElementById("designSelect");
const formSimple   = document.getElementById("formSimple");
const formClassic  = document.getElementById("formClassic");

// simple inputs
const inpName_s      = document.getElementById("inpName_s");
const inpPlayerId_s  = document.getElementById("inpPlayerId_s");
const inpGuild_s     = document.getElementById("inpGuild_s");
const inpPlayStyle_s = document.getElementById("inpPlayStyle_s");
const inpPlayTime_s  = document.getElementById("inpPlayTime_s");
const inpComment_s   = document.getElementById("inpComment_s");
const fileIcon_s     = document.getElementById("fileIcon_s");
const fileFree_s     = document.getElementById("fileFree_s");

// classic inputs
const inpName_c      = document.getElementById("inpName_c");
const inpPlayerId_c  = document.getElementById("inpPlayerId_c");
const inpGuild_c     = document.getElementById("inpGuild_c");
const inpComment_c   = document.getElementById("inpComment_c");
const fileIcon_c     = document.getElementById("fileIcon_c");

// buttons
const btnRender   = document.getElementById("btnRender");
const btnDownload = document.getElementById("btnDownload");
const btnShareX   = document.getElementById("btnShareX");

// =====================================================
// 画像キャッシュ / ローダ
// =====================================================
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

fileIcon_s?.addEventListener("change", e => {
  readImageFile(e.target.files[0], img => { userIconImg_simple = img; drawPreview(); });
});
fileFree_s?.addEventListener("change", e => {
  readImageFile(e.target.files[0], img => { freePhotoImg_simple = img; drawPreview(); });
});
fileIcon_c?.addEventListener("change", e => {
  readImageFile(e.target.files[0], img => { userIconImg_classic = img; drawPreview(); });
});

// =====================================================
// デザイン切替
// =====================================================
designSelect.addEventListener("change", () => {
  const d = designSelect.value;
  if (d === "classic") {
    formSimple.classList.add("hide");
    formClassic.classList.remove("hide");
  } else {
    formSimple.classList.remove("hide");
    formClassic.classList.add("hide");
  }
  drawPreview();
});

// =====================================================
// ボタン
// =====================================================
btnRender.addEventListener("click", () => {
  drawPreview();
});

btnDownload.addEventListener("click", async () => {
  await drawPreview();
  const a = document.createElement("a");
  a.download = "STAR_RESONANCE_ID.png";
  a.href = canvas.toDataURL("image/png");
  a.click();
});

btnShareX.addEventListener("click", () => {
  const tweet =
    "(下記ハッシュタグは消さずに保存した画像を添付して使用してね)\n" +
    "　\n" +
    "#スタレゾ #スタレゾ自己紹介カード\n" +
    "作成はコチラから👇\n" +
    "https://zeroone91.github.io/star-resonance-id-maker/";
  const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweet);
  window.open(url, "_blank");
});

// =====================================================
// メイン描画
// =====================================================
async function drawPreview() {
  const design = designSelect.value;

  canvas.width  = CANVAS_W;
  canvas.height = CANVAS_H;
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  if (design === "classic") {
    await drawClassic();
  } else {
    await drawSimple();
  }
}

// ---------- simple 描画 ----------
async function drawSimple() {
  const C = CONFIG_SIMPLE;

  const baseImg = await loadImage(C.basePath);
  if (baseImg) {
    ctx.drawImage(baseImg, 0, 0, C.canvasW, C.canvasH);
  }

  if (freePhotoImg_simple) {
    drawImageCover(freePhotoImg_simple, C.freePhoto);
  }
  if (userIconImg_simple) {
    drawImageCover(userIconImg_simple, C.userIcon);
  }

  const checkImg = await loadImage(C.checkPath);

  const classCheckboxes = Array.from(document.querySelectorAll('#classList_s input[type="checkbox"]'));
  classCheckboxes.forEach((cb, idx) => {
    if (cb.checked && C.classChecks[idx]) drawCheckAt(C.classChecks[idx], checkImg);
  });

  const vcCheckboxes = Array.from(document.querySelectorAll('#vcList_s input[type="checkbox"]'));
  vcCheckboxes.forEach((cb, idx) => {
    if (cb.checked && C.vcChecks[idx]) drawCheckAt(C.vcChecks[idx], checkImg);
  });

  const fontKey  = document.querySelector('input[name="font_s"]:checked')?.value || "A";
  const font     = FONT_MAP[fontKey] || FONT_MAP["A"];
  const colorKey = document.querySelector('input[name="color_s"]:checked')?.value || "black";
  const color    = resolveColor(colorKey);

  drawAutoCenteredText(inpName_s.value.trim(),      C.name,      font, color);
  drawAutoCenteredText(inpPlayerId_s.value.trim(),  C.playerId,  font, color);
  drawAutoCenteredText(inpGuild_s.value.trim(),     C.guild,     font, color);
  drawAutoCenteredText(inpPlayStyle_s.value.trim(), C.playStyle, font, color);
  drawAutoCenteredText(inpPlayTime_s.value.trim(),  C.playTime,  font, color);
  drawAutoWrappedLeftText(inpComment_s.value.trim(), C.freeComment, font, color);
}

// ---------- classic 描画 ----------
async function drawClassic() {
  const C = CONFIG_CLASSIC;

  const baseImg = await loadImage(C.basePath);
  if (baseImg) {
    const drawW = CANVAS_W;
    const drawH = Math.round(1200 * scaleX); // 1600x1200 → 横フィット・縦は黒余白
    ctx.drawImage(baseImg, 0, 0, drawW, drawH);
  }

  if (userIconImg_classic) {
    drawImageCover(userIconImg_classic, C.userIcon);
  }

  // Class 最大3つ
  const classIcons = Array.from(document.querySelectorAll('#classList_c input[type="checkbox"]'))
    .filter(cb => cb.checked)
    .map(cb => CLASS_ICON_MAP[cb.value])
    .filter(Boolean)
    .slice(0, 3);
  await drawIconArray(classIcons, C.classFrame);

  // VC 最大2つ
  const vcIcons = Array.from(document.querySelectorAll('#vcList_c input[type="checkbox"]'))
    .filter(cb => cb.checked)
    .map(cb => VC_ICON_MAP[cb.value])
    .filter(Boolean)
    .slice(0, 2);
  for (let i = 0; i < vcIcons.length; i++) {
    await drawIcon(vcIcons[i], C.vcFrames[i]);
  }

  // PlayTime 最大3つ
  const ptIcons = Array.from(document.querySelectorAll('#ptList_c input[type="checkbox"]'))
    .filter(cb => cb.checked)
    .map(cb => PT_ICON_MAP[cb.value])
    .filter(Boolean)
    .slice(0, 3);
  for (let i = 0; i < ptIcons.length; i++) {
    await drawIcon(ptIcons[i], C.ptFrames[i]);
  }

  // PlayStyle 5段階
  const psChecked = document.querySelector('input[name="ps_c"]:checked');
  if (psChecked) {
    const idx = Number(psChecked.value) - 1;
    if (idx >= 0 && idx < C.psFrames.length) {
      await drawIcon(PS_ICON_PATH, C.psFrames[idx]);
    }
  }

  const fontKey  = document.querySelector('input[name="font_c"]:checked')?.value || "A";
  const font     = FONT_MAP[fontKey] || FONT_MAP["A"];
  const colorKey = document.querySelector('input[name="color_c"]:checked')?.value || "white";
  const color    = resolveColor(colorKey);

  drawAutoCenteredText(inpName_c.value.trim(),     C.name,     font, color);
  drawAutoCenteredText(inpPlayerId_c.value.trim(), C.playerId, font, color);
  drawAutoCenteredText(inpGuild_c.value.trim(),    C.guild,    font, color);
  drawAutoWrappedLeftText(inpComment_c.value.trim(), C.freeComment, font, color);
}

// =====================================================
// 描画ヘルパー
// =====================================================
function resolveColor(key) {
  switch (key) {
    case "blue":  return "#3b82f6";
    case "red":   return "#ef4444";
    case "pink":  return "#ec4899";
    case "green": return "#22c55e";
    case "white": return "#ffffff";
    case "black":
    default:      return "#000000";
  }
}

function drawImageCover(img, box) {
  const iw = img.width;
  const ih = img.height;
  const boxRatio = box.w / box.h;
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

  ctx.drawImage(img, sx, sy, sw, sh, box.x, box.y, box.w, box.h);
}

async function drawIcon(path, box) {
  const img = await loadImage(path);
  if (!img) return;
  const size = Math.min(box.w, box.h);
  const x = box.x + (box.w - size) / 2;
  const y = box.y + (box.h - size) / 2;
  ctx.drawImage(img, x, y, size, size);
}

async function drawIconArray(paths, frame) {
  const n = paths.length;
  if (!n) return;

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

function drawCheckAt(rect, checkImg) {
  if (!checkImg) return;
  const size = Math.min(rect.w, rect.h) - 4;
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  ctx.drawImage(checkImg, cx - size / 2, cy - size / 2, size, size);
}

function drawAutoCenteredText(text, box, fontFamily, colorHex) {
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

function drawAutoWrappedLeftText(text, box, fontFamily, colorHex) {
  if (!text) return;

  const padX = 12;
  const padY = 8;
  const maxW = box.w - padX * 2;
  const maxH = box.h - padY * 2;

  text = text.replace(/\r/g, "").trim();

  let size = 32;
  ctx.textBaseline = "top";
  ctx.textAlign = "left";

  while (size > 8) {
    ctx.font = size + "px " + fontFamily;
    const lines = wrapText(text, maxW);
    if (lines.length * (size + 6) <= maxH) break;
    size--;
  }

  ctx.fillStyle = colorHex;
  const lines = wrapText(text, maxW);
  let y = box.y + padY;

  for (const line of lines) {
    ctx.fillText(line, box.x + padX, y);
    y += size + 6;
  }
}

function wrapText(text, maxW) {
  const words = text.split(/(\s+)/);
  const lines = [];
  let line = "";

  for (const w of words) {
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

// ==============================
// Discordバナー ランダム表示
// ==============================

// ▼ バナー画像のファイル名（GitHub Pages に置いたもの）
const banners = [
  "banner1.png",
  "banner2.png"
];

// ▼ ランダム選択して表示
function showRandomBanner() {
  const banner = banners[Math.floor(Math.random() * banners.length)];
  const img = document.getElementById("randomBanner");

  img.src = banner;

  // 表示時に幅をプレビューと揃える（CSSで自動調整される）
  img.style.maxWidth = "100%";
  img.style.height = "auto";
}

// ページ読み込み時
window.addEventListener("load", showRandomBanner);


// 初期表示
drawPreview();
