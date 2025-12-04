// script.js
// canvas 1244×1904px に card_base1.png を描画し、指定座標にテキスト・画像・チェックを載せる

// --- config: 座標（px） ---
const CONFIG = {
  canvasW: 1244, canvasH: 1904,

  // テキストボックス
  name:       { x:416.125, y:1588.29,  w:723.072,  h:85.144  }, // プレイヤー名
  playStyle:  { x:66,      y:792,      w:613,      h:43      }, // プレイスタイル
  guild:      { x:62,      y:958,      w:615,      h:71      }, // 所属ギルド
  playTime:   { x:720,     y:792,      w:453,      h:43      }, // 主な活動時間
  playerId:   { x:509.135, y:1433.967, w:630.063,  h:78.007  }, // プレイヤーID
  freeComment:{ x:66,      y:668,      w:1103,     h:117     }, // フリーコメント

  // 画像枠
  userIcon:   { x:59.09,   y:1673.992, w:315.031,  h:315.031 }, // キャラクターアイコン
  freePhoto:  { x:480,     y:516,      w:655,      h:365     }, // フリーフォト

  // チェック枠（Class 8つ）
  classChecks: [
    { x:99,   y:1105, w:38, h:38 },
    { x:240,  y:1105, w:38, h:38 },
    { x:381,  y:1105, w:38, h:38 },
    { x:522,  y:1105, w:38, h:38 },
    { x:622,  y:1105, w:38, h:38 },
    { x:802,  y:1105, w:38, h:38 },
    { x:943,  y:1105, w:38, h:38 },
    { x:1082, y:1105, w:38, h:38 }
  ],

  // チェック枠（VC 3つ）
  vcChecks: [
    { x:856,  y:920, w:38, h:38 },
    { x:979,  y:920, w:38, h:38 },
    { x:1095, y:920, w:38, h:38 }
  ],

  // 画像パス
  checkPath: 'images/check.png',  // あれば使う。なければ赤丸＋チェックで代用
  basePath:  'card_base1.png'
};

// --- DOM取得 ---
const canvas = document.getElementById('cardCanvas');
const ctx     = canvas.getContext('2d');

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

// ベースカード画像
let baseImg = new Image();
baseImg.src = CONFIG.basePath;
baseImg.onload = () => drawPreview();

// チェック画像（なくてもOK）
let checkImg = new Image();
checkImg.src = CONFIG.checkPath;
checkImg.onerror = () => { checkImg = null; };

// アップロード画像
let userIconImg = null;
let freePhotoImg = null;

fileIcon.addEventListener('change', e => {
  readImageFile(e.target.files[0], img => { userIconImg = img; drawPreview(); });
});
fileFree.addEventListener('change', e => {
  readImageFile(e.target.files[0], img => { freePhotoImg = img; drawPreview(); });
});

btnRender.addEventListener('click', drawPreview);
btnDownload.addEventListener('click', downloadPNG);

