import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import sprintReducer from "../reducer/sprintReducer";
import pullRequestReducer from "../reducer/pullRequestReducer";
import userReducer from "../reducer/userReducer";
import { createStore, combineReducers } from "redux";
import PropTypes from "prop-types";
import { Component } from "react";
import { render as rtlRender } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";

const reducer = combineReducers({
  sprints: sprintReducer,
  pullRequests: pullRequestReducer,
});
const store = createStore(reducer);
export function renderWP(
  ui,
  {
    preloadedState,
    store = configureStore({
      reducer: {
        sprints: sprintReducer,
        pullRequests: pullRequestReducer,
        user: userReducer,
      },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

export function getContext(storeData, dispatch, router) {
  const store = {
    subscribe(cb) {
      cb(storeData);
    },
    dispatch: (action) => {
      return Promise.resolve(action);
    },
    getState() {
      return storeData;
    },
  };

  if (dispatch) {
    store.dispatch = dispatch;
  }

  if (!router) {
    // eslint-disable-next-line no-param-reassign
    router = {
      push: () => {},
      createHref: () => {},
      isActive: () => {},
      replace: () => {},
    };
  }

  return {
    context: {
      store,
      addAlertNew: () => null,
      socket: {
        on: function () {},
        off: function () {},
        close: function () {},
        emit: function () {},
      },
      router,
    },
    childContextTypes: {
      store: PropTypes.object.isRequired,
      addAlertNew: PropTypes.func,
      socket: PropTypes.object,
      router: PropTypes.object,
    },
  };
}

export const mockToken =
  '{"access_token":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik16bERNemsxTVRoRlFVRTJRa0ZGT0VGRk9URkJOREJDTVRRek5EZzJSRVpDT1VKRFJrVXdNZyJ9.eyJodHRwczovL2F0bGFzc2lhbi5jb20vb2F1dGhDbGllbnRJZCI6Im1jVllUNHNsUDI1aEtVOXNBUGVudWoxVW5mOFFIZ2EyIiwiaHR0cHM6Ly9hdGxhc3NpYW4uY29tL2VtYWlsRG9tYWluIjoiY29uc3RydWN0Y29ubmVjdC5jb20iLCJodHRwczovL2F0bGFzc2lhbi5jb20vc3lzdGVtQWNjb3VudElkIjoiNjIwOTZhZWU1OTcwOTMwMDY5OGNlOGJjIiwiaHR0cHM6Ly9hdGxhc3NpYW4uY29tL3N5c3RlbUFjY291bnRFbWFpbERvbWFpbiI6ImNvbm5lY3QuYXRsYXNzaWFuLmNvbSIsImh0dHBzOi8vYXRsYXNzaWFuLmNvbS92ZXJpZmllZCI6dHJ1ZSwiaHR0cHM6Ly9hdGxhc3NpYW4uY29tL2ZpcnN0UGFydHkiOmZhbHNlLCJodHRwczovL2F0bGFzc2lhbi5jb20vM2xvIjp0cnVlLCJpc3MiOiJodHRwczovL2F0bGFzc2lhbi1hY2NvdW50LXByb2QucHVzMi5hdXRoMC5jb20vIiwic3ViIjoiYXV0aDB8NjAyZDNmNDUyYTQyY2MwMDY5ODY3ZTA0IiwiYXVkIjoiYXBpLmF0bGFzc2lhbi5jb20iLCJpYXQiOjE2NDg0ODkzMzcsImV4cCI6MTY0ODQ5MjkzNywiYXpwIjoibWNWWVQ0c2xQMjVoS1U5c0FQZW51ajFVbmY4UUhnYTIiLCJzY29wZSI6InJlYWQ6bWUifQ.Pqqzpurhne81Z-TDC8SqkgROxlgRBbxN6paKbZSHrsLU26W7q0CVh0_95qIw8CLzKISrsvTm51tu78pJg1AaXaxK9moorX0fXck5FsPdXYadu_gpaSDtJQmBhUE0xnteLYxLaOl735c9Rp2fL7oAFYZWtXVJ9Df0PebywlRmZmOseq5yqEL4v5wbXjrrbzKVzVbrmhoce5-Yt--xnGay5oNk2uKfcWcbh4V6CnVcHNgEJK_juojjJ9GTXlVp8Hk5hlhJifhu9FIVQTeSBxqsl8EvofXdVhO0Ve1uWcp-fJ-bUixuPEsWXGmDvpl_AjQlbIAUwAZHE2Lq6jjvuxNvkA","scope":"read:me","expires_in":3600,"token_type":"Bearer"}';

export const renderWithProvider =
  (CustomProvider = Provider) =>
  (Component, storeData = {}) => {
    const context = getContext(storeData);

    return render(
      <CustomProvider store={context.context.store}>{Component}</CustomProvider>
    );
  };

export const reRenderWithProvider =
  (rerender, CustomProvider = Provider) =>
  (Component, storeData = {}) => {
    const context = getContext(storeData);

    return rerender(
      <CustomProvider store={context.context.store}>{Component}</CustomProvider>
    );
  };
