const express = require('express');

const {
  findAllForPeriod,
  create,
  update,
  remove,
} = require('../services/transactionService');

const transactionRouter = express.Router();

// findAllForPeriod
transactionRouter.get('/', findAllForPeriod);

// create
transactionRouter.post('/', create);

// update
transactionRouter.put('/:id', update);

// remove
transactionRouter.delete('/:id', remove);

module.exports = transactionRouter;
