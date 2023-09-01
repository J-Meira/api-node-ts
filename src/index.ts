import { Knex } from './database/knex';
import { server } from './server';

const port = process.env.PORT || '3000';

const startServer = () => {
  server.listen(port, () => console.log(`Running on port: ${port}`));
};

if (process.env.IS_DEBUG) {
  startServer();
} else {
  console.log('Started migrations');
  Knex.migrate
    .latest()
    .then(() => {
      Knex.seed
        .run()
        .then(() => startServer())
        .catch(console.log);
    })
    .catch(console.log);
}
