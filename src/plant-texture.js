
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

  // TODO: render canvas

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
