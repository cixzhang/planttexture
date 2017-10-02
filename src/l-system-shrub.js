import PixelTurtle from './pixel-turtle';
import { getColor, lighten } from './colors';

const _ = PixelTurtle.createAction;

const shrub = {
  width: 16,
  height: 16,
  init: [
    _('eyedrop', getColor('stem')),
    _('moveTo',
      turtle => [Math.floor(turtle.width / 2), turtle.height - 1]),
    _('turnTo', [0, -1]),
    _('turn', -Math.PI/4),
  ],
  start: 'a',
  rules: {
    'a': 'b[c]c',
    'c': 'ba',
  },
  actions: {
    'a': [
      _('turn', -Math.PI/12),
      _('draw', 3),
      _('eyedrop', (t) => lighten(t.color, 1)),
    ],
    'b': [
      _('turn', -Math.PI/12),
      _('draw', 2),
      _('eyedrop', (t) => lighten(t.color, 1)),
    ],
    '[': [
      _('save'),
      _('set', 'angleX', (t) => t.direction[0]),
      _('set', 'angleY', (t) => t.direction[1]),
      _('turn', Math.PI/3),
    ],
    'c': [
      _('draw', 2),
      _('eyedrop', (t) => lighten(t.color, 1)),
    ],
    ']': [
      _('load'),
      _('turnTo', (t) => {
        return [t.get('angleX'), t.get('angleY')];
      }),
    ],
    'd': [
      _('draw', 2),
      _('eyedrop', (t) => lighten(t.color, 1)),
    ],
  }
};

export default shrub;
