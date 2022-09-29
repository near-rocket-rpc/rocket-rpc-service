const assert = require('assert');
const nearAPI = require('near-api-js');

function base64Decode (str) {
  const buf = Buffer.from(str, 'base64');
  return buf.toString('utf-8');
}

/**
 * 
 * @param {string} tokenString 
 */
function parse (tokenString) {
  const segments = tokenString.split('.');
  assert(segments.length === 3, 'bad token');

  const header = JSON.parse(base64Decode(segments[0]));
  const body = JSON.parse(base64Decode(segments[1]));

  assert(header.typ === 'JWT', 'non jwt token');
  assert(header.alg === 'ED25519', 'wrong alg');

  return {
    header,
    body,
  }
}

async function verify (tokenString, pubkey) {
  const segments = tokenString.split('.');
  const sig = segments[2];
  const pubKey = nearAPI.utils.PublicKey.fromString(pubkey);

  if (!pubKey.verify(
    Buffer.from(`${segments[0]}.${segments[1]}`), 
    Buffer.from(sig, 'base64')
  )) {
    throw new Error('signature mismatch');
  }
}

module.exports = {
  parse,
  verify,
}
