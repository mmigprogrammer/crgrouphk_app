import _axios from 'axios';
import * as qs from 'qs';
import {Platform} from 'react-native';
import {serverHost, androidServerHost} from '@env';
import {getUniqueId} from 'react-native-device-info';

const axios = baseURL => {
  var host = '';
  Platform.OS === 'android' ? (host = androidServerHost) : (host = serverHost);
  if (serverHost == 'http://localhost:8080') {
    host = host + '/';
  }
  //host = 'https://testing.mmigh.com/';
  host = 'https://crgrouphk.com/';
  //host = 'https://www.crgrouphkhk.com/';
  const instance = _axios.create({
    headers: {Authorization: getUniqueId()},
    baseURL: baseURL || `${host}index.php/Home/`,
    timeout: 5000,
    transformRequest: [
      function (data) {
        data = qs.stringify(data);
        return data;
      },
    ],
  });

  return instance;
};

export {axios};
export default axios();
