var fs = require("fs");
var async = require('async');
var content = fs.readFileSync("./config.json");
const QuizInformation = require('../models').QuizInformation;
var scheduler = require('../scheduler');
var config = JSON.parse(content);
var contract = JSON.parse(fs.readFileSync("./build/contracts/QuizShowToken.json"));
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider(config.eth.url));
var admin = config.admin;
var quizContract = new web3.eth.Contract(contract.abi, config.contract.quiz);

// 퀴즈게임 접수 : 일시 20190312120000, 상품 QC, 상금 1000000000, 상태 0)
//   state  상태 : 0 - 대기, 1 - 게임시작, 2-게임종료, 3- 정산종료
// ------------------------------------------------------------------------
var a = 0;
exports.reserveQuizShow = function (request, callback) {
    var obj = {
        from: admin,
        value: 0,
        gas: 5000000,
        gasPrice: '200'
    }
    quizContract.methods.reserveQuiz(request.datetime, request.prizeKind, parseInt(request.amount)).send(obj, (err, txid) => {
        if(!err) {
            if ( a == 0 ) {
                a++;
                // db.reserveQuizShow(request.datetime, request.prizeKind, request.amount);
                QuizInformation.create({
                    startDate: request.datetime,
                    rewardAmount: request.amount,
                    rewardToken: request.prizeKind
                })
                scheduler.addSchedule(request.datetime, request.prizeKind, request.amount);
                return callback(null);
            }
        }
    });
}

exports.getQuizShowList = async function(finalCallback) {
    let indexs = [];

    try {
        const showList = await QuizInformation.findAll({});
        for ( var i = 0; i < showList.length; i++ ) {
            indexs.push(i);
        }
        async.map(indexs,
            function (id, callback) {
                quizContract.methods.getQuizList(id).call({}, function (err, res) {
                    callback(null, {
                        datetime: res.datetime,
                        prizeKind: res.prize_kind,
                        amount: res.prize_amount
                    });
                });
            }, function (err, result) {
                return finalCallback(null, result);
            }
        )
    } catch (e) {
        console.log(e);
    }
}

exports.quizContract = quizContract;
