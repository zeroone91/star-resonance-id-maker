// script.js
// card_base1.png (1244x1904) に座標通りに描画

const CONFIG = {
  canvasW: 1244,
  canvasH: 1904,

  /* ▼ テキスト枠（card_sumple2 の実座標） ▼ */
  name:       { x:417, y:280,  w:732, h:94  },
  playerId:   { x:420, y:460,  w:729, h:87  },
  guild:      { x:66,  y:932,  w:618, h:74  },
  playStyle:  { x:70,  y:1097, w:616, h:66  },
  playTime:   { x:724, y:1095, w:456, h:67  },
  freeComment:{ x:70,  y:1242, w:1106,h:120 },

  /* ▼ 画像枠 ▼ */
  userIcon:   { x:60,  y:213,  w:324, h:324 },
  freePhoto:  { x:387, y:1397, w:776, h:434 },

  /* ▼ クラスチェック位置 ▼ */
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

  /* ▼ VCチェック ▼ */
  vcChecks: [
    { x:857, y:967, w:47, h:47 },
    { x:980, y:967, w:47, h:47 },
    { x:1096,y:968, w:47, h:47 }
  ],

  basePath:  'card_base1.png',
  checkPath: 'check.png'
};

// ===== DOM =====
const canvas = document.getElementById("cardCanvas");
const ctx = canvas.getContext("2d");

const inpName      = document.getElementById('inpName');
const inpPlayerId  = document.getElementById('inpPlayerId');
const inpGuild     = document.getElementById('inpGuild');
const inpPlayStyle = document.getElementById('inpPlayStyle');
const inpPlayTime  = document.getElementById('inpPlayTime');
const inpComment   = document.getElementById('inpComment');

const fileIcon = document.getElementById('fileIcon');
const fileFree = document.getElementById('fileFree');

const btnRender   = document.getElementById('btnRender');
const btnDownload = document.getElementById('btnDownload');
const btnShareX   = document.getElementById('btnShareX');

// ===== Load Base =====
let baseImg = new Image();
baseImg.src = CONFIG.basePath;
baseImg.onload = () => drawPreview();

let checkImg = new Image();
checkImg.src = CONFIG.checkPath;
checkImg.onerror = () => { checkImg = null; };

let userIconImg = null;
let freePhotoImg = null;

// ===== File Load =====
fileIcon.addEventListener('change', e => {
  readImageFile(e.target.files[0], img => { userIconImg = img; drawPreview(); });
});
fileFree.addEventListener('change', e => {
  readImageFile(e.target.files[0], img => { freePhotoImg = img; drawPreview(); });
});

// メイン描画
btnRender.addEventListener('click', drawPreview);
btnDownload.addEventListener('click', downloadPNG);

// X投稿
btnShareX.onclick = () => {
  const tweet =
    "(下記ハッシュタグは消さずに保存した画像を添付して使用してね)\n" +
    
    "#スタレゾ #スタレゾ自己紹介カード\n" +
    "作成はコチラから👇\n" +
    "https://zeroone91.github.io/star-resonance-id-maker/";

  const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweet);
  window.open(url, "_blank");
};

