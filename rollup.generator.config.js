import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  entry: 'src/l-system-generator.js',
  dest: 'l-system-generator.js',
  format: 'umd',
  indent: '  ',
  moduleName: 'LSysGen',
  plugins: [
    nodeResolve({
      jsnext: true
    })
  ]
}
