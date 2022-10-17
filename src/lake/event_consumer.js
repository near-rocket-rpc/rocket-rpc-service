const { startStream } = require("near-lake-framework");
const { deposit } = require("../service/balance_service");
const logger = require('../utils/logger');
const config = require('config');

const lakeConfig = {
  s3BucketName: "near-lake-data-testnet",
  s3RegionName: "eu-central-1",
  startBlockHeight: config.get('lake.startBlockHeight'),
};

/**
 * 
 * @param {import("near-lake-framework/dist/types").StreamerMessage} message 
 */
async function handleStreamerMessage(message) {
  const depositEvents = message
    .shards
    .flatMap(shard => shard.receiptExecutionOutcomes)
    .flatMap(outcome => outcome.executionOutcome.outcome.logs.map(
      log => {
        const [_, probablyEvent] = log.match(/^EVENT_JSON:(.*)$/) ?? []
        try {
          return JSON.parse(probablyEvent)
        } catch (e) {
          return
        }
      }
    ))
    .filter(e => !!e)
    .filter(e => e.standard === 'rocket-rpc' && e.event === 'deposit');

  if (depositEvents.length) {
    logger.debug('found deposit events');
    logger.debug('%j', depositEvents);
  }

  for (const event of depositEvents) {
    for (const data of event.data) {
      const { account_id, amount } = data;
      await deposit(account_id, amount);
    }
  }
}

function startConsumer() {
  startStream(lakeConfig, handleStreamerMessage);
  logger.info('near lake consumer started');
}

module.exports = {
  startConsumer,
}
