import PropTypes from 'prop-types';

const AnunciosFilter = ({ filters, onChange }) => {
  const handleCheckboxChange = (key) => {
    const updated = { ...filters, [key]: !filters[key] };
    const allPrioridades = ['baja', 'media', 'alta'];
    const allFechas = ['ultimos7', 'esteMes'];

    updated.todos = (
      allPrioridades.every(p => updated[p]) &&
      allFechas.every(f => updated[f])
    );
    onChange(updated);
  };

  const handleTodosChange = () => {
    const newValue = !filters.todos;
    onChange({
      todos: newValue,
      baja: newValue,
      media: newValue,
      alta: newValue,
      ultimos7: newValue,
      esteMes: newValue
    });
  };

  return (
    <>
      <div className="dropdown-item d-flex align-items-center">
        <input
          type="checkbox"
          id="todosCheck"
          className="me-2"
          checked={filters.todos}
          onChange={handleTodosChange}
        />
        <label htmlFor="todosCheck" className="m-0">Mostrar Todos</label>
      </div>

      <hr className="dropdown-divider" />

      <div className="dropdown-item d-flex align-items-center">
        <input
          type="checkbox"
          id="bajaCheck"
          className="me-2"
          checked={filters.baja}
          onChange={() => handleCheckboxChange('baja')}
        />
        <label htmlFor="bajaCheck" className="m-0">Prioridad Baja</label>
      </div>

      <div className="dropdown-item d-flex align-items-center">
        <input
          type="checkbox"
          id="mediaCheck"
          className="me-2"
          checked={filters.media}
          onChange={() => handleCheckboxChange('media')}
        />
        <label htmlFor="mediaCheck" className="m-0">Prioridad Media</label>
      </div>

      <div className="dropdown-item d-flex align-items-center">
        <input
          type="checkbox"
          id="altaCheck"
          className="me-2"
          checked={filters.alta}
          onChange={() => handleCheckboxChange('alta')}
        />
        <label htmlFor="altaCheck" className="m-0">Prioridad Alta</label>
      </div>

      <hr className="dropdown-divider" />

      <div className="dropdown-item d-flex align-items-center">
        <input
          type="checkbox"
          id="ultimos7Check"
          className="me-2"
          checked={filters.ultimos7}
          onChange={() => handleCheckboxChange('ultimos7')}
        />
        <label htmlFor="ultimos7Check" className="m-0">Últimos 7 días</label>
      </div>

      <div className="dropdown-item d-flex align-items-center">
        <input
          type="checkbox"
          id="esteMesCheck"
          className="me-2"
          checked={filters.esteMes}
          onChange={() => handleCheckboxChange('esteMes')}
        />
        <label htmlFor="esteMesCheck" className="m-0">Este mes</label>
      </div>
    </>
  );
};

AnunciosFilter.propTypes = {
  filters: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};

export default AnunciosFilter;
