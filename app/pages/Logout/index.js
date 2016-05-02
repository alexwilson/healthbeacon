import React from 'react';
import { connect } from 'reflux';
import AuthStore from '../../stores/AuthStore';
import AuthActions from '../../actions/AuthActions';

const authStore = connect(AuthStore, 'logout');
class Logout extends React.Component {

  mixins: [authStore];

  /**
   * When mounted this component fires a logout callback.
   * @return {void}
   */
  componentDidMount() {
    AuthActions.logout();
  }

  /**
   * @return {object}
   */
  render = () => (
    <div>
      <span>You are now logged out.</span>
    </div>
  );

}

export default Logout;
