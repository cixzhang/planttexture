// Pixel representation:
// - clockwise coordinates for each corner + color (rgba)
// {
//   position: [[0, 0], [1, 0], [1, 1], [0, 1]]
//   color: [0, 200, 30, 255]
// }

function pixel(position, color) {
  this.position = position;
  this.color = color;
  return this;
}

module.exports = pixel;
