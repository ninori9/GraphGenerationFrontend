module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    fontFamily: {
      sans: [
        '"Fira Sans"',
        'sans-serif',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        'Oxygen',
        'Ubuntu',
        'Cantarell',
        '"Droid Sans"',
        '"Helvetica Neue"',
        'sans-serif',
      ],
      mono: [
        '"Fira Mono"',
        'ui-monospace',
        'SFMono-Regular',
        'Menlo',
        'Monaco',
        'Consolas',
        '"Liberation Mono"',
        '"Courier New"',
        'monospace',
      ],
    },

    extend: {
      // note: colors EXTEND a theme!
      colors: {
        tum: {
          DEFAULT: '#0064BD',
          light: '#89c8ff',
          dark: '#004faf',
          darkest: '#002a96',
        },
        fabric: {
          DEFAULT: '#f4544c',
          light: '#fbbbb7',
          blue: '#94D4D4',
          lightblue: '#d4eeee'
        }
      },
      spacing: {
        128: '32rem',
      },
    },

    variants: {
      extend: {
        opacity: ['disabled'],
        backgroundColor: ['active', 'disabled'],
        borderColor: ['active', 'disabled'],
        boxShadow: ['disabled'],
        cursor: ['disabled'],
        ringWidth: ['hover', 'active', 'disabled'],
        ringColor: ['hover', 'active', 'disabled'],
        ringOpacity: ['hover', 'active', 'disabled'],
        textDecoration: ['hover', 'active'],
        textColor: ['hover', 'active'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/line-clamp')],
}
