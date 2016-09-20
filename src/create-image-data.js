import { drawPixel, normalize } from './helpers.js';

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
  var stemType = Math.min(plant.expression.traits.stem, 3);
  var nodes = [{
    position: [width / 2, height],
    direction: [0, -1]
  }];

  var i = 0;
  var x, y, node, incr;
  while (stems) {
    node = nodes[i % nodes.length];
    x = Math.max(node.position[0], 0);
    y = Math.max(node.position[1], 0);
    incr = normalize(node.direction);

    draw(Math.floor(x), Math.floor(y));

    node.position[0] += incr[0];
    node.position[1] += incr[1];

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
