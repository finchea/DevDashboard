/*
sprintName will look something like this 
    [
        [{name: "DOC-Sprint 84"}, {name: "DOC-Sprint 85"}, {name: "DOC-Sprint 86"}], 
        [{name: "DOC-Sprint 86"}, {name: "DOC-Sprint 88"}, {name: "DOC-Sprint 91"}], 
        [{name: "DOC-Sprint 88"}, {name: "DOC-Sprint 91"}, {name: "DOC-Sprint 95"}]
    ]
*/

export function getUniqueSprintName(sprintsArray) {
  let uniqueSprintName = [];

  sprintsArray.forEach((issues) =>
    issues.forEach((issue) => {
      if (
        uniqueSprintName.findIndex((sprint) => sprint.name === issue.name) ===
        -1
      ) {
        uniqueSprintName.push(issue);
      }
    })
  );

  return uniqueSprintName;
}

export function getPullRequestByDate(data, startDate, endDate) {
  let pullRequest = [];

  for (let index = 0; index < data.values.length; index++) {
    let date = new Date(data.values[index].created_on),
      month = "" + (date.getMonth() + 1),
      day = "" + date.getDate(),
      year = date.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    let d = [year, month, day].join("-");
    const obj = {
      createdOn: data.values[index].created_on,
      reason: data.values[index].reason,
      state: data.values[index].state,
      updatedOn: data.values[index].updated_on,
      title: data.values[index].title,
      id: data.values[index].id,
    };
    if (endDate !== "") {
      if (d <= endDate) {
        pullRequest.push(obj);
      }
    } else {
      pullRequest.push(obj);
    }
  }
  return pullRequest;
}
