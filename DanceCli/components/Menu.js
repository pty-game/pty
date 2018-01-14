import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, Separator, Text, Content } from 'native-base';
import withAuthentication from '../containers/withAuthentication';

const Menu = ({ logOut, userData }) => {
  return (
    <Content style={{ marginTop: 40 }}>
      <Separator bordered>
        <Text>{userData.login}</Text>
      </Separator>
      <ListItem last onPress={() => { logOut(); }}>
        <Text>Log out</Text>
      </ListItem>
    </Content>
  );
};

Menu.defaultProps = {
  userData: {},
};


Menu.propTypes = {
  logOut: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    id: PropTypes.number,
    login: PropTypes.string,
    experience: PropTypes.number,
    gameWon: PropTypes.number,
    gameLose: PropTypes.number,
    gameDraw: PropTypes.number,
    gameTotal: PropTypes.number,
  }),
};

export default withAuthentication(Menu);
