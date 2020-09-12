import React from 'react';

import './styles.css';

export default function Filter(props) {
  const { handleFilter, currentFilter } = props;
  // handleFilter
  const handleInputFilter = (event) => {
    const filter = event.target.value;
    handleFilter(filter);
  };
  return (
    <div id="divFilter">
      <button
        className="waves-effect waves-light btn"
        disabled={!!currentFilter}
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
