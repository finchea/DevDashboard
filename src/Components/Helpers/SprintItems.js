import { guid } from "../Helpers/Guid";

export function GetSprintItems(data, user) {
  const sprintItems = new SprintItems();
  sprintItems.buildSprintItemsFromIssues(data.issues, user);
  return sprintItems;
}

export class SprintItem {
  constructor(otherItem) {
    if (otherItem) {
      this.issueName = otherItem.issueName;
      this.boardId = otherItem.boardId;
      this.state = otherItem.state;
      this.startDate = otherItem.startDate;
      this.endDate = otherItem.endDate;
      this.storyPoints = otherItem.storyPoints;
      this.name = otherItem.name;
      this.tickets = otherItem.tickets;
      this.displayName = otherItem.displayName;
      this.pullRequest = {
        count: otherItem.pullRequest.state,
        state: otherItem.pullRequest.state,
      };
    } else {
      this.storyPoints = 0;
      this.tickets = 0;
      this.pullRequest = {
        count: 0,
        state: undefined,
      };
    }

    this.uid = guid();
  }

  issueName;
  boardId;
  state;
  startDate;
  endDate;
  name;
  storyPoints;
  tickets;
  displayName;
}

export class SprintItems {
  constructor() {
    this.sprintItems = [];
  }

  buildSprintItemsFromIssues(issues, user) {
    issues.forEach((issue) => {
      if (issue) {
        this.addSprintItem(issue, user);
      }
    });
  }

  addSprintItem(issue, user) {
    if (
      issue.fields.issuetype.name === "Story" &&
      issue.fields.customfield_10010
    ) {
      const sprintInfo = issue.fields.customfield_10010[0];
      const sprintItem = new SprintItem();

      sprintItem.issueName = issue.key;
      sprintItem.boardId = sprintInfo.boardId;
      sprintItem.state = sprintInfo.state;
      sprintItem.startDate = new Date(sprintInfo.startDate);
      sprintItem.endDate = new Date(sprintInfo.endDate);
      sprintItem.name = sprintInfo.name;
      sprintItem.displayName = issue.fields.assignee?.displayName || null;

      if (issue.fields.customfield_10024) {
        if (sprintItem.displayName === user) {
          sprintItem.storyPoints = issue.fields.customfield_10024;
        } else {
          sprintItem.storyPoints = 0;
        }
      }

      if (
        !this.sprintItems.find((x) => x.issueName === sprintItem.issueName) &&
        sprintItem.displayName === user
      ) {
        this.sprintItems.push(sprintItem);
      }

      if (issue.fields.customfield_10000) {
        const index = issue.fields.customfield_10000.indexOf("json=");
        if (index > 0) {
          // extract the json from the cache string
          try {
            let jsonText = issue.fields.customfield_10000.slice(index + 5);
            jsonText = jsonText.slice(0, jsonText.length - 1);
            const json = JSON.parse(jsonText);

            sprintItem.pullRequest = {
              count: json?.cachedValue?.summary?.pullrequest?.overall?.count,
              state: json?.cachedValue?.summary?.pullrequest?.overall?.state,
            };
          } catch (e) {
            console.error(`Failed to get pull request info ${e}`);
          }
        }
      }
      this.sprintItems.push(sprintItem);
    }
  }

  getAllSprintItems() {
    return this.sprintItems;
  }

  getUniqueSprintItems(user) {
    const sprintItems = [];
    const ticketNumberList = [];
    const duplicate = [];

    for (let i = 0; i < this.sprintItems.length; i++) {
      const sprintItem = this.sprintItems[i];
      sprintItem.sum = 0;
      let existingSprintItem = sprintItems.find(
        (x) => x.name === sprintItem.name
      );
      if (!ticketNumberList.includes(sprintItem.issueName)) {
        ticketNumberList.push(sprintItem.issueName);
      } else {
        duplicate.push(sprintItem.issueName);
      }

      if (!existingSprintItem) {
        existingSprintItem = new SprintItem(sprintItem);
        existingSprintItem.tickets = 1;
        sprintItems.push(existingSprintItem);
      } else if (
        existingSprintItem &&
        !duplicate.includes(sprintItem.issueName)
      ) {
        if (existingSprintItem.displayName === user) {
          if (sprintItem.startDate < existingSprintItem.startDate) {
            existingSprintItem.startDate = sprintItem.startDate;
          }
          if (sprintItem.endDate > existingSprintItem.endDate) {
            existingSprintItem.endDate = sprintItem.endDate;
          }

          existingSprintItem.storyPoints += sprintItem.storyPoints;
          existingSprintItem.tickets += 1;
        }
      }
    }
    return sprintItems.sort(function (a, b) {
      return new Date(a.startDate) - new Date(b.startDate);
    });
  }
}
