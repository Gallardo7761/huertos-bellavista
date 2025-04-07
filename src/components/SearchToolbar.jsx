import { faFilter, faFilePdf, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AnimatedDropdown from './AnimatedDropdown';
import Button from 'react-bootstrap/Button';

const SearchToolbar = ({ searchTerm, onSearchChange, filtersComponent, onCreate, onPDF }) => (
    <div className="sticky-toolbar search-toolbar-wrapper">
        <div className="search-toolbar">
            <input
                type="text"
                className="search-input"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
            />
            <div className="toolbar-buttons">
                {filtersComponent && (
                    <AnimatedDropdown variant="transparent" icon={<FontAwesomeIcon icon={faFilter} className='fa-md' />}>
                        {filtersComponent}
                    </AnimatedDropdown>
                )}
                {onPDF && (
                    <Button variant="transparent" onClick={onPDF}>
                        <FontAwesomeIcon icon={faFilePdf} className='fa-md' />
                    </Button>
                )}
                {onCreate && (
                    <Button variant="transparent" onClick={onCreate}>
                        <FontAwesomeIcon icon={faPlus} className='fa-md' />
                    </Button>
                )}
            </div>
        </div>
    </div>
);

export default SearchToolbar;