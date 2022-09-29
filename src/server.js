const Koa = require('koa');
const cors = require('@koa/cors');
const auth = require('./middleware/auth');
const dispatcher = require('./middleware/dispatcher');

const app = new Koa();

app.use(cors());
app.use(auth);
app.use(dispatcher);

module.exports = app;
