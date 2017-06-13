const { expect } = require('chai');
const { LSystem } = require('../plant-texture');

describe('l-system', () => {
  it('creates an iterable l-system', () => {
    const iterable = LSystem('a', {
      'a': 'aa'
    });
    expect(iterable.next().value).to.equal('a');
    expect(iterable.next().value).to.equal('aa');
    expect(iterable.next().value).to.equal('aaaa');
    expect(iterable.next().value).to.equal('aaaaaaaa');
  });

  it('iterates a simple herb', () => {
    const iterable = LSystem('b', {
      'b': 'ax',
      'x': '[bb]'
    });
    expect(iterable.next().value).to.equal('b');
    expect(iterable.next().value).to.equal('ax');
    expect(iterable.next().value).to.equal('a[bb]');
    expect(iterable.next().value).to.equal('a[axax]');
    expect(iterable.next().value).to.equal('a[a[bb]a[bb]]');
  });
});
