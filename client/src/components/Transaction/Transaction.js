import React from 'react';

import './styles.css';
import { formatNumber } from '../../helper/formatMoney';
import { zeroToLeft } from '../../helper/formatDate';

export default function Transaction({ transaction, changedTheDay }) {
  const {
    _id,
    category,
    description,
    value,
    day,
    month,
    year,
    type,
  } = transaction;

  return (
    <div
      id="divTransaction"
      className={changedTheDay ? 'row changedTheDay' : 'row'}
      style={
        type === '-'
          ? { backgroundColor: '#f0a1a8' }
          : { backgroundColor: '#a1f0dc' }
      }
    >
      <div className="col s1">
        <span>{zeroToLeft(day)}</span>
      </div>
      <div id="divInfo" className="col s8">
        <span>{category}</span>
        <span>{description}</span>
      </div>
      <div id="spanValue" className="col s2">
        <span className="">{formatNumber(value)}</span>
      </div>
      <div id="divButtons" className="col s2">
        <i className="material-icons">create</i>
        <i className="material-icons">delete</i>
      </div>
    </div>
  );
}
