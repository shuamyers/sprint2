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
      textShadow:false,
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
    <input class="side-search clean-list" type="search" onkeyup=" runSearch(this)" placeholder=" Search">
    <h2>Keywords:<button class="keywords-all-btn" onclick="getAllKeywords()">All</button></h2>
    <ul class="keywords-bar flex flex-wrap clean-list">
    `;

    for (var key in keywords) {
    var fontSize = keywords[key] * 15;
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
function getAllKeywords(){
    renderImgs(gImgs);
}

function renderImgs(imgs) {
    var strHtmls = imgs.map(function(img, idx) {
        var strHtml = `
        <img class="img-${img.id}" src="${img.url}"
        alt="" onclick="renderCanvas(${img.id}); openPage();">
        `;
        return strHtml;
    });
    
  var elImgs = document.querySelector(".images-wrapper");
  elImgs.innerHTML = strHtmls.join("");
}

function getImgs() {
    var imgs = [];

  imgs.push(getImg("img/001.jpg" , ["happy"]));
  imgs.push(getImg("img/002.jpg" , ["rapper", "happy"]));
  imgs.push(getImg("img/003.jpg" , ["funny", "Trump"]));
  imgs.push(getImg("img/008.jpg" , ["traffic", "bad day"]));
  imgs.push(getImg("img/005.jpg" , ["baby", "dog"]));
  imgs.push(getImg("img/004.jpg" , ["dog", "puppy"]));
  imgs.push(getImg("img/007.jpg" , ["rich", "money"]));
  imgs.push(getImg("img/008.jpg" , ["traffic", "bad day"]));
  imgs.push(getImg("img/009.jpg" , ["happy", "food"]));
  imgs.push(getImg("img/010.jpg" , ["fart", "funny"]));
  imgs.push(getImg("img/003.jpg" , ["funny", "Trump"]));
  imgs.push(getImg("img/003.jpg" , ["funny", "Trump"]));
  
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
    // check if the elInput is div with content editable or just input type text.
    var txt = elInput.value ? elInput.value : elInput.innerText;
    if(elInput.value){
        document.querySelector(`.div-${idx}`).innerText = txt;
    }else{
        document.querySelector(`.input-${idx}`).value = txt;
    }
    gMeme.txts[idx].txt = txt;
    renderCanvas(gMeme.selectedImgId);
}

function renderCanvas(id) {
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
    var x = alignTextCords(line);
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
    gCtx.strokeText(line.txt, x, y);
    gCtx.fillText(line.txt, x, y);
}
function alignTextCords(line){
  if (line.align === 'center') return gCtx.canvas.width / 2;
  else if (line.align === 'left') return 0;
  else if (line.align === 'right') return  gCtx.canvas.width;
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
        <input type="text" class="line-input input-${idx}" onkeyup="getText(this,${idx})"
                placeholder="Enter your text here..." value="${gMeme.txts[idx].txt}">
            <ul class="flex clean-list">
                <li><button class="controls-btn" title="Delete line" onclick="deleteLine(${idx})"><i class="fa fa-trash-alt"></i></button></li>
                <li><input class="controls-btn"  title="Change color" type="color" onchange="changeColor(this,${idx})"value="#ffffff"></input></li>
                <li class="fonts-li">
                <select name="fonts" onchange="changeFont(this,${idx})">
                <option class="impact" value="Impact">Impact</option>
                <option class="arial" value="Arial">Arial</option>
                <option class="lucida" value="Lucida Console">Lucida</option>
                <option class="comic" value="Comic Sans MS">Comic</option>
                </select>
                </li>
                <li><button class="controls-btn" title="Text shadow" onclick = "addTextShadow(${idx})" ><i class="fa fa-pied-piper-pp"></i></button></li>
                <li><button class="controls-btn" title="Align left" onclick = "alignText('left',${idx})"><i class="fa fa-align-left"></i></button></li>
                <li><button class="controls-btn" title="Align center" onclick = "alignText('center',${idx})"><i class="fa fa-align-justify"></i></button></li>
                <li><button class="controls-btn" title="Align right" onclick = "alignText('right',${idx})"><i class="fa fa-align-right"></i></button></li>
                <li><button class="controls-btn" title="Increase font size " onclick="fontSizeChanger(4,${idx})"><i class="fa fa-plus"></i></button></li>
                <li><button class="controls-btn" title="decrease font size" onclick="fontSizeChanger(-4,${idx})"><i class="fa fa-minus"></i></button></li>
                <li><button class="controls-btn" title="Move up" onclick="moveTxt(-4,${idx})"><i class="fas fa-arrow-up"></i></button></li>
                <li><button class="controls-btn" title="Move down" onclick="moveTxt(4,${idx})"><i class="fas fa-arrow-down"></i></button></li>
            </ul>
        
        </div>
        `
        return strHtml;
    });
    
    var divHtmls =  gMeme.txts.map(function(line, idx){
        return `<div class="input-div div-${idx}" contenteditable="true" onkeyup="getText(this,${idx})"> </div>`   
    });
    strHtmls = strHtmls.join("");
    strHtmls += `<button class="add-line" onclick="addTxtLine()"><i class="fa fa-plus"></i> New line</button>`
    
    var elControls=document.querySelector('.controls');
    elControls.innerHTML = strHtmls;

    divHtmls = divHtmls.join("");
    var elCanvasWrapper = document.querySelector('.editable-div-container');
    elCanvasWrapper.innerHTML = divHtmls;
}


