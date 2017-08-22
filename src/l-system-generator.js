import { last, flatten } from 'lodash-es';
import lSystem from './l-system';
import PixelTurtle from './pixel-turtle';
import generic from './l-system-generic';

class LSysGen {
  constructor({
    canvas,
    ImageDataClass = ImageData,
  }) {
    this.canvas = canvas || document.createElement('canvas');
    this.ImageData = ImageDataClass;
    this.context = this.canvas.getContext('2d');
  }

  dimensions() {
    return [16, 16];
  }

  generate(start, rules, count = 1) {
    const [width, height] = this.dimensions();
    this.canvas.width = width;
    this.canvas.height = height;
    const turtle = new PixelTurtle(width, height);
    const lsys = lSystem(start, rules);
    const actions = generic.actions;

    const iterations = lSystem.toList(lsys, count);
    const iteration = last(iterations);

    const perfToActions = perf => PixelTurtle.createAction(...perf);
    const ruleToActions = (rule) => {
      let performable = actions[rule];
      if (!performable) performable = [];
      return performable.map(perfToActions);
    };

    turtle.reset();
    turtle.perform(generic.init.map(perfToActions));
    turtle.perform(flatten(iteration.split('').map(ruleToActions)));
    this.renderPixels(turtle);
  }

  renderPixels(turtle) {
    const { width, height } = turtle;
    const imageData = new this.ImageData(turtle.pixels, width, height);
    this.context.putImageData(imageData, 0, 0);
  }

  toPNG() {
    return this.canvas.toDataURL('image/png');
  }
}

export default LSysGen;
