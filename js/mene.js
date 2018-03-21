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
         alt="" onclick="handleImg(${img.id})">
                `;
    return strHtml;
  });

  var elImgs = document.querySelector(".images-wrapper");
  elImgs.innerHTML = strHtmls.join("");
}

function getImgs() {
  var imgs = [];

  imgs.push(getImg("001", ["funny", "happy"]));
  imgs.push(getImg("002", ["funny", "happy"]));
  imgs.push(getImg("003", ["funny"]));
  imgs.push(getImg("002", ["funny", "funny"]));
  imgs.push(getImg("003", ["Trump", "important"]));
  imgs.push(getImg("002", ["Trump", "important"]));
  imgs.push(getImg("003", ["Trump", "important"]));
  imgs.push(getImg("002", ["Trump", "Trump"]));
  imgs.push(getImg("003", ["happy", "Trump"]));
  imgs.push(getImg("003", ["Trump", "important"]));
  imgs.push(getImg("002", ["Trump", "Trump"]));
  imgs.push(getImg("003", ["important", "Trump"]));

  return imgs;
}

function getImg(imgId, keywords) {
  return {
    id: gId++,
    url: "../img/" + imgId + ".jpg",
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
  gCtx.canvas.width = imageObj.width;
  gCtx.canvas.height = imageObj.height;
  imageObj.onload = function() {
    drawImage(this, gElCanvas);
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

  gCtx.drawImage(img, x, y, img.width, img.height);

  var imageData = gCtx.getImageData(x, y, img.width, img.height);
  var data = imageData.data;
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
         <input type="text" class="top-line" onkeyup="getText(this,${idx})">
                    <ul class="flex clean-list">
                            <li><button><i class="fa fa-trash-alt"></i></button></li>
                        <li><input type="color" onchange="changeColor(this,${idx})"></input></li>
                        <li><button><i class="fa fa-font"></i></button></li>
                        <li><button onclick = "addTextShadow(${idx})" ><i class="fa fa-pied-piper-pp"></i></button></li>
                        <li><button onclick = "alignText('left',${idx})"><i class="fa fa-align-left"></i></button></li>
                        <li><button onclick = "alignText('center',${idx})"><i class="fa fa-align-justify"></i></button></li>
                        <li><button onclick = "alignText('right',${idx})"><i class="fa fa-align-right"></i></button></li>
                        <li><button onclick="fontSizeChanger(4,${idx})"><i class="fa fa-plus"></i></button></li>
                        <li><button onclick="fontSizeChanger(-4,${idx})"><i class="fa fa-minus"></i></button></li>
                        <li><button onclick="moveTxt(-4,${idx})"><i class="fas fa-arrow-up"></i></button></li>
                        <li><button onclick="moveTxt(4,${idx})"><i class="fas fa-arrow-down"></i></button></li>
                    </ul>
                
                </div>
        `;
    return strHtml;
  });
  var elControls = document.querySelector(".controls");
  elControls.innerHTML = strHtmls.join("");
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

function changeColor(elColor, idx) {
  var color = elColor.value;
  gMeme.txts[idx].color = color;
  handleImg(gMeme.selectedImgId);
}

function fontSizeChanger(num, idx) {
  gMeme.txts[idx].size += num;
  handleImg(gMeme.selectedImgId);
}
