module.exports = {
  port: 3033,
  logger: {
    level: 'debug',
  },
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
  chargeInterval: 1 * 1000,
  near: {
    nodeUrl: 'https://public-rpc.blockpi.io/http/near-testnet',
    managerAccountId: 'manager.escrow.rocket0.testnet',
    escrowContractId: 'escrow.rocket0.testnet',
  }
}
