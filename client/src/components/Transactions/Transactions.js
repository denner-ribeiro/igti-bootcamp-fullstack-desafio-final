import React, { useState, useEffect } from 'react';
import Painel from '../Painel/Painel';
import Filter from '../Filter/Filter';
import Transaction from '../Transaction/Transaction';

let daysControl = 1;
let changedTheDay = false;

export default function Transactions(props) {
  const { transactions } = props;

  const [currentTransactions, setCurrentTransactions] = useState([]);
  const [launches, setLaunches] = useState(0);
  const [revenues, setRevenues] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    setCurrentTransactions([...transactions]);
  }, [transactions]);

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

  const handleFilter = (filter) => {
    if (!filter) {
      setCurrentTransactions(transactions);
      return;
    }

    const filterTransactions = transactions.filter(
      ({ description }) =>
        !!description.toLowerCase().includes(filter.toLowerCase())
    );
    setCurrentTransactions(filterTransactions);
  };

  return (
    <div>
      <Painel
        launches={launches}
        revenues={revenues}
        expenses={expenses}
        balance={balance}
      />
      <Filter handleFilter={handleFilter} />
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
          />
        );
      })}
    </div>
  );
}
