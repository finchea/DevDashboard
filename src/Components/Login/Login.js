import React from "react";
import "./Login.css";
import Auth from "../../Auth";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: props.failedMsg,
      authCode: props.authCode,
    };
  }

  componentDidMount() {
    const { authCode } = this.state;
    if (authCode) {
      Auth.getTokenFromAuthCode(authCode)
        .then((token, error) => {
          if (token) {
            localStorage.removeItem("token");
            localStorage.setItem("token", token);
            window.location = `http://localhost:3000`;
          } else {
            this.setState({ error: "Failed to get token" });
          }
        })
        .catch((error) => {
          this.setState({ error: "Failed to get token" });
        });
    }
  }

  getAuthCode() {
    Auth.getAuthCode();
  }

  renderError(errorMsg) {
    return <div className="error">{errorMsg}</div>;
  }
  render() {
    const { error } = this.state;

    return (
      <div>
        <h2 className="login">
          Click the button below to authorize access to Jira
        </h2>
        <div className="buttonContainer">
          <div>
            <button
              className="authButton"
              onClick={this.getAuthCode.bind(this)}
            >
              Login
            </button>
            <label hidden={!error}>Login failed, Please try again</label>
          </div>
        </div>
        {error && this.renderError(error)}
      </div>
    );
  }
}
