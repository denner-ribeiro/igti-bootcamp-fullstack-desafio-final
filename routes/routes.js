const express = require('express');
const transactionRouter = express.Router();

// verficar a necessidade de mudar a persistencia para o arquivo transactionService
const TransactionModel = require('../models/TransactionModel');

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

// create
transactionRouter.post('/', async (req, res) => {
  try {
    const {
      description,
      value,
      category,
      year,
      month,
      day,
      yearMonth,
      yearMonthDay,
      type,
    } = req.body;

    const transaction = new TransactionModel({
      description,
      value,
      category,
      year,
      month,
      day,
      yearMonth,
      yearMonthDay,
      type,
    });

    const data = await transaction.save();

    res.json(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// update
transactionRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const {
      description,
      value,
      category,
      year,
      month,
      day,
      yearMonth,
      yearMonthDay,
      type,
    } = req.body;

    const transaction = {
      description,
      value,
      category,
      year,
      month,
      day,
      yearMonth,
      yearMonthDay,
      type,
    };

    const data = await TransactionModel.findByIdAndUpdate(
      { _id: id },
      transaction,
      {
        new: true,
      }
    );

    if (!data) {
      res.status(404).send('Nenhuma transaction encontrada com o id informado');
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// delete
transactionRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const data = await TransactionModel.deleteOne({ _id: id });

    if (!data.deletedCount) {
      res.status(400).send({
        error: 'Nenhuma transaction encontrada para exclusão!',
      });
      return;
    }

    res.json({
      message: 'Transaction excluida com sucesso.',
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// os calculos aparentemente devem ser feitos no front

// quantidade de lançamentos

// total receitas

// total despesas

// saldo atual

module.exports = transactionRouter;
