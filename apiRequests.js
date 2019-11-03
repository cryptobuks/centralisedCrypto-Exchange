global.fetch = require('node-fetch');
const cc = require('cryptocompare');

//connecting to cryptocompare api;
cc.setApiKey('9b2eff8eb109c480b5994fe36a0a2ee2789254cb10820e2a188f2a20f41f1e32');
var api1 = cc;
module.exports.cryptoCompareApi = api1;
