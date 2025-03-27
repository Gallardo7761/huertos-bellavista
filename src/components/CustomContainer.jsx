import PropTypes from 'prop-types';

const CustomContainer = ({ children }) => {
    return (
        <main className="custom-container">
            {children}
        </main>
    );
}

CustomContainer.propTypes = {
    children: PropTypes.node.isRequired,
}

export default CustomContainer;