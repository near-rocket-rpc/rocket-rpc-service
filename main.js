const config = require('config');
const { connect, sequelize } = require('./src/db/sequelize');
const app = require('./src/server');
const chargeAllUsage = require('./src/service/charge_service');
const logger = require('./src/utils/logger');

async function main () {
  await connect();
  await sequelize.sync({ alter: true });
  logger.info('DB connected');

  app.listen(config.port, () => {
    logger.info(`Rocket RPC server listening at ${config.port} ...`);
  });

  setInterval(chargeAllUsage, config.get('chargeInterval'));
}

main()
  .catch(err => {
    console.error(err);
    console.error(err.stack);
    process.exit(1);
  });
