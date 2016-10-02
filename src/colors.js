
import { clone } from 'lodash-es';

const baseColors = {
  stem: [0, 0.3, 0.2]
};

export default function getColor(type, plant) {
  let parsed = clone(baseColors[type]);
  let colors = [0, 0, 0];

  plant.expression.counts.forEach((countObj) => {
    let red = 0;
    let yellow = 0;
    let blue = 0;
    if (type in countObj) {
      red = countObj.red || 0;
      yellow = countObj.yellow || 0;
      blue = countObj.blue || 0;
    }
    colors[0] += yellow / 2 + red;
    colors[1] += yellow / 2 + blue / 2;
    colors[2] += blue;
  });

  return [
    (parsed[0] + colors[0] / 5) * 255,
    (parsed[1] + colors[1] / 5) * 255,
    (parsed[2] + colors[2] / 5) * 255,
    255
  ];
}
