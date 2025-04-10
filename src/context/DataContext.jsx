import { createContext } from "react";
import PropTypes from "prop-types";
import { useData } from "../hooks/useData";

const DataContext = createContext();

export const DataProvider = ({ config, children }) => {
  const data = useData(config);
  
  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  config: PropTypes.shape({
    baseUrl: PropTypes.string.isRequired,
    params: PropTypes.object,
  }).isRequired,
  children: PropTypes.node.isRequired,
};