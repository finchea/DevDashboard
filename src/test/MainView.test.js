/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { fireEvent, render, screen } from "@testing-library/react";
import MainView from "../Components/MainView/MainView";
import { renderWithProvider, renderWP } from "./utiltest";
import { act } from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

const props = {
  sprintSummary: [],
  isLoading: false,
  page: {
    maxResults: 50,
    startAt: 0,
    total: 0,
  },
};

describe("When navigating to the MainView page", () => {
  it("should render two input fields", () => {
    const view = renderWP(<MainView />, props);
    expect(view.getAllByRole("textbox").length).toBe(2);
  });

  it("should not display clear icons", () => {
    const view = renderWP(<MainView />, props);
    const clearIconFrom = view.container.querySelector(".clearIconFrom");
    const clearIconTo = view.container.querySelector(".clearIconTo");

    expect(clearIconFrom).not.toBeInTheDocument();
    expect(clearIconTo).not.toBeInTheDocument();
  });

  it("should clear input when X is clicked", () => {
    const view = renderWP(<MainView />, props);
    userEvent.type(view.container.querySelector(".inputFrom"), "12345");
    userEvent.type(view.container.querySelector(".inputTo"), "12345");
    const clearFrom = screen.getByTestId("clearFrom");
    const clearTo = screen.getByTestId("clearTo");

    act(() => {
      clearFrom.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      clearTo.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(view.container.querySelector(".inputFrom")).toHaveValue("");
    expect(view.container.querySelector(".inputTo")).toHaveValue("");
  });

  it("should display button that is disabled", () => {
    const view = renderWP(<MainView />, props);
    const loadBtn = view.container.querySelector(".loadBtn");
    expect(loadBtn).toBeInTheDocument();
    expect(loadBtn).toBeDisabled();
  });

  describe("When passing dates to the From Input and To Input", () => {
    it("should enable the button if input is valid", () => {
      const view = renderWP(<MainView />, props);

      const calendarFrom = screen.getByTestId("dateCalendarFrom");

      act(() => {
        calendarFrom.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      });
      var days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      var today = new Date();
      var dayName = days[today.getDay()];
      var monthName = months[today.getMonth()];
      const targetDateElement = screen.getByLabelText(
        "Choose " +
          dayName +
          ", " +
          monthName +
          " " +
          today.getDate() +
          "th, " +
          today.getFullYear()
      );
      act(() => {
        targetDateElement.dispatchEvent(
          new MouseEvent("click", { bubbles: true })
        );
      });

      const loadBtn = view.container.querySelector(".loadBtn");
      expect(loadBtn).toBeInTheDocument();
      expect(loadBtn).toBeEnabled();
    });
  });
});