// ---------------------------------------------------------
// メイン描画
// ---------------------------------------------------------
function drawPreview() {
  // 内部解像度は固定
  canvas.width  = CONFIG.canvasW;
  canvas.height = CONFIG.canvasH;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // ベース
  if (baseImg && baseImg.complete) {
    ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // フリーフォト
  if (freePhotoImg) {
    drawImageCover(ctx, freePhotoImg,
      CONFIG.freePhoto.x, CONFIG.freePhoto.y,
      CONFIG.freePhoto.w, CONFIG.freePhoto.h
    );
  }

  // キャラクターアイコン
  if (userIconImg) {
    drawImageCover(ctx, userIconImg,
      CONFIG.userIcon.x, CONFIG.userIcon.y,
      CONFIG.userIcon.w, CONFIG.userIcon.h
    );
  }

  // クラスチェック
  const classCheckboxes = Array.from(
    document.querySelectorAll('#classList input[type=checkbox]')
  );
  classCheckboxes.forEach((cb, idx) => {
    if (cb.checked && CONFIG.classChecks[idx]) {
      drawCheckAt(ctx, CONFIG.classChecks[idx]);
    }
  });

  // VCチェック
  const vcCheckboxes = Array.from(
    document.querySelectorAll('#vcList input[type=checkbox]')
  );
  vcCheckboxes.forEach((cb, idx) => {
    if (cb.checked && CONFIG.vcChecks[idx]) {
      drawCheckAt(ctx, CONFIG.vcChecks[idx]);
    }
  });

  // フォントと色
  const fontChoice = document.querySelector('input[name="font"]:checked').value;
  const fontFamily =
    fontChoice === 'A' ? '"Noto Sans JP", sans-serif' :
    fontChoice === 'B' ? '"Yusei Magic", sans-serif' :
    fontChoice === 'C' ? '"DotGothic16", sans-serif' :
                         '"M PLUS Rounded 1c", sans-serif';

  const colorHex =
    (document.querySelector('input[name="color"]:checked')?.value) || '#000000';

  // テキスト（中央寄せ）
  drawAutoCenteredText(ctx, inpName.value.trim(),      CONFIG.name,      fontFamily, colorHex);
  drawAutoCenteredText(ctx, inpPlayerId.value.trim(),  CONFIG.playerId,  fontFamily, colorHex);
  drawAutoCenteredText(ctx, inpGuild.value.trim(),     CONFIG.guild,     fontFamily, colorHex);
  drawAutoCenteredText(ctx, inpPlayStyle.value.trim(), CONFIG.playStyle, fontFamily, colorHex);
  drawAutoCenteredText(ctx, inpPlayTime.value.trim(),  CONFIG.playTime,  fontFamily, colorHex);

  // フリーコメント（左寄せ・自動改行）
  drawAutoWrappedLeftText(ctx, inpComment.value.trim(), CONFIG.freeComment, fontFamily, colorHex);
}

// ---------------------------------------------------------
// 画像ヘルパ
// ---------------------------------------------------------
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

// box の中を「cover」っぽく埋める
function drawImageCover(ctx, img, x, y, w, h) {
  const iw = img.width;
  const ih = img.height;
  const boxRatio = w / h;
  const imgRatio = iw / ih;
  let sx, sy, sw, sh;

  if (imgRatio > boxRatio) {
    // 横長 → 左右カット
    sh = ih;
    sw = sh * boxRatio;
    sx = (iw - sw) / 2;
    sy = 0;
  } else {
    // 縦長 → 上下カット
    sw = iw;
    sh = sw / boxRatio;
    sx = 0;
    sy = (ih - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

// チェックマーク描画
function drawCheckAt(ctx, rect) {
  const size = Math.min(rect.w, rect.h);
  if (checkImg && checkImg.complete) {
    ctx.drawImage(
      checkImg,
      rect.x + (rect.w - size) / 2,
      rect.y + (rect.h - size) / 2,
      size,
      size
    );
  } else {
    // フォールバック：赤丸＋白チェック
    ctx.fillStyle = '#ff2e6d';
    const cx = rect.x + rect.w / 2;
    const cy = rect.y + rect.h / 2;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(rect.w, rect.h) / 2 - 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy);
    ctx.lineTo(cx - 1, cy + 8);
    ctx.lineTo(cx + 10, cy - 8);
    ctx.stroke();
  }
}

// ---------------------------------------------------------
// テキスト描画ヘルパ
// ---------------------------------------------------------

// ボックス内に収まる最大サイズで中央配置
function drawAutoCenteredText(ctx, text, box, fontFamily, colorHex) {
  if (!text) return;

  const padding = 6;
  const maxW = box.w - padding * 2;
  const maxH = box.h - padding * 2;

  let size = Math.min(64, maxH + 10);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';

  while (size > 6) {
    ctx.font = size + 'px ' + fontFamily;
    const w = ctx.measureText(text).width;
    const h = size;
    if (w <= maxW && h <= maxH) break;
    size--;
  }

  ctx.font = size + 'px ' + fontFamily;
  ctx.fillStyle = colorHex;

  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  ctx.fillText(text, cx, cy);
}

// 左寄せ・自動改行・ボックス高さに収まるようフォント調整
function drawAutoWrappedLeftText(ctx, text, box, fontFamily, colorHex) {
  if (!text) return;

  const padding = 6;
  const maxW = box.w - padding * 2;
  const maxH = box.h - padding * 2;

  text = text.replace(/\r/g, '').trim();
  let size = 24;

  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';

  while (size > 8) {
    ctx.font = size + 'px ' + fontFamily;
    const lines = wrapTextLines(ctx, text, maxW);
    const totalH = lines.length * (size + 6);
    if (totalH <= maxH) break;
    size--;
  }

  ctx.font = size + 'px ' + fontFamily;
  ctx.fillStyle = colorHex;

  const lines = wrapTextLines(ctx, text, maxW);
  let y = box.y + padding;
  const x = box.x + padding;
  const lineHeight = size + 6;

  for (const line of lines) {
    ctx.fillText(line, x, y);
    y += lineHeight;
    if (y > box.y + box.h) break;
  }
}

// 最大幅maxWidthで行を折る
function wrapTextLines(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';

  for (let i = 0; i < words.length; i++) {
    const test = line ? line + ' ' + words[i] : words[i];
    const w = ctx.measureText(test).width;
    if (w > maxWidth && line) {
      lines.push(line);
      line = words[i];
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// ---------------------------------------------------------
// PNGダウンロード
// ---------------------------------------------------------
function downloadPNG() {
  drawPreview(); // 最新状態
  const link = document.createElement('a');
  link.download = 'STAR_RESONANCE_ID.png';
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  link.remove();
}
