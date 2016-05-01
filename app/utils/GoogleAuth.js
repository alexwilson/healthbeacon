import url from 'url';
import fetch from 'isomorphic-fetch';

class GoogleAuth {

  generateUrl = () => {

    let options = {
      protocol: 'https:',
      hostname: 'accounts.google.com',
      query: {
        scope: 'email profile',
        state: '/profile',
        redirect_uri: 'https://oauth2-login-demo.appspot.com/oauthcallback',
        response_type: 'token',
        client_id: '812741506391.apps.googleusercontent.com',
        nonce: 'DgkRrHXmyu3KLd0KDdfq'
      },
      pathname: '/o/oauth2/v2/auth'
    };
    console.log(url.format(options));
  }

  // First, parse the query string
  // var params = {}, queryString = location.hash.substring(1),
  //     regex = /([^&=]+)=([^&]*)/g, m;
  // while (m = regex.exec(queryString)) {
  //   params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
  // }

  // Verify that the nonce in the response is the same as the one you sent in the
  // request.
  // if (params['nonce'] !== nonce) {
  //   alert('Invalid nonce.')
  // } else {
    // And send the token over to the server
    // var req = new XMLHttpRequest();
    // consider using POST so query isn't logged
  //   req.open('GET', 'https://' + window.location.host + '/catchtoken?' + queryString, true);
  //   req.onreadystatechange = function (e) {
  //     if (req.readyState == 4) {
  //       if (req.status == 200) {
  //         window.location = params['state']
  //       } else if (req.status == 400) {
  //         alert('There was an error processing the token.')
  //       } else {
  //         alert('something else other than 200 was returned')
  //       }
  //     }
  //   };
  //   req.send(null);
  // }


}

export default GoogleAuth;
