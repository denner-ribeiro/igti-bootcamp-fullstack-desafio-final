import React from 'react';

import './styles.css';

export default function Filter(props) {
  const { handleFilter, currentFilter, handleOpenModal } = props;
  // handleFilter
  const handleInputFilter = (event) => {
    const filter = event.target.value;
    handleFilter(filter);
  };

  const handleClickOpenModal = () => {
    handleOpenModal({}, true);
  };
  return (
    <div id="divFilter">
      <button
        className="waves-effect waves-light btn"
        disabled={!!currentFilter}
        onClick={handleClickOpenModal}
      >
        + NOVO LANÇAMENTO
      </button>
      <input
        type="text"
        placeholder="Filtro"
        value={currentFilter}
        onChange={handleInputFilter}
      />
    </div>
  );
}
