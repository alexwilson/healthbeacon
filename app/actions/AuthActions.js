import Reflux from 'reflux';

const AuthActions = Reflux.createActions([
  'isAuthenticated',
  'login',
  'logout'
]);

export default AuthActions;
