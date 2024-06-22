const { addDynamicIconSelectors } = require('@iconify/tailwind');
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './features/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        accent: '#F36F5D',
        primary: '#F6F2F1',
        primaryDark: '#eee8e7',
        secondary: '#F4F4F4',
        secondaryDark: '#ece7e7',
        background: '#FFFFFF',
      },
      textColor: {
        primary: '#000000',
        primaryLight: '#909090',
        secondary: '#ffffff',
        accent: '#F36F5D',
        error: '#ff3d23',
      },
      borderColor: {
        secondary: '#e4e4e4',
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
