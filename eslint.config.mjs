import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'coverage']),

  // Приложението (браузър, React)
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      // Съвет на React Compiler, не грешка: показва се като предупреждение
      'react-hooks/set-state-in-effect': 'warn',
    },
  },

  // Контекстите изнасят и Provider, и hook — нормално за контекст
  {
    files: ['src/*Context.jsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },

  // Express сървърът (CommonJS, Node)
  {
    files: ['server.js'],
    extends: [js.configs.recommended],
    languageOptions: { sourceType: 'commonjs', globals: globals.node },
  },

  // Скриптове и конфигурации (ESM, Node)
  {
    files: ['scripts/**/*.js', 'vite.config.mjs', 'eslint.config.mjs'],
    extends: [js.configs.recommended],
    languageOptions: { sourceType: 'module', globals: globals.node },
  },

  // Service worker
  {
    files: ['public/sw.js'],
    extends: [js.configs.recommended],
    languageOptions: { sourceType: 'script', globals: globals.serviceworker },
  },
])
