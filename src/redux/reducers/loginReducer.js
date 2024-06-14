import {SET_USERID} from '../actions';
import {SET_USERTOKEN} from '../actions';
import {SET_USEREMAIL} from '../actions';
import {SET_USERMEMBERID} from '../actions';

const initialState = {
  userToken: null,
};
function loginReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USERID:
      return {...state, userId: action.payload};
    case SET_USERTOKEN:
      return {...state, userToken: action.payload};
    case SET_USEREMAIL:
      return {...state, userEmail: action.payload};
    case SET_USERMEMBERID:
      return {...state, userMemberId: action.payload};
    default:
      return state;
  }
}
export default loginReducer;
