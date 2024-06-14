import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import settingReducer from "./reducers/settingReducer";
import loginReducer from "./reducers/loginReducer";
import shoppingReducer from "./reducers/shoppingReducer";
import searchReducer from "./reducers/searchReducer";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  settingReducer: persistReducer(persistConfig, settingReducer),
  loginReducer: persistReducer(persistConfig, loginReducer),
  shoppingReducer: persistReducer(persistConfig, shoppingReducer),
  searchReducer: persistReducer(persistConfig, searchReducer)

});

export const Store = createStore(rootReducer, applyMiddleware(thunk));
export const persistor = persistStore(Store);
