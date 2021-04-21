`use strict`
var gImg;
var gCorentMeme;
var gCanvas;
var gCtx;
var dataURL;

var gAlign = {
  'center': 100,
  'left': 0,
  'right': 300
};
function onInit() {
  renderGallery()
  renderMyMemes()
}
function renderGallery() {
  var memes = getImages()
  var strHtmls = memes.map(function (meme) {
    return `  
    <div class="img-box">
    <img class="meme-image" src="${meme.url}" id="${meme.id}" onclick="onCreateMeme('${meme.id}')">
      <div class="transparent-box" onclick="onCreateMeme('${meme.id}')">
        <div class="caption">
          <p class="opacity-low">${meme.keywords}</p>
        </div>
      </div>
      </div>
    `
  })
  document.querySelector('.gallery').innerHTML = strHtmls.join('');
}
function renderCanvas() {
  gCanvas = document.getElementById('canvas')
  gCtx = gCanvas.getContext('2d');

  gCtx.drawImage(gImg, 0, 0, gCanvas.width, gCanvas.height)

  gCorentMeme.lines.forEach((line) => {
    gCtx.lineWidth = 1.5;
    gCtx.strokeStyle = line.stroke;
    gCtx.fillStyle = line.color;
    gCtx.font = `${line.size}px impact`;
    var cordX = gAlign[line.align];
    gCtx.fillText(line.txt, cordX, line.linehight);
    gCtx.strokeText(line.txt, cordX, line.linehight);
  });
  dataURL = gCanvas.toDataURL("image/jpeg");

}
function renderSetting() {
  var strHtmls = `
    <input class="input-txt" type="text" id="text" value="${gCorentMeme.lines[gCorentMeme.selectedLineIdx].txt}" onkeyup="onSetText(this.value)">
    `
  document.querySelector('.input').innerHTML = strHtmls;
}
function renderMyMemes() {
  var savedMems = loadFromStorage('url');
  var strHtmls = savedMems.map((savedUrl, idx) => {
    var img = new Image();
    img.src = savedUrl;
    return `
  <img class="meme-image" crossorigin="anonymous" onclick="onEditSavedMeme('${idx}')" src="${img.src}">
    `
  })
  document.querySelector('.my-memes').innerHTML = strHtmls.join('');
}
function onCreateMeme(elMemeId) {


  gImg = document.getElementById(`${elMemeId}`);
  createMeme(elMemeId);
  gCorentMeme = getMeme();
  renderCanvas()
  onGoToEdit();
}
function onSetText(elTxt) {
  setText(elTxt)
  renderCanvas();
}
function onGoToGallery() {
  document.querySelector('.edit-meme').style.display = "none";
  document.querySelector('.gallery').style.display = "flex";
  document.querySelector('.gallery-header').style.display = "flex";
  document.querySelector('.my-memes').style.display = "none";
}
function onGoToEdit() {
  document.querySelector('.edit-meme').style.display = "flex";
  document.querySelector('.gallery').style.display = "none";
  document.querySelector('.gallery-header').style.display = "none";
  document.querySelector('.my-memes').style.display = "none";
}
function onGoToMyMemes() {
  document.querySelector('.my-memes').style.display = "flex";
  document.querySelector('.edit-meme').style.display = "none";
  document.querySelector('.gallery').style.display = "none";
  document.querySelector('.gallery-header').style.display = "none";
}
function downloadCanvas(elLink) {
  const data = gCanvas.toDataURL()
  elLink.href = data
  elLink.download = 'youre art'
}
function onSetAlign(elAlign) {
  setAlign(elAlign);
  renderCanvas()
}
function onResizeTxt(diff) {
  setTxtSize(diff);
  renderCanvas()
}
function onSetColorText(elColor) {
  setColorText(elColor)
  renderCanvas()
}
function onSetColorStroke(elColor) {
  setColorStroke(elColor)
  renderCanvas()
}
function onSetLineHight(elLineHight) {
  setLineHight(elLineHight);
  renderCanvas()
}
function onAddLine() {
  addLine();
  renderCanvas()
  renderSetting()
}
function onMoveLine() {
  moveLine();
  renderCanvas()
  renderSetting()
  addRect()
}
function onDeleteLine() {
  deleteLine();
  renderCanvas()
  renderSetting()
}
function addRect() {
  var line = gCorentMeme.lines[gCorentMeme.selectedLineIdx];
  cordX = gAlign[line.align];
  var width = gCtx.measureText(line.txt).width;
  gCtx.strokeRect(cordX - 20, line.linehight - line.size, width + 40, line.size + 20);
}
function toggleMenu() {
  document.body.classList.toggle('menu-open')
}
function onSaveCanvas() {
  saveCanvas()
  renderMyMemes()
}
function onEditSavedMeme(sevedMemeIdx) {
  var savedMems = loadFromStorage('memes');
  gCorentMeme = savedMems[sevedMemeIdx];
  setGmeme(gCorentMeme);
  gImg = document.getElementById(gCorentMeme.selectedImgId);
  renderCanvas();
  onGoToEdit();
}
function onShare(elLink) {
  var imgContent = gElCanvas.toDataURL('image/jpeg')
  elLink.href = imgContent
}
