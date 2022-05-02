import React, { forwardRef } from "react";
import "./DateRange.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faXmark } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import GetHttp from "../Helpers/Http";
import { GetSprintItems } from "../Helpers/SprintItems";
import { getPullRequestByDate } from "../util";
import { connect } from "react-redux";

class DateRange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultSearchText: "status changed to 'In Development' by currentUser()",
      searchFailedText: undefined,
      startDate: "",
      endDate: "",
      isButtonDisabled: true,
      updatePullRequest: false,
      num: 0,
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    const {
      sprintPage,
      sprintSummary,
      sprintSummaryData,
      pullRequestPage,
      pullRequest,
    } = this.props;
    const { sprintSummary: prevSprintSummary, pullRequest: prevPullRequest } =
      prevProps;
    const { startDate, endDate, updatePullRequest } = this.state;
    if (prevState.startDate !== startDate || prevState.endDate !== endDate) {
      this.validateInput();
    }

    if (
      ((pullRequest.length !== 0 && prevPullRequest.length === 0) ||
        (sprintSummary.length !== 0 && prevSprintSummary.length === 0)) &&
      pullRequest.length !== 0 &&
      sprintSummary.length !== 0
    ) {
      var today = this.formatDate(new Date(), "");
      let day = "";
      if (endDate !== "") {
        day = endDate;
      } else {
        day = today;
      }
      let num = pullRequestPage.total / pullRequestPage.pageLen;
      this.setState({ num: num });
      let page = 2;
      if (num > 1) {
        while (page <= Math.ceil(num)) {
          this.getPullRequestInfo(startDate, day, num, page);
          page++;
        }
      }
    }
    if (updatePullRequest === true) {
      this.getPullRequestCountBySprint(sprintSummaryData, pullRequest);
    }
  };

  getPullRequestCountBySprint = (sprintSummary, pullRequest) => {
    let prBySprint = [];
    for (let index = 0; index < sprintSummary.length; index++) {
      let prCount = [];
      for (let i = 0; i < pullRequest.length; i++) {
        if (
          this.formatDate(sprintSummary[index].startDate, "") <=
            this.formatDate(pullRequest[i].createdOn, "") &&
          this.formatDate(pullRequest[i].createdOn, "") <=
            this.formatDate(sprintSummary[index].endDate, "")
        ) {
          prCount.push(pullRequest[i]);
        }
      }
      const obj = {
        name: sprintSummary[index].name,
        count: prCount.length,
      };
      prBySprint.push(obj);
    }
    this.props.dispatch({ type: "PULL_REQUEST_COUNT", prBySprint });
  };

  getNewSprintInfo() {
    const { startDate, endDate, num } = this.state;
    this.props.dispatch({ type: "CLEAR_SPRINT_REDUCER" });
    this.props.dispatch({ type: "CLEAR_PULLREQUEST_REDUCER" });
    const startAt = 0;
    this.getSprintInfo(startAt);
    this.getPullRequestInfo(startDate, endDate, num);
  }

  getPullRequestInfo(startDate, endDate, num, page = 1) {
    this.setState({ updatePullRequest: false });
    const { pullRequestPage, user } = this.props;
    if (page === 1) {
      this.props.dispatch({ type: "REQUEST_PULLREQUEST_INFO" });
    }
    const name = user.split(" ").join("");
    const http = GetHttp("PullRequest");
    http
      .get(
        `https://api.bitbucket.org/2.0/pullrequests/${name}/?state=MERGED&pagelen=50&q=created_on>${startDate}&sort=created_on&page=${page}`
      )
      .then((response) => {
        const jsonData = JSON.parse(response);
        const pullRequestInfo = getPullRequestByDate(
          jsonData,
          startDate,
          endDate
        );
        let isLoading = false;
        if (jsonData.page === 1) isLoading = true;
        this.props.dispatch({
          type: "GET_PULLREQUEST_SUCCESS",
          results: {
            pullRequestInfo,
            pullRequestPage: {
              page: jsonData.page,
              total: jsonData.size,
              pageLen: jsonData.pagelen,
            },
            isLoading,
          },
        });
      });
    if (page === 1 && pullRequestPage.total <= 50) {
      this.setState({ updatePullRequest: true });
    } else if (page > 1 && page === Math.ceil(num)) {
      this.setState({ updatePullRequest: true });
    }
  }

  getSprintInfo(startAt) {
    const { sprintPage, sprintSummary, user } = this.props;

    this.setState({
      searchSuccessText: undefined,
      searchFailedText: undefined,
    });
    this.props.dispatch({ type: "REQUEST_SPRINT_INFO", sprintSummary });
    const { defaultSearchText, startDate, endDate } = this.state;
    let searchText = defaultSearchText;
    if (startDate && !endDate) {
      searchText += " after " + startDate;
    } else if (startDate && endDate) {
      searchText += " during (' " + startDate + "','" + endDate + "') ";
    } else if (!startDate && endDate) {
      searchText += " before " + endDate;
    }
    const params = {
      jql: searchText,
      expand: "changelog",
      startAt: startAt,
      maxResults: 50,
    };

    const http = GetHttp();
    http
      .get("https://constructconnect.atlassian.net/rest/api/3/search", params)
      .then((response) => {
        const jsonData = JSON.parse(response);
        this.sprintItems = GetSprintItems(jsonData, user);
        const sprintSummaryInfo = this.sprintItems.getUniqueSprintItems(user);
        const totalSprintIssue = jsonData.total;
        this.props.dispatch({
          type: "GET_SPRINT_SUCCESS",
          results: {
            sprintSummaryInfo,
            totalSprintIssue,
            startAt,
          },
        });

        while (startAt + 50 < jsonData.total) {
          startAt = startAt + 50;
          this.getSprintInfo(startAt);
        }
      })
      .catch((e) => {
        const msg = e ? e.message : "Failed to execute query";
        this.setState({ searchFailedText: msg });
        this.props.dispatch({ type: "GET_SPRINT_FAIL" });
      });
  }

  validateInput = () => {
    const { startDate, endDate } = this.state;
    let dateformat = /^\d{4}-\d{2}-\d{2}$/;
    if (
      (startDate.match(dateformat) && endDate === "") ||
      (startDate === "" && endDate.match(dateformat))
    ) {
      this.setState({ isButtonDisabled: false });
    } else if (startDate.match(dateformat) && endDate.match(dateformat)) {
      let e = new Date(endDate);
      let s = new Date(startDate);
      if (e.getTime() >= s.getTime()) {
        this.setState({ isButtonDisabled: false });
      } else {
        this.setState({ isButtonDisabled: true });
      }
    } else this.setState({ isButtonDisabled: true });
  };

  onDateChange = (e) => {
    if (e.type === "From") {
      this.setState({
        startDate: e.value,
      });
    }
    if (e.type === "To") {
      this.setState({
        endDate: e.value,
      });
    }
  };

  clearInput = (label) => {
    if (label === "From") {
      this.setState({ startDate: "" });
    }
    if (label === "To") {
      this.setState({ endDate: "" });
    }
  };

  formatDate(date, type) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (type === "From" || type === "To") {
      this.onDateChange({
        type,
        value: [year, month, day].join("-"),
      });
    } else {
      return [year, month, day].join("-");
    }
  }

  selected = () => {
    this.setState({ isSelected: true });
  };

  input = (label) => {
    const CustomInput = forwardRef(({ onClick }, ref) => (
      <div className="input">
        <div className="calendarIcon">
          <FontAwesomeIcon
            data-testid={`dateCalendar${label}`}
            icon={faCalendar}
            className="calendar"
            onClick={onClick}
          />
        </div>
      </div>
    ));
    return <CustomInput />;
  };

  render() {
    const { isMobile } = this.props;
    const { startDate, endDate } = this.state;

    let beginDate =
      new Date(startDate).toString() !== "Invalid Date"
        ? new Date(startDate)
        : "";
    let endingDate =
      new Date(endDate).toString() !== "Invalid Date" ? new Date(endDate) : "";
    const input = [
      {
        label: "From",
        date: startDate,
        dateString: "startDate",
        dateSelected: beginDate,
        index: 0,
        num: 2,
      },
      {
        label: "To",
        date: endDate,
        dateString: "endDate",
        dateSelected: endingDate,
        index: 1,
        num: 3,
      },
    ];
    return (
      <div className="dateRangeContainer">
        <div className="dates">
          <label className="dateRange">Date Range:</label>
          <div className="datePickerContainer">
            <div className="datePicker">
              {input.map((input, i) => {
                const v = input.dateString;
                return (
                  <div key={input.index} className="inputArea">
                    <label className={"label" + input.label}>
                      {input.label}
                    </label>
                    <input
                      data-testid={`input${input.label}`}
                      name={input.label}
                      id={input.label}
                      className={"input" + input.label}
                      onChange={(value) =>
                        this.onDateChange({
                          type: input.label,
                          value: value.target.value,
                        })
                      }
                      value={this.state[v]}
                      placeholder="yyyy-mm-dd"
                    />
                    {input.date !== "" && (
                      <span
                        className={"x" + input.label}
                        data-testid={`clear${input.label}`}
                        onClick={() => this.clearInput(input.label)}
                      >
                        <FontAwesomeIcon
                          data-testid={`clearIcon${input.label}`}
                          icon={faXmark}
                          className={"clearIcon" + input.label}
                        />
                      </span>
                    )}
                    <DatePicker
                      selected={input.dateSelected}
                      onChange={(date) => this.formatDate(date, input.label)}
                      customInput={this.input(input.label)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <button
          className={classNames("loadBtn", {
            ["disabledBtn"]: this.state.isButtonDisabled,
            ["loading"]: this.props.prisLoading || this.props.isLoading,
          })}
          onClick={() => this.getNewSprintInfo()}
          disabled={
            this.state.isButtonDisabled ||
            (this.props.prisLoading && this.props.isLoading)
          }
        >
          {isMobile ? "Search" : "Click to Load"}
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sprintSummary: state.sprints.sprintSummary,
    isLoading: state.sprints.isLoading,
    sprintPage: state.sprints.sprintPage,
    total: state.sprints.total,
    pullRequest: state.pullRequests.pullRequest,
    prisLoading: state.pullRequests.prisLoading,
    pullRequestPage: state.pullRequests.pullRequestPage,
    user: state.user.user,
  };
};

export default connect(mapStateToProps)(DateRange);
