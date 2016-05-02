import Reflux from 'reflux';
import AuthActions from '../actions/AuthActions';
import GoogleAuth from '../services/GoogleAuth';

const AuthStore = Reflux.createStore({

  /**
   * @return {void}
   */
  init() {
    this.googleAuth = new GoogleAuth();
    this.hasBeenChecked = false;
    this._token = null;

    this.listenTo(AuthActions.isAuthenticated, this.isAuthenticated);
    this.listenTo(AuthActions.login, this.login);
    this.listenTo(AuthActions.logout, this.logout);
  },

  /**
   * Determines if we are currently authenticated with Google or not.
   *
   * @return {boolean}
   */
  isAuthenticated() {
    let isAuthenticated = this.googleAuth.isAuthenticated();
    this.setToken(this.googleAuth.getToken());
    this.hasBeenChecked = true;
    return isAuthenticated;
  },

  /**
   * Sets a token.
   *
   * @param {string} token Current token.
   *
   * @return void
   */
  setToken(token) {
    this._token = token;
    return this.trigger('tokenChanged');
  },

  /**
   * Gets the token.
   *
   * @param {string} token Current token.
   *
   * @return void
   */
  getToken(token) {
    return this._token;
  },

  /**
   * @return {void}
   */
  login() {
    return this.trigger(this.login, this.googleAuth.login());
  },

  /**
   * @return {void}
   */
  logout() {
    this.setToken(null);
    return this.trigger(this.login, this.googleAuth.logout());
  }

});

export default AuthStore;
