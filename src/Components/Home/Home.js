/* eslint-disable jsx-a11y/aria-role */
import React from "react";
import "./Home.css";
import { connect } from "react-redux";
import User from "../User/User";
import DateRange from "../DateRange/DateRange";
import MainView from "../MainView/MainView";
import SprintFilter from "../Sprint/SprintFilter";
import ChartComponent from "../Sprint/ChartComponent";
import PullRequestChart from "../PullRequestChart/PullRequestChart";
import { getUniqueSprintName } from "../util";
import Spinner from "react-bootstrap/Spinner";
import "bootstrap/dist/css/bootstrap.css";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndexes: [],
      uniqueSprintNameList: [],
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { sprintSummary } = this.props;
    if (
      prevProps.sprintSummary.length !== sprintSummary.length &&
      sprintSummary.length !== 0
    ) {
      const defaultSelectedIndex = [];
      const uniqueSprintName = getUniqueSprintName(sprintSummary);
      for (let index = 0; index < uniqueSprintName.length; index++) {
        defaultSelectedIndex.push(index);
      }
      this.setState({
        selectedIndexes: defaultSelectedIndex,
        uniqueSprintNameList: uniqueSprintName,
      });
    }
  };

  onSprintSelect = (index) => {
    const indexArray = [...this.state.selectedIndexes];
    if (indexArray.includes(index)) {
      indexArray.splice(indexArray.indexOf(index), 1);
    } else {
      indexArray.push(index);
    }
    indexArray.sort();
    this.setState({
      selectedIndexes: indexArray,
    });
  };

  logout = () => {
    localStorage.removeItem("token");
    window.location = `http://localhost:3000`;
  };

  render() {
    const { selectedIndexes } = this.state;
    const {
      isLoading,
      sprintSummary,
      prBySprint,
      prisLoading,
      pullRequest,
      pullRequestPage,
      user,
    } = this.props;
    const storyPointList = [0, 2, 4, 8, 12];
    const pullRequestList = [0, 5, 10, 15, 20];
    return (
      <div className="home" role="homePage">
        <div className="header">
          <User user={user} />

          <MainView sprintSummaryData={this.state.uniqueSprintNameList} />
          <button className="logoutBtn" onClick={this.logout}>
            Logout
          </button>
        </div>
        {(isLoading && prisLoading) ||
        (!isLoading && prisLoading) ||
        (isLoading && !prisLoading) ? (
          <div className="spinnerDiv">
            <Spinner animation="border" role="status"></Spinner>
            <div>Loading...</div>
          </div>
        ) : (
          sprintSummary.length !== 0 &&
          pullRequest.length !== 0 &&
          pullRequest.length === pullRequestPage.total && (
            <div>
              <SprintFilter
                onSprintSelect={this.onSprintSelect}
                indexSelected={selectedIndexes}
                sprintSummary={this.state.uniqueSprintNameList}
              />
              <ChartComponent
                indexSelected={selectedIndexes}
                data={this.state.uniqueSprintNameList}
                label="Story Points"
                dataKey="storyPoints"
                list={storyPointList}
              />
              {prBySprint.length !== 0 &&
                pullRequest.length === pullRequestPage.total &&
                pullRequest.length !== 0 && (
                  <ChartComponent
                    indexSelected={selectedIndexes}
                    data={prBySprint}
                    label="Pull Requests"
                    dataKey="count"
                    list={pullRequestList}
                  />
                )}
              <label className="signature">Ethan Finch</label>
            </div>
          )
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sprintSummary: state.sprints.sprintSummary,
    isLoading: state.sprints.isLoading,
    pullRequest: state.pullRequests.pullRequest,
    prisLoading: state.pullRequests.prisLoading,
    prBySprint: state.pullRequests.prBySprint,
    pullRequestPage: state.pullRequests.pullRequestPage,
    user: state.user.user,
  };
};
export default connect(mapStateToProps)(Home);
