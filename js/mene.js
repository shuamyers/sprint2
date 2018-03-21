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
                txt:"",
<<<<<<< HEAD
                x: 0,
                y: 70,
                size: 60,
=======
                y: 20,
                size: 20,
>>>>>>> b270bd3b783df6fcd7054044ce20879a430f3669
                align: "left",
                color: "#fff"
              },

             {
<<<<<<< HEAD
                txt:"",
                x: 0,
                y: 0,
                size: 60,
                align: "left",
                color: "red"
=======
                txt:"bottom",
                y: 300,
                size: 20,
                align: "center",
                color: "#fff"
>>>>>>> b270bd3b783df6fcd7054044ce20879a430f3669
             }
    ]
};

function init() {
    gImgs = getImgs();
    renderImgs(gImgs);
    gKeyWords = getKeyWordsSum(gImgs);
    console.log(gKeyWords);
    renderKeyWords(gKeyWords);
    renderControls()
}

function renderKeyWords(keywords) {
    var strHtmls = `
    <h2>Keywords:</h2>
    <ul class="keywords-bar flex flex-wrap clean-list">
    `;

    for (var key in keywords) {
        var fontSize = keywords[key] * 6;
        var strHtml = `
        <li onclick="getSearchWord(this)" style="font-size:${fontSize}px;">${key}</li>
               `;
        strHtmls += strHtml;
    }
    strHtmls += `</ul>`;
    var elkeyWordsBar = document.querySelector(".keywords-wrapper");
    console.log(strHtmls);
    elkeyWordsBar.innerHTML = strHtmls;
}



function renderImgs(imgs) {
    var strHtmls = imgs.map(function (img, idx) {
        var strHtml = `
         <img class="img-${img.id}" src="${
            img.url
            }" alt="" onclick="handleImg(${img.id})">
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

function getText(elInput , idx) {
    var txt = elInput.value;
    gMeme.txts[idx].txt = txt;
    handleImg(gMeme.selectedImgId);
}

function handleImg(id) {
    gMeme.selectedImgId = id;
    var img = gImgs.find(function (img) {
        return img.id === id;
    });
    var url = img.url;
    gElCanvas = document.querySelector("#imgCanvas");
    gCtx = gElCanvas.getContext("2d");
    gCtx.clearRect(0, 0, gCtx.canvas.width, gCtx.canvas.height);
    var imageObj = new Image();
    imageObj.src = url;
    gCtx.canvas.width  = imageObj.width;
    gCtx.canvas.height = imageObj.height;
    imageObj.onload = function () {
        drawImage(this, gElCanvas);
        if(!gMeme.txts[1].y) updateBottomTxt();
        gMeme.txts.forEach(function (line) {
            drawText(line);
        });
        // drawText(gMeme.txts[1].lineBottom);
    };
}



function drawText(line) {
    var x = gCtx.canvas.width / 2;
    var y = line.y;
<<<<<<< HEAD
    gCtx.font = `${line.size}px 'Segoe UI`;
=======
    gCtx.textAlign=line.align;
    gCtx.fillStyle = line.color;
    gCtx.font = "40px 'Segoe UI'";
>>>>>>> b270bd3b783df6fcd7054044ce20879a430f3669
    gCtx.fillText(line.txt, x, y);
}


function drawImage(img) {
    var x = 0;
    var y = 0;
    
    gCtx.drawImage( img, x, y, img.width, img.height );

    var imageData = gCtx.getImageData(x, y, img.width, img.height);
    var data = imageData.data;
}


function getSearchWord(elSearch) {
    var input = elSearch.value;
    if (input === 0) input = elSearch.innerText;
    searchMemes(input);
}

function searchMemes(input) {
    input = input.toLowerCase();
    console.log("here");
    var filteredImgs = gImgs.filter(function (img) {
        return img.keywords.some(function (word) {
            return word.toLowerCase().indexOf(input) > -1;
        });
    });
    renderImgs(filteredImgs);
}

function getKeyWordsSum(imgs) {
    var KeywordSums = imgs.reduce(function (acc, img) {
        img.keywords.forEach(function (keyword) {
            if (acc[keyword] >= 1) acc[keyword] += 1;
            else acc[keyword] = 1;
        });
        return acc;
    }, {});
    return KeywordSums;
}




function renderControls(){
    var strHtmls = gMeme.txts.map(function (line, idx) {
        var strHtml = `
        <div class="line-btn line-${idx}">
         <input type="text" class="top-line" onkeyup="getText(this,${idx})">
                    <ul class="flex clean-list">
                            <li><button><i class="fa fa-trash-alt"></i></button></li>
                        <li><input type="color" onchange="changeColor(this,${idx})"></input></li>
                        <li><button><i class="fa fa-font"></i></button></li>
<<<<<<< HEAD
                        <li><button><i class="fa fa-align-left"></i></button></li>
                        <li><button><i class="fa fa-align-justify"></i></button></li>
                        <li><button><i class="fa fa-align-right"></i></button></li>
                        <li><button onclick="moveTxt(-4,${idx})"><i class="fa fa-plus"></i></button></li>
                        <li><button onclick="moveTxt(4,${idx})"><i class="fa fa-minus"></i></button></li>
=======
                        <li><button onclick = "alignText('left',${idx})"><i class="fa fa-align-left"></i></button></li>
                        <li><button onclick = "alignText('center',${idx})"><i class="fa fa-align-justify"></i></button></li>
                        <li><button onclick = "alignText('right',${idx})"><i class="fa fa-align-right"></i></button></li>
                        <li><button><i class="fa fa-plus"></i></button></li>
                        <li><button><i class="fa fa-minus"></i></button></li>
>>>>>>> b270bd3b783df6fcd7054044ce20879a430f3669
                    </ul>
                </div>
        `
        return strHtml;
    });
    var elControls=document.querySelector('.controls');
    elControls.innerHTML=strHtmls.join("");
}

<<<<<<< HEAD
function moveTxt (move , idx) {
    gMeme.txts[idx].y += move;
    handleImg(gMeme.selectedImgId);
}

function updateBottomTxt () {
    gMeme.txts[1].y = (gCtx.canvas.height) - 50;
=======

function alignText(pram,idx){
    gMeme.txts[idx].align = pram;
    handleImg(gMeme.selectedImgId);
}

function changeColor(elColor,idx){
    var  color = elColor.value;
    gMeme.txts[idx].color = color;
    handleImg(gMeme.selectedImgId);
>>>>>>> b270bd3b783df6fcd7054044ce20879a430f3669
}