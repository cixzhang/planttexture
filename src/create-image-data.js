import { drawPixel } from './helpers.js';

export default function createImageData(plant) {
  var width = plant.type === 'tree' ? 32 : 16;
  var height = plant.type === 'stalk' || plant.type === 'tree' ? 32 : 16;

  var stemPixels = generateStemPixels(plant, width, height);
  return new ImageData(stemPixels, width, height);
}

function generateStemPixels(plant, width, height) {
  var pixels = new Uint8ClampedArray(4 * width * height);
  var center = Math.floor(width / 2);
  drawPixel(pixels, width, center, 0, [255, 0, 0, 255]);
  return pixels;
}
