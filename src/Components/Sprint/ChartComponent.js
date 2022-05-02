import React, { PureComponent } from "react";
import "./ChartComponent.css";
import { connect } from "react-redux";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
class CustomizedAxisTick extends PureComponent {
  render() {
    const { x, y, payload } = this.props;

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#666"
          transform="rotate(-40)"
        >
          {payload.value}
        </text>
      </g>
    );
  }
}

const renderLineChart = (data, label, dataKey, list) => {
  return (
    <div className="chartContainer">
      <label className="spLabel">{label}</label>

      {data.length === 0 ? (
        <div className="noData">No Sprints Selected</div>
      ) : (
        <ResponsiveContainer className="responsive" width="95%" height={300}>
          <LineChart
            className="chart"
            data={data}
            margin={{ top: 30, right: 15, bottom: 5, left: 7 }}
          >
            <Line
              className="line"
              type="linear"
              dataKey={dataKey}
              stroke="#8884d8"
              dot={{ stroke: "#8884d8", fill: "#8884d8" }}
              isAnimationActive={false}
            />
            <XAxis
              dataKey="name"
              height={150}
              tick={<CustomizedAxisTick />}
              tickLine={false}
              //   padding={{ left: 10 }}
              interval={0}
            />
            <YAxis tickCount={5} ticks={list} tickLine={false} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};
class StoryPointChart extends React.Component {
  render() {
    const { data, label, dataKey, list, indexSelected } = this.props;
    const getSprintData = (data, indexSelected) => {
      let selectedData = [];
      if (indexSelected.length === 0) {
        return selectedData;
      } else {
        selectedData.push(0);
        for (let i = 0; i < indexSelected.length; i++) {
          selectedData.push(data[indexSelected[i]]);
        }
        selectedData.push(0);
        selectedData.push(0);
        return selectedData;
      }
    };

    return renderLineChart(
      getSprintData(data, indexSelected),
      label,
      dataKey,
      list
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};
export default connect(mapStateToProps)(StoryPointChart);
