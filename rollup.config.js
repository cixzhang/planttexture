import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  entry: 'src/plant-texture.js',
  dest: 'plant-texture.js',
  format: 'umd',
  indent: '  ',
  moduleName: 'PlantTexture',
  plugins: [
    nodeResolve({
      jsnext: true
    })
  ]
}
