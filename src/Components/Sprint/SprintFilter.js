import React from "react";
import "./SprintFilter.css";
import { connect } from "react-redux";
import PaginationFooter from "../PaginationFooter/PaginationFooter";
import { getUniqueSprintName } from "../util";
class SprintFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  //componentDidUpdate() {}

  getCheckedStatus = (i) => {
    const { indexSelected } = this.props;
    if (indexSelected.includes(i)) {
      return true;
    }
    return false;
  };

  onPageArrowClick = (value) => {
    if (value === "NEXT") {
      this.props.dispatch({ type: "PAGE_NEXT" });
    }
    if (value === "PREV") {
      this.props.dispatch({ type: "PAGE_PREV" });
    }
  };

  render() {
    const { sprintSummary, isLoading } = this.props;
    let sprints = sprintSummary.map((issue, i) => {
      return (
        <label key={i} className="labels">
          <input
            type="checkbox"
            className="check"
            checked={this.getCheckedStatus(i)}
            onClick={() => this.props.onSprintSelect(i)}
            onChange={() => onclick}
          />
          {issue.name}
        </label>
      );
    });
    return (
      <div className="checkBoxContainer">
        <label>Sprints:</label>
        <div className="checkBox">{sprints}</div>
        {/* <PaginationFooter onPageArrowClick={this.onPageArrowClick} /> */}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    isLoading: state.isLoading,
  };
};
export default connect(mapStateToProps)(SprintFilter);
