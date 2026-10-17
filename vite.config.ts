import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ isSsrBuild }) => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': 'http://localhost:3001'
        }
      },
      plugins: [react()],
      build: {
        rollupOptions: {
          output: {
            // ブラウザ用だけ分割する（SSRビルドは1ファイルのまま）。
            // React本体・アイコン・文言データを分け、並行して読み込み、デプロイをまたいでキャッシュを効かせる。
            manualChunks: isSsrBuild ? undefined : (id: string) => {
              if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/') || id.includes('node_modules/scheduler')) return 'react';
              if (id.includes('node_modules/lucide-react')) return 'icons';
              // 英語版は言語切替時にだけ読み込む（i18n.ts）
              if (/[\\/](translations|serviceContent|caseContent|legalContent)\.en\.ts$/.test(id)) return 'content-en';
              if (/[\\/](translations|serviceContent|caseContent|legalContent|journal)\.ts$/.test(id)) return 'content';
              return undefined;
            },
          },
        },
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
