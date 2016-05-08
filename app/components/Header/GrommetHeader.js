import React from 'react';
import {Link} from 'react-router';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Menu from 'grommet/components/Menu';
import Anchor from 'grommet/components/Anchor';
import Favorite from 'grommet/components/icons/base/Favorite'

class GrommetHeader extends React.Component {
  render = () => (
    <Header colorIndex="neutral-1" justify="between" pad={{"horizontal": "medium"}}>
      <Title>
         <Favorite /><Link to="/">Healthbeacon</Link>
      </Title>
      <Menu label="Menu" dropAlign={{"right": "right"}}>
        <Link to="/dashboard" activeClassName="active" className="anchor">
          Dashboard
        </Link>
        <Link to="/details" activeClassName="active" className="anchor">
          Details
        </Link>
      </Menu>
    </Header>

  );
};

export default GrommetHeader;
