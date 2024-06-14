import {
  SET_DELIVER,
  SET_LANGUAGE,
  SET_CURRENCY,
  SET_NOTIFICATIONS,
} from '../actions';

const initialState = {
  deliver: 'HK',
  currency: 'hkd',
  language: 'en',
  notifications: true,
};
function settingReducer(state = initialState, action) {
  switch (action.type) {
    case SET_DELIVER:
      return {...state, deliver: action.payload};
    case SET_CURRENCY:
      return {...state, currency: action.payload};
    case SET_NOTIFICATIONS:
      return {...state, notifications: action.payload};
    case SET_LANGUAGE:
      return {...state, language: action.payload};
    default:
      return state;
  }
}

export default settingReducer;
