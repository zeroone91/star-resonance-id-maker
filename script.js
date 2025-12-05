// ===================================================
// ★ デザイン切替対応：simple / classic 両対応版（全文）
// ★ simple の既存構造を一切壊さない
// ===================================================


// ======================
// DESIGN = simple
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
// DESIGN = classic
// ======================
// sample_classic.png：1600×1200 → canvas 1244×1904 に縮尺
const scaleX = 1244 / 1600;
const scaleY = 1904 / 1200;

function S(px){ return Math.floor(px * scaleX); }
function T(px){ return Math.floor(px * scaleY); }

const CONFIG_CLASSIC = {
  canvasW: 1244,
  canvasH: 1904,

  // 背景
  basePath: 'base_classic.png',
  checkPath: 'check.png',

  // テキスト枠
  name:       { x:S(760),  y:T(189), w:S(766), h:T(112) },
  playerId:   { x:S(760),  y:T(333), w:S(766), h:T(112) },
  guild:      { x:S(760),  y:T(475), w:S(766), h:T(112) },
  playStyle:  { x:S(760),  y:T(663), w:S(600), h:T(66)  },  // テキスト位置だけ確保
  playTime:   { x:S(1159), y:T(757), w:S(118*3), h:T(118) }, // 説明入力エリア
  freeComment:{ x:S(31),   y:T(985), w:S(1529),h:T(167) },

  // アイコン/写真
  userIcon:   { x:S(13),   y:T(208), w:S(397), h:T(397) },
  freePhoto:  { x:S(760),  y:T(1400),w:S(766), h:T(450) }, // simple と同じ扱いにする

  // CLASS チェック（赤枠1つなので simple と同じUI → 1か所だけに描画でOK）
  classChecks: [
    { x:S(13), y:T(624), w:S(397), h:T(127) }
  ],

  // Voice Chat 2枠
  vcChecks: [
    { x:S(441), y:T(757), w:S(118), h:T(118) },
    { x:S(611), y:T(757), w:S(118), h:T(118) }
  ],

  // Play Time 3枠
  ptChecks: [
    { x:S(1159), y:T(757), w:S(118), h:T(118) },
    { x:S(1299), y:T(757), w:S(118), h:T(118) },
    { x:S(1440), y:T(757), w:S(118), h:T(118) }
  ]
};


// ======================
// 現在のデザイン
// ======================
let currentDesign = "simple";
document.getElementById("designSelect")
  .addEventListener("change", e=>{
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

const btnRender   = document.getElementById('btnRender');
const btnDownload = document.getElementById('btnDownload');
const btnShareX   = document.getElementById('btnShareX');


// ======================
// 画像読み込み
// ======================
let baseImg = null;
let checkImg = null;

function loadImage(path){
  return new Promise(res=>{
    const img = new Image();
    img.onload = ()=>res(img);
    img.src = path;
  });
}


// ======================
// 初期ロード
// ======================
(async ()=>{
  baseImg  = await loadImage(CONFIG_SIMPLE.basePath);
  checkImg = await loadImage(CONFIG_SIMPLE.checkPath);
  drawPreview();
})();


// ======================
// ファイル読み込み
// ======================
let userIconImg = null;
let freePhotoImg = null;

fileIcon.addEventListener('change', e=>{
  readImageFile(e.target.files[0], img=>{ userIconImg = img; drawPreview(); });
});
fileFree.addEventListener('change', e=>{
  readImageFile(e.target.files[0], img=>{ freePhotoImg = img; drawPreview(); });
});

function readImageFile(file, cb){
  if (!file){ cb(null); return; }
  const reader = new FileReader();
  reader.onload = e=>{
    const img = new Image();
    img.onload = ()=>cb(img);
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}


// ======================
// メイン描画
// ======================
btnRender.addEventListener('click', drawPreview);
btnDownload.addEventListener('click', downloadPNG);

btnShareX.onclick = ()=>{
  const tweet =
    "(下記ハッシュタグは消さずに保存した画像を添付して使用してね)\n\n" +
    "#スタレゾ #スタレゾ自己紹介カード\n" +
    "作成はコチラ👇\n" +
    "https://zeroone91.github.io/star-resonance-id-maker/";
  const url = "https://twitter.com/intent/tweet?text=" + encodeURIComponent(tweet);
  window.open(url, "_blank");
};


// ======================
// ★ デザイン切替に応じて CONFIG を取得
// ======================
function CONF(){
  return currentDesign === "classic" ? CONFIG_CLASSIC : CONFIG_SIMPLE;
}


// ======================
// 描画処理本体
// ======================
async function drawPreview(){

  const C = CONF();

  // キャンバス初期化
  canvas.width  = C.canvasW;
  canvas.height = C.canvasH;
  ctx.clearRect(0,0,canvas.width,canvas.height);

  // 背景
  const bg = await loadImage(C.basePath);
  ctx.drawImage(bg, 0,0, C.canvasW, C.canvasH);

  // Free Photo
  if (freePhotoImg){
    drawImageCover(ctx, freePhotoImg,
      C.freePhoto.x, C.freePhoto.y,
      C.freePhoto.w, C.freePhoto.h
    );
  }

  // User Icon
  if (userIconImg){
    drawImageCover(ctx, userIconImg,
      C.userIcon.x, C.userIcon.y,
      C.userIcon.w, C.userIcon.h
    );
  }

  // Class checks（classic は1枠だけ large、simple は8枠）
  const classCheckboxes = Array.from(document.querySelectorAll('#classList input[type=checkbox]'));
  if (currentDesign === "simple"){
    classCheckboxes.forEach((cb, idx)=>{
      if (cb.checked && C.classChecks[idx]){
        drawCheckAt(ctx, C.classChecks[idx]);
      }
    });
  } else {
    // classic → どれかチェックされてたらまとめて1枠に描画
    if (classCheckboxes.some(cb=>cb.checked)){
      drawCheckAt(ctx, C.classChecks[0]);
    }
  }

  // VC
  const vcCheckboxes = Array.from(document.querySelectorAll('#vcList input[type=checkbox]'));
  vcCheckboxes.forEach((cb, idx)=>{
    if (cb.checked && C.vcChecks[idx]){
      drawCheckAt(ctx, C.vcChecks[idx]);
    }
  });

  // テキスト設定
  const fontChoice = document.querySelector('input[name="font"]:checked').value;
  const fontFamily =
    fontChoice === 'A' ? '"Noto Sans JP", sans-serif' :
    fontChoice === 'B' ? '"Yusei Magic", sans-serif' :
    fontChoice === 'C' ? '"DotGothic16", sans-serif' :
                         '"M PLUS Rounded 1c", sans-serif';

  const colorHex =
    document.querySelector('input[name="color"]:checked')?.value || "#000000";

  // テキスト描画
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
// Auto Center Text
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
// Auto Wrapped Text
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
