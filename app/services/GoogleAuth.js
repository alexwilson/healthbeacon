import Hello from 'hellojs';

class GoogleAuth {

  constructor() {
    this._token = null;
    this._hello = Hello.init(
      {
        google: "930863321978-crtshthdr7p0hvne13qmp8ovmo4aqoo3.apps.googleusercontent.com"
      },
      {
        force: false,
        display: 'page',
        scope: [
          'https://www.googleapis.com/auth/fitness.activity.read',
          'https://www.googleapis.com/auth/fitness.body.read',
          'https://www.googleapis.com/auth/fitness.location.read'
        ]
      }
    );
  };

  /**
   * Returns true if authenticated.
   *
   * @return {boolean}
   */
  isAuthenticated() {
    let currentTime = (new Date()).getTime() / 1000;
    let session = this._hello('google').getAuthResponse();
    const response = (session && session.access_token && session.expires > currentTime);
    return (response) ? (this.setToken(session.access_token) || response) : response;
  };

  /**
   * Initiates a login.
   * @return {void}
   */
  login() {
    return this._hello.login('google');
  };

  /**
   * Logs out.
   * @return {void}
   */
  logout() {
    return this._hello.logout('google');
  };

  /**
   * Makes token available.
   *
   * @param {string} token
   *
   * @return {boolean}
   */
  setToken(token) {
    this._token = token;
  };

  /**
   * Makes token available.
   *
   * @param {string} token
   */
  getToken(token) {
    return this._token;
  };

  /**
   * [getHealth description]
   * @return {[type]} [description]
   */
  getHealth() {
    return this._hello.api('fitness/v1/users/me/dataSources');
  };

}

export default GoogleAuth;
