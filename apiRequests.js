global.fetch = require('node-fetch');
const cc = require('cryptocompare');

//connecting to cryptocompare api;
cc.setApiKey('');
var api1 = cc;
module.exports.cryptoCompareApi = api1;
