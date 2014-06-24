/* jshint unused:false */
/* global G_vmlCanvasManager */
/* jshint camelcase: false */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('.login').click(login);
    $('#generate').click(change);
    $('#save').click(saveImage);
    imagePicker();
  }

  function saveImage() {
    var canvas = document.getElementById('canvas');
    var image = canvas.toDataURL('image/jpg');
    var canvasImg = document.getElementById('canvasImg');
    canvasImg.src = image;

    var link = document.createElement('a');
      link.download = 'test.jpg';
      link.href = canvas.toDataURL('image/jpg');
      link.click();
  }

  function imagePicker() {
    $('select').imagepicker({limit:1});
  }

  function login(e) {
    $('#login').modal();
    e.preventDefault();
  }

  var canvas;
  var context;
  var canvasWidth = 700;
  var canvasHeight = 500;
  var clickX = [];
  var clickY = [];
  var clickDrag = [];
  var paint;
  var colorYellow = '#F5E53D';
  var colorOrange = '#EA861B';
  var colorRed = '#E92216';
  var colorPink = '#E97E9D';
  var colorPurple = '#9F4B94';
  var colorBlue = '#0085FE';
  var colorGreen = '#00AC2F';
  var colorBrown = '#583518';
  var colorGray = '#A1A1A2';
  var colorBlack = '#000000';
  var colorWhite = '#FFFFFF';
  var curColor;
  var clickColor = [];
  var clickSize = [];
  var curSize;
  var outlineImage = new Image();

  var drawingAreaX = 0;
  var drawingAreaY = 0;
  var drawingAreaWidth = 700;
  var drawingAreaHeight = 500;

  var totalLoadResources = 1;
  var curLoadResNum = 0;

  function resourceLoaded() {
    if(++curLoadResNum >= totalLoadResources - 1) {
      console.log('resource loaded');
      redraw();
    }
  }

  var canvasDiv = document.getElementById('canvasDiv');
  canvas = document.createElement('canvas');
  canvas.setAttribute('width', canvasWidth);
  canvas.setAttribute('height', canvasHeight);
  canvas.setAttribute('id', 'canvas');
  canvasDiv.appendChild(canvas);
  if(typeof G_vmlCanvasManager !== 'undefined') {
  	canvas = G_vmlCanvasManager.initElement(canvas);
  }
  context = canvas.getContext('2d');

  function change() {
    outlineImage.onload = function() {resourceLoaded();};
    var imageSource = $('#drawing').find(':selected').data('picture');
    outlineImage.src = imageSource;
    if(imageSource) {
      redraw();
    } else {
      clearCanvas();
    }
  }

  $('#canvas').mousedown(function(e){
    $('#canvas').offset({right: -146, bottom: -421});
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;

    paint = true;
    addClick(mouseX, mouseY, false);
    redraw();
  });

  $('#canvas').mousemove(function(e){
    if(paint){
      $('#canvas').offset({right: -146, bottom: -421});

      addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
      redraw();
    }
  });

  $('#canvas').mouseup(function(e){
    paint = false;
    redraw();
  });

  $('#canvas').mouseleave(function(e){
    paint = false;
  });

  $('#chooseYellow').mousedown(function(e) {
    curColor = colorYellow;
  });

  $('#chooseOrange').mousedown(function(e) {
    curColor = colorOrange;
  });

  $('#chooseRed').mousedown(function(e) {
    curColor = colorRed;
  });

  $('#choosePink').mousedown(function(e) {
    curColor = colorPink;
  });

  $('#choosePurple').mousedown(function(e) {
    curColor = colorPurple;
  });

  $('#chooseBlue').mousedown(function(e) {
    curColor = colorBlue;
  });

  $('#chooseGreen').mousedown(function(e) {
    curColor = colorGreen;
  });

  $('#chooseBrown').mousedown(function(e) {
    curColor = colorBrown;
  });

  $('#chooseGray').mousedown(function(e) {
    curColor = colorGray;
  });

  $('#chooseBlack').mousedown(function(e) {
    curColor = colorBlack;
  });

  $('#chooseWhite').mousedown(function(e) {
    curColor = colorWhite;
  });

  $('#chooseSmall').mousedown(function(e) {
    curSize = 'small';
  });

  $('#chooseMedium').mousedown(function(e) {
    curSize = 'medium';
  });

  $('#chooseLarge').mousedown(function(e) {
    curSize = 'large';
  });

  $('#chooseExtraLarge').mousedown(function(e) {
    curSize = 'extra large';
  });

  $('#clearCanvas').mousedown(function(e) {
    clickX = [];
    clickY = [];
    clickDrag = [];
    clickColor = [];
    clickSize = [];
    clearCanvas();
    redraw();
   });

  function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    clickColor.push(curColor);
    clickSize.push(curSize);
  }

  function clearCanvas() {
	  context.clearRect(0, 0, canvasWidth, canvasHeight);
  }

  function redraw(){
    clearCanvas();
    var radius;
    context.lineJoin = 'round';

    for(var i=0; i < clickX.length; i++) {
      if(clickSize[i] === 'small'){
        radius = 2;
      }else if(clickSize[i] === 'medium'){
        radius = 5;
      }else if(clickSize[i] === 'large'){
        radius = 10;
      }else if(clickSize[i] === 'extra large'){
        radius = 20;
      }

      context.beginPath();
      if(clickDrag[i] && i){
        context.moveTo(clickX[i-1], clickY[i-1]);
      }else{
        context.moveTo(clickX[i]-1, clickY[i]);
      }
      context.lineTo(clickX[i], clickY[i]);
      context.closePath();
      context.strokeStyle = clickColor[i];
      context.lineWidth = radius;
      context.stroke();
    }

    context.drawImage(outlineImage, drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
  }

})();

function ajax(url, type, data={}, success=r=>console.log(r), dataType='json'){
  'use strict';
  $.ajax({url:url, type:type, dataType:dataType, data:data, success:success});
}
