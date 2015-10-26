/*
Project: sketchMe v1.0.0 - sketch effects for canvas element
Authors: Rodrigo Koga
License: MIT
Github: https://github.com/rokoala/sketch-me.git
 */

(function(window,undefined){

  SketchMe = function (selector,options) {

    function isCanvasSupported(elem){
      return !!(elem.getContext && elem.getContext('2d'));
    }

    if ( !selector ) {
      return this;
    }else {
      var element = document.getElementById(selector);
      if(element){
        var canvas = document.createElement("canvas");
        element.appendChild(canvas);
        return new SketchMe.prototype.init(canvas,options);
      }else if(isCanvasSupported(selector)){
        return new SketchMe.prototype.init(selector,options);
      }else{
        throw "Initialize SketcheMe with an id or a canvas element!";
      }
    }
  };

  SketchMe.prototype = {
    init:function (canvas,options) {
      this.canvas = canvas;
      this.options = options;
      this.ctx = canvas.getContext("2d");
    }
  }

  window.SketchMe = SketchMe;

})(window);


(function ($) {
'use strict';

$(document).ready(function () {

  var sketchConfig = {
    bezierRandom: 25,
    randomX:15,
    randomY:15,
    save:function() {
      _processing.noLoop();
      _processing.save("sketchImg");
      _processing.loop();
    },
    stop:function () {
      _processing.noLoop();
    },
    start:function () {
      _processing.loop();
    },
    loadRandomImage:function () {
      $.ajax({
        url:"/getRandomImage"
      }).then(function (result) {
        var imageBase64 = "data:image/png;base64,"+result;
        userImg.src = imageBase64;
      });
    }
  };
  var gui = new dat.GUI();

  gui.add(sketchConfig, 'bezierRandom',0,50);
  gui.add(sketchConfig, 'randomX',0,40);
  gui.add(sketchConfig, 'randomY',0,40);
  gui.add(sketchConfig, 'save');
  gui.add(sketchConfig, 'stop')
  gui.add(sketchConfig, 'start')
  gui.add(sketchConfig, 'loadRandomImage');

  var $canvas = $("#sketchCanvas");
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


  var loadedImg,_processing = null;
  var w,h,max;
  var index,iteration = 0;
  var pixels = [];

  var getRandomX = function(){
    var des = Math.random(-sketchConfig.randomX,sketchConfig.randomX);
    return Math.ceil(index + des);
  }

  var getRandomY = function(){
    var des = (Math.random(-sketchConfig.randomY,sketchConfig.randomY) * w);
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

    _processing = processing;

    var checkValid = function(v1,v2,v3){
      if(pixels[v1] < -1 && pixels[v2] < -1 && pixels[v3] < -1){
        return true;
      }else{
        return false;
      }
    }

    processing.setup = function () {
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
          w = loadedImg.width;
          h = loadedImg.height;
          max = w*h;

          processing.size(w,h)
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
          processing.stroke(pixels[x1]);
          processing.fill(255,0);
          processing.bezier(getX(x1) + processing.random(-sketchConfig.bezierRandom,sketchConfig.bezierRandom), currentY, currentX, currentY, getX(dx1)+processing.random(-sketchConfig.bezierRandom,sketchConfig.bezierRandom), getY(dy1)+processing.random(-sketchConfig.bezierRandom,sketchConfig.bezierRandom),currentX+processing.random(-sketchConfig.bezierRandom,sketchConfig.bezierRandom), currentY);
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
  }

  userImg.onload = function() {
    loadedImg = null;
    var p = new Processing(canvasElement, sketchProc);
  }

});

})(jQuery);
