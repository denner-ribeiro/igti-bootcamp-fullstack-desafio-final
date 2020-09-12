const mongoose = require('mongoose');

let schema = mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
    validate(value) {
      if (value < 0) throw new Error('Valor negativo');
    },
  },
  category: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  day: {
    type: Number,
    required: true,
  },
  yearMonth: {
    type: String,
    required: true,
  },
  yearMonthDay: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
});

// feito pelo professor
// let schema = mongoose.Schema({
//   description: String,
//   value: Number,
//   category: String,
//   year: Number,
//   month: Number,
//   day: Number,
//   yearMonth: String,
//   yearMonthDay: String,
//   type: String,
// });

const TransactionModel = mongoose.model('transaction', schema);

module.exports = TransactionModel;
