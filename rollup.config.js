import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import json from '@rollup/plugin-json';

export default {
  input: 'src/toggle-timer-card.ts',
  output: [
    {
      file: 'dist/toggle-timer-card.js',
      format: 'es',
      sourcemap: false,
    },
    {
      file: 'custom_components/toggle_timer/www/toggle-timer-card.js',
      format: 'es',
      sourcemap: false,
    },
  ],
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
