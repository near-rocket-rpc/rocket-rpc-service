const nearAPI = require('near-api-js');

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
      nodeUrl: "https://public-rpc.blockpi.io/http/near-testnet",
      walletUrl: "https://wallet.testnet.near.org",
      helperUrl: "https://helper.testnet.near.org",
      explorerUrl: "https://explorer.testnet.near.org",
    };
    const nearConnection = await nearAPI.connect(connectionConfig);

    near = nearConnection;
  }

  return near;
}

module.exports = {
  getNEAR
}
