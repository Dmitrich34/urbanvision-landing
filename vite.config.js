import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig(({ mode }) => {
  const isSingle = mode === 'single' // запускаем с --mode single для «одного файла»

  return {
    base: isSingle ? './' : '/',      // 👈 добавили относительную базу для single
    plugins: [
      react(),
      tailwindcss(),
      ...(isSingle ? [viteSingleFile()] : []), // подключаем только в режиме single
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'es2018',
      // Для single: всё встраиваем в HTML; для обычной — дефолты Vite
      cssCodeSplit: isSingle ? false : true,
      assetsInlineLimit: isSingle ? 100_000_000 : 4096,
      rollupOptions: isSingle
        ? { output: { inlineDynamicImports: true } }
        : {},
    },
  }
})
