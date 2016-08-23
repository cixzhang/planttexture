(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.PlantTexture = global.PlantTexture || {})));
}(this, function (exports) { 'use strict';

  function coordToIndex(width, x, y) {
    return (y * width + x) * 4;
  }

  function drawPixel(pixels, width, x, y, rgba) {
    var index = coordToIndex(width, x, y);
    pixels[index+0] = rgba[0];
    pixels[index+1] = rgba[1];
    pixels[index+2] = rgba[2];
    pixels[index+3] = rgba[3];
    return pixels;
  }

  function createImageData(plant) {
    var width = plant.type === 'tree' ? 32 : 16;
    var height = plant.type === 'stalk' || plant.type === 'tree' ? 32 : 16;

    var stemPixels = generateStemPixels(plant, width, height);
    return new ImageData(stemPixels, width, height);
  }

  function generateStemPixels(plant, width, height) {
    var pixels = new Uint8ClampedArray(4 * width * height);
    var stems = plant.growth.stems;
    var stemType = Math.max(plant.expression.traits.stem, 3);

    // 0: branch every 2 pixels after 2 pixels
    // 1: branch every 3 pixels after 3 pixels
    // 2: branch every 4 pixels after 5 pixels
    // 3: branch every 5 pixels after 8 pixels

    // Paint first and second center pixel
    var i = 0;
    while (stems && i < height) {
      drawPixel(pixels, width, width / 2, i, [255, 0, 0, 255]);
      stems--;
      i++;
    }
    return pixels;
  }

  function createPNG(plant, canvas = document.createElement('canvas')) {
    createCanvas(plant, canvas);
    return canvas.toDataURL('image/png');
  }

  function createCanvas(plant, canvas = document.createElement('canvas')) {
    var ctx = canvas.getContext('2d');

    var imageData = createImageData(plant);
    canvas.height = imageData.height;
    canvas.width = imageData.width;
    ctx.putImageData(imageData, 0, 0);

    return canvas;
  }

  exports.createPNG = createPNG;
  exports.createCanvas = createCanvas;

  Object.defineProperty(exports, '__esModule', { value: true });

}));