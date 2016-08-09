import string from 'rollup-plugin-string';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  entry: 'src/main.js',
  dest: 'bundle.js',
  format: 'iife',
  indent: '  ',
  plugins: [
    string({
      include: '**/*.glsl'
    }),
    nodeResolve({
      jsnext: true,
      main: true,
      browser: true
    }),
    commonjs({
      include: 'node_modules/**',
      sourceMap: true
    })
  ]
}
