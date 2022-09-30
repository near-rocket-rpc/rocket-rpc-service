module.exports = {
  port: 3033,
  rpc: {
    premium: 'https://public-rpc.blockpi.io/http/near-testnet',
    free: 'https://rpc.testnet.near.org'
  },
  postgres: {
    username: 'postgres',
    password: '',
    hostname: 'localhost',
    database: 'rocket_rpc',
    logging: false,
  },
}
