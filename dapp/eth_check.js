var constant = require('./constant.js');
var eth = require('./eth.js');
var fs = require('fs');

var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

const mainAddress = constant.mainAddress;
const makerAddress = constant.makerAddress;
const eoaAddress = constant.eoaAddress;
const TokenContractAddress = constant.TokenContractAddress;
const crowdFundContractAddress = constant.crowdFundContractAddress;

// Logging
function logArrayElements(name, index, array) {
  var balance = web3.fromWei(web3.eth.getBalance(name));
  var token_amount =  eth.getTokenAmount(name) 
  console.log('[' + index + '] = '+name +', '+balance+' ETH, ' +token_amount+' TDs' );
}

exports.getAll = function (mode) {
    var arr=[];
    if(mode==2) {  // 전체노드 조회
        fs.readFileSync(__dirname+'/../data/users.txt').toString().split('\n').forEach(
           function (user) {
               if (user !='') {
                   arr.push(user);
               }
           }
        );
        arr.forEach(logArrayElements);
   } else if(mode==1) {   // 특정노드 조회
        arr = [ mainAddress, makerAddress, eoaAddress, TokenContractAddress, crowdFundContractAddress];
        arr.forEach(logArrayElements);
   }
};
