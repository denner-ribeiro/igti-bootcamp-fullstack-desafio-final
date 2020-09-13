const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Aqui havia um erro difícil de pegar. Importei como "transactionModel",
// com "t" minúsculo. No Windows, isso não faz diferença. Mas como no Heroku
// o servidor é Linux, isso faz diferença. Gastei umas boas horas tentando
// descobrir esse erro :-/
const TransactionModel = require('../models/TransactionModel');

// Retorna todas as transactions pelo periodo informado
const findAllForPeriod = async (req, res) => {
  try {
    const { period = '' } = req.query;

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
};

// Cria uma nova transaciton
const create = async (req, res) => {
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
};

// Altera uma transaction pelo id
const update = async (req, res) => {
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

    // Monta o objeto a ser atualizado
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
      { _id: ObjectId(id) },
      transaction,
      {
        new: true,
      }
    );

    if (!data) {
      res
        .status(404)
        .send('Nenhuma transaction encontrada com o id informado!');
      return;
    }

    res.json(data);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// Remove uma transaction pelo id
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await TransactionModel.deleteOne({ _id: ObjectId(id) });

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
};

module.exports = { findAllForPeriod, create, update, remove };
