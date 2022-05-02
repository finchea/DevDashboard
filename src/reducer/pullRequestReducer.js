const initialState = {
  pullRequest: [],
  prBySprint: [],
  prisLoading: false,
  pullRequestPage: {
    page: 0,
    total: 0,
    pageLen: 50,
  },
};

export default function pullRequestReducer(state = initialState, action) {
  if (action.type === "GET_PULLREQUEST_SUCCESS") {
    const pullrequestsArray = [...state.pullRequest];
    let pullRequests = pullrequestsArray.concat(action.results.pullRequestInfo);
    let isLoading = action.results.isLoading;
    if (
      Math.ceil(
        action.results.pullRequestPage.total /
          action.results.pullRequestPage.pageLen
      ) === action.results.pullRequestPage.page
    ) {
      isLoading = false;
    }
    // if (state.prisLoading === false) {
    //   state.prisLoading = false;
    // } else {
    //   state.prisLoading = true;
    // }

    // if (
    //   action.results.pullRequestPage.page === 1 &&
    //   action.results.pullRequestPage.total <= 50
    // ) {
    //   state.prisLoading = false;
    // }
    // if (
    //   action.results.pullRequestPage.page ===
    //   Math.ceil(
    //     action.results.pullRequestPage.total /
    //       action.results.pullRequestPage.pageLen
    //   )
    // ) {
    //   state.prisLoading = false;
    // }

    return {
      ...state,
      pullRequest: pullRequests,
      prisLoading: isLoading,
      pullRequestPage: {
        page: action.results.pullRequestPage.page,
        total: action.results.pullRequestPage.total,
        pageLen: action.results.pullRequestPage.pageLen,
      },
    };
  }
  if (action.type === "REQUEST_PULLREQUEST_INFO") {
    return {
      ...state,
      prisLoading: true,
    };
  }
  if (action.type === "PULL_REQUEST_COUNT") {
    return {
      ...state,
      prBySprint: action.prBySprint,
    };
  }
  if (action.type === "CLEAR_PULLREQUEST_REDUCER") {
    return initialState;
  }
  return state;
}
