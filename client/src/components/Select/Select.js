import React from 'react';

import './styles.css';

export default function Select(props) {
  const { currentPeriodId, periods, onSelectChange } = props;

  const handleChange = (event) => {
    const value = +event.target.value;
    const period = periods[value - 1].period;

    onSelectChange(value, period);
  };

  const handlePreviousSelectChange = (event) => {
    event.target.value = currentPeriodId - 1;
    handleChange(event);
  };

  const handleNextSelectChange = (event) => {
    event.target.value = currentPeriodId + 1;
    handleChange(event);
  };

  return (
    <div id="divSelectPeriod">
      <button
        id="btnPrevious"
        className="waves-effect waves-light btn"
        onClick={handlePreviousSelectChange}
        disabled={currentPeriodId === 1}
      >
        &lt;
      </button>
      <select
        className="browser-default"
        value={currentPeriodId}
        onChange={handleChange}
      >
        {periods.map((item) => {
          const { id, period } = item;
          return (
            <option key={id} value={id}>
              {period}
            </option>
          );
        })}
      </select>
      <button
        id="btnNext"
        className="waves-effect waves-light btn"
        onClick={handleNextSelectChange}
        disabled={currentPeriodId > 35}
      >
        &gt;
      </button>
    </div>
  );
}
