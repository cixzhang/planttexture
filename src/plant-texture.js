import createImageData, { computeTotalSize } from './create-image-data.js';

export function createCanvas(plant, canvas = document.createElement('canvas')) {
  var ctx = canvas.getContext('2d');

  var imageData = createImageData(plant);
  canvas.height = imageData.height;
  canvas.width = imageData.width;
  ctx.putImageData(imageData, 0, 0);

  return canvas;
}

export function createPNG(plant, canvas = document.createElement('canvas')) {
  createCanvas(plant, canvas);
  return canvas.toDataURL('image/png');
}

export function createStemSet(
  type,
  stemTypes,
  stemGrowths,
  canvas = document.createElement('canvas')
) {
  var ctx = canvas.getContext('2d');
  var totalSize = computeTotalSize(type, stemTypes.length, stemGrowths.length);
  canvas.width = totalSize[0];
  canvas.height = totalSize[1];

  var heightAnchor = 0;
  var widthAnchor = 0;

  stemTypes.forEach(function (stemType) {
    var imageData;
    widthAnchor = 0;

    stemGrowths.forEach(function (stemGrowth) {
      var plant = {
        growth: {
          stems: stemGrowth,
          leaves: 0
        },
        expression: {
          traits: {
            stem: stemType,
            leaf: 0
          }
        }
      };

      imageData = createImageData(plant);
      ctx.putImageData(imageData, widthAnchor, heightAnchor);
      widthAnchor += imageData.width;
    });
    heightAnchor += imageData.height;
  });
  return canvas;
}

export function createStemSetPNG(
  type,
  stemTypes,
  stemGrowths,
  canvas = document.createElement('canvas')
) {
  createStemSet(type, stemTypes, stemGrowths, canvas);
  return canvas.toDataURL('image/png');
}