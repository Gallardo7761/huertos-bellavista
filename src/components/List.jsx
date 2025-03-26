import ListItem from "./ListItem";
import '../css/List.css';

const List = ({ datos, config }) => {
  return (
    <ul className="list-group">
      {datos.map((item, index) => (
        <ListItem key={index} item={item} config={config} index={index} />
      ))}
    </ul>
  );
};

export default List;
