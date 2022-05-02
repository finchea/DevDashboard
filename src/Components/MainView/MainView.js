import React from "react";
import "./MainView.css";
import { connect } from "react-redux";
import GetHttp from "../Helpers/Http";
import { GetSprintItems } from "../Helpers/SprintItems";
import DateRange from "../DateRange/DateRange";
import classNames from "classnames";

class MainView extends React.Component {
  constructor(props) {
    super(props);

    this.searchText = React.createRef();
    this.sprintItems = [];
    this.state = {
      defaultSearchText: "status changed to 'In Development'",
      searchFailedText: undefined,
      isMobile: true,
    };
  }

  componentDidMount = () => {
    if (window.innerWidth < 768) {
      this.setState({ isMobile: true });
    }
    if (window.innerWidth >= 768) {
      this.setState({ isMobile: false });
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { isMobile } = this.state;

    if (window.innerWidth < 768 && isMobile === false) {
      this.setState({ isMobile: true });
    }
    if (window.innerWidth >= 768 && isMobile === true) {
      this.setState({ isMobile: false });
    }
  };

  renderFailure(data) {
    return <div className="failureText">{data}</div>;
  }

  render() {
    const { searchFailedText, isMobile } = this.state;
    const { sprintSummaryData, isLoading, page, total } = this.props;
    return (
      <div className="mainview">
        <div className="searchArea">
          <DateRange
            isMobile={isMobile}
            sprintSummaryData={sprintSummaryData}
          />
        </div>
        {searchFailedText && this.renderFailure(searchFailedText)}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoading: state.isLoading,
    total: state.total,
  };
};

export default connect(mapStateToProps)(MainView);
