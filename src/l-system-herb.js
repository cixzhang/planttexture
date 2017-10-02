import { getColor, lighten } from './colors';

const herb = {
  width: 16,
  height: 16,
  init: (kind) => ([
    ['eyedrop', getColor('stem')],
    ['moveTo', turtle => [Math.floor(turtle.width / 2), turtle.height - 1]],
    ['turnTo', [0, -1]],
    ['set', 'type', kind + 2],
  ]),
  start: 'b',
  rules: (kind) => ({
    'b': 'ax',
    'x': `[${'b'.repeat(kind + 2).split('').join('-')}]`
  }),
  actions: {
    'a': [
      ['draw', (turtle) => turtle.get('type')],
      ['eyedrop', (t) => lighten(t.color, 1)],
      ['set', 'nodes', (turtle) => {
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
        }],
    ],
    'b': [
      ['draw', (turtle) => turtle.get('type') / 2],
      ['eyedrop', (t) => lighten(t.color, 1)],
      ['set', 'nodes', (turtle) => {
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
      }],
    ],
    '[': [
      ['set', 'adjust', (turtle) => {
          const adjust = turtle.get('adjust') || turtle.get('type');
          return adjust / turtle.get('type');
        }],
      ['save'],
      ['turnTo', (turtle) => [-1 * turtle.get('adjust'), -1]],
    ],
    '-': [
      ['load'],
      ['save'],
      ['turnTo', (turtle) => [1 * turtle.get('adjust'), -1]],
    ],
    ']': [
      ['set', 'adjust', (turtle) => {
          const adjust = turtle.get('adjust') || turtle.get('type');
          return adjust * turtle.get('type');
        }],
      ['load'],
      ['turnTo', [0, -1]],
    ],
    'x': [],
  }
}

export default herb;
