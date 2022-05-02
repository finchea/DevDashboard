const initialState = {
  sprintSummary: [],
  isLoading: false,
  sprintPage: {
    maxResults: 50,
    startAt: 0,
    total: 0,
  },
};

export default function sprintReducer(state = initialState, action) {
  if (action.type === "GET_SPRINT_SUCCESS") {
    const sprintsArray = [...state.sprintSummary];
    sprintsArray.push(action.results.sprintSummaryInfo);
    // let isLoading = true;
    // if (action.results.startAt + 50 >= action.results.totalSprintIssue) {
    //   isLoading = false;
    // }
    return {
      ...state,
      isLoading: false,
      sprintSummary: sprintsArray,
      sprintPage: {
        ...state.sprintPage,
        total: action.results.totalSprintIssue,
      },
    };
  }
  if (action.type === "REQUEST_SPRINT_INFO") {
    return {
      ...state,
      isLoading: true,
    };
  }
  if (action.type === "GET_SPRINT_FAIL") {
    return {
      ...state,
      isLoading: false,
    };
  }
  if (action.type === "PAGE_NEXT") {
    let num = state.sprintPage.startAt + 50;
    return {
      ...state,
      sprintPage: { ...state.sprintPage, startAt: num },
    };
  }
  if (action.type === "PAGE_PREV") {
    if (state.sprintPage.startAt < 50) {
      return { ...state, sprintPage: { ...state.sprintPage } };
    } else {
      let num = state.sprintPage.startAt - 50;
      let newSprintSummary = [];
      const array = [...state.sprintSummary];
      array.splice(array.indexOf(array.length - 1), 1);
      newSprintSummary = [...array];
      return {
        ...state,
        sprintSummary: newSprintSummary,
        sprintPage: { ...state.sprintPage, startAt: num },
      };
    }
  }
  if (action.type === "CLEAR_SPRINT_REDUCER") {
    return initialState;
  }

  return state;
}
