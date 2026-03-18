import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'logos',
  web: {
    host: 'localhost',
    port: 3000,
    commands: {
      dev: 'next dev',
      build: 'next build',
    },
  },
  permissions: [],
  outdir: 'out',
  brand: {
    displayName: 'Logos AI',
    icon: 'https://tossapp-tan.vercel.app/icon.png',
    primaryColor: '#6B5CE7',
  },
});
