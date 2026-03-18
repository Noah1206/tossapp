import { defineConfig } from '@granite-js/plugin-core';
import { appsInToss } from '@apps-in-toss/plugins';

export default defineConfig({
  appName: 'logos-ai',
  scheme: 'logos-ai',
  outdir: 'out',
  plugins: [
    appsInToss({
      appType: 'general',
      brand: {
        displayName: 'Logos AI',
        primaryColor: '#6B5CE7',
        icon: 'https://tossapp-tan.vercel.app/icon.png',
      },
      navigationBar: {},
    }),
  ],
});
