const MONTHS = [
  '',
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

// const forMonthYear = (date) => {
//   const arrayDate = date.split('-');
//   const year = arrayDate[0];
//   const month = Number(arrayDate[1]) - 1;

//   return `${MONTHS[month]}/${year}`;
// };

// export { forMonthYear };

function zeroToLeft(value) {
  if (value.toString().length === 2) {
    return value;
  }

  return '0' + value;
}

function forYearMonth(date) {
  date = date.split('/');

  const index = MONTHS.findIndex((month) => month === date[0]);

  const yearMonth = `${date[1]}-${zeroToLeft(index)}`;

  return yearMonth;
}

export { zeroToLeft, forYearMonth };
