import PropTypes from 'prop-types';

const Container = ({ children }) => {
    return (
        <main className="custom-container">
            {children}
        </main>
    );
}

Container.propTypes = {
    children: PropTypes.node.isRequired,
}

export default Container;