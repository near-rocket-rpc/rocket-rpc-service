const config = require('config');
const app = require('./src/server');

app.listen(config.port, () => {
  console.log(`Rocket RPC server listening at ${config.port} ...`);
});
