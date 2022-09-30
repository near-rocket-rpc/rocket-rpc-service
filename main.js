const config = require('config');
const { connect, sequelize } = require('./src/db/sequelize');
const app = require('./src/server');

async function main () {
  await connect();
  await sequelize.sync({ alter: true });

  app.listen(config.port, () => {
    console.log(`Rocket RPC server listening at ${config.port} ...`);
  });
}

main()
  .catch(err => {
    console.error(err);
    console.error(err.stack);
    process.exit(1);
  })
