// ===================================================
// ★ デザイン切替対応：simple / classic 両対応版（全文）
// ★ simple の既存構造を一切壊さない
// ===================================================


// ======================
// DESIGN = simple（既存）
// ======================
const CONFIG_SIMPLE = {
  canvasW: 1244,
  canvasH: 1904,

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

  basePath:  'base_simple.png',
  checkPath: 'check.png'
};


// ======================
// DESIGN = classic（追加）
// ======================
// sample_classic.png：1600×1200（横長）
// → canvas 1244×1904 の「横 fit」に合わせる
const classicScaleX = 1244 / 1600;
const classicScaleY = 1244 / 1600; // 高さ側も同率（縦は933pxになる）

function CX(px){ return Math.floor(px * classicScaleX); }
function CY(px){ return Math.floor(px * classicScaleY); }

const CONFIG_CLASSIC = {
  canvasW: 1244,
  canvasH: 1904,

  basePath: 'base_classic.png',
  checkPath: 'check.png',

  name:       { x:CX(760),  y:CY(189), w:CX(766), h:CY(112) },
  playerId:   { x:CX(760),  y:CY(333), w:CX(766), h:CY(112) },
  guild:      { x:CX(760),  y:CY(475), w:CX(766), h:CY(112) },
  playStyle:  { x:CX(760),  y:CY(663), w:CX(600), h:CY(66) },
  playTime:   { x:CX(1159), y:CY(757), w:CX(118*3), h:CY(118) },
  freeComment:{ x:CX(31),   y:CY(985), w:CX(1529),h:CY(167) },

  userIcon:   { x:CX(13),   y:CY(208), w:CX(397), h:CY(397) },
  freePhoto:  { x:CX(760),  y:CY(1400),w:CX(766), h:CY(450) },

  classChecks: [
    { x:CX(13), y:CY(624), w:CX(397), h:CY(127) }
  ],

  vcChecks: [
    { x:CX(441), y:CY(757), w:CX(118), h:CY(118) },
    { x:CX(611), y:CY(757), w:CX(118), h:CY(118) }
  ],

  ptChecks: [
    { x:CX(1159), y:CY(757), w:CX(118), h:CY(118) },
    { x:CX(1299), y:CY(757), w:CX(118), h:CY(118) },
    { x:CX(1440), y:CY(757), w:CX(118), h:CY(118) }
  ]
};


// ======================
// 現在デザイン
// ======================
let currentDesign = "simple";

document.getElementById("designSelect").addEventListener("change", e=>{
  currentDesign = e.target.value;
  drawPreview();
});


// ======================
// DOM
// ======================
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


// ======================
// 画像読み込み
// ======================
function loadImage(path){
  return new Promise(res=>{
    const img = new Image();
    img.onload = ()=>res(img);
    img.src = path;
  });
}


// ======================
// ファイル読み込み
// ======================
let userIconImg = null;
let freePhotoImg = null;

fileIcon.onchange = e=>{
  readImageFile(e.target.files[0], img=>{ userIconImg = img; drawPreview(); });
};
fileFree.onchange = e=>{
  readImageFile(e.target.files[0], img=>{ freePhotoImg = img; drawPreview(); });
};

function readImageFile(file, cb){
  if (!file){ cb(null); return; }
  const r = new FileReader();
  r.onload = e=>{
    const img = new Image();
    img.onload = ()=>cb(img);
    img.src = e.target.result;
  };
  r.readAsDataURL(file);
}


// ======================
// 現在CONFIG
// ======================
function CONF(){
  return currentDesign === "classic" ? CONFIG_CLASSIC : CONFIG_SIMPLE;
}


