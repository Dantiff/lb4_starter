import {ApplicationConfig} from '@loopback/core';
import {BingwaApiV2Application} from './application';

/**
 * Export the OpenAPI spec from the application
 */
async function exportOpenApiSpec(): Promise<void> {
  const config: ApplicationConfig = {
    rest: {
      basePath: '/api',
      apiExplorer: {
        disabled: false,
      },
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST ?? 'localhost',
      cors: {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        preflightContinue: false,
        optionsSuccessStatus: 204,
        maxAge: 86400,
        credentials: true,
      },
      expressSettings: {
        'x-powered-by': false,
        env: 'production',
      }
    },
  };
  const outFile = process.argv[2] ?? '';
  const app = new BingwaApiV2Application(config);
  await app.boot();
  await app.exportOpenApiSpec(outFile);
}

exportOpenApiSpec().catch(err => {
  console.error('Fail to export OpenAPI spec from the application.', err);
  process.exit(1);
});
