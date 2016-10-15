import { drawPixel } from './helpers.js';

export default function generateLeafPixels(plant, width, height, pixels, nodes) {
  var draw = (x, y, color) => drawPixel(pixels, width, x, y, color);
  var color = [255, 0, 0, 255];

  nodes.forEach(function (node) {
    node.growthNode.forEach(function (nodule) {
      var x = nodule[0];
      var y = nodule[1];
      draw(Math.floor(x), Math.floor(y), color);
    });
  });
}
