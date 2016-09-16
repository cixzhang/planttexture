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
    var draw = (x, y) => drawPixel(pixels, width, x, y, [255, 0, 0, 255]);
    var stemType = Math.min(plant.expression.traits.stem, 3);
    var nodes = [{
      position: [width / 2, height],
      direction: [0, -1]
    }];

    var i = 0;
    var x, y, node;
    while (stems) {
      node = nodes[i % nodes.length];
      x = node.position[0];
      y = node.position[1];
      draw(x, y);
      node.position[0] += node.direction[0];
      node.position[1] += node.direction[1];

      if (!(i % (stemType % 3 + 2))) {
        node.direction = [node.direction[0] + 1, node.direction[1]];

        nodes.push({
          position: [node.position[0], node.position[1]],
          direction: [node.direction[0] - 2, node.direction[1]]
        });
      }

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