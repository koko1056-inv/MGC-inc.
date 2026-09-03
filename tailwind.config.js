/** @type {import('tailwindcss').Config} */
// index.html で CDN 版に渡していた tailwind.config をそのまま移植したもの。
// 見た目を変えないため、トークンは一切変更していない。
export default {
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './translations.ts',
    './serviceContent.ts',
    './caseContent.ts',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'Noto Sans JP',
          'Hiragino Kaku Gothic ProN',
          'Hiragino Sans',
          'Yu Gothic',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        jp: ['Noto Sans JP', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Yu Gothic', 'Inter', 'sans-serif'],
      },
      colors: {
        // 透過（bg-accent/10 など）を効かせるため <alpha-value> を持つ形にする。
        // 実際の色は styles.css の --color-accent-rgb で定義する。
        accent: 'rgb(var(--color-accent-rgb) / <alpha-value>)',
        offwhite: '#FAFAFA',
        offblack: '#0A0A0F',
        ink: '#15151B',
      },
      spacing: {
        128: '32rem',
      },
    },
  },
  plugins: [],
};
