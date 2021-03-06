
import { clone } from 'lodash-es';

var baseColors = {
  stem: [0, 0.3, 0.2],
  leaf: [0, 0.3, 0.1]
};

export function getColor(type, plant) {
  var parsed = clone(baseColors[type]);
  var colors = [0, 0, 0];

  if (plant && plant.expression && plant.expression.counts) {
    plant.expression.counts.forEach((countObj) => {
      var red = 0;
      var yellow = 0;
      var blue = 0;
      if (type in countObj) {
        red = countObj.red || 0;
        yellow = countObj.yellow || 0;
        blue = countObj.blue || 0;
      }
      colors[0] += yellow / 2 + red;
      colors[1] += yellow / 2 + blue / 2;
      colors[2] += blue;
    });
  }

  return [
    Math.floor((parsed[0] + colors[0] / 5) * 255),
    Math.floor((parsed[1] + colors[1] / 5) * 255),
    Math.floor((parsed[2] + colors[2] / 5) * 255),
    255
  ];
}

export function lighten(color, amt) {
  var lighter = clone(color);

  lighter[0] = color[0] + amt;
  lighter[1] = color[1] + amt;
  lighter[2] = color[2] + amt;

  return lighter;
}