// ===== Draw =====
function drawPreview() {
  canvas.width  = CONFIG.canvasW;
  canvas.height = CONFIG.canvasH;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // 背景
  if (baseImg && baseImg.complete) {
    ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#222";
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  // Free Photo
  if (freePhotoImg) {
    drawImageCover(ctx, freePhotoImg,
      CONFIG.freePhoto.x, CONFIG.freePhoto.y,
      CONFIG.freePhoto.w, CONFIG.freePhoto.h
    );
  }

  // User Icon
  if (userIconImg) {
    drawImageCover(ctx, userIconImg,
      CONFIG.userIcon.x, CONFIG.userIcon.y,
      CONFIG.userIcon.w, CONFIG.userIcon.h
    );
  }

  // Class checks
  const classCheckboxes = Array.from(document.querySelectorAll('#classList input[type=checkbox]'));
  classCheckboxes.forEach((cb, idx) => {
    if (cb.checked && CONFIG.classChecks[idx]) {
      drawCheckAt(ctx, CONFIG.classChecks[idx]);
    }
  });

  // VC checks
  const vcCheckboxes = Array.from(document.querySelectorAll('#vcList input[type=checkbox]'));
  vcCheckboxes.forEach((cb, idx) => {
    if (cb.checked && CONFIG.vcChecks[idx]) {
      drawCheckAt(ctx, CONFIG.vcChecks[idx]);
    }
  });

  // Font / color
  const fontChoice = document.querySelector('input[name="font"]:checked').value;
  const fontFamily =
    fontChoice === 'A' ? '"Noto Sans JP", sans-serif' :
    fontChoice === 'B' ? '"Yusei Magic", sans-serif' :
    fontChoice === 'C' ? '"DotGothic16", sans-serif' :
                         '"M PLUS Rounded 1c", sans-serif';

  const colorHex =
    document.querySelector('input[name="color"]:checked')?.value || "#000000";

  // Centered Text
  drawAutoCenteredText(ctx, inpName.value.trim(),      CONFIG.name,      fontFamily, colorHex);
  drawAutoCenteredText(ctx, inpPlayerId.value.trim(),  CONFIG.playerId,  fontFamily, colorHex);
  drawAutoCenteredText(ctx, inpGuild.value.trim(),     CONFIG.guild,     fontFamily, colorHex);
  drawAutoCenteredText(ctx, inpPlayStyle.value.trim(), CONFIG.playStyle, fontFamily, colorHex);
  drawAutoCenteredText(ctx, inpPlayTime.value.trim(),  CONFIG.playTime,  fontFamily, colorHex);

  // Free Comment
  drawAutoWrappedLeftText(ctx, inpComment.value.trim(), CONFIG.freeComment, fontFamily, colorHex);
}

// ===== Helper =====
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

function drawCheckAt(ctx, rect) {
  const size = Math.min(rect.w, rect.h) - 4;
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;

  if (checkImg && checkImg.complete) {
    ctx.drawImage(checkImg, cx - size/2, cy - size/2, size, size);
  } else {
    ctx.fillStyle = "#ff2e6d";
    ctx.beginPath();
    ctx.arc(cx, cy, size/2 - 2, 0, Math.PI*2);
    ctx.fill();
  }
}

function drawAutoCenteredText(ctx, text, box, fontFamily, colorHex) {
  if (!text) return;

  const padX = 12;
  const padY = 8;
  const maxW = box.w - padX*2;
  const maxH = box.h - padY*2;

  let size = Math.min(64, maxH + 12);

  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  while (size > 6) {
    ctx.font = size + "px " + fontFamily;
    const w = ctx.measureText(text).width;
    const h = size;
    if (w <= maxW && h <= maxH) break;
    size--;
  }

  ctx.font = size + "px " + fontFamily;
  ctx.fillStyle = colorHex;

  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  ctx.fillText(text, cx, cy);
}

function drawAutoWrappedLeftText(ctx, text, box, fontFamily, colorHex) {
  if (!text) return;

  const padX = 12;
  const padY = 8;
  const maxW = box.w - padX*2;
  const maxH = box.h - padY*2;

  let size = 36;
  ctx.textBaseline = "top";
  ctx.textAlign = "left";

  text = text.replace(/\r/g,'').trim();

  while (size > 8) {
    ctx.font = size + "px " + fontFamily;
    const lines = wrapText(ctx, text, maxW);
    const totalH = lines.length * (size + 6);
    if (totalH <= maxH) break;
    size--;
  }

  ctx.font = size + "px " + fontFamily;
  ctx.fillStyle = colorHex;

  const lines = wrapText(ctx, text, maxW);
  const lineH = size + 6;

  let y = box.y + padY;
  const x = box.x + padX;

  for (const line of lines) {
    ctx.fillText(line, x, y);
    y += lineH;
    if (y > box.y + box.h) break;
  }
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";

  words.forEach(word => {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });

  if (line) lines.push(line);
  return lines;
}

function downloadPNG() {
  drawPreview();
  const link = document.createElement('a');
  link.download = 'STAR_RESONANCE_ID.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
