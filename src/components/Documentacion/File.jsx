import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const File = ({ file }) => {
    const getIcon = (type) => {
        let dir = "/images/icons/";
        switch(type) {
            case "image/jpeg":
                return dir + "jpg_64.svg";
            case "image/png":
                return dir + "png_64.svg";
            case "video/mp4":
                return dir + "mp4_64.svg";
            case "application/pdf":
                return dir + "pdf_64.svg";
            case "text/plain":
                return dir + "txt_64.svg";
            default:
                return dir + "file_64.svg";
        }
    }

    return (
        <Card as={Link} to={`/files/${file.id}`} className="text-decoration-none shadow-sm col-sm-3 col-lg-2 col-xxl-1 position-relative">
            <Card.Body as={"div"} className="text-center">
                <img src={getIcon(file.type)} alt={file.name} className="img-fluid mb-2" />
                <p className="text-truncate">{file.name}</p>
            </Card.Body>
            <Button>
                <FontAwesomeIcon icon={faTrashAlt} />
            </Button>
        </Card>
    );
}

export default File;