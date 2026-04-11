const SearchToolbar = ({ searchTerm, onSearchChange, children }) => (
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
                {children}
            </div>
        </div>
    </div>
);

export default SearchToolbar;