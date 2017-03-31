import React, { PropTypes } from 'react';
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
  userData: React.PropTypes.shape({
    id: React.PropTypes.number,
    login: React.PropTypes.string,
    experience: React.PropTypes.number,
    gameWon: React.PropTypes.number,
    gameLose: React.PropTypes.number,
    gameDraw: React.PropTypes.number,
    gameTotal: React.PropTypes.number,
  }),
};

export default withAuthentication(Menu);
