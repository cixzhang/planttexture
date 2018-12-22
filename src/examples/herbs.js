
const herbs = [
  // branching variants
  {
    width: 16,
    height: 16,
    init: [
      ['eyedrop', [0, 0, 0, 255]],
      ['moveTo', t => [Math.floor(t.width / 2), t.height - 1]],
      ['turnTo', [0, -1]],
    ],
    start: '*x',
    rules: {
      x: '[i*a',
      a: 'b',
      b: 'g*][>>i*<<g*]r', // add variation with 'g*][>>i*<g*]r' and ''g*][>>i*<<<g*]r'
      r: '<<i*>>g*',
      i: '1',
      g: 'g*', // this can also be '*' or 'i*' for shorter stems
    },
    actions: {
      '1': [['draw', 1]],
      '>': [['turn', Math.PI / 6]],
      '<': [['turn', -Math.PI / 6]],
      '[': [['save']],
      ']': [['load']],
      '*': [['eyedrop', [255, 0, 0, 255]], ['draw', 1], ['eyedrop', [0, 0, 0, 255]]],
    }
  },
  {
    width: 16,
    height: 16,
    init: [
      ['eyedrop', [0, 0, 0, 255]],
      ['moveTo', t => [Math.floor(t.width / 2), t.height - 1]],
      ['turnTo', [0, -1]],
    ],
    start: '*x',
    rules: {
      x: '[i*a', // can scoot up branching by moving the [ forward
      a: 'b',
      b: 'i>1g>*<<][>>i*<ig*]r',
      r: '<<<g*>g*',
      i: '1',
      g: 'g*',
    },
    actions: {
      '1': [['draw', 1]],
      '>': [['turn', Math.PI / 6]],
      '<': [['turn', -Math.PI / 6]],
      '[': [['save']],
      ']': [['load']],
      '*': [['eyedrop', [255, 0, 0, 255]], ['draw', 1], ['eyedrop', [0, 0, 0, 255]]],
    }
  },
  // stalk variants
  {
    width: 16,
    height: 16,
    init: [
      ['eyedrop', [0, 0, 0, 255]],
      ['moveTo', t => [Math.floor(t.width / 2), t.height - 1]],
      ['turnTo', [0, -1]],
    ],
    start: '*x',
    rules: {
      x: '*r',
      l: 'i[<<1*>>]r',
      r: '1[>1*<]l',
      i: 'i1', // '11' or '1' for varying growth rates
    },
    actions: {
      '1': [['draw', 1]],
      '>': [['turn', Math.PI / 6]],
      '<': [['turn', -Math.PI / 6]],
      '[': [['save']],
      ']': [['load']],
      '*': [['eyedrop', [255, 0, 0, 255]], ['draw', 1], ['eyedrop', [0, 0, 0, 255]]],
    }
  }
];

module.exports = herbs;
