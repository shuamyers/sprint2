"use strict";
console.log("sprint 2");

var gId = 1;
var gImgs;
var gKeyWords;
var gElCanvas;
var gCtx;

var gMeme = {
  selectedImgId: null,
  txts: [
    {
      txt: "",
      y: 70,
      size: 60,
      align: "center",
      color: "#fff",
      textShadow:true,
      font:'Impact'
    },
    {
      txt: "",
      y: 0,
      size: 60,
      align: "center",
      color: "#fff",
      textShadow:false,
      font:'Impact'
    }
  ]
};

function init() {
  gImgs = getImgs();
  renderImgs(gImgs);
  gKeyWords = getKeyWordsSum(gImgs);
  console.log(gKeyWords);
  renderKeyWords(gKeyWords);
  renderControls();
}

function renderKeyWords(keywords) {
  var strHtmls = `
    <h2>Keywords:</h2>
    <ul class="keywords-bar flex flex-wrap clean-list">
    `;

  for (var key in keywords) {
    var fontSize = keywords[key] * 6;
    var strHtml = `
        <li onclick="runSearch(this)" style="font-size:${fontSize}px;">${key}</li>
               `;
    strHtmls += strHtml;
  }
  strHtmls += `</ul>`;
  var elKeyWordsBar = document.querySelector(".keywords-wrapper");
  console.log(strHtmls);
  elKeyWordsBar.innerHTML = strHtmls;
}

function renderImgs(imgs) {
  var strHtmls = imgs.map(function(img, idx) {
    var strHtml = `
         <img class="img-${img.id}" src="${img.url}"
         alt="" onclick="handleImg(${img.id}); openPage();">
                `;
    return strHtml;
  });

  var elImgs = document.querySelector(".images-wrapper");
  elImgs.innerHTML = strHtmls.join("");
}

function getImgs() {
  var imgs = [];

  imgs.push(getImg(`img/001.jpg` , ["funny", "happy"]));
  imgs.push(getImg("img/002.jpg" , ["funny", "happy"]));
  imgs.push(getImg("img/003.jpg" , ["funny"]));
  imgs.push(getImg("img/003.jpg" , ["funny", "funny"]));
  imgs.push(getImg("img/003.jpg" , ["Trump", "important"]));
  imgs.push(getImg("img/003.jpg" , ["Trump", "important"]));
  imgs.push(getImg("img/003.jpg" , ["Trump", "important"]));
  imgs.push(getImg("img/003.jpg" , ["Trump", "Trump"]));
  imgs.push(getImg("img/003.jpg" , ["happy", "Trump"]));
  imgs.push(getImg("img/003.jpg" , ["Trump", "important"]));
  imgs.push(getImg("img/003.jpg" , ["Trump", "Trump"]));
  imgs.push(getImg("img/003.jpg" , ["important", "Trump"]));

  return imgs;
}

function getImg( url , keywords) {
  return {
    id: gId++,
    url: url,
    keywords: keywords
  };
}

function getText(elInput, idx) {
  var txt = elInput.value;
  gMeme.txts[idx].txt = txt;
  handleImg(gMeme.selectedImgId);
}

function handleImg(id) {
  gMeme.selectedImgId = id;
  var img = gImgs.find(function(img) {
    return img.id === id;
  });
  var url = img.url;
  gElCanvas = document.querySelector("#imgCanvas");
  gCtx = gElCanvas.getContext("2d");
  gCtx.clearRect(0, 0, gCtx.canvas.width, gCtx.canvas.height);
  var imageObj = new Image();
  imageObj.src = url;
  imageObj.onload = function() {
    gCtx.canvas.width = imageObj.width;
    gCtx.canvas.height = imageObj.height;
    drawImage(this, gElCanvas);
    // debugger
    if (!gMeme.txts[1].y) updateBottomTxt();
    gMeme.txts.forEach(function(line) {
      drawText(line);
    });
    // drawText(gMeme.txts[1].lineBottom);
  };
}

function drawText(line) {
  var x = gCtx.canvas.width / 2;
  var y = line.y;
  gCtx.font = `${line.size}px ${line.font}`;
  gCtx.textAlign = line.align;
  gCtx.fillStyle = line.color;
  if (line.textShadow) {
    gCtx.shadowColor = '#999';
    gCtx.shadowBlur = 20;
    gCtx.shadowOffsetX = 15;
    gCtx.shadowOffsetY = 15;
  } else {
    gCtx.shadowColor = 'rgba(0,0,0,0)';
    gCtx.shadowBlur = 0;
    gCtx.shadowOffsetX = 0;
    gCtx.shadowOffsetY = 0;
  }
  gCtx.fillText(line.txt, x, y);
}

function drawImage(img) {
  var x = 0;
  var y = 0;
  console.log(gCtx)
  gCtx.drawImage(img, x, y, img.width, img.height);

  // var imageData = gCtx.getImageData(x, y, img.width, img.height);
  // var data = imageData.data;
}

function runSearch(elSearch){
    var input = elSearch.value;
    if (input === 0) input = elSearch.innerText;
    var filteredImgs = filterByKeyword(input, gImgs)
    renderImgs(filteredImgs)
}

function filterByKeyword(input,imgs) {
  input = input.toLowerCase();
  console.log("here");
  var filteredImgs = gImgs.filter(function(img) {
    return img.keywords.some(function(word) {
      return word.toLowerCase().indexOf(input) > -1;
    });
  });
    return filteredImgs
}

