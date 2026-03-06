import { useRef, useState } from 'react';
import { useConfig } from '../hooks/useConfig';
import { DataProvider } from '../context/DataContext';
import { useDataContext } from '../hooks/useDataContext';
import FileUpload from '../components/Documentacion/FileUpload';
import File from '../components/Documentacion/File';
import CustomContainer from '../components/CustomContainer';
import ContentWrapper from '../components/ContentWrapper';
import LoadingIcon from '../components/LoadingIcon';
import IfRole from '../components/Auth/IfRole.jsx';
import { CONSTANTS } from '../util/constants.js';
import CustomModal from '../components/CustomModal.jsx';
import { Button } from 'react-bootstrap';
import { useError } from '../context/ErrorContext';

const Documentacion = () => {
  const { config, configLoading } = useConfig();
  const { showError } = useError();

  if (configLoading) return <p><LoadingIcon /></p>;

  const reqConfig = {
    baseUrl: config.apiConfig.coreUrl + config.apiConfig.endpoints.files.all,
    params: {}
  };

  return (
    <DataProvider config={reqConfig} onError={showError}>
      <DocumentacionContent reqConfig={reqConfig} />
    </DataProvider>
  );
};

const DocumentacionContent = ({ reqConfig }) => {
  const { data, dataLoading, postData, deleteDataWithBody } = useDataContext();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const fileUploadRef = useRef();

  const handleSelectFiles = async (files) => {
    const file = files[0];
    if (!file || !reqConfig?.baseUrl) return;

    const fileName = file.name;
    const mimeType = file.type || "application/octet-stream";
    const uploadedBy = JSON.parse(localStorage.getItem("identity"))?.user?.userId;
    const context = 1;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    formData.append("mimeType", mimeType);
    formData.append("uploadedBy", uploadedBy);
    formData.append("context", context);

    try {
      await postData(reqConfig.baseUrl, formData);
      fileUploadRef.current?.resetSelectedFiles();
    } catch (err) {
      console.error("Error al subir archivo:", err);
    }
  };

  const handleDeleteFile = async (file) => {
    setDeleteTarget(file);
  };

  return (
    <CustomContainer className="py-4">
      <ContentWrapper>
        <h1 className="section-title mb-3">Documentación</h1>
        <hr className="section-divider my-4" />

        <IfRole roles={[CONSTANTS.ROLE_ADMIN, CONSTANTS.ROLE_DEV]}>
          <FileUpload ref={fileUploadRef} onFilesSelected={handleSelectFiles} />
        </IfRole>

        {dataLoading ? (<LoadingIcon />) : (
          <div className="mt-4 d-flex flex-wrap gap-3 justify-content-start">
            {data?.length === 0 && <p>No hay documentos todavía.</p>}
            {data?.filter(file => file.context === CONSTANTS.CONTEXT_HUERTOS)
              .map((file, idx) => (
                <File key={idx} file={file} onDelete={handleDeleteFile} />
              ))
            }
          </div>
        )}

        <CustomModal
          title="Confirmar eliminación"
          show={deleteTarget !== null}
          onClose={() => setDeleteTarget(null)}
        >
          <p className='p-3'>¿Estás seguro de que quieres eliminar el archivo?</p>
          <div className="d-flex justify-content-end gap-2 mt-3 p-3">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button
              variant="danger"
              onClick={async () => {
                try {
                  await deleteDataWithBody(`${reqConfig.baseUrl}/${deleteTarget.fileId}`, {
                    filePath: deleteTarget.filePath
                  });
                  setDeleteTarget(null);
                } catch (err) {
                  console.error("Error al eliminar:", err.message);
                }
              }}
            >
              Confirmar
            </Button>
          </div>
        </CustomModal>

      </ContentWrapper>
    </CustomContainer>
  );
};

export default Documentacion;
