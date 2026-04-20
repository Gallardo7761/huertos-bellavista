import { useEffect, useState } from "react";
import { useError } from "../../context/ErrorContext";
import { useConfig } from "../../hooks/useConfig";
import { useDataContext } from "../../hooks/useDataContext";
import LoadingIcon from "../LoadingIcon";
import NotificationModal from "../NotificationModal";
import { DataProvider } from "../../context/DataContext";

const SolicitudesPopup = () => {
    const { config, configLoading } = useConfig();
    const { showError } = useError();

    if (configLoading || !config) return <p className="text-center my-5"><LoadingIcon /></p>;

    const reqConfig = {
        baseUrl: `${config.apiConfig.baseUrl}${config.apiConfig.endpoints.requests.count}`,
        params: {}
    };

    return (
        <DataProvider config={reqConfig} onError={showError}>
            <SolicitudesPopupContent />
        </DataProvider>
    );
}

const SolicitudesPopupContent = () => {
    const { data, dataLoading } = useDataContext();

    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const shown = sessionStorage.getItem("popup_requests_shown");
        if (data !== null && data.count > 0 && !shown) {
            setShowPopup(true);
            sessionStorage.setItem("popup_requests_shown", "true");
        }
    }, [data]);

    if (dataLoading) return <p className="text-center my-5"><LoadingIcon /></p>;

    return (
        <NotificationModal
            show={showPopup}
            onClose={() => setShowPopup(false)}
            title={`Solicitudes pendientes`}
            message={`Hay ${data.count} solicitudes pendientes de ser atendidas`}
            variant="info"
            buttons={[]}
        />
    );
}

export default SolicitudesPopup;