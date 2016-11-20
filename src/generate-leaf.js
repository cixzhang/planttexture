import { drawPixel } from './helpers.js';
import { getColor, lighten } from './colors.js';

var leafPixels = [
  [[1, 0], [2, 0], [2, -1], [3, -1]],
  [[-1, 0], [-2, 0], [-2, -1], [-3, -1]]
];

export default function generateLeafPixels(plant, width, height, pixels, nodes) {
  var draw = (x, y, color) => drawPixel(pixels, width, x, y, color);
  var leaves = plant.growth.leaves;
  var leafSize = (plant.expression.traits.leaf || 0) + 1;
  var leafColor = getColor('leaf', plant);

  nodes.forEach(function (node) {
    var count = 0;
    var leaf = 0;
    var color = Array.from(leafColor);

    for (var i = node.growthNode.length - 1; i > 0; i--) {
      var nodule = node.growthNode[i];
      if (count >= leaves) break;
      if (i % 2) continue;

      leaf = (leaf + 1) % 2;
      var x = nodule[0];
      var y = nodule[1];
      leafPixels[leaf].forEach(function (position, i) {
        if (i > leafSize) return;
        draw(Math.floor(x + position[0]), Math.floor(y + position[1]), color);
      });

      color = lighten(color, 20);
      count++;
    }
  });
}
