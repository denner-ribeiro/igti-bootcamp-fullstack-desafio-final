import React, { useState } from 'react';

import Select from './components/Select/Select';
import Transactions from './components/Transactions/Transactions';
import * as api from './api/apiService';

// Gero os periodos para o select e pego o periodo atual
const PERIODS = api.getAllPeriods();
const CURRENT_PERIOD_ID = api.getCurrentPeriodId(PERIODS);

export default function App() {
  const [currentPeriodId, setCurrentPeriodId] = useState(CURRENT_PERIOD_ID);
  const [period, setPeriod] = useState('');

  // Quando é selecionado um periodo no select seta as variáveis de estado
  // para repassar para o component Transacitons o periodo atual
  const handleCurrentPeriodIdChange = (currentId, period) => {
    setCurrentPeriodId(currentId);
    setPeriod(period);
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
      <Transactions period={period} />
    </div>
  );
}
