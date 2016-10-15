import generateStemPixels from './generate-stem';
import generateLeafPixels from './generate-leaf';

export default function createImageData(plant) {
  var width = plant.type === 'tree' ? 32 : 16;
  var height = plant.type === 'stalk' || plant.type === 'tree' ? 32 : 16;
  var pixels = new Uint8ClampedArray(4 * width * height);
  var draw = function (gen, nodes) {
    return gen(plant, width, height, pixels, nodes);
  };

  var nodes = draw(generateStemPixels);
  draw(generateLeafPixels, nodes);

  return new ImageData(pixels, width, height);
}
