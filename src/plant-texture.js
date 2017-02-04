import { createStemSet } from './create-image-data.js';

class PlantTexture {
  constructor(canvas) {
    this.canvas = canvas || document.createElement('canvas');
    this.png = null;
    this.frames = [];
  }

  generateStems(type, stemTypes, stemGrowths) {
    createStemSet({type, stemTypes, stemGrowths, canvas: this.canvas, frames: this.frames});
  }

  toPNG() {
    return this.canvas.toDataURL('image/png');
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
