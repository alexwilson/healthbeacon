import React from 'react';
import AuthStore from '../stores/AuthStore';

class Logout extends React.Component {

  componentDidMount() {
    AuthStore.logout();
  }

  render = () => (
    <div>
      <span>You are now logged out.</span>
    </div>
  );

}

export default Logout;
