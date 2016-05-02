import AuthStore from '../stores/AuthStore';

const requireAuth = (nextState, replace) => {

  if (!AuthStore.isAuthenticated()) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

export default requireAuth;
