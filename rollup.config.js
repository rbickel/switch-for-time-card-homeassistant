import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

export default {
  input: 'src/switch-for-time-card.ts',
  output: {
    file: 'dist/switch-for-time-card.js',
    format: 'es',
    sourcemap: false,
  },
  plugins: [
    json(),
    resolve({
      browser: true,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: false,
    }),
    terser({
      compress: {
        drop_console: false,
      },
      output: {
        comments: false,
      },
    }),
  ],
};
