import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

import Painel from '../Painel/Painel';
import Filter from '../Filter/Filter';
import Transaction from '../Transaction/Transaction';

import * as api from '../../api/apiService';

import './styles.css';

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement(document.getElementById('root'));

/**
 * Para controlar o espaçamento entre os dias
 */
let daysControl = 1;
let changedTheDay = false;

export default function Transactions(props) {
  const { period } = props;

  const [transactions, setTransactions] = useState([]);
  const [currentTransactions, setCurrentTransactions] = useState([]);
  const [launches, setLaunches] = useState(0);
  const [revenues, setRevenues] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [balance, setBalance] = useState(0);
  const [currentFilter, setCurrentFilter] = useState('');

  // Para edit e save com modal
  const [currentTransaction, setCurrentTransaction] = useState({});
  const [isNew, setIsNew] = useState(true);
  const [radioSelected, setRadioSelected] = useState(true);
  const [description, setDescription] = useState('');
  const [category, setSetCategory] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState('');

  // Estado da modal
  const [modalIsOpen, setIsOpen] = React.useState(false);

  // Quando atualiza o periodo
  useEffect(() => {
    const getAllTransactions = async (currentPeriod) => {
      // busca os dados no banco pela api
      const res = await api.findAllForPeriod(currentPeriod);
      setTransactions(res.transactions);
      setCurrentTransactions(res.transactions);
      setCurrentFilter('');
    };
    // Caso altere o mes/ano ele busca as transactions novamente
    const currentPeriod = api.getCurrentPeriod(period);
    getAllTransactions(currentPeriod);
  }, [period]);

  // Quando atualiza as transactions ou o currentFilter
  useEffect(() => {
    if (!currentFilter) {
      setCurrentTransactions([...transactions]);
    } else {
      const filterTransactions = transactions.filter(
        ({ description }) =>
          !!description.toLowerCase().includes(currentFilter.toLowerCase())
      );
      setCurrentTransactions(filterTransactions);
    }
  }, [currentFilter, transactions]);

  // Quando atualiza o currentTransaciton
  useEffect(() => {
    const calculateRevenuesExpenses = (type) => {
      return currentTransactions.reduce(
        (acc, curr) => acc + (curr.type === type ? curr.value : 0),
        0
      );
    };

    setLaunches(currentTransactions.length);

    const totalRevenues = calculateRevenuesExpenses('+');
    const totalExpenses = calculateRevenuesExpenses('-');
    setRevenues(totalRevenues);
    setExpenses(totalExpenses);

    setBalance(totalRevenues - totalExpenses);
  }, [currentTransactions]);

  // Quando altera o conteúdo do input
  const handleChangeInputFilter = (filter) => {
    setCurrentFilter(filter);
  };

  /**
   * Funções de interação coma api
   */

  // Deleta a transaction pelo id
  const handleDelete = async (id) => {
    const data = await api.deleteTransacitonForId(id);
    if (!data.delete) {
      alert('Erro ao excluir item');
      return;
    }

    const newTransacitons = transactions.filter(
      (transaction) => transaction._id !== id
    );
    setTransactions(newTransacitons);
  };

  // Função para editar ou salvar um documento
  const handleButtonSaveOrEdit = async () => {
    function orderByTransactions(arrayTransactions) {
      // Ordenação pelos atributos abaixo
      // { yearMonthDay: 1, type: -1, category: 1 }
      arrayTransactions.sort((a, b) => {
        if (Date.parse(a.yearMonthDay) < Date.parse(b.yearMonthDay)) {
          return -1;
        } else if (Date.parse(a.yearMonthDay) === Date.parse(b.yearMonthDay)) {
          if (a.type === '-' && b.type === '-') {
            return a.category.localeCompare(b.category);
          } else if (a.type === '-' && b.type === '+') {
            return -1;
          } else {
            return 1;
          }
        } else {
          return 1;
        }
      });

      return arrayTransactions;
    }

    async function saveNewTransaction(obj) {
      // Salva o novo objeto no banco
      const res = await api.saveTransaction(obj);

      if (!res.error) {
        let arrayTransactions = [...transactions];
        arrayTransactions.push(res);

        arrayTransactions = orderByTransactions(arrayTransactions);

        setTransactions(arrayTransactions);
      } else {
        console.log(res.error);
      }
    }

    async function editCurrentTransaction(obj) {
      const res = await api.editTransaction(obj, currentTransaction._id);

      if (!res.error) {
        const index = transactions.findIndex(
          (transaction) => transaction._id === currentTransaction._id
        );

        let arrayTransactions = [...transactions];

        // se trocar o mes ou ano ele tira o item do vetor
        // caso contrário ele atualiza o item no vetor
        if (arrayTransactions[index].yearMonth !== res.yearMonth) {
          arrayTransactions.splice(index, 1);
        } else {
          arrayTransactions[index] = res;
        }

        arrayTransactions = orderByTransactions(arrayTransactions);
        setTransactions(arrayTransactions);
      } else {
        console.log(res.error);
      }
    }

    if (!radioSelected || !description || !category || !value || !date) {
      return;
    }

    // Monta o objeto que será criado ou alterado
    const [year, month, day] = date.split('-');
    const obj = {
      description,
      value,
      category,
      year: Number(year),
      month: Number(month),
      day: Number(day),
      yearMonth: `${year}-${month}`,
      yearMonthDay: date,
      type: radioSelected,
    };

    if (isNew) {
      // Salva o novo objeto no banco
      saveNewTransaction(obj);
    } else {
      // Edita o objeto no banco
      editCurrentTransaction(obj);
    }

    closeModal();
  };

  /**
   * Funções da modal
   */
  function openModal(transaction, flag) {
    setIsOpen(true);
    setIsNew(flag);
    setCurrentTransaction(transaction);
  }

  function afterOpenModal() {
    // se a flag for true é novo lançamento
    // se a flag for false é edição
    if (isNew) {
      setCurrentTransaction({});
      setRadioSelected('-');
      setDescription('');
      setSetCategory('');
      setValue(0);
      const currentDate = new Date()
        .toLocaleDateString()
        .split('/')
        .reverse()
        .join('-');
      setDate(currentDate);
    } else {
      setCurrentTransaction(currentTransaction);
      setRadioSelected(currentTransaction.type);
      setDescription(currentTransaction.description);
      setSetCategory(currentTransaction.category);
      setValue(currentTransaction.value);
      setDate(currentTransaction.yearMonthDay);
    }
  }

  function closeModal() {
    setIsOpen(false);
  }

  /**
   * Funções dos atributos da transaction
   */

  const handleRadioChange = (event) => {
    setRadioSelected(event.target.value);
  };

  const handleInputChangeDescription = (event) => {
    setDescription(event.target.value);
  };

  const handleInputChangeCategory = (event) => {
    setSetCategory(event.target.value);
  };

  const handleInputChangeValue = (event) => {
    setValue(+event.target.value);
  };

  const handleInputChangeDate = (event) => {
    setDate(event.target.value);
  };

  return (
    <div>
      {/* <button onClick={openModal}>Open Modal</button> */}
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div id="divTitle">
          <h1>{isNew ? 'Inclusão de lançamento' : 'Edição de lançamento'}</h1>
          <button
            className="waves-effect waves-light btn red darken-4"
            onClick={closeModal}
          >
            X
          </button>
        </div>
        <form id="form">
          {/* Radios */}
          <div id="divRadios">
            <label>
              <input
                name="group1"
                type="radio"
                value="-"
                disabled={!isNew}
                onChange={handleRadioChange}
                checked={radioSelected === '-'}
              />
              <span style={isNew ? { color: 'rgb(192, 57, 43)' } : {}}>
                Despesa
              </span>
            </label>
            <label>
              <input
                name="group1"
                type="radio"
                value="+"
                disabled={!isNew}
                onChange={handleRadioChange}
                checked={radioSelected === '+'}
              />
              <span style={isNew ? { color: 'rgb(39, 174, 96)' } : {}}>
                Receita
              </span>
            </label>
          </div>
          <div className="row">
            {/* input description */}
            <div className="input-field">
              <input
                placeholder="Digite a descrição"
                id="inputDescription"
                type="text"
                value={description}
                onChange={handleInputChangeDescription}
                required
                className="validate"
              />
              <label htmlFor="inputDescription" className="active">
                Descrição:
              </label>
            </div>
            {/* input category */}
            <div className="input-field">
              <input
                placeholder="Digite a categoria"
                id="inputCategory"
                type="text"
                value={category}
                onChange={handleInputChangeCategory}
                required
                className="validate"
              />
              <label htmlFor="inputCategory" className="active">
                Categoria:
              </label>
            </div>

            <div id="divValueDate">
              {/* input value */}
              <div className="input-field">
                <input
                  placeholder="R$ 0,00"
                  id="inputValue"
                  type="number"
                  className="validate"
                  min="0"
                  step="0.01"
                  value={value}
                  onChange={handleInputChangeValue}
                  required
                />
                <label htmlFor="inputValue" className="active">
                  Valor:
                </label>
              </div>
              {/* input date */}
              <input
                placeholder="Data"
                type="date"
                className="browser-default"
                value={date}
                onChange={handleInputChangeDate}
                required
              ></input>
            </div>
          </div>
        </form>
        <button
          className="waves-effect waves-light btn"
          disabled={!description || !category}
          onClick={handleButtonSaveOrEdit}
        >
          SALVAR
        </button>
      </Modal>

      <Painel
        launches={launches}
        revenues={revenues}
        expenses={expenses}
        balance={balance}
      />
      <Filter
        handleFilter={handleChangeInputFilter}
        currentFilter={currentFilter || ''}
        handleOpenModal={openModal}
      />
      {currentTransactions.map((transaction, index) => {
        // configuração para dar espaço entre os dias do mês
        changedTheDay = false;
        if (transaction.day !== daysControl) {
          daysControl = transaction.day;
          changedTheDay = true;
        }

        return (
          <Transaction
            key={index}
            transaction={transaction}
            changedTheDay={changedTheDay}
            onDelete={handleDelete}
            handleOpenModal={openModal}
          />
        );
      })}
    </div>
  );
}

// Estilização da modal
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
  },
  overlay: { zIndex: 1000 },
};
