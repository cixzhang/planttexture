import lSystem from './l-system';
import PixelTurtle from './pixel-turtle';
import { getColor } from './colors';

const generate = (count) => lSystem('b', {
    'b': 'ax',
    'x': '[b-b]'
  }, count);

const init = () => ([
  PixelTurtle.createAction('eyedrop', getColor('stem')),
  PixelTurtle.createAction('moveTo',
    turtle => [Math.floor(turtle.width / 2), turtle.height - 1]),
  PixelTurtle.createAction('turnTo', [0, -1])
]);
const actions = () => ({
  'a': [
    PixelTurtle.createAction('draw', 2),
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
    PixelTurtle.createAction('draw', 1),
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
    PixelTurtle.createAction('save'),
    PixelTurtle.createAction('turn', Math.PI/4)
  ],
  '-': [ PixelTurtle.createAction('turn', -Math.PI/2) ],
  ']': [ PixelTurtle.createAction('load') ],
  'x': []
});

export default { generate, init, actions };
