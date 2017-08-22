
const init = [
  ['eyedrop', [0, 0, 0, 255]],
  ['moveTo', t => [Math.floor(t.width / 2), t.height - 1]],
  ['turnTo', [0, -1]],
];

const actions = {
  'd': [['draw', 1]],
  'm': [['move', 1]],
  '>': [['turn', Math.PI / 6]],
  '<': [['turn', -Math.PI / 6]],
  '[': [['save']],
  ']': [['load']]
};

export default { init, actions };
