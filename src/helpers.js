
export function coordToIndex(width, x, y) {
  return (y * width + x) * 4;
}

export function indexToCoord(width, index) {
  var pixel = index / 4;
  var y = Math.floor(width / pixel);
  var x = width % pixel;
  return [x, y];
}

export function drawPixel(pixels, width, x, y, rgba) {
  var index = coordToIndex(width, x, y);
  pixels[index+0] = rgba[0];
  pixels[index+1] = rgba[1];
  pixels[index+2] = rgba[2];
  pixels[index+3] = rgba[3];
  return pixels;
}

export function normalize(vec) {
  var magn2 = vec[0] * vec[0] + vec[1] * vec[1];
  if (!magn2) return vec;

  var magn = Math.sqrt(magn2);
  return [vec[0]/magn, vec[1]/magn];
}