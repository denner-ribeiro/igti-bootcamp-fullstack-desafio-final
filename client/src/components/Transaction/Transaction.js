import React from 'react';

import './styles.css';
import { formatNumber } from '../../helper/formatMoney';
import { zeroToLeft } from '../../helper/formatDate';

export default function Transaction({
  transaction,
  changedTheDay,
  onDelete,
  handleOpenModal,
}) {
  const { _id, category, description, value, day, type } = transaction;

  const handleClickDelete = (event) => {
    onDelete(_id);
  };

  const handleClickOpenModal = (event) => {
    handleOpenModal(transaction, false);
  };

  return (
    <div
      id="divTransaction"
      className={changedTheDay ? 'row changedTheDay' : 'row'}
      style={
        type === '-'
          ? { backgroundColor: '#F0A1A8' }
          : { backgroundColor: '#A1F0DC' }
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
        <i className="material-icons" onClick={handleClickOpenModal}>
          create
        </i>
        <i className="material-icons" onClick={handleClickDelete}>
          delete
        </i>
      </div>
    </div>
  );
}
