/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render, screen } from "@testing-library/react";
import { LocalStorageMock } from "@react-mock/localstorage";
import App from "../App";
import { mockToken } from "./utiltest";
import { act } from "react-dom/test-utils";

describe("When navigating to the page", () => {
  it("should display Login button if user is not authenticated or token does not exist", () => {
    const view = render(
      <LocalStorageMock items={{ token: "" }}>
        <App />
      </LocalStorageMock>
    );
    const homePage = view.container.querySelector(".home");
    expect(homePage).not.toBeInTheDocument();
    expect(view.container.getElementsByClassName(".home").length).toBe(0);

    const btn = view.container.querySelector(".authButton");
    expect(btn).toBeInTheDocument();

    expect(view.getByRole("button")).toBeInTheDocument();
  });

  it("should not display Login button if user is authenticated", () => {
    const view = render(
      <LocalStorageMock items={{ token: mockToken }}>
        <App />
      </LocalStorageMock>
    );
    expect(view.getAllByRole("homePage").length).toBe(1);
    expect(view.getByRole("homePage")).toBeInTheDocument();
    const btn = view.container.querySelector(".authButton");
    expect(btn).not.toBeInTheDocument();
  });
});

describe("When clicking on the logout button", () => {
  it("should not contain token in the localStorage", () => {
    const view = render(
      <LocalStorageMock items={{ token: mockToken }}>
        <App />
      </LocalStorageMock>
    );
    const logoutBtn = view.container.querySelector(".logoutBtn");

    act(() => {
      logoutBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(window.localStorage).toMatchObject({});
  });
});
