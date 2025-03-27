import PropTypes from 'prop-types';

const SociosFilter = ({ filters, onChange }) => {
  const handleCheckboxChange = (key) => {
    onChange({ ...filters, [key]: !filters[key] });
  };

  return (
    <>
      <div className="dropdown-item d-flex align-items-center">
        <input
          type="checkbox"
          id="mostrarTodosCheck"
          className="me-2"
          checked={filters.todos}
          onChange={() => handleCheckboxChange('todos')}
        />
        <label htmlFor="mostrarTodosCheck" className="m-0">Mostrar Todos</label>
      </div>

      <hr className="dropdown-divider" />

      <div className="dropdown-item d-flex align-items-center">
        <input
          type="checkbox"
          id="esperaCheck"
          className="me-2"
          checked={filters.listaEspera}
          onChange={() => handleCheckboxChange('listaEspera')}
        />
        <label htmlFor="esperaCheck" className="m-0">Lista de Espera</label>
      </div>

      <div className="dropdown-item d-flex align-items-center">
        <input
          type="checkbox"
          id="invernaderosCheck"
          className="me-2"
          checked={filters.invernadero}
          onChange={() => handleCheckboxChange('invernadero')}
        />
        <label htmlFor="invernaderosCheck" className="m-0">Invernadero</label>
      </div>

      <div className="dropdown-item d-flex align-items-center">
        <input
          type="checkbox"
          id="inactivosCheck"
          className="me-2"
          checked={filters.inactivos}
          onChange={() => handleCheckboxChange('inactivos')}
        />
        <label htmlFor="inactivosCheck" className="m-0">Inactivos</label>
      </div>

      <div className="dropdown-item d-flex align-items-center">
        <input
          type="checkbox"
          id="colaboradoresCheck"
          className="me-2"
          checked={filters.colaboradores}
          onChange={() => handleCheckboxChange('colaboradores')}
        />
        <label htmlFor="colaboradoresCheck" className="m-0">Colaboradores</label>
      </div>

      <div className="dropdown-item d-flex align-items-center">
        <input
          type="checkbox"
          id="hortelanosCheck"
          className="me-2"
          checked={filters.hortelanos}
          onChange={() => handleCheckboxChange('hortelanos')}
        />
        <label htmlFor="hortelanosCheck" className="m-0">Hortelanos</label>
      </div>
    </>
  );
};

SociosFilter.propTypes = {
  filters: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default SociosFilter;
