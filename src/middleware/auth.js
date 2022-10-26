const { getNEAR } = require("../utils/near");
const { parse, verify } = require("../utils/token");
const logger = require('../utils/logger');
const assert = require('assert');
const { charge } = require("../service/balance_service");

// token cache
const tokens = {};

/**
 * 
 * @param {import("koa").Context} ctx 
 * @param {*} next 
 */
async function authMiddleware (ctx, next) {
  let plan = 'free';
  const authHeader = ctx.header.authorization;
  let authToken = null;
  if (authHeader && authHeader.startsWith('bearer')) {
    authToken = authHeader.split(" ")[1];
  }

  if (authToken) {
    logger.debug('authorizing jwt token');
    const tokenBody = parse(authToken);
    const { sub, pubkey } = tokenBody.body;

    // make sure pubkey is owned by sub account
    if (!tokens[pubkey]) {
      const near = await getNEAR();
      const account = await near.account(sub);
      const keys = await account.getAccessKeys();
      if (!keys.find(key => key.public_key === pubkey)) {
        throw new Error('key not found');
      }
      tokens[pubkey] = sub;
    }

    assert(tokens[pubkey] === sub, 'you are not the owner of this pubkey');
    await verify(authToken, pubkey);
    logger.debug(`${sub} authorized`);
    ctx.accountId = sub;

    // try to charge for usage
    try {
      await charge(sub);

      plan = 'premium';
    } catch (err) {
      logger.warn('charging %s failed', sub);
      // logger.debug(err);
    }
  }

  ctx.plan = plan;

  await next();
}

module.exports = authMiddleware;
