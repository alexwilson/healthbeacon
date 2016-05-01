import React from 'react';
import AuthStore from '../stores/AuthStore';

class Login extends React.Component {

  componentDidMount() {
    AuthStore.login();
  }

  render = () => (
    <div>
      <span>Logging in.</span>
    </div>
  );

}

export default Login;
