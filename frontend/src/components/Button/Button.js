import React from 'react';
import './Button.css';
import PropTypes from 'prop-types';

const Button = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default Button;
