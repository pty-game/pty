import React, { PropTypes } from 'react';
import { Button } from 'native-base';

const ownStyles = {
  btn: {
    marginTop: 20,
  },
};

const Container = (props) => {
  const { children, style } = props;
  const propsWithoutStyle = props;

  delete propsWithoutStyle.style;

  return (
    <Button style={{ ...ownStyles.btn, ...style }} {...propsWithoutStyle} >
      {children}
    </Button>
  );
};

Container.defaultProps = {
  style: {},
};

Container.propTypes = {
  children: PropTypes.element.isRequired,
  style: PropTypes.object,
};

export default Container;
