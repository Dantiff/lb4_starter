
import {ApplicationConfig, BingwaApiV2Application} from './application';

export * from './application';

export async function main(options: ApplicationConfig = {}) {
  const app = new BingwaApiV2Application(options);
  await app.boot();
  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  return app;
}

if (require.main === module) {
  // Run the application
  const version = Number(require('../package.json').version.split('.').shift());
  const config = {
    rest: {
      basePath: '/api' + (version > 0 ? '/v' + version : ''),
      apiExplorer: {
        disabled: false,
      },
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
      // The `gracePeriodForClose` provides a graceful close for http/https
      // servers with keep-alive clients. The default value is `Infinity`
      // (don't force-close). If you want to immediately destroy all sockets
      // upon stop, set its value to `0`.
      // See https://www.npmjs.com/package/stoppable
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        // useful when used with OpenAPI-to-GraphQL to locate your application
        setServersFromRequest: true,
      },
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
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
