/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import { fireEvent, render, screen } from "@testing-library/react";
import PaginationFooter from "../Components/PaginationFooter/PaginationFooter";
import { renderWithProvider, renderWP } from "./utiltest";
import { act } from "react-dom/test-utils";

const props = {
  sprintSummary: [],
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

describe("When receiving sprint data", () => {
  it("should disable nextPage chevron if it is last page", () => {
    const view = renderWP(<PaginationFooter />, {
      ...props,
      page: { ...props.page, startAt: 10, total: 50 },
    });
    const nextPage = screen.getByTestId("rightChevron");
    expect(nextPage).toHaveClass("disabledArrow");
  });
  it("should disable prevPage chevron if it is first page", () => {
    const view = renderWP(<PaginationFooter />, {
      ...props,
      page: { ...props.page, total: 50 },
    });
    const prevPage = screen.getByTestId("leftChevron");
    expect(prevPage).toHaveClass("disabledArrow");
  });
  it("should enable prevPage chevron if it is not first page", () => {
    const view = renderWP(<PaginationFooter />, {
      ...props,
      page: { ...props.page, startAt: 50 },
    });
    const prevPage = screen.getByTestId("leftChevron");
    expect(prevPage).not.toHaveClass("disabledArrow");
  });
});
