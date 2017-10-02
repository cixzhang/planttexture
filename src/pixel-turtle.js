import { drawPixel } from './helpers.js';
import { pick } from 'lodash-es';

class PixelTurtle {
  static createAction(command, ...params) {
    return [ command, ...params ];
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
    this.color = [0, 0, 0, 255];
    this.saved = [];
    this.state = {};
    return this;
  }

  moveTo([x, y]) {
    this.position[0] = x;
    this.position[1] = y;
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
      doDraw(Math.round(x), Math.round(y), this.color);
      this.move(1);
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

  turnTo([x, y]) {
    this.direction[0] = x;
    this.direction[1] = y;
    return this;
  }

  save() {
    this.saved.push([...this.position]);
    return this;
  }

  load() {
    this.position = this.saved.pop();
    return this;
  }

  eyedrop(color) {
    this.color = color;
    return this;
  }

  get(key) {
    return this.state[key];
  }

  set(key, value) {
    this.state[key] = value;
    return value;
  }

  perform(actions) {
    actions.map((_action) => {
      const action = [..._action];
      const command = action.shift();
      const params = action.map(param => {
        if (typeof param === 'function') return param(this);
        return param;
      })
      this[command](...params);
    });
    return this;
  }

  toJSON() {
    return pick(this, [ 'width', 'height', 'pixels', 'markers' ]);
  }
}

export default PixelTurtle;
