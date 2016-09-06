import { drawPixel } from './helpers.js';

export default function createImageData(plant) {
  var width = plant.type === 'tree' ? 32 : 16;
  var height = plant.type === 'stalk' || plant.type === 'tree' ? 32 : 16;

  var stemPixels = generateStemPixels(plant, width, height);
  return new ImageData(stemPixels, width, height);
}

function generateStemPixels(plant, width, height) {
  var pixels = new Uint8ClampedArray(4 * width * height);
  var stems = plant.growth.stems;
  var draw = (x, y) => drawPixel(pixels, width, x, y, [255, 0, 0, 255]);
  var stemType = Math.max(plant.expression.traits.stem, 3);
  var growthNode = {
    position: [width / 2, 0],
    direction: [1, 0],
    next: null
  };

  var i = 0;
  var x, y;
  var currentNode = growthNode;
  while (stems) {
    x = currentNode.position[0];
    y = currentNode.position[1];
    draw(x, y);
    currentNode.position[0] += currentNode.direction[0];
    currentNode.position[1] += currentNode.direction[1];

    if (stemType % 3 && i % (stemType % 3)) {
      currentNode.next = {
        position: [currentNode.position[0], currentNode.position[1]],
        direction: [currentNode.direction[0], currentNode.direction[1] + 1],
        next: {
          position: [currentNode.position[0], currentNode.position[1]],
          direction: [currentNode.direction[0], currentNode.direction[1] - 1],
          next: null
        }
      }
    }

    currentNode = growthNode.next || growthNode;
    stems--;
    i++;
  }
  return pixels;
}
