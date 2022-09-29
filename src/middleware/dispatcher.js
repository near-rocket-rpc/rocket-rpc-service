const proxy = require('koa-better-http-proxy');
const config = require('config');
const { URL }= require('url');
const path = require('path');

function buildRPC (rpcUrl) {
  const url = new URL(rpcUrl);
  const host = url.host;
  const pathname = url.pathname;

  return proxy(host, {
    https: true,
    proxyReqPathResolver: ctx => {
      const requestPath = ctx.url;
      return path.join(pathname, requestPath);
    }
  })
}

const freeRPC = buildRPC(config.rpc.free);
const premiumRPC = buildRPC(config.rpc.premium);

async function dispatchMiddleware (ctx, next) {
  if (ctx.plan === 'premium') {
    console.log('using premium rpc');
    return await premiumRPC(ctx, next);
  } else {
    console.log('using free rpc');
    return await freeRPC(ctx, next);
  }
}

module.exports = dispatchMiddleware;
