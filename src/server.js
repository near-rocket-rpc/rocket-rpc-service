const Koa = require('koa');
const cors = require('@koa/cors');
const body = require('koa-body');
const auth = require('./middleware/auth');
const dispatcher = require('./middleware/dispatcher');
const ratelimit = require('./middleware/ratelimit');
const { monitorMiddleware } = require('./middleware/socketio');

const app = new Koa();

app.use(cors());
app.use(body());
app.use(auth);
app.use(ratelimit);
app.use(monitorMiddleware);
app.use(dispatcher);

module.exports = app;
