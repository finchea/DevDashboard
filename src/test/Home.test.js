/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { render, screen } from "@testing-library/react";
import Home from "../Components/Home/Home";
import { renderWithProvider, renderWP, reRenderWithProvider } from "./utiltest";

const props = {
  sprintSummary: [],
  pullRequest: [],
  isLoading: false,
  page: {
    maxResults: 50,
    startAt: 0,
    total: 0,
  },
};

const sprintSummaryData = [
  {
    issueName: "IAM-9659",
    name: "IAM - 22.P1.2",
    startDate: "Date Wed Feb 16 2022 08:00:35 GMT-0600 (Central Standard Time)",
    endDate: "Date Wed Mar 02 2022 08:47:00 GMT-0600 (Central Standard Time)",
    storyPoints: 16,
  },
];

const PullRequestData = [
  {
    page: 1,
    pagelen: 50,
    size: 7,
    values: [{}],
  },
];

describe("When navigating to the Home page", () => {
  it("should display logout button", () => {
    const view = renderWP(<Home />, props);
    const logoutBtn = view.container.querySelector(".logoutBtn");
    expect(logoutBtn).toBeInTheDocument();
  });

  it("should not render sprint checkbox and sprint chart if no data is present", () => {
    const view = renderWP(<Home />, props);

    const checkBox = view.container.querySelector(".checkBoxContainer");
    expect(checkBox).not.toBeInTheDocument();
    const chart = view.container.querySelector(".chartContainer");
    expect(chart).not.toBeInTheDocument();
  });

  it("should render sprint checkbox and sprint chart if data is present", () => {
    const mockProps = { ...props };
    mockProps.sprintSummary.push(sprintSummaryData);
    mockProps.pullRequest.push(PullRequestData);
    const view = renderWP(<Home mockProps />);
    screen.debug();
    const checkBox = view.container.querySelector(".checkBoxContainer");
    expect(checkBox).toBeInTheDocument();
    const chart = view.container.querySelector(".chartContainer");
    expect(chart).toBeInTheDocument();
  });
});
