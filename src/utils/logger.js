const config = require('config');
const logger = require('pino')({
  level: config.get('logger.level')
});

module.exports = logger;
