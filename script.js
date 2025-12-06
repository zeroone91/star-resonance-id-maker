// script.js - STAR RESONANCE ID MAKER

// ----------------------------------------
// キャンバスサイズ
// ----------------------------------------
const CANVAS_W = 1244;
const CANVAS_H = 1904;

// ブルプロ風（横長）
const BP_W = 1904;
const BP_H = 1244;

// ----------------------------------------
// simple CONFIG (base_simple 1244x1904)
// ----------------------------------------
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

// ----------------------------------------
// classic CONFIG (base_classic 1600x1200 -> 横フィット)
// ----------------------------------------
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

  // PlayStyle 5段階
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

// ----------------------------------------
// ブルプロ風 CONFIG (base_bp 1904x1244)
// sample_bp.png を元にした概ねの座標
// ----------------------------------------
const CONFIG_BP = {
  canvasW: BP_W,
  canvasH: BP_H,
  basePath: "base_bp.png",

  // 背景 & アイコン（トリミング対象）
  bgImgBox:   { x: 40,  y: 30,  w: 1820, h: 540 }, // BG IMG（青枠）
  iconBox:    { x: 70,  y: 60,  w: 300,  h: 500 }, // ICON（緑枠）

  // テキスト＆その他
  name:       { x: 360, y:  70, w: 900, h: 120 }, // 左寄せ 白
  playerId:   { x:1320, y: 80, w: 230, h:  80 }, // 左寄せ 白
  like:       { x:1600, y: 80, w: 260, h:  80 }, // 左寄せ 白

  playTime:   { x: 580, y: 460, w: 560, h:  70 }, // 左寄せ 白
  freeComment:{ x: 930, y: 360, w: 900, h: 160 }, // 左寄せ 黒

  rank:       { x: 190, y: 690, w: 170, h:  60 }, // 右寄せ 黒
  score:      { x: 190, y: 750, w: 170, h:  60 }, // 右寄せ 黒

  className:  { x:  80, y: 820, w: 260, h:  70 }, // 中央 白
  classIcon:  { x: 150, y: 880, w: 170, h: 160 }, // アイコン 白

  level:      { x: 150, y:1100, w: 260, h:  80 }, // 右寄せ 白（"Lv."付き）

  guild:      { x: 520, y: 700, w: 520, h: 110 }, // 左寄せ 黒
  playStyle:  { x:1150, y: 700, w: 700, h: 110 }, // 左寄せ 黒

  photo1:     { x: 470, y: 840, w: 420, h: 260 }, // PHOTO 1
  photo2:     { x: 960, y: 840, w: 420, h: 260 }, // PHOTO 2
  photo3:     { x:1450, y: 840, w: 420, h: 260 }  // PHOTO 3
};

// ----------------------------------------
// アイコンパス
// ----------------------------------------
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

// ----------------------------------------
// フォント
// ----------------------------------------
const FONT_MAP = {
  "A": "'Noto Sans JP', sans-serif",          // かっこいい系
  "B": "'Yusei Magic', cursive",             // かわいい系
  "C": "'DotGothic16', sans-serif",          // ゲーム系
  "D": "'M PLUS Rounded 1c', sans-serif"     // おしゃれ系
};

// ----------------------------------------
// DOM 取得
// ----------------------------------------
const canvas = document.getElementById("cardCanvas");
const ctx     = canvas.getContext("2d");

const designSelect = document.getElementById("designSelect");
const formSimple   = document.getElementById("formSimple");
const formClassic  = document.getElementById("formClassic");
const formBP       = document.getElementById("formBP");

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

// blueprotocol inputs
const inpName_bp      = document.getElementById("inpName_bp");
const inpPlayerId_bp  = document.getElementById("inpPlayerId_bp");
const inpGuild_bp     = document.getElementById("inpGuild_bp");
const inpRank_bp      = document.getElementById("inpRank_bp");
const inpScore_bp     = document.getElementById("inpScore_bp");
const inpLevel_bp     = document.getElementById("inpLevel_bp");
const inpPlayStyle_bp = document.getElementById("inpPlayStyle_bp");
const inpPlayTime_bp  = document.getElementById("inpPlayTime_bp");
const inpLike_bp      = document.getElementById("inpLike_bp");
const inpComment_bp   = document.getElementById("inpComment_bp");

