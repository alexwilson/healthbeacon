import React from 'react';
import { connect } from 'reflux';
import AuthStore from '../../stores/AuthStore';
import AuthActions from '../../actions/AuthActions';

const authStore = connect(AuthStore, 'login');
class Login extends React.Component {

  mixins: [authStore];

  /**
   * When mounted this component fires a login callback.
   * @return {void}
   */
  componentDidMount() {
    AuthActions.login();
  }

  /**
   * @return {object}
   */
  render = () => (
    <div>
      <span>Logging in.</span>
    </div>
  );

}

export default Login;