function getKeyWordsSum(imgs) {
  var KeywordSums = imgs.reduce(function(acc, img) {
    img.keywords.forEach(function(keyword) {
      if (acc[keyword] >= 1) acc[keyword] += 1;
      else acc[keyword] = 1;
    });
    return acc;
  }, {});
  return KeywordSums;
}

function renderControls() {
  var strHtmls = gMeme.txts.map(function(line, idx) {
    var strHtml = `
        <div class="line-btn line-${idx}">
         <input type="text" class="line-input" onkeyup="getText(this,${idx})"
             placeholder="Enter your text here..." value="${gMeme.txts[idx].txt}">
                    <ul class="flex clean-list">
                            <li><button class="controls-btn" onclick="deleteLine(${idx})"><i class="fa fa-trash-alt"></i></button></li>
                        <li><input class="controls-btn" type="color" onchange="changeColor(this,${idx})"></input></li>
                        <li class="fonts-li">
                            <select name="fonts" onchange="changeFont(this,${idx})">
                                <option class="arial" value="Arial">Arial</option>
                                <option class="impact" value="Impact">Impact</option>
                                <option class="lucida" value="Lucida Console">Lucida</option>
                                <option class="comic" value="Comic Sans MS">Comic</option>
                            </select>
                        </li>
                        <li><button class="controls-btn" onclick = "addTextShadow(${idx})" ><i class="fa fa-pied-piper-pp"></i></button></li>
                        <li><button class="controls-btn" onclick = "alignText('left',${idx})"><i class="fa fa-align-left"></i></button></li>
                        <li><button class="controls-btn" onclick = "alignText('center',${idx})"><i class="fa fa-align-justify"></i></button></li>
                        <li><button class="controls-btn" onclick = "alignText('right',${idx})"><i class="fa fa-align-right"></i></button></li>
                        <li><button class="controls-btn" onclick="fontSizeChanger(4,${idx})"><i class="fa fa-plus"></i></button></li>
                        <li><button class="controls-btn" onclick="fontSizeChanger(-4,${idx})"><i class="fa fa-minus"></i></button></li>
                        <li><button class="controls-btn" onclick="moveTxt(-4,${idx})"><i class="fas fa-arrow-up"></i></button></li>
                        <li><button class="controls-btn" onclick="moveTxt(4,${idx})"><i class="fas fa-arrow-down"></i></button></li>
                    </ul>
                
                </div>
        `
        return strHtml;
    });
    strHtmls = strHtmls.join("");
    strHtmls += `<button class="add-line" onclick="addTxtLine()"><i class="fa fa-plus"></i> New line</button>`
    var elControls=document.querySelector('.controls');
    elControls.innerHTML=strHtmls;
}


function changeFont(elFont,idx){
    gMeme.txts[idx].font = elFont.value;
    handleImg(gMeme.selectedImgId);
}
function addTextShadow(idx){
    var shadow =  gMeme.txts[idx].textShadow;
    gMeme.txts[idx].textShadow = (shadow)? false : true;
    handleImg(gMeme.selectedImgId);
}

function moveTxt(move, idx) {
  gMeme.txts[idx].y += move;
  handleImg(gMeme.selectedImgId);
}

function updateBottomTxt() {
  gMeme.txts[1].y = gCtx.canvas.height - 50;
}

function alignText(pram, idx) {
  gMeme.txts[idx].align = pram;
  handleImg(gMeme.selectedImgId);
}

function fontSizeChanger(num ,idx) {
    gMeme.txts[idx].size += num;
    handleImg(gMeme.selectedImgId);
}

function openPage() {
    var elMainPage = document.querySelector('.main-page');
    var elMemePage = document.querySelector('.meme-page');
    elMainPage.classList.toggle('hide');
    elMemePage.classList.toggle('hide');
}
function changeColor(elColor, idx) {
  var color = elColor.value;
  gMeme.txts[idx].color = color;
  handleImg(gMeme.selectedImgId);
}

function addTxtLine() {
    if(gMeme.txts.length > 3)return;
    var newLine = 
        {
    txt: "",
    y: 70,
    size: 60,
    align: "center",
    color: "#fff",
    textShadow:false,
    font:'Impact'
  };
    gMeme.txts.push(newLine);
    renderControls();
}


function deleteLine (idx) {
    if(gMeme.txts.length < 3) return;
    gMeme.txts.splice(idx, 1);
    renderControls();
    handleImg(gMeme.selectedImgId);
}


function downloadData(elLink) {
    var canvas = document.getElementById("imgCanvas");
    var img  = canvas.toDataURL("image/png");
    elLink.href = `${img}`;
}


function openModal(){
  document.querySelector('.modal').classList.add('modal-open');
  var elAddimg = document.querySelector('.add-img');
  elAddimg.classList.toggle('hide');
}

function closeModal(){
  document.querySelector('.modal').classList.remove('modal-open');
  var elAddimg = document.querySelector('.add-img');
  elAddimg.classList.toggle('hide');
}

function addImg () {
  var url = document.querySelector('.uploud-url');
  gImgs.push(getImg(`${url.value}`, ["funny", "happy"]));
  renderImgs(gImgs);
  closeModal();
  handleImg(gId-1);
  openPage();
  var elAddimg = document.querySelector('.add-img');
  elAddimg.classList.toggle('hide');
}
