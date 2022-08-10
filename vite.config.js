import { sveltekit } from '@sveltejs/kit/vite';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';
import svg from '@poppanator/sveltekit-svg';

const production = process.env.NODE_ENV === 'production';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		// ↓ Needed for development mode
		!production &&
			nodePolyfills({
				include: ['node_modules/**/*.js', new RegExp('node_modules/.vite/.*js')]
			}),
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
			plugins: [NodeModulesPolyfillPlugin()]
		}
	},

	build: {
		rollupOptions: {
			plugins: [
				// ↓ Needed for build
				nodePolyfills()
			]
		},
		// ↓ Needed for build if using WalletConnect and other providers
		commonjsOptions: {
			transformMixedEsModules: true
		}
	}
};

export default config;
