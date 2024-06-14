import { SET_SEARCHHISTORY } from '../actions';

const initialState = {
  searchHistory: [],
};
function searchReducer(state = initialState, action) {
  switch (action.type) {
    case SET_SEARCHHISTORY:
      return { ...state, searchHistory: action.payload };
    default:
      return state;
  }
}
export default searchReducer;
