import auth0 from "auth0-js";

const clientId = process.env.REACT_APP_CC_CLIENT_ID;
const clientSecret = process.env.REACT_APP_CC_CLIENT_SECRET;
export default class Auth {
  static getAuthCode() {
    this.auth0 = new auth0.WebAuth({
      audience: "api.atlassian.com",
      domain: "https://auth.atlassian.com",
      clientID: clientId,
      redirectUri: "http://localhost:3000",
      state: "intoyou3377",
      responseType: "code",
      scope: "read:me", //jira-user',
    });

    this.auth0.authorize();
  }

  static getTokenFromAuthCode(code) {
    return new Promise((resolve, reject) => {
      const http = new XMLHttpRequest();

      const params = {
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: "http://localhost:3000",
        code: code,
      };

      const urlEncodedParamPairs = JSON.stringify(params);

      http.open("POST", "https://auth.atlassian.com/oauth/token");
      http.setRequestHeader("Content-Type", "application/json; charset=utf-8");

      http.onreadystatechange = function () {
        if (http.readyState === 4) {
          if (http.status === 200) {
            resolve(http.responseText);
          } else {
            reject(null);
          }
        }
      };

      http.send(urlEncodedParamPairs);
    });
  }
}
