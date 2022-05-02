import React, { PureComponent } from "react";
import "./PullRequestChart.css";
import { connect } from "react-redux";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, stroke, payload } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#666"
          transform="rotate(-45)"
        >
          {payload.value}
        </text>
      </g>
    );
  }
}

const renderLineChart = (data, indexSelected) => {
  return (
    <div className="pchartContainer">
      <label className="pspLabel">Pull Requests</label>
      {!indexSelected ? (
        <div className="noData">No Sprints Selected</div>
      ) : (
        <ResponsiveContainer className="responsive" width="95%" height={300}>
          <LineChart className="pchart" data={data}>
            <Line
              className="line"
              type="linear"
              dataKey="count"
              stroke="#8884d8"
              dot={{ stroke: "#8884d8", fill: "#8884d8" }}
              isAnimationActive={false}
            />
            <XAxis
              dataKey="name"
              height={125}
              tick={<CustomizedAxisTick />}
              tickLine={false}
              //   padding={{ left: 10 }}
              interval={0}
            />
            <YAxis tickCount={5} tick={[0, 5, 15, 25, 35]} tickLine={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
class PullRequestChart extends React.Component {
  render() {
    const { prBySprint, indexSelected } = this.props;
    const getSprintData = (pr, indexSelected) => {
      let selectedData = [];
      if (indexSelected.length === 0) {
        return selectedData;
      } else {
        selectedData.push(0);
        for (let i = 0; i < indexSelected.length; i++) {
          selectedData.push(pr[indexSelected[i]]);
        }
        selectedData.push(0);
        selectedData.push(0);
        return selectedData;
      }
    };
    return renderLineChart(
      getSprintData(prBySprint, indexSelected),
      indexSelected
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps)(PullRequestChart);
