import PropTypes from 'prop-types';

const GastosFilter = ({ filters, onChange }) => {
  const handleCheckboxChange = (key) => {
    if (key === 'todos') {
      const newValue = !filters.todos;
      onChange({
        todos: newValue,
        banco: newValue,
        caja: newValue
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
    </>
  );
};

GastosFilter.propTypes = {
  filters: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default GastosFilter;
