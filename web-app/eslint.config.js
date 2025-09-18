import { defineConfig } from 'eslint-define-config';

export default defineConfig({
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended', // Add this line
    ],
    plugins: ['@typescript-eslint', 'vue'],
    rules: {
        'prettier/prettier': 'error', // Ensure Prettier issues are shown as ESLint errors
        // Add other custom rules here
    },
    overrides: [
        {
            files: ['*.ts', '*.vue'],
            parser: '@typescript-eslint/parser',
        },
    ],
});