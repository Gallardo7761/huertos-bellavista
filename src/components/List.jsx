import ListItem from "./ListItem";
import {ListGroup} from 'react-bootstrap';

const List = ({ datos, config }) => {
  return (
    <ListGroup className="gap-2">
      {datos.map((item, index) => (
        <ListItem key={index} item={item} config={config} index={index} />
      ))}
    </ListGroup>
  );
};

export default List;
