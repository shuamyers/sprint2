'use strict';
console.log('sprint 2');

var gId=1;
var gImgs;
var gKeyWords;
var gCtx;

// var gMeme = {
//     selectedImgId: 5,
//     txts:[{
//         line: 'I never eat Falafel',
//         size: 20,
//         align: 'left',
//         color: 'red'
//     }]} 

function init(){
    gImgs =getImgs();
    renderImgs(gImgs); 
    gKeyWords= getKeyWordsSum(gImgs);
    console.log(gKeyWords);
    // renderKeyWords(gKeyWords);
}

function getKeyWordsSum(imgs) {
    var KeywordSums = imgs.reduce(function (acc, img) {
        img.keywords.forEach(function(keyword) {
            if (acc[keyword] >= 1) acc[keyword] += 1;
            else acc[keyword] = 1;
        });
        return acc;
    }, {});
    return KeywordSums;
}


function renderImgs(imgs) {

    var strHtmls = imgs.map(function (img, idx) {
        var strHtml = `
         <img class="img-"${img.id}"" src=""${img.url}"" alt="" onclick="handleImg(this)">
                `
        return strHtml
    });

    var elImgs = document.querySelector('.images-wrapper');
    elImgs.innerHtml = strHtmls.join('');

}

function getImgs(){
    var imgs = [];


    imgs.push(getImg('001',['funny','happy']));
    imgs.push(getImg('002',['funny','cool']));
    imgs.push(getImg('003',['funny','lol']));
    
    return imgs;
}

function getImg(imgId,keywords){
    return {
        id:gId++,
        url:'../img/'+imgId+'.jpg',
        keywords:keywords
         }
}

function handleImg(elImg) {

    var url = elImg.src;
    console.log(url);
    var elCanvas = document.querySelector('#imgCanvas');
    gCtx = elCanvas.getContext('2d');
    var imageObj = new Image();
      imageObj.onload = function () {
        drawImage(this);
      };
      imageObj.src = url;
}

function drawImage(imageObj) {
    var x = 0;//69;
    var y = 0;//50;

    gCtx.drawImage(imageObj, x, y);

    var imageData = gCtx.getImageData(x, y, imageObj.width, imageObj.height);
    var data = imageData.data;

  }


  function searchMemes(elSearch){
        var input =elSearch.value.toLowerCase();
        var filteredImgs = gImgs.filter(function(img){
            return img.keywords.some(function(word){
                    return (word.indexOf(input) > -1);
             });              
        })
        console.log(filteredImgs);
        // renderImgs(filteredImgs);
  }