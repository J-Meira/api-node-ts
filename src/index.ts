import { Knex } from './database/knex';
import { server } from './server';

const fs = require('fs');
const https = require('https');

const port = process.env.PORT || '3000';

if (process.env.IS_DEBUG) {
  const key = fs.readFileSync('./.ssl/cert.key');
  const cert = fs.readFileSync('./.ssl/cert.crt');
  const httpsServer = https.createServer({ key: key, cert: cert }, server);
  httpsServer.listen(port, () => {
    console.log(`Running HTTPS on port ${port}`);
  });
} else {
  console.log('Started migrations');
  Knex.migrate
    .latest()
    .then(() => {
      Knex.seed
        .run()
        .then(() =>
          server.listen(port, () =>
            console.log(`Running on port: ${port}`),
          ),
        )
        .catch(console.log);
    })
    .catch(console.log);
}
