// script.js
// 主要仕様：canvas 1244×1904px に card_base1.png を読み込み
// 指定座標にテキスト・チェック・画像を描画し、PNGを出力する

// --- config: 座標（px） ---
// 横1244 × 縦1904 基準（与えられた値そのまま使用）
const CONFIG = {
  canvasW: 1244, canvasH: 1904,
  name: { x:416.125, y:1588.29, w:723.072, h:85.144 },
  playStyle: { x:66, y:792, w:613, h:43 },
  guild: { x:62, y:958, w:615, h:71 },
  playTime: { x:720, y:792, w:453, h:43 },
  playerId: { x:509.135, y:1433.967, w:630.063, h:78.007 },
  freeComment: { x:66, y:668, w:1103, h:117 },
  userIcon: { x:59.09, y:1673.992, w:315.031, h:315.031 },
  freePhoto: { x:480, y:516, w:655, h:365 },
  classChecks: [
    { x:99, y:1105, w:38, h:38 },
    { x:240, y:1105, w:38, h:38 },
    { x:381, y:1105, w:38, h:38 },
    { x:522, y:1105, w:38, h:38 },
    { x:622, y:1105, w:38, h:38 },
    { x:802, y:1105, w:38, h:38 },
    { x:943, y:1105, w:38, h:38 },
    { x:1082, y:1105, w:38, h:38 }
  ],
  vcChecks: [
    { x:856, y:920, w:38, h:38 },
    { x:979, y:920, w:38, h:38 },
    { x:1095, y:920, w:38, h:38 }
  ],
  // check image path (put your check.png in /images/check.png OR update path)
  checkPath: 'images/check.png',
  basePath: 'card_base1.png'
};

// --- DOM ---
const canvas = document.getElementById('cardCanvas');
const ctx = canvas.getContext('2d');

const inpName = document.getElementById('inpName');
const inpPlayerId = document.getElementById('inpPlayerId');
const inpGuild = document.getElementById('inpGuild');
const inpPlayStyle = document.getElementById('inpPlayStyle');
const inpPlayTime = document.getElementById('inpPlayTime');
const inpComment = document.getElementById('inpComment');

const fileIcon = document.getElementById('fileIcon');
const fileFree = document.getElementById('fileFree');

const btnRender = document.getElementById('btnRender');
const btnDownload = document.getElementById('btnDownload');

let baseImg = new Image();
baseImg.src = CONFIG.basePath;
baseImg.onload = () => drawPreview();

let checkImg = new Image();
checkImg.src = CONFIG.checkPath;
checkImg.onerror = () => { checkImg = null; } // if not available, we'll draw a fallback

// uploaded images
let userIconImg = null;
let freePhotoImg = null;

fileIcon.addEventListener('change', e => {
  readImageFile(e.target.files[0], img => { userIconImg = img; drawPreview(); });
});
fileFree.addEventListener('change', e => {
  readImageFile(e.target.files[0], img => { freePhotoImg = img; drawPreview(); });
});

document.querySelectorAll('input,textarea').forEach(el => {
  el.addEventListener('input', () => { /* optional */ });
});

// render button
btnRender.addEventListener('click', drawPreview);
btnDownload.addEventListener('click', downloadPNG);

