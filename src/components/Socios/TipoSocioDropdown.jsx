import AnimatedDropdown from '../AnimatedDropdown';
import { Image } from 'react-bootstrap';

const tipos = [
  { value: 0, label: 'Lista de espera', icon: 'list.png' },
  { value: 1, label: 'Hortelano', icon: 'farmer.png' },
  { value: 2, label: 'Hortelano+Invernadero', icon: 'green_house.png' },
  { value: 3, label: 'Colaborador', icon: 'join.png' },
  { value: 4, label: 'Subvención', icon: 'subvencion4.png' },
  { value: 5, label: 'Informático', icon: 'programmer.png' }
];

const basePath = '/images/icons/';

const TipoSocioDropdown = ({ value, onChange }) => {
  const selected = tipos.find(t => t.value === value) || tipos[0];

  return (
    <AnimatedDropdown
      trigger={
        <button className="btn p-0 border-0 bg-transparent">
          <Image
            src={basePath + selected.icon}
            width={36}
            className="rounded me-3"
            alt={selected.label}
          />
        </button>
      }
      className="w-auto"
    >
      {({ closeDropdown }) => (
        <>
          {tipos.map(t => (
            <div
              key={t.value}
              className={`dropdown-item d-flex align-items-center`}
              style={{ width: '100%', minWidth: '160px' }}
              onClick={() => {
                onChange(t.value);
                closeDropdown();
              }}
            >
              <img src={basePath + t.icon} width={24} height={24} alt={t.label} className='me-3' />
              {t.label}
            </div>
          ))}
        </>
      )}
    </AnimatedDropdown>
  );
};

export default TipoSocioDropdown;
