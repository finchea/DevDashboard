export default function GetHttp(variable) {
  if (variable === "sprintSummary") return new Http();
  else if (variable === "PullRequest") {
    return new PullRequestHTTP();
  } else {
    return new Http();
  }
}
export class Http {
  get(url, params) {
    return new Promise((resolve, reject) => {
      let urlEncodedParams = "";
      if (params) {
        const urlEncodedParamPairs = ["?"];
        Object.keys(params).forEach((name) => {
          urlEncodedParamPairs.push(
            `${encodeURIComponent(name)}=${encodeURIComponent(params[name])}`
          );
        });

        for (let i = 0; i < urlEncodedParamPairs.length; i++) {
          if (i > 1) {
            urlEncodedParams += "&";
          }
          urlEncodedParams += urlEncodedParamPairs[i];
        }
      }

      const http = new XMLHttpRequest();
      const Buffer = require("buffer/").Buffer;
      const authString = Buffer.from(
        "james.higgins@constructconnect.com:25u7AoajmGoqL0N8ArcB9F2B"
      ).toString("base64");

      http.open("GET", `${url}${urlEncodedParams}`);
      http.setRequestHeader("Authorization", `Basic ${authString}`); // Basic authentication
      http.setRequestHeader("Accept", "application/json");

      http.onreadystatechange = function () {
        if (http.readyState === 4) {
          if (http.status === 200) {
            resolve(http.response);
          } else {
            reject(null);
          }
        }
      };
      http.send();
    });
  }
}

export class PullRequestHTTP {
  get(url) {
    return new Promise((resolve, reject) => {
      const http = new XMLHttpRequest();
      const Buffer = require("buffer/").Buffer;
      const authString = Buffer.from(
        "jameshiggins:kLLVeTyzZThpzevKZGKp"
      ).toString("base64");

      http.open("GET", `${url}`);
      http.setRequestHeader("Authorization", `Basic ${authString}`); // Basic authentication
      http.setRequestHeader("Accept", "application/json");

      http.onreadystatechange = function () {
        if (http.readyState === 4) {
          if (http.status === 200) {
            resolve(http.response);
          } else {
            reject(null);
          }
        }
      };

      http.send();
    });
  }
  // username: jameshiggins
  // psw: kLLVeTyzZThpzevKZGKp
  // URI: https://api.bitbucket.org/2.0/pullrequests/jameshiggins/?state=MERGED
}
