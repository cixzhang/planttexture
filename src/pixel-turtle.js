import { drawPixel } from './helpers.js';
import { pick } from 'lodash-es';

class PixelTurtle {
  static createAction(command, ...params) {
    return { command, params };
  }

  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.reset();
    return this;
  }

  reset() {
    this.pixels = new Uint8ClampedArray(4 * this.width * this.height);
    this.position = [0, 0];
    this.direction = [1, 0];
    this.color = [0, 0, 0, 1];
    this.markers = {};
    return this;
  }

  move(c) {
    this.position[0] += c * this.direction[0];
    this.position[1] += c * this.direction[1];
    return this;
  }

  draw(c) {
    var doDraw = (x, y, color) => drawPixel(
      this.pixels,
      this.width,
      x, y, color);
    for (let i = 0; i < c; i++) {
      let x = Math.max(this.position[0], 0);
      let y = Math.max(this.position[1], 0);
      doDraw(Math.floor(x), Math.floor(y), this.color);
    }
    return this;
  }

  turn(d) {
    const cosD = Math.cos(d);
    const sinD = Math.sin(d);
    const [x, y] = this.direction;
    this.direction[0] = x * cosD - y * sinD;
    this.direction[1] = x * sinD + y * cosD;
    return this;
  }

  save(id) {
    this.markers[id] = [...this.position];
  }

  load(id) {
    this.position = this.markers[id];
  }

  eyedrop(color) {
    this.color = color;
  }

  perform(actions) {
    actions.map((action) => {
      const params = action.params.map(param => {
        if (typeof param === 'function') return param(this);
        return param;
      })
      this[action.command](...params);
    });
    return this;
  }

  toJSON() {
    return pick(this, [ 'width', 'height', 'pixels', 'markers' ]);
  }
}

export default PixelTurtle;
