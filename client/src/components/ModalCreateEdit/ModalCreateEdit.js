import React from 'react';
import Modal from 'react-modal';

import './styles.css';

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

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
// Modal.setAppElement('#root');

export default function ModalCreateEdit() {
  const [modalIsOpen, setIsOpen] = React.useState(false);
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <button onClick={openModal}>Open Modal</button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div id="divTitle">
          <h1>Edição de lançamento</h1>
          <button
            className="waves-effect waves-light btn red darken-4"
            onClick={closeModal}
          >
            X
          </button>
        </div>
        <form id="form">
          <div id="divRadios">
            <label>
              <input name="group1" type="radio" checked />
              <span>Despesa</span>
            </label>
            <label>
              <input name="group1" type="radio" />
              <span>Receita</span>
            </label>
          </div>
          <div className="row">
            <div className="input-field">
              <input
                placeholder="Digite a descrição"
                id="inputDescription"
                type="text"
                className="validate"
              />
              <label htmlFor="inputDescription" className="active">
                Descrição:
              </label>
            </div>
            <div className="input-field">
              <input
                placeholder="Digite a categoria"
                id="inputCategory"
                type="text"
                className="validate"
              />
              <label htmlFor="inputCategory" className="active">
                Categoria:
              </label>
            </div>

            <div id="divValueDate">
              <div className="input-field">
                <input
                  placeholder="R$ 0,00"
                  id="inputValue"
                  type="number"
                  className="validate"
                  min="0"
                  step="0.01"
                />
                <label htmlFor="inputValue" className="active">
                  Valor:
                </label>
              </div>
              <input
                placeholder="Data"
                type="date"
                className="browser-default"
                required=""
                // value="2019-11-01"
              ></input>
            </div>
          </div>
        </form>
        <button className="waves-effect waves-light btn">SALVAR</button>
      </Modal>
    </div>
  );
}
