import { flatten } from 'lodash-es';
import PlantTextureOld from './plant-texture-old';
import lSystem from './l-system';
import herbSystem from './l-system-herb';
import shrubSystem from './l-system-shrub';
import PixelTurtle from './pixel-turtle';

import { getPlantDimensions, computeTotalSize } from './create-image-data';

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

  generate({ type, count, kinds }) {
    count = count || 9;
    const lsysmap = {
      herb: herbSystem,
      shrub: shrubSystem,
    };

    const lsys = lsysmap[type];
    if (!lsys) return;

    const [width, height] = getPlantDimensions(type);
    const turtle = new PixelTurtle(width, height);
    const actions = lsys.actions();
    this.setup(type, kinds, count);

    for (let t = 0; t < kinds; t++) {
      const plants = lSystem.toList(lsys.generate(t), count);
      plants.forEach((plant, i) => {
        turtle.reset();
        turtle.perform(lsys.init(t));
        turtle.perform(flatten(plant.split('').map(rule => actions[rule])));
        this.renderPixels(`${type}.${t}.${i}`, turtle, i * width, t * height);
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
