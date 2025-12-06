// script.js
// simple / classic 両対応版（simple の元仕様を維持したまま classic を追加）

// ===============================
//  共通
// ===============================
const CANVAS_W = 1244;
const CANVAS_H = 1904;

// -------------------------------
// simple（従来）カード用 CONFIG
// -------------------------------
const CONFIG_SIMPLE = {
  canvasW: CANVAS_W,
  canvasH: CANVAS_H,

  // テキスト枠
  name:       { x:417, y:280,  w:732, h:94  },
  playerId:   { x:420, y:460,  w:729, h:87  },
  guild:      { x:66,  y:932,  w:618, h:74  },
  playStyle:  { x:70,  y:1097, w:616, h:66  },
  playTime:   { x:724, y:1095, w:456, h:67  },
  freeComment:{ x:70,  y:1242, w:1106,h:120 },

  // 画像枠
  userIcon:   { x:60,  y:213,  w:324, h:324 },
  freePhoto:  { x:387, y:1397, w:776, h:434 },

  // チェック枠
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

// -------------------------------
// classic カード用 CONFIG
//   基準画像：1600x1200（sample_classic / base_classic）
// -------------------------------
const scaleX = CANVAS_W / 1600;        // 1244 / 1600
const CX = v => Math.round(v * scaleX);
const CY = v => Math.round(v * scaleX);

const CONFIG_CLASSIC = {
  canvasW: CANVAS_W,
  canvasH: CANVAS_H,

  basePath: "base_classic.png",

  // テキスト枠
  name:       { x: CX(760),  y: CY(189), w: CX(766), h: CY(112) },
  playerId:   { x: CX(760),  y: CY(333), w: CX(766), h: CY(112) },
  guild:      { x: CX(760),  y: CY(475), w: CX(766), h: CY(112) },

  // Class 全体枠（ここに最大3つ横並び）
  classFrame: { x: CX(13),   y: CY(624), w: CX(396), h: CY(127) },

  // Voice Chat（最大2つ）
  vcFrames: [
    { x: CX(441), y: CY(758), w: CX(118), h: CY(117) },
    { x: CX(611), y: CY(758), w: CX(117), h: CY(117) }
  ],

  // Play Time（最大3つ）
  ptFrames: [
    { x: CX(1160), y: CY(758), w: CX(117), h: CY(117) },
    { x: CX(1299), y: CY(758), w: CX(118), h: CY(117) },
    { x: CX(1440), y: CY(758), w: CX(118), h: CY(117) }
  ],

  // Play Style（5 段階）※sample_classic から再解析
  //  1〜5 の中心：
  //   (850,696) (1008,696) (1166,696) (1325,696) (1483,696)
  //  そこから 60x60 の枠を切って配置
  psFrames: [
    { x: CX(820),    y: CY(666), w: CX(60), h: CY(60) },      // 1
    { x: CX(978.25), y: CY(666), w: CX(60), h: CY(60) },      // 2
    { x: CX(1136.5), y: CY(666), w: CX(60), h: CY(60) },      // 3
    { x: CX(1294.75),y: CY(666), w: CX(60), h: CY(60) },      // 4
    { x: CX(1453),   y: CY(666), w: CX(60), h: CY(60) }       // 5
  ],

  // Free Comment
  freeComment:{ x: CX(32),   y: CY(985), w: CX(1528), h: CY(167) },

  // アイコン
  userIcon:   { x: CX(13),   y: CY(209), w: CX(396), h: CY(396) }
};

// ===============================
// アイコン画像マップ
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
// フォント設定
// ===============================
const FONT_MAP = {
  "A": "'Noto Sans JP', sans-serif",
  "B": "'Yusei Magic', sans-serif",
  "C": "'DotGothic16', sans-serif",
  "D": "'M PLUS Rounded 1c', sans-serif"
};

// ===============================
// DOM 取得
// ===============================
const canvas = document.getElementById("cardCanvas");
const ctx    = canvas.getContext("2d");

const designSelect = document.getElementById("designSelect");

// simple フォーム
const inpName      = document.getElementById("inpName");
const inpPlayerId  = document.getElementById("inpPlayerId");
const inpGuild     = document.getElementById("inpGuild");
const inpPlayStyle = document.getElementById("inpPlayStyle");
const inpPlayTime  = document.getElementById("inpPlayTime");
const inpComment   = document.getElementById("inpComment");
const fileIcon     = document.getElementById("fileIcon");
const fileFree     = document.getElementById("fileFree");

// classic フォーム
const inpName_c     = document.getElementById("inpName_c");
const inpPlayerId_c = document.getElementById("inpPlayerId_c");
const inpGuild_c    = document.getElementById("inpGuild_c");
const inpComment_c  = document.getElementById("inpComment_c");
const fileIcon_c    = document.getElementById("fileIcon_c");

// ラッパー（あれば切替に使う）
const formSimple  = document.getElementById("formSimple");
const formClassic = document.getElementById("formClassic");

// ボタン
const btnRender   = document.getElementById("btnRender");
const btnDownload = document.getElementById("btnDownload");
const btnShareX   = document.getElementById("btnShareX");

// ===============================
// 画像キャッシュ
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

// ユーザー画像
let userIconImg_simple  = null;
let freePhotoImg_simple = null;
let userIconImg_classic = null;

// ===============================
// ファイル入力
// ===============================
fileIcon && fileIcon.addEventListener("change", e => {
  readImageFile(e.target.files[0], img => {
    userIconImg_simple = img;
    drawPreview();
  });
});

fileFree && fileFree.addEventListener("change", e => {
  readImageFile(e.target.files[0], img => {
    freePhotoImg_simple = img;
    drawPreview();
  });
});

fileIcon_c && fileIcon_c.addEventListener("change", e => {
  readImageFile(e.target.files[0], img => {
    userIconImg_classic = img;
    drawPreview();
  });
});

// ===============================
// デザイン切替
// ===============================
function getCurrentDesign() {
  return designSelect ? designSelect.value : "simple";
}

designSelect && designSelect.addEventListener("change", () => {
  const d = getCurrentDesign();

  if (formSimple && formClassic) {
    formSimple.style.display  = (d === "simple")  ? "" : "none";
    formClassic.style.display = (d === "classic") ? "" : "none";
  }
  drawPreview();
});

// ===============================
// ボタンイベント
// ===============================
btnRender && btnRender.addEventListener("click", () => {
  drawPreview();
});

btnDownload && btnDownload.addEventListener("click", () => {
  downloadPNG();
});

btnShareX && btnShareX.addEventListener("click", () => {
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
// メイン描画
// ===============================
async function drawPreview() {
  const design = getCurrentDesign();

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
// simple 描画
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

  // チェックマーク
  const checkImg = await loadImage(C.checkPath);

  const classCheckboxes = Array.from(
    document.querySelectorAll('#classList input[type="checkbox"]')
  );
  classCheckboxes.forEach((cb, idx) => {
    if (cb.checked && C.classChecks[idx]) {
      drawCheckAt(ctx, C.classChecks[idx], checkImg);
    }
  });

  const vcCheckboxes = Array.from(
    document.querySelectorAll('#vcList input[type="checkbox"]')
  );
  vcCheckboxes.forEach((cb, idx) => {
    if (cb.checked && C.vcChecks[idx]) {
      drawCheckAt(ctx, C.vcChecks[idx], checkImg);
    }
  });

  const { fontFamily, colorHex } = getFontAndColor("simple");

  // テキスト
  drawAutoCenteredText(ctx, (inpName?.value || "").trim(),      C.name,      fontFamily, colorHex);
  drawAutoCenteredText(ctx, (inpPlayerId?.value || "").trim(),  C.playerId,  fontFamily, colorHex);
  drawAutoCenteredText(ctx, (inpGuild?.value || "").trim(),     C.guild,     fontFamily, colorHex);
  drawAutoCenteredText(ctx, (inpPlayStyle?.value || "").trim(), C.playStyle, fontFamily, colorHex);
  drawAutoCenteredText(ctx, (inpPlayTime?.value || "").trim(),  C.playTime,  fontFamily, colorHex);

  drawAutoWrappedLeftText(
    ctx,
    (inpComment?.value || "").trim(),
    C.freeComment,
    fontFamily,
    colorHex
  );
}

// -------------------------------
// classic 描画
// -------------------------------
async function drawClassic() {
  const C = CONFIG_CLASSIC;

  // 背景（横幅フィット／縦はアスペクト比維持）
  const baseImg = await loadImage(C.basePath);
  if (baseImg) {
    const drawW = CANVAS_W;
    const drawH = Math.round(1200 * (CANVAS_W / 1600)); // 1200 * scaleX
    ctx.drawImage(baseImg, 0, 0, drawW, drawH);
  }

  // キャラアイコン
  if (userIconImg_classic) {
    drawImageCover(ctx, userIconImg_classic, C.userIcon.x, C.userIcon.y, C.userIcon.w, C.userIcon.h);
  }

  // Class アイコン（最大3つ）
  const classChecks = Array.from(
    document.querySelectorAll('#classList_c input[type="checkbox"]')
  )
    .filter(cb => cb.checked)
    .map(cb => CLASS_ICON_MAP[cb.value])
    .filter(Boolean)
    .slice(0, 3);

  await drawIconArray(classChecks, C.classFrame);

  // VC アイコン（最大2つ）
  const vcChecks = Array.from(
    document.querySelectorAll('#vcList_c input[type="checkbox"]')
  )
    .filter(cb => cb.checked)
    .map(cb => VC_ICON_MAP[cb.value])
    .filter(Boolean)
    .slice(0, 2);

  for (let i = 0; i < vcChecks.length; i++) {
    await drawIcon(vcChecks[i], C.vcFrames[i]);
  }

  // Play Time（最大3つ）
  const ptChecks = Array.from(
    document.querySelectorAll('#ptList_c input[type="checkbox"]')
  )
    .filter(cb => cb.checked)
    .map(cb => PT_ICON_MAP[cb.value])
    .filter(Boolean)
    .slice(0, 3);

  for (let i = 0; i < ptChecks.length; i++) {
    await drawIcon(ptChecks[i], C.ptFrames[i]);
  }

  // Play Style（1〜5 のどこか1つ）
  const psChecked = document.querySelector('input[name="ps_c"]:checked');
  if (psChecked) {
    const idx = Number(psChecked.value) - 1;
    if (idx >= 0 && idx < C.psFrames.length) {
      await drawIcon(PS_ICON_PATH, C.psFrames[idx]);
    }
  }

  const { fontFamily, colorHex } = getFontAndColor("classic");

  // テキスト（フォント・色は simple と同じ仕組み）
  drawAutoCenteredText(ctx, (inpName_c?.value || "").trim(),     C.name,     fontFamily, colorHex);
  drawAutoCenteredText(ctx, (inpPlayerId_c?.value || "").trim(), C.playerId, fontFamily, colorHex);
  drawAutoCenteredText(ctx, (inpGuild_c?.value || "").trim(),    C.guild,    fontFamily, colorHex);

  drawAutoWrappedLeftText(
    ctx,
    (inpComment_c?.value || "").trim(),
    C.freeComment,
    fontFamily,
    colorHex
  );
}

// ===============================
// フォント＆カラー取得
// ===============================
function getFontAndColor(mode) {
  let fontInput = null;
  let colorInput = null;

  if (mode === "classic") {
    fontInput  = document.querySelector('input[name="font_c"]:checked');
    colorInput = document.querySelector('input[name="color_c"]:checked');
  }
  // classic で未選択、または simple の場合
  if (!fontInput) {
    fontInput = document.querySelector('input[name="font"]:checked');
  }
  if (!colorInput) {
    colorInput = document.querySelector('input[name="color"]:checked');
  }

  const fontKey   = fontInput ? fontInput.value : "A";
  const fontFamily = FONT_MAP[fontKey] || FONT_MAP["A"];
  const colorHex   = colorInput ? colorInput.value : "#ffffff";

  return { fontFamily, colorHex };
}

// ===============================
// ヘルパー
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
    // 横長 → 横をトリミング
    sh = ih;
    sw = sh * boxRatio;
    sx = (iw - sw) / 2;
    sy = 0;
  } else {
    // 縦長 → 縦をトリミング
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
  const dx = frame.x + (frame.w - size) / 2;
  const dy = frame.y + (frame.h - size) / 2;

  ctx.drawImage(img, dx, dy, size, size);
}

async function drawIconArray(paths, frame) {
  const n = paths.length;
  if (n === 0) return;

  const perW = frame.w / n;
  for (let i = 0; i < n; i++) {
    const img = await loadImage(paths[i]);
    if (!img) continue;

    const size = Math.min(perW * 0.8, frame.h * 0.8);
    const dx = frame.x + perW * i + (perW - size) / 2;
    const dy = frame.y + (frame.h - size) / 2;

    ctx.drawImage(img, dx, dy, size, size);
  }
}

function drawCheckAt(ctx, rect, checkImg) {
  if (!checkImg) return;
  const size = Math.min(rect.w, rect.h) - 4;
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;

  ctx.drawImage(checkImg, cx - size / 2, cy - size / 2, size, size);
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
// PNG ダウンロード
// ===============================
async function downloadPNG() {
  await drawPreview();
  const link = document.createElement("a");
  link.download = "STAR_RESONANCE_ID.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

// ===============================
// 初期描画
// ===============================
drawPreview();
