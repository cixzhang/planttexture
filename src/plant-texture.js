import { createStemSet } from './create-image-data.js';

class PlantTexture {
  constructor({
    canvas,
    ImageDataClass = ImageData,
    name
  }) {
    this.name = name;
    this.canvas = canvas || document.createElement('canvas');
    this.png = null;
    this.frames = [];
    this.ImageData = ImageDataClass;
  }

  generateStems({type, stemTypes, stemGrowths}) {
    createStemSet({
      type,
      stemTypes,
      stemGrowths,
      canvas: this.canvas,
      frames: this.frames
    }, this.ImageData);
  }

  toPNG() {
    return this.canvas.toDataURL('image/png');
  }

  toJSON() {
    const meta = {
      image: `${this.name}.png`,
      tile: 16
    };

    return {
      frames: this.frames,
      meta
    };
  }
}

export default PlantTexture;