// ======================
// メイン描画
// ======================
async function drawPreview(){

  const C = CONF();

  canvas.width  = C.canvasW;
  canvas.height = C.canvasH;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // 背景読み込み
  const bg = await loadImage(C.basePath);

  // =========================================
  // ★ classic だけ「横幅フィット（比率維持）」で描画
  // =========================================
  if (currentDesign === "classic") {
    const drawW = C.canvasW;          // =1244
    const drawH = Math.round(1200 * (1244/1600)); // ≒933（正しい比率）
    ctx.drawImage(bg, 0, 0, drawW, drawH);
  } else {
    // simple は従来どおりフル
    ctx.drawImage(bg, 0,0, C.canvasW, C.canvasH);
  }

  // ==========================
  // Free Photo
  // ==========================
  if (freePhotoImg){
    drawImageCover(ctx, freePhotoImg,
      C.freePhoto.x, C.freePhoto.y,
      C.freePhoto.w, C.freePhoto.h
    );
  }

  // ==========================
  // User Icon
  // ==========================
  if (userIconImg){
    drawImageCover(ctx, userIconImg,
      C.userIcon.x, C.userIcon.y,
      C.userIcon.w, C.userIcon.h
    );
  }

  // ==========================
  // CLASS チェック
  // ==========================
  const classList = [...document.querySelectorAll('#classList input[type=checkbox]')];

  if (currentDesign === "simple"){
    classList.forEach((cb,i)=>{
      if (cb.checked && C.classChecks[i]){
        drawCheckAt(ctx, C.classChecks[i]);
      }
    });
  } else {
    if (classList.some(cb=>cb.checked)){
      drawCheckAt(ctx, C.classChecks[0]);
    }
  }

  // ==========================
  // VC
  // ==========================
  const vcList = [...document.querySelectorAll('#vcList input[type=checkbox]')];
  vcList.forEach((cb,i)=>{
    if (cb.checked && C.vcChecks[i]){
      drawCheckAt(ctx, C.vcChecks[i]);
    }
  });

  // ==========================
  // テキスト設定
  // ==========================
  const fontChoice = document.querySelector('input[name="font"]:checked').value;
  const fontFamily =
    fontChoice === 'A' ? '"Noto Sans JP", sans-serif' :
    fontChoice === 'B' ? '"Yusei Magic", sans-serif' :
    fontChoice === 'C' ? '"DotGothic16", sans-serif' :
                         '"M PLUS Rounded 1c", sans-serif';

  const colorHex =
    document.querySelector('input[name="color"]:checked')?.value || "#000000";

  // ==========================
  // テキスト描画
  // ==========================
  drawAutoCenteredText(ctx, inpName.value.trim(),      C.name,      fontFamily, colorHex);
  drawAutoCenteredText(ctx, inpPlayerId.value.trim(),  C.playerId,  fontFamily, colorHex);
  drawAutoCenteredText(ctx, inpGuild.value.trim(),     C.guild,     fontFamily, colorHex);
  drawAutoCenteredText(ctx, inpPlayStyle.value.trim(), C.playStyle, fontFamily, colorHex);
  drawAutoCenteredText(ctx, inpPlayTime.value.trim(),  C.playTime,  fontFamily, colorHex);

  // Free Comment
  drawAutoWrappedLeftText(ctx, inpComment.value.trim(), C.freeComment, fontFamily, colorHex);
}


// ======================
// 画像 Cover 描画
// ======================
function drawImageCover(ctx, img, x, y, w, h){
  const iw = img.width;
  const ih = img.height;
  const boxRatio = w / h;
  const imgRatio = iw / ih;

  let sx, sy, sw, sh;

  if (imgRatio > boxRatio){
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

  ctx.drawImage(img, sx,sy, sw,sh, x,y, w,h);
}


// ======================
// チェックマーク描画
// ======================
let checkImg = null;
loadImage("check.png").then(img => checkImg = img);

function drawCheckAt(ctx, rect){
  const size = Math.min(rect.w, rect.h) - 4;
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;

  if (checkImg){
    ctx.drawImage(checkImg, cx - size/2, cy - size/2, size, size);
  } else {
    ctx.fillStyle = "#ff2e6d";
    ctx.beginPath();
    ctx.arc(cx, cy, size/2 - 2, 0, Math.PI*2);
    ctx.fill();
  }
}


// ======================
// 中央テキスト
// ======================
function drawAutoCenteredText(ctx, text, box, fontFamily, colorHex){
  if (!text) return;

  const padX = 12;
  const padY = 8;
  const maxW = box.w - padX*2;
  const maxH = box.h - padY*2;

  let size = Math.min(64, maxH + 12);

  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  while (size > 6){
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


// ======================
// 改行テキスト
// ======================
function drawAutoWrappedLeftText(ctx, text, box, fontFamily, colorHex){
  if (!text) return;

  const padX = 12;
  const padY = 8;
  const maxW = box.w - padX*2;
  const maxH = box.h - padY*2;

  let size = 36;
  ctx.textBaseline = "top";
  ctx.textAlign = "left";

  text = text.replace(/\r/g,'').trim();

  while (size > 8){
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

  for (const line of lines){
    ctx.fillText(line, x, y);
    y += lineH;
    if (y > box.y + box.h) break;
  }
}

function wrapText(ctx, text, maxWidth){
  const words = text.split(/\s+/);
  const lines = [];
  let line = "";

  words.forEach(word=>{
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxWidth && line){
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  });

  if (line) lines.push(line);
  return lines;
}


// ======================
// DL
// ======================
function downloadPNG(){
  drawPreview();
  const link = document.createElement('a');
  link.download = 'STAR_RESONANCE_ID.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
}
