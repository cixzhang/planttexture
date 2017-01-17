import generateStemPixels from './generate-stem';
import generateLeafPixels from './generate-leaf';

export function computeTotalSize(plantType, rows, columns) {
  var width = plantType === 'tree' ? 32 : 16;
  var height = plantType === 'stalk' || plantType === 'tree' ? 32 : 16;
  return [width * columns, height * rows];
}

export function createImageData(plant, nodes) {
  var width = plant.type === 'tree' ? 32 : 16;
  var height = plant.type === 'stalk' || plant.type === 'tree' ? 32 : 16;
  var pixels = new Uint8ClampedArray(4 * width * height);
  var draw = function (gen, nodes) {
    return gen(plant, width, height, pixels, nodes);
  };

  draw(generateStemPixels, nodes);
  draw(generateLeafPixels, nodes);

  return new ImageData(pixels, width, height);
}

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
  canvas = document.createElement('canvas'),
  nodeSet = []
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
      var nodes = []
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

      imageData = createImageData(plant, nodes);
      ctx.putImageData(imageData, widthAnchor, heightAnchor);
      widthAnchor += imageData.width;
      nodeSet.push(nodes);
    });

    heightAnchor += imageData.height;
  });
  return canvas;
}

export function createStemSetPNG(
  type,
  stemTypes,
  stemGrowths,
  canvas = document.createElement('canvas'),
  nodeSet = []
) {
  createStemSet(type, stemTypes, stemGrowths, canvas, nodeSet);
  return canvas.toDataURL('image/png');
}
