import React, { useState, useEffect } from 'react';

import Painel from '../Painel/Painel';
import Filter from '../Filter/Filter';
import Transaction from '../Transaction/Transaction';

import * as api from '../../api/apiService';

// para controlar o espaçamento entre os dias
let daysControl = 1;
let changedTheDay = false;

export default function Transactions(props) {
  const { period } = props;

  const [transactions, setTransactions] = useState([]);
  const [currentTransactions, setCurrentTransactions] = useState([]);
  const [launches, setLaunches] = useState(0);
  const [revenues, setRevenues] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [balance, setBalance] = useState(0);
  const [currentFilter, setCurrentFilter] = useState('');

  // Quando atualiza o periodo
  useEffect(() => {
    const getAllTransactions = async (currentPeriod) => {
      // busca os dados no banco pela api
      const res = await api.findAllForPeriod(currentPeriod);
      setTransactions(res.transactions);
      setCurrentTransactions(res.transactions);
      setCurrentFilter('');
    };
    // Caso altere o mes/ano ele busca as transactions novamente
    const currentPeriod = api.getCurrentPeriod(period);
    getAllTransactions(currentPeriod);
  }, [period]);

  // Quando atualiza as transactions ou o currentFilter
  useEffect(() => {
    if (!currentFilter) {
      setCurrentTransactions([...transactions]);
    } else {
      const filterTransactions = transactions.filter(
        ({ description }) =>
          !!description.toLowerCase().includes(currentFilter.toLowerCase())
      );
      setCurrentTransactions(filterTransactions);
    }
  }, [currentFilter, transactions]);

  // Quando atualiza o currentTransaciton
  useEffect(() => {
    const calculateRevenuesExpenses = (type) => {
      return currentTransactions.reduce(
        (acc, curr) => acc + (curr.type === type ? curr.value : 0),
        0
      );
    };

    setLaunches(currentTransactions.length);

    const totalRevenues = calculateRevenuesExpenses('+');
    const totalExpenses = calculateRevenuesExpenses('-');
    setRevenues(totalRevenues);
    setExpenses(totalExpenses);

    setBalance(totalRevenues - totalExpenses);
  }, [currentTransactions]);

  // Quando altera o conteúdo do input
  const handleChangeInputFilter = (filter) => {
    setCurrentFilter(filter);
  };

  // Deleta a transaction pelo id
  const handleDelete = async (id) => {
    const data = await api.deleteTransacitonForId(id);
    if (!data.delete) {
      alert('Erro ao excluir item');
      return;
    }

    const newTransacitons = transactions.filter(
      (transaction) => transaction._id !== id
    );
    setTransactions(newTransacitons);
  };

  return (
    <div>
      <Painel
        launches={launches}
        revenues={revenues}
        expenses={expenses}
        balance={balance}
      />
      <Filter
        handleFilter={handleChangeInputFilter}
        currentFilter={currentFilter || ''}
      />
      {currentTransactions.map((transaction, index) => {
        // configuração para dar espaço entre os dias do mês
        changedTheDay = false;
        if (transaction.day !== daysControl) {
          daysControl = transaction.day;
          changedTheDay = true;
        }

        return (
          <Transaction
            key={index}
            transaction={transaction}
            changedTheDay={changedTheDay}
            onDelete={handleDelete}
          />
        );
      })}
    </div>
  );
}
