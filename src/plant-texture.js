import GLBigTriangle from 'gl-big-triangle';
import createShader from 'gl-shader';

import shader_v from './shader_v.glsl';
import shader_f from './shader_f.glsl';

export function plantTexturePNG(plant, canvas = document.createElement('canvas')) {
  plantTextureCanvas(plant, canvas);
  return canvas.toDataURL('image/png');
}

export function plantTextureCanvas(plant, canvas = document.createElement('canvas')) {
  /* eslint no-console: [0] */
  var gl = getGL(canvas);
  if (!gl) {
    console.log('Cannot find WebGL context.');
    return;
  }

  render(gl);

  return canvas;
}

function getGL(canvas) {
  var gl = (
    canvas.getContext('webgl') ||
    canvas.getContext('webgl-experimental') ||
    canvas.getContext('experimental-webgl')
  );

  if (!gl) {
    console.log('Cannot find WebGL context.');
    return false;
  }
  return gl;
}

function render(gl) {
  // TODO: render plant
  var triangle = GLBigTriangle(gl);
  var shader = createShader(gl, shader_v, shader_f);
  shader.bind();
  triangle.bind();
  triangle.draw();

  shader.dispose();
  triangle.unbind();
}
