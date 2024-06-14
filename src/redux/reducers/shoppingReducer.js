import {SET_CART, SET_SEARCHLISTTITLE} from '../actions';

const initialState = {
  cart: [],
  searchListTitle: '',
  searchHistory: [],
};
function shoppingReducer(state = initialState, action) {
  switch (action.type) {
    case SET_CART:
      return {...state, cart: action.payload};
    case SET_SEARCHLISTTITLE:
      return {...state, searchListTitle: action.payload};
    default:
      return state;
  }
}
export default shoppingReducer;
