import { chain } from 'lodash-es';

function* lSystem(_state, rules, maxIterations) {
  maxIterations = maxIterations || Infinity;
  let i = 0;
  let state = _state;
  const holder = '@'; // avoid this char in rules
  const ruleList = chain(rules)
    .map((replace, key) => ({
      length: key.length,
      key,
      replace
    }))
    .sortBy(rule => -rule.length)
    .value()

  yield state;
  i += 1;

  while (i < maxIterations) {
    const replacements = [];
    let heldState = state;
    ruleList.forEach((rule) => {
      // apply rule
      let found = heldState.search(rule.key);
      while (found > -1) {
        heldState = heldState.replace(rule.key, holder);
        replacements[found] = {index: found, rule};
        found = heldState.search(rule.key)
      }
    });

    const stateList = heldState.split('');
    replacements.forEach(({ index, rule }) => {
      stateList[index] = rule.replace;
    });

    state = stateList.join('');
    yield state;
    i += 1;
  }
}

lSystem.toList = (iterable, count) => {
  const list = [];
  for (let i = 0; i < count; i++) {
    list.push(iterable.next().value)
  }
  return list;
}

export default lSystem;
