// tailwind.config.ts
import { heroui } from '@heroui/react'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      borderRadius: {
        // Unifying your "4xl" style across the app
        portal: '2rem',
      },
      spacing: {
        // Unified height for alignment between Stats and Chart cards
        'dashboard-card': '30rem',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: '#006FEE',
              foreground: '#FFFFFF',
            },
            // Setting the slate-50 as the default app background
            background: '#f8fafc',
          },
          layout: {
            radius: {
              small: '8px',
              medium: '12px',
              large: '16px',
            },
          },
        },
      },
    }),
  ],
}
