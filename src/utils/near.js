const nearAPI = require('near-api-js');
const config = require('config');
const logger = require('./logger');

let near;

/**
 * 
 * @returns {Promise<nearAPI.Near>}
 */
async function getNEAR() {
  if (!near) {
    const { keyStores } = nearAPI;
    const homedir = require("os").homedir();
    const CREDENTIALS_DIR = ".near-credentials";
    const credentialsPath = require("path").join(homedir, CREDENTIALS_DIR);
    const myKeyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

    const connectionConfig = {
      networkId: "testnet",
      keyStore: myKeyStore, // first create a key store 
      nodeUrl: config.get('near.nodeUrl'),
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };
    const nearConnection = await nearAPI.connect(connectionConfig);

    near = nearConnection;
  }

  return near;
}

async function batchCharge (chargesMap) {
  const near = await getNEAR();
  const manager = await near.account(config.get('near.managerAccountId'));
  const charges = Object
    .keys(chargesMap)
    .map(accountId => [
      accountId,
      chargesMap[accountId].toString()
    ]);

  logger.info('charging accounts:');
  logger.info('%j', charges);

  await manager.functionCall({
    contractId: config.get('near.escrowContractId'),
    methodName: 'batch_charge',
    args: {
      charges
    },
  });
} 

module.exports = {
  getNEAR,
  batchCharge,
}
