var constant = require('../dapp/constant.js');
var eth = require('../dapp/eth.js');

var express = require('express');
var router = express.Router();

//----------------------------
//  펀딩 참여하기 입력화면
//----------------------------
router.get('/new', function(req, res, next) {

    var fund_balance = eth.getBalance(constant.crowdFundContractAddress);
    var fund_tamount = eth.getTokenAmount(constant.crowdFundContractAddress);  // token balanceof

    res.render('new', {fund : constant.crowdFundContractAddress, fund_balance : fund_balance, fund_tamount:fund_tamount});
});

//----------------------------
//  메인화면, 사용자 상세화면
//----------------------------
router.get(['/', '/:user'], function(req, res, next) {
    var user = req.params.user;

    var fund_balance = eth.getBalance(constant.crowdFundContractAddress);
    var fund_tamount = eth.getTokenAmount(constant.crowdFundContractAddress);  // token balanceof

    if(user) {
      // if user exists,
      var user_balance = eth.getBalance(user);
      var user_famount = eth.getFundAmount(user);  // fund balanceof
      var user_tamount = eth.getTokenAmount(user);  // token balanceof

      res.render('view', {display:'',
                          fund : constant.crowdFundContractAddress,fund_balance:fund_balance, fund_tamount:fund_tamount,
                          user:user, user_balance : user_balance, user_famount:user_famount, user_tamount:user_tamount});
    } else { 
      // if user doesn't exist,
      res.render('view', {display:'display:none',
                          fund : constant.crowdFundContractAddress,fund_balance:fund_balance, fund_tamount:fund_tamount});
    }
});


//----------------------------
//  펀딩 참여하기 액션
//----------------------------
router.post('/join', function(req, res, next) {
    var from = req.body.user;
    var famount = req.body.famount;
    var passphase = req.body.passphase;

    eth.unlockAccount(from, passphase, checkUnlock);

    function checkUnlock(err, result) {
        if (err) {
            console.log(err);
            return callback(err);
        } else {
            eth.sendTransaction(from, constant.crowdFundContractAddress, famount, 100000, checkTransaction);
        }
    }

    function checkTransaction( err, result) {
        if(err) {
            console.log(err);
            return callback(err);
        } else {
            eth.fundTransferEvent(checkEvent);
        }
    }

    function checkEvent(err, result) {
        if(err) {
            console.log(err);
            return res.send(400);
        } else {
            try {
                res.redirect('/users/' + from);
            } catch(e) {
            }
        }
    }
});

module.exports = router;