import PlantTextureOld from './plant-texture-old';
import lSystem from './l-system';
import PixelTurtle from './pixel-turtle';

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

  generateStems() {
    /* TODO */
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

PlantTexture.Old = PlantTextureOld;
PlantTexture.lSystem = lSystem;
PlantTexture.Turtle = PixelTurtle;
export default PlantTexture;
