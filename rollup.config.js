import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import {terser} from 'rollup-plugin-terser';
import pkg from './package.json';

const comment         = `/*!
 * ${pkg.name} - version ${pkg.version}
 *
 * Made with ❤ by ${pkg.author.name} ${pkg.author.email}
 *
 * Copyright (c) ${(new Date()).getFullYear()} ${pkg.author.name}
 */
`;
const commentHistory  = `/*!
 * History API fix
 *
 * Made with ❤ by ${pkg.author.name} ${pkg.author.email}
 *
 * Copyright (c) ${(new Date()).getFullYear()} ${pkg.author.name}
 */
`;

export default [
	{
		input: 'src/history.js',
		output: {
      file: 'dist/history.fix.js',
      banner: commentHistory,
		},
		plugins: [
			babel({
        presets: [
          ["@babel/preset-env", {
            targets: {
              browsers: ["last 2 versions", "not IE < 11", "not IE_mob < 11"]
            },
          modules: false
          }]
        ],
				exclude: ['node_modules/**']
      }),
      cleanup(),
      terser(),
		]
	},

	// browser-friendly UMD build
	{
		input: 'src/routrrr.js',
		output: {
			name: 'Routrrr',
			file: pkg.browser,
      format: 'umd',
      banner: comment,
		},
		plugins: [
      // resolve(),
      // commonjs(),
			babel({
        presets: [
          ["@babel/preset-env", {
            targets: {
              browsers: ["last 2 versions", "not IE < 11", "not IE_mob < 11"]
            },
          modules: false
          }]
        ],
				exclude: ['node_modules/**']
      }),
      cleanup(),
      terser(),
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/routrrr.js',
		output: [
			{
        file: pkg.main,
        format: 'cjs',
        banner: comment,
        exports: 'auto',
      },
			{
        file: pkg.module,
        format: 'es',
        banner: comment,
      }
		],
		plugins: [
      babel({
        presets: [
          ["@babel/preset-env", {
            targets: {
              browsers: ["last 2 versions", "not IE <= 11", "not IE_mob <= 11"]
            },
          modules: false
          }]
        ],
        exclude: ['node_modules/**']
			}),
      cleanup(),
      terser(),
		]
	}
];
