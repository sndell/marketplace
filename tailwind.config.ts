const { addDynamicIconSelectors } = require('@iconify/tailwind');
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        accent: '#F36F5D',
        primary: '#F6F2F1',
        primaryDark: '#eee8e7',
        background: '#FFFFFF',
      },
      textColor: {
        primary: '#000000',
        primaryLight: '#909090',
        secondary: '#ffffff',
        accent: '#F36F5D',
      },
      screens: {
        xs: '560px',
      },
      fontSize: {
        '3xl': '32px',
      },
    },
  },
  plugins: [addDynamicIconSelectors()],
};
export default config;