const fileIcon_bp   = document.getElementById("fileIcon_bp");
const fileBg_bp     = document.getElementById("fileBg_bp");
const filePhoto1_bp = document.getElementById("filePhoto1_bp");
const filePhoto2_bp = document.getElementById("filePhoto2_bp");
const filePhoto3_bp = document.getElementById("filePhoto3_bp");

// buttons
const btnRender   = document.getElementById("btnRender");
const btnDownload = document.getElementById("btnDownload");
const btnShareX   = document.getElementById("btnShareX");

// Cropper モーダル
const cropModal   = document.getElementById("cropModal");
const cropTitle   = document.getElementById("cropTitle");
const cropImage   = document.getElementById("cropImage");
const cropOkBtn   = document.getElementById("cropOk");
const cropCancelBtn = document.getElementById("cropCancel");

let currentCropTarget = null;
let cropperInstance   = null;

// ----------------------------------------
// 画像キャッシュ / ローダ
// ----------------------------------------
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

// ブルプロ風：切り抜き済み画像
let bpIconCroppedImg = null;
let bpBgCroppedImg   = null;

// ブルプロ風：フリーフォト
let bpPhoto1Img = null;
let bpPhoto2Img = null;
let bpPhoto3Img = null;

// 通常読み込み
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

// ----------------------------------------
// simple / classic 用 file change
// ----------------------------------------
fileIcon_s?.addEventListener("change", e => {
  readImageFile(e.target.files[0], img => { userIconImg_simple = img; drawPreview(); });
});
fileFree_s?.addEventListener("change", e => {
  readImageFile(e.target.files[0], img => { freePhotoImg_simple = img; drawPreview(); });
});
fileIcon_c?.addEventListener("change", e => {
  readImageFile(e.target.files[0], img => { userIconImg_classic = img; drawPreview(); });
});

// ----------------------------------------
// ブルプロ風：Cropper 起動ヘルパ
// ----------------------------------------
function openCropper(file, target) {
  if (!file) return;
  currentCropTarget = target;

  const reader = new FileReader();
  reader.onload = e => {
    cropImage.src = e.target.result;
    cropImage.onload = () => {
      // 既存 Cropper 破棄
      if (cropperInstance) {
        cropperInstance.destroy();
        cropperInstance = null;
      }

      let aspect = 1;
      if (target === "bp_icon") {
        aspect = CONFIG_BP.iconBox.w / CONFIG_BP.iconBox.h;
        cropTitle.textContent = "キャラクターアイコンをトリミング（緑枠比率）";
      } else if (target === "bp_bg") {
        aspect = CONFIG_BP.bgImgBox.w / CONFIG_BP.bgImgBox.h;
        cropTitle.textContent = "背景イメージをトリミング（青枠比率）";
      }

      cropperInstance = new Cropper(cropImage, {
        aspectRatio: aspect,
        viewMode: 1,
        autoCropArea: 1
      });

      cropModal.classList.remove("hide");
    };
  };
  reader.readAsDataURL(file);
}

// Cropper OK / Cancel
cropOkBtn.addEventListener("click", () => {
  if (!cropperInstance || !currentCropTarget) return;

  let box;
  if (currentCropTarget === "bp_icon") box = CONFIG_BP.iconBox;
  else if (currentCropTarget === "bp_bg") box = CONFIG_BP.bgImgBox;
  else box = null;

  const canvasCrop = cropperInstance.getCroppedCanvas({
    width: box ? box.w : 800,
    height: box ? box.h : 800
  });

  const img = new Image();
  img.onload = () => {
    if (currentCropTarget === "bp_icon") bpIconCroppedImg = img;
    if (currentCropTarget === "bp_bg")   bpBgCroppedImg   = img;
    cropModal.classList.add("hide");
    cropperInstance.destroy();
    cropperInstance = null;
    currentCropTarget = null;
    drawPreview();
  };
  img.src = canvasCrop.toDataURL("image/png");
});

cropCancelBtn.addEventListener("click", () => {
  if (cropperInstance) {
    cropperInstance.destroy();
    cropperInstance = null;
  }
  currentCropTarget = null;
  cropModal.classList.add("hide");
});

// ブルプロ風 file change
fileIcon_bp?.addEventListener("change", e => {
  openCropper(e.target.files[0], "bp_icon");
});
fileBg_bp?.addEventListener("change", e => {
  openCropper(e.target.files[0], "bp_bg");
});

