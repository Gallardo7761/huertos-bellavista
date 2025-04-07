import { useState } from 'react';
import { useConfig } from '../hooks/useConfig';
import { useData } from '../hooks/useData';
import { usePaginatedList } from '../hooks/usePaginatedList';
import { DataProvider } from '../context/DataContext';

import CustomContainer from '../components/CustomContainer';
import ContentWrapper from '../components/ContentWrapper';
import LoadingIcon from '../components/LoadingIcon';
import SearchToolbar from '../components/SearchToolbar';
import PaginatedCardGrid from '../components/PaginatedCardGrid';
import PDFModal from '../components/PDFModal';

import IngresoCard from '../components/Ingresos/IngresoCard';
import IngresosFilter from '../components/Ingresos/IngresosFilter';
import { IngresosPDF } from '../components/Ingresos/IngresosPDF';
import { CONSTANTS } from '../util/constants';

import '../css/Ingresos.css';

const PAGE_SIZE = 10;

const Ingresos = () => {
    const { config, configLoading } = useConfig();

    if (configLoading) return <p><LoadingIcon /></p>;

    const HOST = config.apiConfig.baseUrl;
    const BASE = `${HOST}`;
    const ENDPOINT = config.apiConfig.endpoints.incomes.allWithNames;

    const reqConfig = {
        baseUrl: BASE + ENDPOINT,
        params: {
            _sort: 'created_at',
            _order: 'desc'
        }
    };

    return (
        <DataProvider config={reqConfig}>
            <IngresosContent config={reqConfig} />
        </DataProvider>
    );
};

const IngresosContent = ({ config }) => {
    const { data, dataLoading, dataError, postData, putData, deleteData } = useData();
    const [showPDFModal, setShowPDFModal] = useState(false);

    const {
        paginated,
        filtered,
        searchTerm,
        setSearchTerm,
        filters,
        setFilters,
        loaderRef,
        loading,
        isUsingFilters
    } = usePaginatedList({
        data,
        pageSize: PAGE_SIZE,
        initialFilters: {
            todos: true,
            banco: true,
            caja: true,
            semestral: true,
            anual: true
        },
        filterFn: (ingreso, filters) => {
            if (filters.todos) return true;

            const { banco, caja, semestral, anual } = filters;

            const typeMatch =
                (banco && ingreso.type === CONSTANTS.PAYMENT_TYPE_BANK) ||
                (caja && ingreso.type === CONSTANTS.PAYMENT_TYPE_CASH);

            const freqMatch =
                (semestral && ingreso.frequency === CONSTANTS.PAYMENT_FREQUENCY_BIYEARLY) ||
                (anual && ingreso.frequency === CONSTANTS.PAYMENT_FREQUENCY_YEARLY);

            const typeFilters = [banco, caja].filter(Boolean).length;
            const freqFilters = [semestral, anual].filter(Boolean).length;

            // Si hay al menos un tipo y una frecuencia seleccionados: combinar
            if (typeFilters > 0 && freqFilters > 0) {
                return typeMatch && freqMatch;
            }

            // Si solo hay tipos seleccionados
            if (typeFilters > 0 && freqFilters === 0) {
                return typeMatch;
            }

            // Si solo hay frecuencias seleccionadas
            if (freqFilters > 0 && typeFilters === 0) {
                return freqMatch;
            }

            // Si no hay nada marcado (raro, pero posible)
            return false;
        },
        searchFn: (ingreso, term) => {
            const normalized = term.toLowerCase();
            return (
                ingreso.concept?.toLowerCase().includes(normalized) ||
                String(ingreso.member_number).includes(normalized)
            );
        }
    });

    const showPDFPopup = () => setShowPDFModal(true);
    const closePDFPopup = () => setShowPDFModal(false);

    if (dataLoading) return <p className="text-center my-5"><LoadingIcon /></p>;
    if (dataError) return <p className="text-danger text-center my-5">{dataError}</p>;

    return (
        <CustomContainer>
            <ContentWrapper>
                <div className="d-flex justify-content-between align-items-center m-0 p-0">
                    <h1 className="section-title">Lista de Ingresos</h1>
                </div>

                <hr className="section-divider" />

                <SearchToolbar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    filtersComponent={<IngresosFilter filters={filters} onChange={setFilters} />}
                    onPDF={showPDFPopup}
                />

                <PaginatedCardGrid
                    items={isUsingFilters ? filtered : paginated}
                    loaderRef={loaderRef}
                    loading={loading}
                    renderCard={(income) => (
                        <IngresoCard key={income.income_id} income={income} />
                    )}
                />
            </ContentWrapper>

            <PDFModal show={showPDFModal} onClose={closePDFPopup} title="Vista previa del PDF">
                <IngresosPDF ingresos={filtered} />
            </PDFModal>
        </CustomContainer>
    );
};

export default Ingresos;
