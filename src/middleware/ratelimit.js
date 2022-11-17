const { RateLimiter } = require('limiter');

const freeLimiter = new RateLimiter({
  tokensPerInterval: 2,
  interval: 'sec'
});
const premiumLimiter = new RateLimiter({
  tokensPerInterval: 10,
  interval: 'sec'
});

async function ratelimitMiddleware(ctx, next) {
  let limiter = freeLimiter;
  if (ctx.plan === 'premium') {
    limiter = premiumLimiter;
  }

  await limiter.removeTokens(1);

  await next();
}

module.exports = ratelimitMiddleware;
