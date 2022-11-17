import { sveltekit } from '@sveltejs/kit/vite';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import inject from '@rollup/plugin-inject';

import svg from '@poppanator/sveltekit-svg';

const isDev = process.env.NODE_ENV === 'development';

/** @type {import('vite').UserConfig} */
const config = {
	define: {
		__version__: JSON.stringify(process.env.npm_package_version)
	},
	resolve: {
		alias: {
			path: 'path-br	owserify',
			util: 'rollup-plugin-node-polyfills/polyfills/util',
			'@ensdomains/address-encoder': '@ensdomains/address-encoder/lib/index.umd.js'
		}
	},
	plugins: [
		sveltekit(),
		// ↓ Needed for development mode
		isDev
			? nodePolyfills({
					include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')]
			  })
			: '',
		svg({
			type: 'url',
			svgoOptions: {
				multipass: true,
				plugins: [
					{
						name: 'preset-default',
						// by default svgo removes the viewBox which prevents svg icons from scaling
						// not a good idea! https://github.com/svg/svgo/pull/1461
						params: { overrides: { removeViewBox: false, removeUselessStrokeAndFill: false } }
					}
				]
			}
		})
	],
	optimizeDeps: {
		esbuildOptions: {
			// Node.js global to browser globalThis
			define: {
				global: 'globalThis'
			},
			// Enable esbuild polyfill plugins
			plugins: [
				NodeGlobalsPolyfillPlugin({
					buffer: true,
					process: true
				}),
				NodeModulesPolyfillPlugin()
			]
		}
	},

	build: {
		rollupOptions: {
			plugins: [
				// ↓ Needed for build
				nodePolyfills(),
				inject({ Buffer: ['buffer', 'Buffer'] })
			]
		},
		// ↓ Needed for build if using WalletConnect and other providers
		commonjsOptions: {
			transformMixedEsModules: true
		}
	}
};

export default config;
