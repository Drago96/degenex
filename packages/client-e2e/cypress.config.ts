import { defineConfig } from 'cypress';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    baseUrl: `http://${process.env.CLIENT_HOST || 'localhost'}:${
      process.env.CLIENT_PORT || '4200'
    }`,
  },
});
