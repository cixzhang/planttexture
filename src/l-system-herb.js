import lSystem from './l-system';
import PixelTurtle from './pixel-turtle';
import { getColor } from './colors';

const generate = (type, count) => lSystem('b', {
    'b': 'ax',
    'x': `[${'b'.repeat(type + 2).split('').join('-')}]`
  }, count);

const init = (type) => ([
  PixelTurtle.createAction('eyedrop', getColor('stem')),
  PixelTurtle.createAction('moveTo',
    turtle => [Math.floor(turtle.width / 2), turtle.height - 1]),
  PixelTurtle.createAction('turnTo', [0, -1]),
  PixelTurtle.createAction('set', 'type', type + 2)
]);
const actions = () => ({
  'a': [
    PixelTurtle.createAction('draw', (turtle) => turtle.get('type')),
    PixelTurtle.createAction('set', 'nodes', (turtle) => {
      const nodes = turtle.get('nodes') || [];
      nodes.push({
        position: turtle.position,
        direction: 'left'
      });
      nodes.push({
        position: turtle.position,
        direction: 'right'
      });
      return nodes;
    })
  ],
  'b': [
    PixelTurtle.createAction('draw', (turtle) => turtle.get('type') / 2),
    PixelTurtle.createAction('set', 'nodes', (turtle) => {
      const nodes = turtle.get('nodes') || [];
      nodes.push({
        position: turtle.position,
        direction: 'left'
      });
      nodes.push({
        position: turtle.position,
        direction: 'right'
      });
      return nodes;
    })
  ],
  '[': [
    PixelTurtle.createAction('set', 'adjust', (turtle) => {
      const adjust = turtle.get('adjust') || turtle.get('type');
      return adjust / turtle.get('type');
    }),
    PixelTurtle.createAction('save'),
    PixelTurtle.createAction('turnTo', (turtle) => [-1 * turtle.get('adjust'), -1])
  ],
  '-': [
    PixelTurtle.createAction('load'),
    PixelTurtle.createAction('save'),
    PixelTurtle.createAction('turnTo', (turtle) => [1 * turtle.get('adjust'), -1])
  ],
  ']': [
    PixelTurtle.createAction('set', 'adjust', (turtle) => {
      const adjust = turtle.get('adjust') || turtle.get('type');
      return adjust * turtle.get('type');
    }),
    PixelTurtle.createAction('load'),
    PixelTurtle.createAction('turnTo', [0, -1])
  ],
  'x': []
});

export default { generate, init, actions };