filePhoto1_bp?.addEventListener("change", e => {
  readImageFile(e.target.files[0], img => { bpPhoto1Img = img; drawPreview(); });
});
filePhoto2_bp?.addEventListener("change", e => {
  readImageFile(e.target.files[0], img => { bpPhoto2Img = img; drawPreview(); });
});
filePhoto3_bp?.addEventListener("change", e => {
  readImageFile(e.target.files[0], img => { bpPhoto3Img = img; drawPreview(); });
});

// ----------------------------------------
// デザイン切替
// ----------------------------------------
designSelect.addEventListener("change", () => {
  const d = designSelect.value;
  formSimple.classList.add("hide");
  formClassic.classList.add("hide");
  formBP.classList.add("hide");

  if (d === "classic") {
    formClassic.classList.remove("hide");
  } else if (d === "blueprotocol") {
    formBP.classList.remove("hide");
  } else {
    formSimple.classList.remove("hide");
  }

  drawPreview();
});

// ----------------------------------------
// ボタン
// ----------------------------------------
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

// ----------------------------------------
// メイン描画
// ----------------------------------------
async function drawPreview() {
  const design = designSelect.value;

  if (design === "blueprotocol") {
    canvas.width  = BP_W;
    canvas.height = BP_H;
  } else {
    canvas.width  = CANVAS_W;
    canvas.height = CANVAS_H;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (design === "classic") {
    await drawClassic();
  } else if (design === "blueprotocol") {
    await drawBlueprotocol();
  } else {
    await drawSimple();
  }
}

// ----------------------------------------
// simple 描画
// ----------------------------------------
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

  // フリーコメント：箱の高さベースで自動縮小・左寄せ
  drawShrinkBlockLeft(inpComment_s.value.trim(), C.freeComment, font, color);
}

