'use strict';
console.log('sprint 2');

var gId=1;
var gImgs;

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
}

function renderImgs(imgs) {

    var strHtmls = imgs.map(function (img, idx) {
        var strHtml = `
         <img class="img-"${img.id}"" src=""${img.url}"" alt="" onclick="handleImg(this)">
                `
        return strHtml
    });

    var elImgs = document.querySelector('.images-wrapper')
    elImgs.innerHtml = strHtmls.join('');

}

function getImgs(){
    var imgs = [];


    imgs.push(getImg('001',['funny','happy']));
    imgs.push(getImg('002',['funny','happy']));
    imgs.push(getImg('003',['funny','happy']));
    
    return imgs;
}

function getImg(imgId,keywords){
    return {
        id:gId++,
        url:'../img/'+imgId+'.jpg',
        keywords:keywords
}}