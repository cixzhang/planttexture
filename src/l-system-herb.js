import lSystem from './l-system';
import PixelTurtle from './pixel-turtle';

const system = lSystem('b', {
  'b': 'ax',
  'x': '[b-b]'
});
const init = [
  PixelTurtle.createAction('moveTo',
    turtle => [Math.floor(turtle.width / 2), Math.floor(turtle.height)])
];
const actions = {
  'a': [
    PixelTurtle.createAction('turnTo', [0, 1]),
    PixelTurtle.createAction('draw', 2),
    PixelTurtle.createAction('set', (turtle) => {
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
    PixelTurtle.createAction('turnTo', [0, 1]),
    PixelTurtle.createAction('draw', 1),
    PixelTurtle.createAction('set', (turtle) => {
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
};

export default { system, init, actions };
