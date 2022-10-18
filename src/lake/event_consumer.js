const { startStream } = require("near-lake-framework");
const { deposit } = require("../service/balance_service");
const logger = require('../utils/logger');
const config = require('config');
const Checkpoint = require("../db/checkpoint");
const Queue = require('priorityqueuejs');

const CONSUMER_TASK = 'event_consumer';

const queue = new Queue((a, b) => b.blockHeight - a.blockHeight);

/**
 * 
 * @param {import("near-lake-framework/dist/types").StreamerMessage} message 
 */
async function handleStreamerMessage(message) {
  const blockHeight = message.block.header.height;
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

  // a list of json event data
  let events = depositEvents.flatMap(es => es.data);

  queue.enq({
    blockHeight,
    events,
  });
}

let processRunning = false;
async function processQueue() {
  try {
    while (!queue.isEmpty()) {
      const { blockHeight, events } = queue.deq();
      // logger.debug(`processing block height ${blockHeight}`);

      if (events.length) {
        for (const data of events) {
          await deposit(data.account_id, data.amount);
        }
      }

      await Checkpoint.saveCheckpoint(CONSUMER_TASK, blockHeight);
    }
  } catch (err) {
    throw err;
  } finally {
    // schedule another call after 1 sec
    setTimeout(processQueue, 1000);
  }
}

async function startConsumer() {
  const startBlockHeight = await Checkpoint.getCheckpoint(CONSUMER_TASK) || config.get('lake.startBlockHeight');
  const lakeConfig = {
    s3BucketName: "near-lake-data-testnet",
    s3RegionName: "eu-central-1",
    startBlockHeight
  };
  startStream(lakeConfig, handleStreamerMessage);
  logger.info('near lake consumer started from ' + startBlockHeight);

  // schedule a task to consume queue
  processQueue();
}

module.exports = {
  startConsumer,
}
