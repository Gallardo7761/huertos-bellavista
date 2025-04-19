import { useRef } from 'react';
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

const Documentacion = () => {
  const { config, configLoading } = useConfig();

  if (configLoading) return <p><LoadingIcon /></p>;

  const reqConfig = {
    baseUrl: config.apiConfig.coreUrl + config.apiConfig.endpoints.files.all,
    uploadUrl: config.apiConfig.coreUrl + config.apiConfig.endpoints.files.upload,
    params: {
      _sort: 'uploaded_at',
      _order: 'desc'
    }
  };

  return (
    <DataProvider config={reqConfig}>
      <DocumentacionContent reqConfig={reqConfig} />
    </DataProvider>
  );
};

const DocumentacionContent = ({ reqConfig }) => {
  const { data, dataLoading, dataError, postData, deleteDataWithBody } = useDataContext();
  const fileUploadRef = useRef();

  const handleSelectFiles = async (files) => {
    const file = files[0];
    if (!file || !reqConfig?.uploadUrl) return;

    const file_name = file.name;
    const mime_type = file.type || "application/octet-stream";
    const uploaded_by = JSON.parse(localStorage.getItem("user"))?.user_id;
    const context = 1;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("file_name", file_name);
    formData.append("mime_type", mime_type);
    formData.append("uploaded_by", uploaded_by);
    formData.append("context", context);

    try {
      await postData(reqConfig.uploadUrl, formData);
      fileUploadRef.current?.resetSelectedFiles();
    } catch (err) {
      console.error("Error al subir archivo:", err);
    }
  };

  const handleDeleteFile = async (file) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${file.file_name}?`)) {
      try {
        await deleteDataWithBody(`${reqConfig.baseUrl}/${file.file_id}`, {
          file_path: file.file_path
        });
      } catch (err) {
        console.error("Error al eliminar archivo:", err);
      }
    }
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
          <div className="mt-4">
            {dataError && <p className="text-danger">❌ Error al cargar los archivos.</p>}
            {data?.length === 0 && <p>No hay documentos todavía.</p>}
            {data?.map((file, idx) => (
              <File key={idx} file={file} onDelete={handleDeleteFile} />
            ))}
          </div>
        )}

      </ContentWrapper>
    </CustomContainer>
  );
};

export default Documentacion;
