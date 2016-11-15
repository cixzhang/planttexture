import { drawPixel } from './helpers.js';

var leafPixels = [
  [[1, 0], [2, 0], [2, -1], [3, -1]],
  [[-1, 0], [-2, 0], [-2, -1], [-3, -1]]
];

export default function generateLeafPixels(plant, width, height, pixels, nodes) {
  var draw = (x, y, color) => drawPixel(pixels, width, x, y, color);
  var leaves = plant.growth.leaves;
  var color = [0, 60, 50, 255];

  nodes.forEach(function (node, nodeI) {
    var leaf = 0;
    color = [0, 50, 20, 255];
    node.growthNode.forEach(function (nodule, i) {
      if (nodeI + i > leaves) return;
      if ((i + 1) % 2) return;

      leaf = (leaf + 1) % 2;
      var x = nodule[0];
      var y = nodule[1];
      leafPixels[leaf].forEach(function (position) {
        draw(Math.floor(x + position[0]), Math.floor(y + position[1]), color);
      });

      color[0] += 20;
      color[1] += 20;
      color[2] += 20;
    });
  });
}
