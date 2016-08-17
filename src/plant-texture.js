import createImageData from './create-image-data.js';

export function createPNG(plant, canvas = document.createElement('canvas')) {
  createCanvas(plant, canvas);
  return canvas.toDataURL('image/png');
}

export function createCanvas(plant, canvas = document.createElement('canvas')) {
  var ctx = canvas.getContext('2d');

  var imageData = createImageData(plant);
  canvas.height = imageData.height;
  canvas.width = imageData.width;
  ctx.putImageData(imageData, 0, 0);

  return canvas;
}
