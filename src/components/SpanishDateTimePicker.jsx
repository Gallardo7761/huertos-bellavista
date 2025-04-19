import DatePicker, { registerLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';

import 'react-datepicker/dist/react-datepicker.css';

registerLocale('es', es);

const SpanishDateTimePicker = ({ selected, onChange }) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
      dateFormat="dd/MM/yyyy HH:mm"
      timeCaption="Hora"
      locale="es"
      className="form-control themed-input"
    />
  );
};

export default SpanishDateTimePicker;