// draw preview / main render
function drawPreview() {
  // ensure canvas uses specified logical size
  canvas.width = CONFIG.canvasW;
  canvas.height = CONFIG.canvasH;

  // clear
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // draw base
  if(baseImg && baseImg.complete){
    ctx.drawImage(baseImg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#222';
    ctx.fillRect(0,0,canvas.width,canvas.height);
  }

  // draw FREE PHOTO (cover inside rect)
  if(freePhotoImg) {
    drawImageCover(ctx, freePhotoImg, CONFIG.freePhoto.x, CONFIG.freePhoto.y, CONFIG.freePhoto.w, CONFIG.freePhoto.h);
  }

  // draw user icon (cover)
  if(userIconImg) {
    drawImageCover(ctx, userIconImg, CONFIG.userIcon.x, CONFIG.userIcon.y, CONFIG.userIcon.w, CONFIG.userIcon.h);
  } else {
    // leave blank - base has placeholder
  }

  // draw checks for class
  const classCheckboxes = Array.from(document.querySelectorAll('#classList input[type=checkbox]'));
  classCheckboxes.forEach((cb, idx) => {
    if(cb.checked){
      drawCheckAt(ctx, CONFIG.classChecks[idx]);
    }
  });

  // draw checks for vc (horizontal)
  const vcCheckboxes = Array.from(document.querySelectorAll('#vcList input[type=checkbox]'));
  vcCheckboxes.forEach((cb, idx) => {
    if(cb.checked){
      drawCheckAt(ctx, CONFIG.vcChecks[idx]);
    }
  });

  // draw text fields
  // choose font according to radio selection
  const fontChoice = document.querySelector('input[name="font"]:checked').value;
  const fontFamily = (fontChoice === 'A') ? '"Noto Sans JP", sans-serif'
                  : (fontChoice === 'B') ? '"Yusei Magic", sans-serif'
                  : (fontChoice === 'C') ? '"DotGothic16", sans-serif'
                  : '"M PLUS Rounded 1c", sans-serif';

  // color
  const colorHex = document.querySelector('input[name="color"]:checked').value || '#000';
  ctx.fillStyle = colorHex;

  // helper to draw centered text in box with auto font size
  drawAutoCenteredText(ctx, inpName.value.trim(), CONFIG.name, fontFamily, true);
  drawAutoCenteredText(ctx, inpPlayerId.value.trim(), CONFIG.playerId, fontFamily, true);
  drawAutoCenteredText(ctx, inpGuild.value.trim(), CONFIG.guild, fontFamily, true);
  drawAutoCenteredText(ctx, inpPlayStyle.value.trim(), CONFIG.playStyle, fontFamily, true);
  drawAutoCenteredText(ctx, inpPlayTime.value.trim(), CONFIG.playTime, fontFamily, true);

  // class names: draw text of checked class names in a single line area (if needed)
  // We will draw the chosen class names as a concatenated string centered in the class area (CONFIG.classChecks area approximate)
  const selectedClasses = classCheckboxes.filter(c=>c.checked).map(c=>c.value).join(' / ');
  // for visible text we can put it above or below class area; choose Y near classChecks
  const classTextBox = { x: 66, y: CONFIG.classChecks[0].y - 40, w: 1103, h: 40 };
  drawAutoCenteredText(ctx, selectedClasses, classTextBox, fontFamily, true);

  // vc text similarly
  const selectedVC = vcCheckboxes.filter(c=>c.checked).map(c=>c.value).join(' / ');
  const vcTextBox = { x: 660, y: CONFIG.vcChecks[0].y - 40, w: 520, h: 40 };
  drawAutoCenteredText(ctx, selectedVC, vcTextBox, fontFamily, true);

  // free comment: left-aligned, auto font-size to fit box (wrap)
  drawAutoWrappedLeftText(ctx, inpComment.value.trim(), CONFIG.freeComment, fontFamily);

  // done
}

// ---------- helper functions ----------

function readImageFile(file, cb){
  if(!file){ cb(null); return; }
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => cb(img);
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// cover: draw image so that it covers the box (crop overflow) keeping aspect ratio - "cover" behaviour
function drawImageCover(ctx, img, x, y, w, h){
  const iw = img.width, ih = img.height;
  const boxRatio = w/h;
  const imgRatio = iw/ih;
  let sx, sy, sw, sh;
  if(imgRatio > boxRatio){
    // image wider -> cut left/right
    sh = ih;
    sw = sh * boxRatio;
    sx = (iw - sw)/2;
    sy = 0;
  } else {
    // image taller -> cut top/bottom
    sw = iw;
    sh = sw / boxRatio;
    sx = 0;
    sy = (ih - sh)/2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

// draw check image centered in rect
function drawCheckAt(ctx, rect){
  const size = Math.min(rect.w, rect.h);
  if(checkImg && checkImg.complete){
    ctx.drawImage(checkImg, rect.x + (rect.w - size)/2, rect.y + (rect.h - size)/2, size, size);
  } else {
    // fallback: draw a filled red check circle
    ctx.fillStyle = '#ff2e6d';
    const cx = rect.x + rect.w/2;
    const cy = rect.y + rect.h/2;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.min(rect.w, rect.h)/2 - 2, 0, Math.PI*2);
    ctx.fill();
    // draw white check mark
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 6, cy);
    ctx.lineTo(cx - 1, cy + 8);
    ctx.lineTo(cx + 10, cy - 8);
    ctx.stroke();
  }
}

// auto-centered text: reduce font size until fits in box width and box height
function drawAutoCenteredText(ctx, text, box, fontFamily, centerVertically){
  if(!text) return;
  const padding = 8;
  let maxW = box.w - padding*2;
  let maxH = box.h - padding*2;
  // start large
  let size = Math.min(80, maxH + 10);
  ctx.textBaseline = 'middle';
  while(size > 6){
    ctx.font = size + 'px ' + fontFamily;
    const metrics = ctx.measureText(text);
    const textWidth = metrics.width;
    const textHeight = size; // approximate
    if(textWidth <= maxW && textHeight <= maxH) break;
    size -= 1;
  }
  ctx.font = size + 'px ' + fontFamily;
  ctx.fillStyle = document.querySelector('input[name="color"]:checked').value || '#000';
  // compute center position
  const cx = box.x + box.w/2;
  const cy = box.y + (centerVertically ? box.h/2 : size/2);
  ctx.textAlign = 'center';
  ctx.fillText(text, cx, cy);
}

// auto-wrapped left aligned text with dynamic font size to fit height
function drawAutoWrappedLeftText(ctx, text, box, fontFamily){
  if(!text) return;
  const padding = 6;
  let maxW = box.w - padding*2;
  let maxH = box.h - padding*2;
  // remove excessive newlines
  text = text.replace(/\r/g, '').trim();
  let size = 24; // start
  ctx.textBaseline = 'top';
  // decrease size until it fits in height when wrapped
  while(size > 8){
    ctx.font = size + 'px ' + fontFamily;
    const lines = wrapTextLines(ctx, text, maxW);
    const totalHeight = lines.length * (size + 6);
    if(totalHeight <= maxH) break;
    size -= 1;
  }
  ctx.font = size + 'px ' + fontFamily;
  ctx.fillStyle = document.querySelector('input[name="color"]:checked').value || '#000';
  ctx.textAlign = 'left';
  const lines = wrapTextLines(ctx, text, maxW);
  let y = box.y + padding;
  const x = box.x + padding;
  const lineHeight = size + 6;
  for(const line of lines){
    ctx.fillText(line, x, y);
    y += lineHeight;
    if(y > box.y + box.h) break;
  }
}

function wrapTextLines(ctx, text, maxWidth){
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for(let i=0;i<words.length;i++){
    const test = (line ? (line + ' ' + words[i]) : words[i]);
    const w = ctx.measureText(test).width;
    if(w > maxWidth && line){
      lines.push(line);
      line = words[i];
    } else {
      line = test;
    }
  }
  if(line) lines.push(line);
  return lines;
}

// download PNG directly from canvas
function downloadPNG(){
  // ensure latest render
  drawPreview();
  // create a temporary link
  const link = document.createElement('a');
  link.download = 'STAR_RESONANCE_ID.png';
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  link.remove();
}
