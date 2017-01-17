import { createStemSetPNG } from './create-image-data.js';

class PlantTexture {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.png = null;
    this.nodeSet = [];
  }

  generateStems(type, stemTypes, stemGrowths) {
    this.png = createStemSetPNG(type, stemTypes, stemGrowths, this.canvas, this.nodeSet);
  }
}

export default PlantTexture;
