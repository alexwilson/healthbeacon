import Hello from 'hellojs';
import url from 'url';

class AuthWrapper {

  constructor() {
    this._hello = Hello.init(
      {
        google: "930863321978-crtshthdr7p0hvne13qmp8ovmo4aqoo3.apps.googleusercontent.com"
      },
      {
        force: true,
        display: 'page'
      }
    );
  };

  isAuthenticated() {
    let currentTime = (new Date()).getTime() / 1000;
    let session = this._hello('google').getAuthResponse();
    return (session && session.access_token && session.expires > currentTime);
  };

  /**
   * Initiates a login popup.
   * @return {void}
   */
  login() {
    this._hello.login('google');
  };

  /**
   * Logs out.
   * @return {void}
   */
  logout() {
    this._hello.logout('google');
  }

  getHealth() {
    return this._hello.api('fitness/v1/users/me/dataSources');
  };

  _getRedirectUrl() {
    let options = url.parse(window.location.href);
    options = {
      'hostname': window.location.hostname,
      'pathname': window.location.pathname
    };
    return url.format(options);
  };

}

export default AuthWrapper;
