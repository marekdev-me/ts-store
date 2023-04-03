export default function ObjectId() {
  const isBrowser = typeof window !== 'undefined';
  // @ts-ignore
  const secondInHex = Math.floor(new Date() / 1000).toString(16);
  let machineId;
  if (isBrowser) {
    machineId = Math.random().toString(16).slice(2, 8);
  } else {
    // eslint-disable-next-line global-require
    const os = require('os');
    // eslint-disable-next-line global-require
    const crypto = require('crypto');
    machineId = crypto.createHash('md5').update(os.hostname()).digest('hex').slice(0, 6);
  }
  const processId = Math.floor(Math.random() * 100000).toString(16).slice(0, 4).padStart(4, '0');
  let counter;
  if (typeof process !== 'undefined') {
    counter = process.hrtime()[1].toString(16).slice(0, 6).padStart(6, '0');
  } else {
    counter = Math.floor(Math.random() * 16777216).toString(16).padStart(6, '0');
  }

  return secondInHex + machineId + processId + counter;
}
