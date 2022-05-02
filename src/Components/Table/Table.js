import React from "react";
import "./Table.css";
import Table from "react-bootstrap/Table";
import { header, tableData } from "../../data";

class StoryTable extends React.Component {
  createRow = (item, columnName) => {
    if (columnName === "Type") {
      if (item.Type === "Feature") {
        return <th className="greenDot"></th>;
      } else {
        return <th className="redDot"></th>;
      }
    } else {
      if (!item[columnName]) return <th> </th>;
      return <th className="column">{item[columnName]}</th>;
    }
  };
  render() {
    return (
      <div className="tableContainer">
        <label>Tickets</label>
        <Table className="table">
          <thead>
            <tr>
              {header.map((item, index) => {
                return (
                  <th className="header" key={header[index].toString()}>
                    {header[index]}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="body">
            {tableData.map((item, index) => {
              return (
                <tr className="rows">
                  {header.map((column, index) => {
                    return this.createRow(item, column);
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default StoryTable;
