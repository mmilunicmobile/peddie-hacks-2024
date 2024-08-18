/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				foreground: "#050315",
				background: "#fbfbfe",
				primary: "#2f27ce",
				secondary: "#dedcff",
				accent: "#433bff",
			},
			fontFamily: {
				'press-start': ['"Press Start 2P"', 'sans-serif'],
			},
		},
	},
	plugins: [],
}
