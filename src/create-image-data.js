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
