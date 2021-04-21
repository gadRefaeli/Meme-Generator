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
  document.querySelector('.my-memes').style.display = "block";
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


function getImageByMemeId(memeId) {
  var img = gImgs.find(function (img) {
    return (memeId === img.id)

  })
  return img.url;
}

function renderMyMemes() {
var savedMems=loadFromStorage('url');
var strHtmls=savedMems.map((savedUrl,idx) => {
  var img=new Image();
  img.onload=function(){
      context.drawImage(img,0,0);
  }
  img.src=savedUrl;
  return `
  <img class="meme-image" crossorigin="anonymous" onclick="onEditSavedMeme('${idx}')" src="${img.src}">
    `
})
  document.querySelector('.my-memes').innerHTML = strHtmls.join('');
}

 function onEditSavedMeme(sevedMemeIdx){
  var savedMems=loadFromStorage('memes');
  gCorentMeme = savedMems[sevedMemeIdx];
  setGmeme(gCorentMeme);
  renderCanvas();
  onGoToEdit();
}



// function renderMyMemes() {


//   var img = new Image();
//   img.onload = function () {
//     context.drawImage(img, 0, 0);
//   }
//   img.src = loadFromStorage('memes');

//   var memes = img.src
//   var strHtmls = memes.map(function (meme) {
//     return `  
//     <div class="img-box">
//     <img class="meme-image" src="${meme.url}" id="${meme.id}" onclick="onCreateMeme('${meme.id}')">
//       <div class="transparent-box" onclick="onCreateMeme('${meme.id}')">
//         <div class="caption">
//           <p class="opacity-low">${meme.keywords}</p>
//         </div>
//       </div>
//       </div>
//     `
//   }
//  document.querySelector('.my-memes').innerHTML = strHtmls;

//   )








// <div class="img-box">
// <img class="meme-image" src="${meme.url}" id="${meme.id}" onclick="onCreateMeme('${meme.id}')">
//   <div class="transparent-box" onclick="onCreateMeme('${meme.id}')">
//     <div class="caption">
//       <p class="opacity-low">${meme.keywords}</p>
//     </div>
//   </div>
//   </div>




// function getImageByMemeId(memeId) {
//   var img = gImgs.find(function (img) {
//     return (memeId === img.id)

//   })
//   return document.getElementById(`${img.id}`);
// }


// function renderMyMemes() {
//   var memes = getgCorentMeme()

//     var strHtmls = memes.map(function (meme) {
//       return `  
//       <div class="img-box">
//       <img class="meme-image" src="${dataURL}" id="${meme.id}" onclick="onCreateMeme('${meme.id}')">
//         <div class="transparent-box" onclick="onCreateMeme('${meme.id}')">
//           <div class="caption">
//             <p class="opacity-low">${meme.keywords}</p>
//           </div>
//         </div>
//         </div>
//       `
//     }

  // var strHtmls = `
  // <img class="meme-image" src=".\img\btn\image19.png"  id="${meme.id}" onclick="onCreateMeme('${meme.id}')">
  // `
  // document.querySelector('.my-memes').innerHTML = strHtmls;
  // var newMemeCanvas = document.getElementById('new-canvas');
  // var ctx = newMemeCanvas.getContext('2d');
  // console.log(ctx)
  // var curentImage = getImageByMemeId(1);
  // ;
  // ctx.drawImage(curentImage, 0, 0, 5, 5);

  //    gCorentMeme.lines.forEach((line) => {
  //    ctx.lineWidth = 1.5;
  //    ctx.strokeStyle = line.stroke;
  //   ctx.fillStyle = line.color;
  //    ctx.font = `${line.size}px impact`;
  //    var cordX = gAlign[line.align];
  //    ctx.fillText(line.txt, cordX, line.linehight);
  //    ctx.strokeText(line.txt, cordX, line.linehight);
  //  });




































// function addListeners() {
//   addMouseListeners()
//   addTouchListeners()
//   window.addEventListener('resize', () => {
//       renderCanvas()
//   })
// }

// function addMouseListeners() {
//   gCanvas.addEventListener('mousemove', onMove)
//   gCanvas.addEventListener('mousedown', onDown)
//   gCanvas.addEventListener('mouseup', onUp)
// }

// function addTouchListeners() {
//   gCanvas.addEventListener('touchmove', onMove)
//   gCanvas.addEventListener('touchstart', onDown)
//   gCanvas.addEventListener('touchend', onUp)
// }

// function onDown(ev) {
//   const pos = getEvPos(ev)
//   if (!isCirlceClicked(pos)) return
//   gCircle.isDragging = true
//   gStartPos = pos
//   document.body.style.cursor = 'grabbing'

// }

// function onMove(ev) {
//   if (gCircle.isDragging) {
//       const pos = getEvPos(ev)
//       const dx = pos.x - gStartPos.x
//       const dy = pos.y - gStartPos.y

//       gCircle.pos.x += dx
//       gCircle.pos.y += dy

//       gStartPos = pos
//       renderCanvas()
//   }
// }

// function onUp() {
//   gCircle.isDragging = false
//   document.body.style.cursor = 'grab'
// }

// function resizeCanvas() {
//   const elContainer = document.querySelector('.canvas-container')
//   gElCanvas.width = elContainer.offsetWidth
//   gElCanvas.height = elContainer.offsetHeight
// }

// function getEvPos(ev) {
//   var pos = {
//       x: ev.offsetX,
//       y: ev.offsetY
//   }
//   if (gTouchEvs.includes(ev.type)) {
//       ev.preventDefault()
//       ev = ev.changedTouches[0]
//       pos = {
//           x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
//           y: ev.pageY - ev.target.offsetTop - ev.target.clientTop
//       }
//   }
//   return pos
// }

// function isCirlceClicked(clickedPos) {
//   const { pos } = gCircle
//   const distance = Math.sqrt((pos.x - clickedPos.x) ** 2 + (pos.y - clickedPos.y) ** 2)
//   return distance <= gCircle.size
// }
