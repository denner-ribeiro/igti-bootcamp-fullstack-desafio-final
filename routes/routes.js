const express = require('express');
const transactionRouter = express.Router();

// verficar a necessidade de mudar a persistencia para o arquivo transactionService
const TransactionModel = require('../models/TransactionModel');

// transactionRouter.get('/periods', async (req, res) => {
//   try {
//     let periods = await TransactionModel.distinct('yearMonth');

//     periods = periods.map((period, index) => {
//       return {
//         id: index,
//         period,
//       };
//     });

//     res.json(periods);
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// });

// findAllForPeriod
transactionRouter.get('/', async (req, res) => {
  try {
    const { period } = req.query;

    // Validações
    const arrayPeriod = period.split('-');
    const isYearValid = !!Number(arrayPeriod[0]) && arrayPeriod[0].length === 4;
    const isMonthValid =
      !!Number(arrayPeriod[1]) && arrayPeriod[1].length === 2;

    if (!period || arrayPeriod.length !== 2 || !isYearValid || !isMonthValid) {
      res.status(400).send({
        error:
          'É necessário informar o parâmetro "period", cujo valor deve estar no formato yyyy-mm',
      });
      return;
    }

    const transactions = await TransactionModel.find({
      yearMonth: period,
    }).sort({ yearMonthDay: 1, type: -1, category: 1 });

    if (!transactions.length) {
      res.status(400).send({
        error:
          'Nenhuma transaction encontrada para o periodo informado: ' + period,
      });
      return;
    }

    res.json({
      length: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// filtro pela descrição
transactionRouter.get('/', async (req, res) => {});

// create
transactionRouter.post('/', async (req, res) => {});

// update
transactionRouter.put('/', async (req, res) => {});

// delete
transactionRouter.delete('/', async (req, res) => {});

// os calculos aparentemente devem ser feitos no front

// quantidade de lançamentos

// total receitas

// total despesas

// saldo atual

module.exports = transactionRouter;
