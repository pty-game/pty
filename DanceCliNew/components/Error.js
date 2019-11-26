import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import {useDispatch, useSelector} from 'react-redux'
import Container from './Container';
import { setError } from '../redux/modules/meta';

const Error = ({ navigation }) => {
  const dispatch = useDispatch();
  const error = useSelector(({ meta: { error } }) => error);

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Home');
      dispatch(setError(null))
    }, 3000);
  }, []);
  return (
    <Container>
      <Text style={{ textAlign: 'center' }}>
        {error}
      </Text>
    </Container>
  );
};

export default Error;
