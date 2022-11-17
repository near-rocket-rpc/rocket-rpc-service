const { sequelize } = require('../db/sequelize');
const TokenBalance = require('../db/token_balance');
const Transaction = require('../db/transaction');
const Sequelize = require('sequelize');
const assert = require('assert');
const logger = require('../utils/logger');

const COST = 1e18;

async function charge (accountId) {
  await sequelize.transaction(async t => {
    const balance = await TokenBalance.findOne({
      where: {
        account_id: accountId,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    assert(!!balance, `account ${accountId} not found`);
    assert(balance.balance > 0, 'no enough balance');

    balance.balance -= COST;
    await balance.save({ transaction: t });

    await Transaction.create({
      account_id: accountId,
      type: 'charge',
      amount: COST
    }, {
      transaction: t,
    });
  });
}

async function deposit (accountId, amount) {
  await sequelize.transaction(async t => {
    let balance = await TokenBalance.findOne({
      where: {
        account_id: accountId,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!balance) {
      balance = await TokenBalance.create({
        account_id: accountId,
        balance: 0,
      }, {
        transaction: t,
      });
    }

    balance.balance = BigInt(balance.balance) + BigInt(amount);
    await balance.save({ transaction: t });

    await Transaction.create({
      account_id: accountId,
      type: 'deposit',
      amount,
    }, {
      transaction: t,
    });

    logger.info(`${accountId} deposited ${amount} RPC tokens`);
  });
}

module.exports = {
  charge,
  deposit,
}