// ----------------------------------------
// classic 描画
// ----------------------------------------
async function drawClassic() {
  const C = CONFIG_CLASSIC;

  const baseImg = await loadImage(C.basePath);
  if (baseImg) {
    const drawW = CANVAS_W;
    const drawH = Math.round(1200 * scaleX);
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

  // フリーコメント：高さベースで自動縮小・左寄せ
  drawShrinkBlockLeft(inpComment_c.value.trim(), C.freeComment, font, color);
}

// ----------------------------------------
// ブルプロ風 描画
// ----------------------------------------
async function drawBlueprotocol() {
  const C = CONFIG_BP;

  // 1. 背景（ユーザー BG）最背面
  if (bpBgCroppedImg) {
    ctx.drawImage(bpBgCroppedImg, C.bgImgBox.x, C.bgImgBox.y, C.bgImgBox.w, C.bgImgBox.h);
  }

  // 2. キャラアイコン（BGの上）
  if (bpIconCroppedImg) {
    ctx.drawImage(bpIconCroppedImg, C.iconBox.x, C.iconBox.y, C.iconBox.w, C.iconBox.h);
  }

  // 3. base_bp.png（半透過前提）
  const baseImg = await loadImage(C.basePath);
  if (baseImg) {
    ctx.drawImage(baseImg, 0, 0, C.canvasW, C.canvasH);
  }

  // 4. クラスアイコン
  const classRadio = document.querySelector('input[name="class_bp"]:checked');
  const className  = classRadio ? classRadio.value : "";
  const classIconPath = CLASS_ICON_MAP[className];

  if (className) {
    drawShrinkText(className, C.className, getBpFont(), "#ffffff", "center");
  }
  if (classIconPath) {
    await drawIcon(classIconPath, C.classIcon);
  }

  // 5. PHOTO1-3
  if (bpPhoto1Img) drawImageCover(bpPhoto1Img, C.photo1);
  if (bpPhoto2Img) drawImageCover(bpPhoto2Img, C.photo2);
  if (bpPhoto3Img) drawImageCover(bpPhoto3Img, C.photo3);

  // 6. テキスト類
  const font = getBpFont();

  const name  = inpName_bp.value.trim();
  const id    = inpPlayerId_bp.value.trim();
  const guild = inpGuild_bp.value.trim();
  const like  = (inpLike_bp.value.trim() || "0");
  const rank  = (inpRank_bp.value.trim() || "1");
  const score = (inpScore_bp.value.trim() || "0");
  const level = (inpLevel_bp.value.trim() || "1");
  const playStyle = inpPlayStyle_bp.value.trim();
  const playTime  = inpPlayTime_bp.value.trim();
  const comment   = inpComment_bp.value.trim();

  // 白文字グループ
  drawShrinkText(name,      C.name,   font, "#ffffff", "left");
  drawShrinkText(id,        C.playerId, font, "#ffffff", "left");
  drawShrinkText(like,      C.like,  font, "#ffffff", "left");
  drawShrinkText(playTime,  C.playTime, font, "#ffffff", "left");
  drawShrinkText("Lv." + level, C.level, font, "#ffffff", "right");

  // 黒文字グループ
  drawShrinkText(rank,      C.rank,       font, "#000000", "right");
  drawShrinkText(score,     C.score,      font, "#000000", "right");
  drawShrinkText(guild,     C.guild,      font, "#000000", "left");
  drawShrinkText(playStyle, C.playStyle,  font, "#000000", "left");
  drawShrinkBlockLeft(comment, C.freeComment, font, "#000000");
}

// ブルプロ用フォント取得
function getBpFont() {
  const fontKey = document.querySelector('input[name="font_bp"]:checked')?.value || "A";
  return FONT_MAP[fontKey] || FONT_MAP["A"];
}

// ----------------------------------------
// 描画ヘルパー
// ----------------------------------------
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

// 中央寄せ・一行テキスト
function drawAutoCenteredText(text, box, fontFamily, colorHex) {
  if (!text) return;

  const padX = 12;
  const padY = 8;
  const maxW = box.w - padX * 2;
  const maxH = box.h - padY * 2;

  let size = Math.min(64, maxH);

  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  while (size > 8) {
    ctx.font = size + "px " + fontFamily;
    if (ctx.measureText(text).width <= maxW && size <= maxH) break;
    size--;
  }

  ctx.fillStyle = colorHex;
  const cx = box.x + box.w / 2;
  const cy = box.y + box.h / 2;
  ctx.fillText(text, cx, cy);
}

// 左寄せ・複数行：箱の高さベースで自動縮小
function drawShrinkBlockLeft(text, box, fontFamily, colorHex) {
  if (!text) return;

  const padX = 12;
  const padY = 8;
  const maxW = box.w - padX * 2;
  const maxH = box.h - padY * 2;

  text = text.replace(/\r/g, "").trim();
  const linesRaw = text.split(/\n/);

  let size = Math.floor(box.h * 0.5);
  if (size < 10) size = 10;

  ctx.textBaseline = "top";
  ctx.textAlign = "left";

  while (size > 8) {
    ctx.font = size + "px " + fontFamily;
    const lines = wrapLines(linesRaw, maxW);
    const totalH = lines.length * (size + 4);
    if (totalH <= maxH) {
      ctx.fillStyle = colorHex;
      let y = box.y + padY;
      for (const line of lines) {
        ctx.fillText(line, box.x + padX, y);
        y += size + 4;
      }
      return;
    }
    size--;
  }
}

// ブルプロ風：一行テキスト（左右/中央）
function drawShrinkText(text, box, fontFamily, colorHex, align = "left") {
  if (!text) return;

  const padX = 12;
  const padY = 4;
  const maxW = box.w - padX * 2;
  const maxH = box.h - padY * 2;

  let size = Math.floor(box.h * 0.8);
  if (size < 10) size = 10;

  ctx.textBaseline = "middle";
  ctx.textAlign = align;

  while (size > 8) {
    ctx.font = size + "px " + fontFamily;
    if (ctx.measureText(text).width <= maxW && size <= maxH) break;
    size--;
  }

  ctx.fillStyle = colorHex;
  let x;
  if (align === "right") {
    x = box.x + box.w - padX;
  } else if (align === "center") {
    x = box.x + box.w / 2;
  } else {
    x = box.x + padX;
  }
  const y = box.y + box.h / 2;
  ctx.fillText(text, x, y);
}

// テキスト改行ヘルパ
function wrapLines(lines, maxW) {
  const result = [];
  for (const line of lines) {
    const words = line.split(/(\s+)/);
    let current = "";
    for (const w of words) {
      const t = current + w;
      if (ctx.measureText(t).width > maxW && current) {
        result.push(current);
        current = w.trim();
      } else {
        current = t;
      }
    }
    if (current) result.push(current);
  }
  return result;
}

// ----------------------------------------
// Discord バナー ランダム表示
// ----------------------------------------
const banners = [
  "banner1.png",
  "banner2.png"
];

function showRandomBanner() {
  const banner = banners[Math.floor(Math.random() * banners.length)];
  const img = document.getElementById("randomBanner");
  if (!img) return;
  img.src = banner;
  img.style.maxWidth = "100%";
  img.style.height = "auto";
}

window.addEventListener("load", () => {
  showRandomBanner();
  drawPreview();
});
