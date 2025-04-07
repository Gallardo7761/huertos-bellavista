import PropTypes from 'prop-types';

const IngresosFilter = ({ filters, onChange }) => {
  const handleCheckboxChange = (key) => {
    if (key === 'todos') {
      const newValue = !filters.todos;
      onChange({
        todos: newValue,
        banco: newValue,
        caja: newValue,
        semestral: newValue,
        anual: newValue
      });
    } else {
      const updated = { ...filters, [key]: !filters[key] };
      const allTrue = Object.entries(updated)
        .filter(([k]) => k !== 'todos')
        .every(([, v]) => v === true);

      updated.todos = allTrue;
      onChange(updated);
    }
  };

  return (
    <>
      <div className="dropdown-item d-flex align-items-center">
        <input
          type="checkbox"
          id="todosCheck"
          className="me-2"
          checked={filters.todos}
          onChange={() => handleCheckboxChange('todos')}
        />
        <label htmlFor="todosCheck" className="m-0">Mostrar Todos</label>
      </div>

      <hr className="dropdown-divider" />

      <div className="dropdown-item d-flex align-items-center">
        <input
          type="checkbox"
          id="bancoCheck"
          className="me-2"
          checked={filters.banco}
          onChange={() => handleCheckboxChange('banco')}
        />
        <label htmlFor="bancoCheck" className="m-0">Banco</label>
      </div>

      <div className="dropdown-item d-flex align-items-center">
        <input
          type="checkbox"
          id="cajaCheck"
          className="me-2"
          checked={filters.caja}
          onChange={() => handleCheckboxChange('caja')}
        />
        <label htmlFor="cajaCheck" className="m-0">Caja</label>
      </div>

      <div className="dropdown-item d-flex align-items-center">
        <input
          type="checkbox"
          id="semestralCheck"
          className="me-2"
          checked={filters.semestral}
          onChange={() => handleCheckboxChange('semestral')}
        />
        <label htmlFor="semestralCheck" className="m-0">Semestral</label>
      </div>

      <div className="dropdown-item d-flex align-items-center">
        <input
          type="checkbox"
          id="anualCheck"
          className="me-2"
          checked={filters.anual}
          onChange={() => handleCheckboxChange('anual')}
        />
        <label htmlFor="anualCheck" className="m-0">Anual</label>
      </div>
    </>
  );
};

IngresosFilter.propTypes = {
  filters: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default IngresosFilter;
