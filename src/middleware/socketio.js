const { Server } = require('socket.io');
const logger = require('../utils/logger');

const sockets = {};

/**
 * 
 * @param {Server} io 
 */
function setupSocket (io) {
  io.on('connection', socket => {
    logger.debug('new socket connected');

    socket.on('ping', data => {
      const { accountId } = data;
      socket.accountId = accountId;
      sockets[accountId] = socket;

      logger.info(`socket ping: ${accountId}`);
    });

    socket.on('disconnect', () => {
      if (socket.accountId) {
        sockets[socket.accountId] = null;
        logger.info(`socket disconnect: ${socket.accountId}`);
      }
    });
  });
}

async function monitorMiddleware (ctx, next) {
  if (ctx.accountId && ctx.request.body) {
    const socket = sockets[ctx.accountId];
    if (socket) {
      socket.emit('call', ctx.request.body);
    }
  }

  await next();
}

module.exports = {
  setupSocket,
  monitorMiddleware,
}