function changeFont(elFont,idx){
    gMeme.txts[idx].font = elFont.value;
    renderCanvas(gMeme.selectedImgId);
}
function addTextShadow(idx){
    var shadow =  gMeme.txts[idx].textShadow;
    gMeme.txts[idx].textShadow = (shadow)? false : true;
    renderCanvas(gMeme.selectedImgId);
}

function moveTxt(move, idx) {
    gMeme.txts[idx].y += move;
renderCanvas(gMeme.selectedImgId);
}

function updateBottomTxt() {
    gMeme.txts[1].y = gCtx.canvas.height - 50;
}

function alignText(pram, idx) {
    gMeme.txts[idx].align = pram;
    renderCanvas(gMeme.selectedImgId);
}

function fontSizeChanger(num ,idx) {
    gMeme.txts[idx].size += num;
    renderCanvas(gMeme.selectedImgId);
}

function openPage() {
    var elMainPage = document.querySelector('.main-page');
    var elMemePage = document.querySelector('.meme-page');
    var elSearch = document.querySelector('.nav-search');
    var elSearchBar = document.querySelector('.search-bar');
    elSearchBar.classList.toggle('hide');
    elSearch.classList.toggle('hide');
    elMainPage.classList.toggle('hide');
    elMemePage.classList.toggle('hide');
}
function changeColor(elColor, idx) {
  var color = elColor.value;
  gMeme.txts[idx].color = color;
  renderCanvas(gMeme.selectedImgId);
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
    renderCanvas(gMeme.selectedImgId);
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
    renderCanvas(gId-1);
    openPage();
    var elAddimg = document.querySelector('.add-img');
    elAddimg.classList.toggle('hide');
}

function reset(){
     gMeme = {
        selectedImgId: null,
        txts: [
            {txt: "",y: 70,size: 60,align: "center",color: "#fff",textShadow:false,font:'Impact'},
            {txt: "",y: 0,size: 60,align: "center",color: "#fff",textShadow:false,font:'Impact'}]
        };
    resetInputs()
 }

function resetInputs(){
    var elsInput=document.querySelectorAll('.line-input');
    elsInput.forEach(function(elInput){
        elInput.value='';
   })
}

function toggleMenu() {
  var navBar = document.getElementById('navBar');
  navBar.classList.toggle('open');
}

function toggleSearch(){
  var searchBar = document.querySelector('.keywords-wrapper');
  searchBar.classList.toggle('open');
}


// function getBtns(elDiv,idx){
//     var elLine0 = document.querySelector('.line-0');
//     var elLine1 = document.querySelector('.line-1');
//     if (idx == 0) {
//          elLine0.classList.remove('hide');
//          elLine1.classList.add('hide');
//     }else{
//         elLine1.classList.remove('hide');
//         elLine0.classList.add('hide');
//     }
// }