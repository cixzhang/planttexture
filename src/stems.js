export default function stems(plant, size) {
  // Convert plant information to stem pixels
  /*
  Rendering stems: (1)
  - no appearance for monocots
  - mainly increase length and width for stalks
  - mostly length for trees until a certain height, keep a spread
  - mostly spread for shrubs
  - equal spread and height otherwise
  - for wood trait the count also increases width
  - trait vs growth: use trait to determine how the stem grows and growth to determine
  how far along it is

  - trait stem > 3: grow upwards mainly
  - trait stem = 0: make mostly branches
  */

  const stemPixels = [];
  const baseColor = [20, 220, 80, 255];
  const sizeX = size[0];
  const sizeY = size[1];
  const start = [Math.ceil(sizeX / 2), 3]; // adjust starting Y
  if (plant.traits.dicot && plant.growth.stem) {
    stemPixels.push(start, baseColor); // first pixel
    // TODO: computeNext or finish
  }

  return stemPixels;
}
