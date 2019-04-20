const express = require('express');
const User = require('../models').User;

const router = express.Router();

router.post('/', async function(req, res, next) {
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

router.get('/', async function(req, res, next) {
  try {
    const result = await User.findAll();
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
})

router.get('/email/:email', async function(req, res, next) {
  try {
    const result = await User.findOne({
      where: { email: req.params.email }
    });
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    console.log(error);
    next(error);
  }
})

module.exports = router;
