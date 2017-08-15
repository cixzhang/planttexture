import lSystem from './l-system';
import PixelTurtle from './pixel-turtle';
import { getColor, lighten } from './colors';

const generate = (type, count) => lSystem('a', {
    'a': 'b[c]c',
    'c': 'ba',
  }, count);

const init = () => ([
  PixelTurtle.createAction('eyedrop', getColor('stem')),
  PixelTurtle.createAction('moveTo',
    turtle => [Math.floor(turtle.width / 2), turtle.height - 1]),
  PixelTurtle.createAction('turnTo', [0, -1]),
  PixelTurtle.createAction('turn', -Math.PI/4),
]);

const actions = () => ({
  'a': [
    PixelTurtle.createAction('turn', -Math.PI/12),
    PixelTurtle.createAction('draw', 3),
    PixelTurtle.createAction('eyedrop', (t) => lighten(t.color, 1)),
  ],
  'b': [
    PixelTurtle.createAction('turn', -Math.PI/12),
    PixelTurtle.createAction('draw', 2),
    PixelTurtle.createAction('eyedrop', (t) => lighten(t.color, 1)),
  ],
  '[': [
    PixelTurtle.createAction('save'),
    PixelTurtle.createAction('set', 'angleX', (t) => t.direction[0]),
    PixelTurtle.createAction('set', 'angleY', (t) => t.direction[1]),
    PixelTurtle.createAction('turn', Math.PI/3),
  ],
  'c': [
    PixelTurtle.createAction('draw', 2),
    PixelTurtle.createAction('eyedrop', (t) => lighten(t.color, 1)),
  ],
  ']': [
    PixelTurtle.createAction('load'),
    PixelTurtle.createAction('turnTo', (t) => {
      return [t.get('angleX'), t.get('angleY')];
    }),
  ],
  'd': [
    PixelTurtle.createAction('draw', 2),
    PixelTurtle.createAction('eyedrop', (t) => lighten(t.color, 1)),
  ],
});

export default { generate, init, actions };
