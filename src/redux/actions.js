export const SET_DELIVER = 'SET_DELIVER';
export const SET_CURRENCY = 'SET_CURRENCY';
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';
export const SET_USEREMAIL = 'SET_USEREMAIL';
export const SET_USERMEMBERID = 'SET_USERMEMBERID';
export const SET_USERID = 'SET_USERID';
export const SET_USERTOKEN = 'SET_USERTOKEN';
export const SET_CART = 'SET_CART';
export const SET_SEARCHLISTTITLE = 'SET_SEARCHLISTTITLE';
export const SET_SEARCHHISTORY = 'SET_SEARCHHISTORY';

export const setDeliver = deliver => dispatch => {
  dispatch({
    type: SET_DELIVER,
    payload: deliver,
  });
};
export const setCurrency = currency => dispatch => {
  dispatch({
    type: SET_CURRENCY,
    payload: currency,
  });
};
export const setLanguage = language => dispatch => {
  dispatch({
    type: SET_LANGUAGE,
    payload: language,
  });
};
export const setNotifications = notifications => dispatch => {
  dispatch({
    type: SET_NOTIFICATIONS,
    payload: notifications,
  });
};
export const setUserEmail = userEmail => dispatch => {
  dispatch({
    type: SET_USEREMAIL,
    payload: userEmail,
  });
};
export const setUserMemberId = userMemberId => dispatch => {
  dispatch({
    type: SET_USERMEMBERID,
    payload: userMemberId,
  });
};

export const setUserId = userId => dispatch => {
  dispatch({
    type: SET_USERID,
    payload: userId,
  });
};
export const setUserToken = userToken => dispatch => {
  dispatch({
    type: SET_USERTOKEN,
    payload: userToken,
  });
};
export const setCart = cart => dispatch => {
  dispatch({
    type: SET_CART,
    payload: cart,
  });
};
export const setSearchListTitle = searchListTitle => dispatch => {
  dispatch({
    type: SET_SEARCHLISTTITLE,
    payload: searchListTitle,
  });
};
export const setSearchHistory = searchHistory => dispatch => {
  dispatch({
    type: SET_SEARCHHISTORY,
    payload: searchHistory,
  });
};
