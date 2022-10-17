const { Op } = require("sequelize");
const ChargeCheckpoint = require("../db/checkpoint");
const Transaction = require("../db/transaction");
const _ = require('lodash');
const logger = require('../utils/logger');
const { batchCharge } = require("../utils/near");

let running = false;

async function chargeAllUsage() {
  if (running) return;
  running = true;

  try {
    const checkpoint = await ChargeCheckpoint.findOne();
    const lastChargedId = checkpoint ? checkpoint.last_charged_id : 0;

    // find all charging transactions later than checkpoint
    const transactions = await Transaction.findAll({
      where: {
        type: 'charge',
        id: {
          [Op.gt]: lastChargedId,
        }
      }
    });

    const newCheckpointId = _.max(transactions.map(t => t.id));
    logger.debug('newCheckpointId %d', newCheckpointId);

    // group by account id
    const accountCharges = _.mapValues(
      _.groupBy(transactions, t => t.account_id),
      txns => _.sumBy(txns, t => BigInt(t.amount))
    )
    logger.debug('accountCharges %j', accountCharges);

    await batchCharge(accountCharges);
  } catch (err) {
    logger.error('chargeAll failed');
    logger.error(err);
  } finally {
    running = false;
  }
}

module.exports = chargeAllUsage;
