import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'native-base';

const ownStyles = {
  marginTop: 20,
};

const MyButton = (props) => {
  const { children, style } = props;

  const allProps = { ...props, style: { ...ownStyles, ...style } };

  return (
    <Button {...allProps} >
      {children}
    </Button>
  );
};

MyButton.defaultProps = {
  style: {},
};

MyButton.propTypes = {
  children: PropTypes.element.isRequired,
  style: PropTypes.object,
};

export default MyButton;
