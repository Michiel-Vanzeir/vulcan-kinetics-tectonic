import { defineConfig } from 'wxt';

// WXT generates manifest.json from this config + the files in entrypoints/.
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'Doubt Helper',
    version: '0.1.0',
    description:
      'Notices when you keep deleting your writing and finds keywords for who could help.',
  },
});
