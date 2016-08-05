(function (createShell) {
  'use strict';

  createShell = 'default' in createShell ? createShell['default'] : createShell;

  function PlantTexture(plant, element = document.createElement('div')) {
    this.plant = plant;
    this.element = element;
    this.shell = createShell({
      element: element
    });
  }

  PlantTexture.prototype = {};

  PlantTexture.prototype.mount = function (parent)  {
    parent.appendChild(this.element);
    return this.element;
  };

  var texture = new PlantTexture();
  texture.mount(document.body);

}(createShell));