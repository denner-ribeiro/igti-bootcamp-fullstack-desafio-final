import React from 'react';

import './styles.css';
import { formatNumber } from '../../helper/formatMoney';

export default function Painel(props) {
  const { launches, revenues, expenses, balance } = props;
  return (
    <div id="divPainel">
      <div>
        Lançamentos:
        <span> {launches}</span>
      </div>
      <div>
        Receitas:
        <span className="colorGod"> {formatNumber(revenues)}</span>
      </div>
      <div>
        Despesas:
        <span className="colorBad"> -{formatNumber(expenses)}</span>
      </div>
      <div>
        Saldo:
        <span className={balance > 0 ? 'colorGod' : 'colorBad'}>
          {' '}
          {formatNumber(balance)}
        </span>
      </div>
    </div>
  );
}
