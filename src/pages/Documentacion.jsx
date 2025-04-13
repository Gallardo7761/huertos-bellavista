import { useRef } from 'react';
import { useConfig } from '../hooks/useConfig';
import { useData } from '../hooks/useData';
import { DataProvider } from '../context/DataContext';
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

  const BASE = config.apiConfig.coreUrl;
  const ENDPOINT = config.apiConfig.endpoints.files.all;
  const ENDPOINT_UPLOAD = config.apiConfig.endpoints.files.upload;

  const reqConfig = {
    baseUrl: BASE + ENDPOINT,
    uploadUrl: BASE + ENDPOINT_UPLOAD,
    params: {
      _sort: 'uploaded_at',
      _order: 'desc'
    }
  };

  return (
    <DataProvider config={reqConfig}>
      <DocumentacionContent config={reqConfig} />
    </DataProvider>
  );
};

const DocumentacionContent = ({ config }) => {
  const { data, dataLoading, dataError, postData, deleteDataWithBody } = useData(config);
  const fileUploadRef = useRef();

  const handleSelectFiles = async (files) => {
    const file = files[0];
    if (!file) return;

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
      await postData(config.uploadUrl, formData);
      fileUploadRef.current?.resetSelectedFiles();
    } catch (err) {
      console.error("Error al subir archivo:", err);
    }
  };

  const handleDeleteFile = async (file) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${file.file_name}?`)) {
      try {
        await deleteDataWithBody(`${config.baseUrl}/${file.file_id}`, {
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
        <div className="mb-4">
          <h1 className="section-title">Documentación</h1>
        </div>

        <hr className="section-divider my-4" />

        <IfRole roles={[CONSTANTS.ROLE_ADMIN, CONSTANTS.ROLE_DEV]}>
            <FileUpload ref={fileUploadRef} onFilesSelected={handleSelectFiles} />
        </IfRole>

        <div className="mt-4">
          {dataLoading && <LoadingIcon />}
          {dataError && <p className="text-danger">❌ Error al cargar los archivos.</p>}
          {data?.length === 0 && !dataLoading && <p>No hay documentos todavía.</p>}
          {data?.map((file, idx) => (
            <File key={idx} file={file} onDelete={handleDeleteFile} />
          ))}
        </div>
      </ContentWrapper>
    </CustomContainer>
  );
};

export default Documentacion;
