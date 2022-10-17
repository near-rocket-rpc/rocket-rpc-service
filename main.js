const config = require('config');
const { connect, sequelize } = require('./src/db/sequelize');
const { startConsumer } = require('./src/lake/event_consumer');
const app = require('./src/server');
const chargeAllUsage = require('./src/service/charge_service');
const logger = require('./src/utils/logger');

function setupGlobalProxy () {
  const proxy = require('node-global-proxy').default;
  proxy.setConfig({
    http: 'http://127.0.0.1:1087',
    https: 'http://127.0.0.1:1087'
  });
  proxy.start();
}

async function main () {
  setupGlobalProxy();

  await connect();
  await sequelize.sync({ alter: true });
  logger.info('DB connected');

  startConsumer();

  app.listen(config.port, () => {
    logger.info(`Rocket RPC server listening at ${config.port} ...`);
  });

  // setInterval(chargeAllUsage, config.get('chargeInterval'));
}

main()
  .catch(err => {
    console.error(err);
    console.error(err.stack);
    process.exit(1);
  });
