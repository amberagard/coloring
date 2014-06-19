/* jshint unused:false */
/*global G_vmlCanvasManager */
/* jshint camelcase: false */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('.login').click(login);
    imagePicker();
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
  // var colorYellow = {};
  // colorYellow.r = 245;
  // colorYellow.g = 229;
  // colorYellow.b = 61;
  var colorOrange = '#EA861B';
  // var colorOrange = {};
  // colorOrange.r = 234;
  // colorOrange.g = 134;
  // colorOrange.b = 27;
  var colorRed = '#E92216';
  // var colorRed = {};
  // colorRed.r = 233;
  // colorRed.g = 34;
  // colorRed.b = 22;
  var colorPink = '#E97E9D';
  // var colorPink = {};
  // colorPink.r = 233;
  // colorPink.g = 126;
  // colorPink.b = 157;
  var colorPurple = '#9F4B94';
  // var colorPurple = {};
  // colorPurple.r = 159;
  // colorPurple.g = 75;
  // colorPurple.b = 148;
  var colorBlue = '#0085FE';
  // var colorBlue = {};
  // colorBlue.r = 0;
  // colorBlue.g = 133;
  // colorBlue.b = 254;
  var colorGreen = '#00AC2F';
  // var colorGreen = {};
  // colorGreen.r = 0;
  // colorGreen.g = 172;
  // colorGreen.b = 47;
  var colorBrown = '#583518';
  // var colorBrown = {};
  // colorBrown.r = 88;
  // colorBrown.g = 53;
  // colorBrown.b = 24;
  var colorGray = '#A1A1A2';
  // var colorGray = {};
  // colorGray.r = 161;
  // colorGray.g = 161;
  // colorGray.b = 162;
  var colorBlack = '#000000';
  // var colorBlack = {};
  // colorBlack.r = 0;
  // colorBlack.g = 0;
  // colorBlack.b = 0;
  var colorWhite = '#FFFFFF';
  // var colorWhite = {};
  // colorWhite.r = 255;
  // colorWhite.g = 255;
  // colorWhite.b = 255;
  var curColor;
  var clickColor = [];
  var clickSize = [];
  var curSize;
  // var mediumStartX = 18;
  // var mediumStartY = 19;
  // var mediumImageWidth = 93;
  // var mediumImageHeight = 46;
  var outlineImage = new Image();
  // var paintImage = new Image();
  // var backgroundImage = new Image();
  //var pixelStack= [];

  var drawingAreaX = 0;
  var drawingAreaY = 0;
  var drawingAreaWidth = 700;
  var drawingAreaHeight = 500;

  var totalLoadResources = 8;
  var curLoadResNum = 0;

  // var colorLayerData;
  // var clickedColorR;
  // var clickedColorG;
  // var clickedColorB;
  // var clickedcolorA;
  // var newColorR;
  // var newColorG;
  // var newColorB;
  //var outlineLayerData;
  // var pixelVisited;
  // var pixelsDrawn;
  // var paths = [];
  // var neighbors = [[1, 0], [0, -1], [-1, 0], [0, 1], [1, 1], [1, -1], [-1, -1], [-1, 1]];
  // var curColorIndex = 0;
  //var color = [colorYellow, colorOrange, colorRed, colorPink, colorPurple, colorBlue, colorGreen, colorBrown, colorGray, colorBlack, colorWhite];

  function resourceLoaded() {
    if(++curLoadResNum >= totalLoadResources - 1) {
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

  // outlineImage.onload = function() {
  //   // context.drawImage(outlineImage, drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
  //   // outlineLayerData = context.getImageData(0, 0, canvasWidth, canvasHeight);
  //   // clearCanvas();
  //   // colorLayerData = context.getImageData(0, 0, canvasWidth, canvasHeight);
  //   resourceLoaded();
  // };
	// outlineImage.src = 'img/watermelonduck.png';

  $('#drawing').change(function() {
    outlineImage.onload = function() {resourceLoaded();};
    var imageSource = $(this).find(':selected').data('picture');
    outlineImage.src = imageSource;
    if(imageSource) {
      $('#canvasDiv').css('background-image', '<img src="'+outlineImage.src+'">');
    }
  });

  $('#canvas').mousedown(function(e){
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;

    // if(mouseX < drawingAreaX) {
    //   if(mouseX > mediumStartX) {
    //     if(mouseY > mediumStartY && mouseY < mediumStartY + mediumImageHeight) {
    //       curColorIndex = 0;
    //       curColor = colorYellow;
    //       redraw();
    //     } else if(mouseY > mediumStartY + mediumImageHeight && mouseY < mediumStartY + mediumImageHeight * 2) {
    //       curColorIndex = 1;
    //       curColor = colorOrange;
    //       redraw();
    //     } else if(mouseY > mediumStartY + mediumImageHeight * 2 && mouseY < mediumStartY + mediumImageHeight * 3) {
    //       curColorIndex = 2;
    //       curColor = colorRed;
    //       redraw();
    //     } else if(mouseY > mediumStartY + mediumImageHeight * 3 && mouseY < mediumStartY + mediumImageHeight * 4) {
    //       curColorIndex = 3;
    //       curColor = colorPink;
    //       redraw();
    //     } else if(mouseY > mediumStartY + mediumImageHeight * 4 && mouseY < mediumStartY + mediumImageHeight * 5) {
    //       curColorIndex = 4;
    //       curColor = colorPurple;
    //       redraw();
    //     } else if(mouseY > mediumStartY + mediumImageHeight * 5 && mouseY < mediumStartY + mediumImageHeight * 6) {
    //       curColorIndex = 5;
    //       curColor = colorBlue;
    //       redraw();
    //     } else if(mouseY > mediumStartY + mediumImageHeight * 6 && mouseY < mediumStartY + mediumImageHeight * 7) {
    //       curColorIndex = 6;
    //       curColor = colorGreen;
    //       redraw();
    //     } else if(mouseY > mediumStartY + mediumImageHeight * 7 && mouseY < mediumStartY + mediumImageHeight * 8) {
    //       curColorIndex = 7;
    //       curColor = colorBrown;
    //       redraw();
    //     } else if(mouseY > mediumStartY + mediumImageHeight * 8 && mouseY < mediumStartY + mediumImageHeight * 9) {
    //       curColorIndex = 8;
    //       curColor = colorGray;
    //       redraw();
    //     } else if(mouseY > mediumStartY + mediumImageHeight * 9 && mouseY < mediumStartY + mediumImageHeight * 10) {
    //       curColorIndex = 9;
    //       curColor = colorBlack;
    //       redraw();
    //     }
    //   }
    // }
    // else if(mouseX > drawingAreaX + drawingAreaWidth) {
    //
    // }
    // else if(mouseY > drawingAreaY && mouseY < drawingAreaY + drawingAreaHeight) {
    //   paintAt(mouseX, mouseY);
    // }


    paint = true;
    addClick(mouseX, mouseY, false);
    redraw();
    //paintAt(mouseX, mouseY);
  });

  $('#canvas').mousemove(function(e){
    if(paint){
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
    //clearCanvas();
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
    // context.fillStyle = '#FFFFFF';
    // context.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  // function paintAt(mouseX, mouseY) {
  //   flood(mouseX, mouseY);
  // }
  //
  // function flood(startX, startY) {
  //   var pixelPos = (startY * canvasWidth + startX) * 4;
  //   var r = colorLayerData.data[pixelPos + 0];
  //   var g = colorLayerData.data[pixelPos + 1];
  //   var b = colorLayerData.data[pixelPos + 2];
  //   var a = colorLayerData.data[pixelPos + 3];
  //
  //   clickedColorR = r;
  //   clickedColorG = g;
  //   clickedColorB = b;
  //
  //   newColorR = color[curColorIndex].r;
  //   newColorG = color[curColorIndex].g;
  //   newColorB = color[curColorIndex].b;
  //
  //   if(clickedColorR === newColorR && clickedColorG === newColorG && clickedColorB === newColorB) {
  //     return;
  //   }
  //   if(outlineLayerData.data[pixelPos] + outlineLayerData.data[pixelPos + 1] + outlineLayerData.data[pixelPos + 2] === 0 && outlineLayerData.data[pixelPos + 3] === 255) {
  //     return;
  //   }
  //
  //   pixelStack = [[startX, startY]];
  //
  //   floodFill();
  // }

  // function floodFill() {
  //   var newPos, x, y, pixelPos, reachLeft, reachRight;
  //   var drawingBoundLeft = drawingAreaX;
  //   var drawingBoundTop = drawingAreaY;
  //   var drawingBoundRight = drawingAreaX + drawingAreaWidth - 1;
  //   var drawingBoundBottom = drawingAreaY + drawingAreaHeight -1;
  //
  //   while(pixelStack.length) {
  //     newPos = pixelStack.pop();
  //     x = newPos[0];
  //     y = newPos[1];
  //
  //     pixelPos = (y * canvasWidth + x) * 4;
  //     while(y-- >= drawingBoundTop && matchClickedColor(pixelPos)) {
  //       pixelPos -= canvasWidth * 4;
  //     }
  //
  //     pixelPos += canvasWidth * 4;
  //     ++y;
  //     reachLeft = false;
  //     reachRight = false;
  //
  //     while(y++ < drawingBoundBottom && matchClickedColor(pixelPos)) {
  //       colorPixel(pixelPos);
  //       if(x > drawingBoundLeft) {
  //         if(matchClickedColor(pixelPos - 4)) {
  //           if(!reachLeft) {
  //             pixelStack.push([x - 1, y]);
  //             reachLeft = true;
  //           }
  //         } else if(reachLeft) {
  //           reachLeft = false;
  //         }
  //       }
  //       if(x < drawingBoundRight) {
  //         if(matchClickedColor(pixelPos + 4)) {
  //           if(!reachRight) {
  //             pixelStack.push([x + 1, y]);
  //             reachRight = true;
  //           }
  //         } else if(reachRight) {
  //           reachRight = false;
  //         }
  //       }
  //       pixelPos += canvasWidth * 4;
  //     }
  //   }
  //   redraw();
  // }
  //
  // context.putImageData(colorLayerData, 0, 0);

  // function colorPixel(pixelPos) {
  //   colorLayerData.data[pixelPos] = newColorR;
  //   colorLayerData.data[pixelPos + 1] = newColorG;
  //   colorLayerData.data[pixelPos + 2] = newColorB;
  //   colorLayerData.data[pixelPos + 3] = 255;
  // }

  // function matchClickedColor(pixelPos) {
  //   var r = outlineLayerData.data[pixelPos];
  //   var g = outlineLayerData.data[pixelPos + 1];
  //   var b = outlineLayerData.data[pixelPos + 2];
  //   var a = outlineLayerData.data[pixelPos + 3];
  //
  //   if(r + g + b === 0 && a === 255) {
  //     return false;
  //   }
  //
  //   r = colorLayerData.data[pixelPos];
  //   g = colorLayerData.data[pixelPos + 1];
  //   b = colorLayerData.data[pixelPos + 2];
  //
  //   if(r === clickedColorR && g === clickedColorG && b === clickedColorB) {
  //     return true;
  //   }
  //
  //   if(r === newColorR && g === newColorG && b === newColorB) {
  //     return false;
  //   }
  //
  //   return true;
  // }

  function redraw(){
    // if(curLoadResNum < totalLoadResources) {
    //   return;
    // }

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

    //
    // clearCanvas();
    //
    // if(colorLayerData) {
    //   context.putImageData(colorLayerData, 0, 0);
    //   colorLayerData = context.getImageData(0, 0, canvasWidth, canvasHeight);
    // }
    //
    // context.drawImage(backgroundImage, 0, 0, canvasWidth, canvasHeight);
    //
    // var locX, locY;
    //   //Yellow
    //   locX = (curColorIndex === 0) ? 52 : 52; //18
    //   locY = 19;
    //   context.beginPath();
    //   context.arc(locX + 46, locY + 23, 18, 0, Math.PI * 2, true);
    //   context.closePath();
    //   context.fillStyle = 'rgb(' + colorYellow.r + ',' + colorYellow.g + ',' + colorYellow.b + ')';
    //   context.fill();
    //
    //   if(curColorIndex === 0) {
    //     context.drawImage(paintImage, 0, 0, 59, mediumImageHeight, locX, locY, 59, mediumImageHeight);
    //   } else {
    //     context.drawImage(paintImage, locX, locY, mediumImageWidth, mediumImageHeight);
    //   }
    //

    context.drawImage(outlineImage, drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
  }

})();

function ajax(url, type, data={}, success=r=>console.log(r), dataType='json'){
  'use strict';
  $.ajax({url:url, type:type, dataType:dataType, data:data, success:success});
}
