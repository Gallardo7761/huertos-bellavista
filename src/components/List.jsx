import ListItem from "./ListItem";
import '../css/List.css';
import {ListGroup} from 'react-bootstrap';

const List = ({ datos, config }) => {
  return (
    <ListGroup>
      {datos.map((item, index) => (
        <ListItem key={index} item={item} config={config} index={index} />
      ))}
    </ListGroup>
  );
};

export default List;
