import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Spinner } from 'native-base';

import Container from './Container';

const Pending = ({ navigation }) => {
  const error = useSelector(({ meta: { error } }) => error);
  useEffect(() => {
    if (error) navigation.navigate('Error');
  }, [error]);
  return (
    <Container>
      <Spinner />
    </Container>
  );
};

export default Pending;
