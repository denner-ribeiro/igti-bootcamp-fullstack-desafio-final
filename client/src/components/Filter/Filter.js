import React from 'react';

import './styles.css';

export default function Filter(props) {
  const { handleFilter } = props;
  // handleFilter
  const handleInputFilter = (event) => {
    const filter = event.target.value;
    handleFilter(filter);
  };
  return (
    <div id="divFilter">
      <button className="waves-effect waves-light btn">
        + NOVO LANÇAMENTO
      </button>
      <input type="text" placeholder="Filtro" onInput={handleInputFilter} />
    </div>
  );
}
