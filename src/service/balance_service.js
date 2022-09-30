const { sequelize } = require('../db/sequelize');
const TokenBalance = require('../db/token_balance');
const Transaction = require('../db/transaction');
const Sequelize = require('sequelize');
const assert = require('assert');

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

    balance.balance -= 1;
    await balance.save({ transaction: t });

    await Transaction.create({
      account_id: accountId,
      type: 'charge',
      amount: 1
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
      lock: Sequelize.LOCK.UPDATE,
    });

    if (!balance) {
      balance = await TokenBalance.create({
        account_id: accountId,
        balance: 0,
      }, {
        transaction: t,
      });
    }

    balance.balance += amount;
    await balance.save({ transaction: t });

    await Transaction.create({
      account_id: accountId,
      type: 'deposit',
      amount,
    }, {
      transaction: t,
    });
  });
}

module.exports = {
  charge,
  deposit,
}
