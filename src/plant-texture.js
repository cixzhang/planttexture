import { flatten } from 'lodash-es';
import PlantTextureOld from './plant-texture-old';
import lSystem from './l-system';
import herbSystem from './l-system-herb';
import PixelTurtle from './pixel-turtle';

import { computeTotalSize } from './create-image-data';

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
    this.context = this.canvas.getContext('2d');
  }

  generateHerbs({ count, types }) {
    count = count || 9;
    const width = 16;
    const height = 16;
    const actions = herbSystem.actions();
    const turtle = new PixelTurtle(width, height);
    this.setup('herb', types, count);
    for (let t = 0; t < types; t++) {
      const herbs = lSystem.toList(herbSystem.generate(t), count);
      herbs.forEach((herb, i) => {
        turtle.reset();
        turtle.perform(herbSystem.init(t));
        turtle.perform(flatten(herb.split('').map(rule => actions[rule])));
        this.renderPixels(`herb.0.${i}`, turtle, i * width, t * height);
      });
    }
  }

  setup(type, rows, columns) {
    const totalSize = computeTotalSize(type, rows, columns);
    this.canvas.width = totalSize[0];
    this.canvas.height = totalSize[1];
  }

  renderPixels(name, turtle, x, y) {
    const { width, height } = turtle;
    const imageData = new this.ImageData(turtle.pixels, width, height);
    this.context.putImageData(imageData, x, y);

    this.frames.push({
      name,
      frame: { x, y, w: width, h: height },
      meta: { nodules: turtle.get('nodes') }
    });
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
