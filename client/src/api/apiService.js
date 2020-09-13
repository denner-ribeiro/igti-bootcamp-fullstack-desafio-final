import axios from 'axios';

import * as formatDate from '../helper/formatDate';

// Definindo a baseURL de comunicação com a api
const api = axios.create({ baseURL: 'api' });
const RESOURCE = '/transaction';

// define ano/mes corrente
const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth() + 1;
const GLOBAL_YEARS = [CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1];
const GLOBAL_MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const MONTH_DESCRIPTIONS = [
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

// cria todos os periodos com base no ano atual, anterior e proximo
function getAllPeriods() {
  const periods = [];
  let index = 1;
  GLOBAL_YEARS.forEach((year) => {
    GLOBAL_MONTHS.forEach((month) => {
      periods.push({
        id: index++,
        period: `${MONTH_DESCRIPTIONS[month]}/${year}`,
      });
    });
  });

  return periods;
}

// Retorna o perido atual ou o informado no formato: yyyy-mm
function getCurrentPeriod(currentPeriod) {
  if (!currentPeriod) {
    return `${CURRENT_YEAR}-${formatDate.zeroToLeft(CURRENT_MONTH)}`;
  }

  return formatDate.forYearMonth(currentPeriod);
}

function getCurrentPeriodId(periods) {
  const index = periods.findIndex(
    (item) =>
      item.period ===
      `${MONTH_DESCRIPTIONS[Number(CURRENT_MONTH)]}/${CURRENT_YEAR}`
  );

  return index + 1;
}

async function findAllForPeriod(period) {
  const res = await axios.get(
    api.defaults.baseURL + RESOURCE + '?period=' + period
  );

  return res.data;
}

async function deleteTransacitonForId(id) {
  try {
    const res = await axios.delete(api.defaults.baseURL + RESOURCE + `/${id}`);

    return {
      delete: true,
      res,
    };
  } catch (error) {
    return {
      delete: false,
      error,
    };
  }
}

async function saveTransaction(transaction) {
  try {
    const res = await axios.post(api.defaults.baseURL + RESOURCE, transaction);

    delete res.data.__v;

    return res.data;
  } catch (error) {
    return { error: 'Erro ao salvar novo lançamento!' };
  }
}

async function editTransaction(transaction, id) {
  try {
    const res = await axios.put(
      api.defaults.baseURL + RESOURCE + `/${id}`,
      transaction
    );

    delete res.data.__v;

    return res.data;
  } catch (error) {
    return { error: 'Erro ao editar lançamento!' };
  }
}

export {
  findAllForPeriod,
  getAllPeriods,
  getCurrentPeriod,
  getCurrentPeriodId,
  deleteTransacitonForId,
  saveTransaction,
  editTransaction,
};
