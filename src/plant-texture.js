
function PlantTexture(plant, canvas = document.createElement('canvas')) {
  this.plant = plant;
  this.canvas = canvas;
}

export default PlantTexture;

PlantTexture.prototype = {};

PlantTexture.prototype.mount = function (parent)  {
  parent.appendChild(this.canvas);
  return this.canvas;
};

