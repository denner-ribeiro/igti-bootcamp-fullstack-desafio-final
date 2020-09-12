import React, { useState, useEffect } from 'react';

import Select from './components/Select/Select';
import * as api from './api/apiService';
import Transactions from './components/Transactions/Transactions';

const PERIODS = api.getAllPeriods();
const CURRENT_PERIOD_ID = api.getCurrentPeriodId(PERIODS);

export default function App() {
  const [currentPeriodId, setCurrentPeriodId] = useState(CURRENT_PERIOD_ID);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Ao carregar a página seleciona as transactions pelo mes/ano corrent
    const currentPeriod = api.getCurrentPeriod();
    getAllTransactions(currentPeriod);
  }, []);

  const getAllTransactions = async (currentPeriod) => {
    const res = await api.findAllForPeriod(currentPeriod);
    setTransactions(res.transactions);
  };

  const handleCurrentPeriodIdChange = (currentId, period) => {
    setCurrentPeriodId(currentId);
    // Caso altere o mes/ano ele busca as transactions novamente
    const currentPeriod = api.getCurrentPeriod(period);
    getAllTransactions(currentPeriod);
  };

  return (
    <div className="container">
      <h1>Bootcamp Full Stack - Desafio Final</h1>
      <h2>Controle Financeiro Pessoal</h2>
      <Select
        periods={PERIODS}
        currentPeriodId={currentPeriodId}
        onSelectChange={handleCurrentPeriodIdChange}
      />
      <Transactions transactions={transactions} />
    </div>
  );
}
