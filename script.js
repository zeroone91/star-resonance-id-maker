// script.js
// card_base.png(1244x1904) を背景にして指定座標へ描画

const CONFIG = {
  canvasW: 1244,
  canvasH: 1904,

  // テキスト枠（card_sumple3 の赤枠から取得）
  // ※わずかに余白を持たせるため、パディングは関数側で調整
  name:       { x:417, y:280,  w:732, h:94  },   // NAME
  playerId:   { x:420, y:460,  w:729, h:87  },   // ID
  guild:      { x:66,  y:932,  w:618, h:74  },   // Guild
  playStyle:  { x:70,  y:1097, w:616, h:66  },   // Play Style
  playTime:   { x:724, y:1095, w:456, h:67  },   // Play Time
  freeComment:{ x:70,  y:1242, w:1106,h:120 },   // Free Comment

  // 画像枠
  userIcon:   { x:60,  y:213,  w:324, h:324 },   // USER ICON
  freePhoto:  { x:387, y:1397, w:776, h:434 },   // FREE PHOTO

  // Classチェック（□の中央）
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

  // VCチェック
  vcChecks: [
    { x:857, y:967, w:47, h:47 },
    { x:980, y:967, w:47, h:47 },
    { x:1096,y:968, w:47, h:47 }
  ],

  basePath:  'card_base1.png',  // ★ GitHub にこの名前でアップロードしてね
  checkPath: 'check.png'       // ★ チェック画像
};

// DOM 取得
const canvas = document.getElementById('cardCanvas');
const ctx = canvas.getContext('2d');

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

// 画像
let baseImg = new Image();
baseImg.src = CONFIG.basePath;
baseImg.onload = () => drawPreview();

let checkImg = new Image();
checkImg.src = CONFIG.checkPath;
checkImg.onerror = () => { checkImg = null; };

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

// メイン描画
function drawPreview() {
  canvas.width  = CONFIG.canvasW;
  canvas.height = CONFIG.canvasH;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // 背景
  if (baseImg && baseImg.complete) {
    ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#222';
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  // FREE PHOTO（cover）
  if (freePhotoImg) {
    drawImageCover(ctx, freePhotoImg,
      CONFIG.freePhoto.x, CONFIG.freePhoto.y,
      CONFIG.freePhoto.w, CONFIG.freePhoto.h
    );
  }

  // USER ICON（枠の真ん中に cover）
  if (userIconImg) {
    drawImageCover(ctx, userIconImg,
      CONFIG.userIcon.x, CONFIG.userIcon.y,
      CONFIG.userIcon.w, CONFIG.userIcon.h
    );
  }

  // クラスチェック（チェックのみ。クラス名は描画しない）
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

  // 中央寄せのテキスト
  drawAutoCenteredText(ctx, inpName.value.trim(),      CONFIG.name,      fontFamily, colorHex);
  drawAutoCenteredText(ctx, inpPlayerId.value.trim(),  CONFIG.playerId,  fontFamily, colorHex);
  drawAutoCenteredText(ctx, inpGuild.value.trim(),     CONFIG.guild,     fontFamily, colorHex);
  drawAutoCenteredText(ctx, inpPlayStyle.value.trim(), CONFIG.playStyle, fontFamily, colorHex);
  drawAutoCenteredText(ctx, inpPlayTime.value.trim(),  CONFIG.playTime,  fontFamily, colorHex);

  // フリーコメント：左寄せ・自動改行（なるべく大きいサイズから調整）
  drawAutoWrappedLeftText(ctx, inpComment.value.trim(), CONFIG.freeComment, fontFamily, colorHex);
}

// 画像読込
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

// box を cover で埋める
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

// チェックマーク描画（□の中央に）
function drawCheckAt(ctx, rect) {
  const size = Math.min(rect.w, rect.h) - 4;  // 枠より少し小さめ
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;

  if (checkImg && checkImg.complete) {
    ctx.drawImage(
      checkImg,
      cx - size/2,
      cy - size/2,
      size,
      size
    );
  } else {
    // 代替：赤丸＋白チェック
    ctx.fillStyle = '#ff2e6d';
    ctx.beginPath();
    ctx.arc(cx, cy, size/2 - 2, 0, Math.PI*2);
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

// 中央寄せテキスト（枠内に収まる最大サイズ）
function drawAutoCenteredText(ctx, text, box, fontFamily, colorHex) {
  if (!text) return;

  const paddingX = 12;
  const paddingY = 8;
  const maxW = box.w - paddingX*2;
  const maxH = box.h - paddingY*2;

  let size = Math.min(64, maxH + 12);   // なるべく大きいところから
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

// 左寄せ・自動改行（FREE COMMENT）
function drawAutoWrappedLeftText(ctx, text, box, fontFamily, colorHex) {
  if (!text) return;

  const paddingX = 12;
  const paddingY = 8;
  const maxW = box.w - paddingX*2;
  const maxH = box.h - paddingY*2;

  text = text.replace(/\r/g,'').trim();
  let size = 36;  // まずは大きめからスタート

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
  let y = box.y + paddingY;
  const x = box.x + paddingX;
  const lineHeight = size + 6;

  for (const line of lines) {
    ctx.fillText(line, x, y);
    y += lineHeight;
    if (y > box.y + box.h) break;
  }
}

function wrapTextLines(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (let i=0;i<words.length;i++){
    const test = line ? line + ' ' + words[i] : words[i];
    const w = ctx.measureText(test).width;
    if (w > maxWidth && line){
      lines.push(line);
      line = words[i];
    }else{
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// PNG保存
function downloadPNG(){
  drawPreview();
  const link = document.createElement('a');
  link.download = 'STAR_RESONANCE_ID.png';
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  link.remove();
}
