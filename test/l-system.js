const { expect } = require('chai');
const PlantTexture = require('../plant-texture');

describe('l-system', () => {
  const lSystem = PlantTexture.lSystem;

  it('creates an iterable l-system', () => {
    const iterable = lSystem('a', {
      'a': 'aa'
    });
    expect(iterable.next().value).to.equal('a');
    expect(iterable.next().value).to.equal('aa');
    expect(iterable.next().value).to.equal('aaaa');
    expect(iterable.next().value).to.equal('aaaaaaaa');
  });

  it('can generate a simple herb', () => {
    const iterable = lSystem('b', {
      'b': 'ax',
      'x': '[bb]'
    });
    expect(iterable.next().value).to.equal('b');
    expect(iterable.next().value).to.equal('ax');
    expect(iterable.next().value).to.equal('a[bb]');
    expect(iterable.next().value).to.equal('a[axax]');
    expect(iterable.next().value).to.equal('a[a[bb]a[bb]]');
  });

  it('can generate a simple stalk', () => {
    const iterable = lSystem('ix', {
      'i': 'y',
      'yx': 'yix'
    });

    expect(iterable.next().value).to.equal('ix');
    expect(iterable.next().value).to.equal('yx');
    expect(iterable.next().value).to.equal('yix');
    expect(iterable.next().value).to.equal('yyx');
    expect(iterable.next().value).to.equal('yyix');
  });
});
