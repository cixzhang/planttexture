import { drawPixel, normalize } from './helpers.js';
import { getColor, lighten } from './colors.js';

export default function generateStemPixels(plant, width, height) {
  var draw = (x, y, color) => drawPixel(pixels, width, x, y, color);
  var pixels = new Uint8ClampedArray(4 * width * height);
  var stems = plant.growth.stems;
  var stemType = plant.expression.traits.stem + 2;
  var nodes = [{
    position: [width / 2, height],
    direction: [0, -1],
    color: getColor('stem', plant)
  }];

  var i = 1;
  var x, y, node, incr;
  while (stems) {
    node = nodes[i % nodes.length];
    x = Math.max(node.position[0], 0);
    y = Math.max(node.position[1], 0);
    incr = normalize(node.direction);

    draw(Math.floor(x), Math.floor(y), node.color);

    node.position[0] += incr[0];
    node.position[1] += incr[1];
    node.color = lighten(node.color, 5);

    if (!(i % stemType) && node.direction[0] <= (1 / stemType)) {
      node.direction = [node.direction[0] + 1, node.direction[1]];

      nodes.push({
        position: [node.position[0], node.position[1]],
        direction: [node.direction[0] - 2, node.direction[1]],
        color: node.color
      });
    } else {
      node.direction = [node.direction[0] / 2, node.direction[1]]
    }

    stems--;
    i++;
  }
  return pixels;
}
