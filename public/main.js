(function ($) {
'use strict';

$(document).ready(function () {

  var $canvas = $("#sketchCanvas");
  var $saveBtn = $("<button/>").addClass("save-image-btn").text("Capture Image State");
  var canvasElement = $canvas.get(0);
  var middleY = canvasElement.height / 2;
  var ctx=canvasElement.getContext("2d");
  var userImg = new Image;

  $("body").append($canvas);

  ctx.font="30px Arial";
  ctx.fillStyle='gray';
  ctx.fillText("Drop an image here",100,middleY);

    // To enable drag and drop
  canvasElement.addEventListener("dragover", function (evt) {
  	evt.preventDefault();
  }, false);

  // Handle dropped image file - only Firefox and Google Chrome
  canvasElement.addEventListener("drop", function (evt) {
  	var files = evt.dataTransfer.files;

    if (files.length > 0) {
  		var file = files[0];
  		if (typeof FileReader !== "undefined" && file.type.indexOf("image") != -1) {
  			var reader = new FileReader();
  			// Note: addEventListener doesn't work in Google Chrome for this event
  			reader.onload = function (evt) {
  				userImg.src = evt.target.result;
  			};
  			reader.readAsDataURL(file);
  		}
  	}
  	evt.preventDefault();
  }, false);


  var loadedImg = null;
  var w = 500;
  var h = 500;
  var max = w*h;
  var index = 0;
  var iteration = 0;
  var pixels = [];

  var getRandomX = function(){
    var des = Math.random(-15,15);
    return Math.ceil(index + des);
  }

  var getRandomY = function(){
    var des = (Math.random(-15,15) * w);
    return Math.ceil(index + des);
  }

  var getX = function(){
    return index % w;
  }

  var getY = function(value){
    return Math.ceil(value / w);
  }

  // Simple way to attach js code to the canvas is by using a function
  function sketchProc(processing) {

    var checkValid = function(v1,v2,v3){
      if(pixels[v1] < -1 && pixels[v2] < -1 && pixels[v3] < -1){
        return true;
      }else{
        return false;
      }
    }

    processing.setup = function () {
      processing.size(w,h)
      loadedImg = processing.loadImage(userImg.src);

      processing.smooth();
      processing.background(255);
      processing.strokeWeight(1);
      processing.frameRate(10000);
    }

    // Override draw function, by default it will be called 60 times per second
    processing.draw = function() {

      // start drawing
      function start() {
        if(iteration === 0){
          processing.image(loadedImg,0,0,w,h);
          processing.loadPixels();

          pixels = processing.pixels.toArray();
          processing.background(255);
        }

        index = processing.random(0,max);

        var currentY = getY(index);
        var currentX = getX();

        var x1 = getRandomX();

        var dx1 = getRandomX();
        var dy1 = getRandomY();

        if(checkValid(x1,dx1,dy1)){

          processing.stroke(pixels[x1],processing.random(100.0)+20);

          if(iteration <= 5000){
              processing.fill(255,0);
              processing.bezier(getX(x1) + processing.random(-50,50), currentY, currentX, currentY, getX(dx1)+processing.random(-50,50), getY(dy1)+processing.random(-50,50),currentX+processing.random(-50,50), currentY);
          }else if(iteration > 5000){
              processing.bezier(getX(x1) + processing.random(-15,15), currentY, currentX, currentY, getX(dx1)+processing.random(-20,20), getY(dy1)+processing.random(-20,20),currentX+processing.random(-15,15), currentY);
          }else if(iteration > 7500){
              processing.bezier(getX(x1) + processing.random(-10,10), currentY, currentX, currentY, getX(dx1)+processing.random(-10,10), getY(dy1)+processing.random(-5,5),currentX+processing.random(-5,5), currentY);
          }else if(iteration > 10000){
              processing.fill(pixels[x1]);
              processing.bezier(getX(x1) + processing.random(-3,3), currentY, currentX, currentY, getX(dx1)+processing.random(-3,3), getY(dy1)+processing.random(-3,3),currentX+processing.random(-3,3), currentY);
          }
        }

        iteration++;
        if(iteration > 50000)
          processing.noLoop();

      };

      // waits until image have been loaded
      if(loadedImg != null){
        if(loadedImg.loaded)
          start();
      }

    };

    $saveBtn.click(function () {
      processing.noLoop();
      processing.save("sketchImg");
      processing.loop();
    });

  }

  userImg.onload = function() {
    var p = new Processing(canvasElement, sketchProc);
    $("body").append($saveBtn);
  }

});

})(jQuery);
