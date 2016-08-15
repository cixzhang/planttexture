(function () {
  'use strict';

  function plantTextureCanvas(plant, canvas = document.createElement('canvas')) {
    /* eslint no-console: [0] */
    var ctx = canvas.getContext('2d');
    var width = plant.type === 'tree' ? 32 : 16;
    var height = plant.type === 'stalk' || plant.type === 'tree' ? 32 : 16;

    var imageData = generatePlantImage(plant, width, height);
    ctx.putImageData(imageData, width, height);

    return canvas;
  }

  function generatePlantImage(plant, width, height) {
    var stemPixels = generateStemPixels(plant, width, height);
    return new ImageData(stemPixels, width, height);
  }

  function generateStemPixels(plant, width, height) {
    var pixels = new Uint8ClampedArray(4 * width * height);
    var center = Math.floor(width / 2);
    var start = coordToIndex(center, 0, width);
    pixels[start] = 255;
    pixels[start+3] = 255;
    return pixels;
  }

  function coordToIndex(x, y, width) {
    return (y * width + x) * 4;
  }

  // function indexToCoord(index, width) {
  //   var pixel = index / 4;
  //   var y = Math.floor(width / pixel);
  //   var x = width % pixel;
  //   return [x, y];
  // }

  var canvas = plantTextureCanvas({
    type: 'herb'
  });
  document.body.appendChild(canvas);

}());