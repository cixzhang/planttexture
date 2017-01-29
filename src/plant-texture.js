import { createStemSetPNG } from './create-image-data.js';

class PlantTexture {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.png = null;
    this.frames = [];
  }

  generateStems(type, stemTypes, stemGrowths) {
    this.png = createStemSetPNG(type, stemTypes, stemGrowths, this.canvas, this.frames);
  }

  toJSON() {
    const meta = {
      image: 'plant-texture.png',
      tile: 16
    };

    return {
      frames: this.frames,
      meta
    };
  }
}

export default PlantTexture;
