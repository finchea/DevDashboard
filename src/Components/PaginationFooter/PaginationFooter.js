import React from "react";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faL,
} from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import "./PaginationFooter.css";

class PaginationFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prevDisabled: false,
      nextDisabled: false,
    };
  }

  onArrowClick = (e) => {
    const { onPageArrowClick } = this.props;
    onPageArrowClick(e.type);
  };

  componentDidMount = () => {
    const {
      sprintPage: { startAt, maxResults, total },
    } = this.props;
    if (startAt === 0) {
      this.setState({ prevDisabled: true });
    }
    if (startAt + 50 >= total) {
      this.setState({ nextDisabled: true });
    } else this.setState({ nextDisabled: false });
  };

  componentDidUpdate = (prevProps, prevState) => {
    const {
      sprintPage: { startAt, total },
      sprintSummary,
    } = this.props;
    if (startAt === 0 && this.state.prevDisabled === false) {
      this.setState({ prevDisabled: true });
    }
    if (startAt > 0 && this.state.prevDisabled === true) {
      this.setState({ prevDisabled: false });
    }
    if (startAt + 50 >= total && startAt !== prevProps.sprintPage.startAt) {
      this.setState({ nextDisabled: true });
    }
    if (startAt + 50 < total && startAt !== prevProps.sprintPage.startAt) {
      this.setState({ nextDisabled: false });
    }
  };

  render() {
    let disabledClass = "disabledArrow";
    return (
      <div className="footerContainer">
        <FontAwesomeIcon
          className={classNames("arrowClass", {
            [disabledClass]: this.state.prevDisabled,
          })}
          icon={faChevronLeft}
          onClick={() =>
            !this.state.prevDisabled && this.onArrowClick({ type: "PREV" })
          }
          data-testid={`leftChevron`}
        />
        <FontAwesomeIcon
          className={classNames("arrowClass", {
            [disabledClass]: this.state.nextDisabled,
          })}
          icon={faChevronRight}
          onClick={() =>
            !this.state.nextDisabled && this.onArrowClick({ type: "NEXT" })
          }
          data-testid={`rightChevron`}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    sprintSummary: state.sprints.sprintSummary,
    sprintPage: state.sprints.sprintPage,
    total: state.sprints.total,
  };
};
export default connect(mapStateToProps)(PaginationFooter);
