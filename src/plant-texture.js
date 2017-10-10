import { flatten, mapValues } from 'lodash-es';
import PlantTextureOld from './plant-texture-old';
import lSystem from './l-system';
import herbSystem from './l-system-herb';
import shrubSystem from './l-system-shrub';
import PixelTurtle from './pixel-turtle';

class PlantTexture {
  static mapStateToActions(state, actions) {
    return flatten(state.split('').map(rule => actions[rule] || []));
  }

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

  getValue(fnOrVal, plant) {
    if (typeof fnOrVal === 'function') return fnOrVal(plant);
    return fnOrVal;
  }

  generatePlant({ type, count, kinds }) {
    count = count || 9;
    const defmap = {
      herb: herbSystem,
      shrub: shrubSystem,
    };

    const definition = defmap[type];
    if (!definition) return;

    this.generate(definition, { type, count, kinds });
  }

  generate(definition, plant) {
    const { type, count, kinds } = plant;
    const { width, height } = definition;
    const turtle = new PixelTurtle(width, height);
    this.setup(kinds, count, width, height);

    for (let t = 0; t < kinds; t++) {
      const getValueWithKind = v => this.getValue(v, t);
      const {
        init = [],
        start = '',
        rules = {},
        actions = {} } = mapValues(definition, getValueWithKind);
      const lsys = lSystem(start, rules, count);
      lSystem
        .toList(lsys, count)
        .forEach((plant, i) => {
          turtle.reset();
          turtle.perform(init);
          turtle.perform(PlantTexture.mapStateToActions(plant, actions));
          this.renderPixels(`${type}.${t}.${i}`, turtle, i * width, t * height);
        });
    }
  }

  setup(rows, columns, width, height) {
    const totalSize = [width * columns, height * rows];
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
