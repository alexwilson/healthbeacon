import Reflux from 'reflux';
import GoogleActions from '../actions/GoogleActions';
import AuthWrapper from '../utils/AuthWrapper';

const AuthStore = Reflux.createStore({

  init() {
    this.authWrapper = new AuthWrapper();
    // this.hasBeenChecked = false;
    // this.listenTo(GoogleActions.checkLoginStatus, this.checkLoginStatus);
    this.listenTo(GoogleActions.login, this.login);
    this.listenTo(GoogleActions.logout, this.logout);
  },

  checkLoginStatus() {
    return this.authWrapper.isAuthenticated();
  },

  loggedIn() {
    return this.checkLoginStatus();
  },

  login() {
    return this.authWrapper.login();
  },

  logout() {
    return this.authWrapper.logout();
  }

});

export default AuthStore;
