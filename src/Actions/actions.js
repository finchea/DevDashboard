export const getSprints = (results) => {
  return {
    type: "GET_SPRINT_SUCCESS",
    payload: results,
  };
};

export const deleteSprints = (sprintSummary) => {
  return {
    type: "REQUEST_SPRINT_INFO",
    payload: sprintSummary,
  };
};

export const getPullRequests = (results) => {
  return {
    type: "GET_PULLREQUEST_SUCCESS",
    payload: results,
  };
};

export const getPRCountBySprint = (prBySprint) => {
  return {
    type: "PULL_REQUEST_COUNT",
    payload: prBySprint,
  };
};
