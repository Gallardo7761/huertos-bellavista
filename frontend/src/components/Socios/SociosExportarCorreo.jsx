const SociosExportarCorreo = ({ onAll, onNew }) => {
    return (
        <>
            <div className="dropdown-item d-flex align-items-center py-2" onClick={() => onAll()}>
                <label className="m-0" style={{ cursor: 'pointer', width: '100%' }}>
                    Lista completa
                </label>
            </div>
            <div className="dropdown-item d-flex align-items-center py-2" onClick={() => onNew()}>
                <label className="m-0" style={{ cursor: 'pointer', width: '100%' }}>
                    Nuevos correos
                </label>
            </div>
        </>
    );
}

export default SociosExportarCorreo;