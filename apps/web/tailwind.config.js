/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");

module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "#19323C",
				},
				secondary: {
					DEFAULT: "#8C5E58",
				},
				tertiary: {
					DEFAULT: "#4B8F8C",
				},
				light: {
					DEFAULT: "#FDFBED",
				},
				red: {
					DEFAULT: "#963D48",
				},
			},
		},
	},
	plugins: [
		nextui({
			theme: {
				extend: {
					colors: {
						primary: {
							DEFAULT: "#19323C",
						},
						secondary: {
							DEFAULT: "#8C5E58",
						},
						warning: {
							DEFAULT: "#FFB800",
						},
						danger: {
							DEFAULT: "#FF4D4F",
						},
					},
				},
			},
		}),
	],
};