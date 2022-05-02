import "./App.css";
import Login from "./Components/Login/Login";
import Home from "./Components/Home/Home";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import sprintReducer from "./reducer/sprintReducer.js";
import pullRequestReducer from "./reducer/pullRequestReducer";
import userReducer from "./reducer/userReducer";

function App() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const authorizationCode = urlParams.get("code");

  const token = localStorage.getItem("token");
  const failed = urlParams.get("failed");
  const reducer = combineReducers({
    sprints: sprintReducer,
    pullRequests: pullRequestReducer,
    user: userReducer,
  });
  const store = createStore(reducer);

  //look up CombineReducer.

  if (token) {
    const json = JSON.parse(token);

    return (
      <Provider store={store}>
        <div>
          <Home />
        </div>
      </Provider>
    );
  }

  return (
    <div className="App">
      <Login failedMsg={failed} authCode={authorizationCode} />
    </div>
  );
}

export default App;
