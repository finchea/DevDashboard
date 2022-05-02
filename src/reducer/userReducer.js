const initialState = {
  user: "James Higgins",
  email: "james.higgins@constructconnect.com",
};

export default function sprintReducer(state = initialState, action) {
  if (action.type === "REQUEST_USER_INFO") {
    return {
      ...state,
    };
  }
  return state;
}
