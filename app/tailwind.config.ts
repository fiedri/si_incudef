import type { Config } from 'tailwindcss'

/**
 * Tokens from docs/incudef_design_system.md
 *
 * Mode-dependent colors (primary, surface, outline, ...) resolve to CSS
 * variables so a single class works in both themes. The values are declared in
 * src/routes/styles.css under :root and .dark.
 */
const config: Config = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Static accents
        accent: '#C85A32',
        'on-accent': '#0F0F0F',
        ochre: '#D99B26',
        success: '#1E7E4E',
        warning: '#B86E00',
        error: '#B42318',

        // Theme-aware tokens
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--color-muted-foreground) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        'on-primary': 'rgb(var(--color-on-primary) / <alpha-value>)',
        'primary-container': 'rgb(var(--color-primary-container) / <alpha-value>)',
        'on-primary-container': 'rgb(var(--color-on-primary-container) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-container': 'rgb(var(--color-surface-container) / <alpha-value>)',
        'surface-container-low': 'rgb(var(--color-surface-container-low) / <alpha-value>)',
        'on-surface': 'rgb(var(--color-on-surface) / <alpha-value>)',
        'on-surface-variant': 'rgb(var(--color-on-surface-variant) / <alpha-value>)',
        outline: 'rgb(var(--color-outline) / <alpha-value>)',
        'outline-variant': 'rgb(var(--color-outline-variant) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['"PT Sans"', 'system-ui', 'sans-serif'],
        serif: ['"PT Serif"', 'Georgia', 'serif'],
        mono: ['"Spline Sans Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-lg': ['40px', { lineHeight: '48px', letterSpacing: '-0.5px', fontWeight: '700' }],
        'display-lg-mobile': [
          '30px',
          { lineHeight: '36px', letterSpacing: '-0.25px', fontWeight: '700' },
        ],
        'headline-lg': ['32px', { lineHeight: '40px', letterSpacing: '-0.25px', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', letterSpacing: '0px', fontWeight: '700' }],
        'title-lg': ['20px', { lineHeight: '28px', letterSpacing: '0px', fontWeight: '700' }],
        'title-md': ['16px', { lineHeight: '24px', letterSpacing: '0px', fontWeight: '700' }],
        'body-lg': ['16px', { lineHeight: '24px', letterSpacing: '0px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', letterSpacing: '0px', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.1px', fontWeight: '400' }],
        'label-lg': ['14px', { lineHeight: '20px', letterSpacing: '0.1px', fontWeight: '700' }],
        'label-md': ['12px', { lineHeight: '16px', letterSpacing: '0.25px', fontWeight: '700' }],
        'label-sm': ['11px', { lineHeight: '14px', letterSpacing: '0.25px', fontWeight: '700' }],
        'mono-md': ['13px', { lineHeight: '20px', letterSpacing: '0px', fontWeight: '400' }],
      },
      spacing: {
        'gutter-xs': '4px',
        'gutter-sm': '8px',
        'gutter-md': '16px',
        'gutter-lg': '24px',
        'gutter-xl': '32px',
        section: '48px',
        page: '24px',
      },
      borderRadius: {
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        full: '9999px',
      },
      transitionTimingFunction: {
        state: 'ease-out',
        'surface-in': 'cubic-bezier(0.2, 0, 0, 1)',
        'surface-out': 'cubic-bezier(0.3, 0, 1, 1)',
      },
      transitionDuration: {
        250: '250ms',
      },
      maxWidth: {
        page: '1280px',
      },
    },
  },
  plugins: [],
}

export default config
