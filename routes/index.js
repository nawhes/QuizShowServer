const express = require('express');
const User = require('../models').User;
const QuizInformation = require('../models').QuizInformation;
const QuizList = require('../models').QuizList;
const QuizAnswerList = require('../models').QuizAnswerList;

const router = express.Router();

/* GET home page. */
router.post('/user', async function(req, res, next) {
  try {
    const result = await User.create({
      email: req.body.email,
      pubKey: req.body.pubKey,
      uid: req.body.uid,
      deviceToken: req.body.deviceToken,
    });
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.get('/user/pubKey/:pubKey', async function(req, res, next) {
  try {
    const result = await User.findOne({
      where: { pubKey: req.params.pubKey }
    });
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
})

router.get('/quiz/:round', async function (req, res, next) {
  try {
    const quizInfo = await QuizInformation.findOne({
      where: { id: req.params.round }
    });
    const quizList = await QuizList.findAll({
      where: { round: req.params.round }
    });
    console.log(quizInfo);
    console.log(quizList);
    res.status(201).json(quizInfo);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
