/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		screens: {
			sm: '375px',
			md: '720px',
			lg: '1024px',
			xl: '1280px'
		},
		// textColor: {
		// 	warningPrice: '#F29D4E',
		// 	forbiddenPrice: '#F24E4E'
		// },
		extend: {
			colors: {
				brand: {
					primary: '#5959D8',
					green: '#3AD076',
					red: '#F24E4E',
					bgFrom: '#DDDEF5',
					bgTo: '#F6F7FA',
					background: '#EFF0F9',
					overlayBg: '#13132D80',
					warningPrice: '#F29D4E',
					forbiddenPrice: '#F24E4E'
				}
			}
		}
	},
	plugins: [
		({ addVariant }) => {
			addVariant('child', '& > *');
			addVariant('descendant', '& *');
		}
	]
};
