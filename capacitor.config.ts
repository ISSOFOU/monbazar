import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.monbazar.app',
  appName: 'Mon Bazar',
  webDir: 'dist',
  server: {
    url: 'https://resplendent-empanada-11d531.netlify.app',
    cleartext: false,
  },
};

export default config;
