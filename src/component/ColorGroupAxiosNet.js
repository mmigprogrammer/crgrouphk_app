import _axios from 'axios';
import * as qs from 'qs';
import {Platform} from 'react-native';
import {serverHost, androidServerHost} from '@env';
import {getUniqueId} from 'react-native-device-info';

const axios = baseURL => {
  const host =
    //access the server from client side by proxy server:https://cors.sh/
    'https://proxy.cors.sh/http://booking.xhair.com.hk:9999/clg/api/';

  const instance = _axios.create({
    headers: {
      'x-requested-with': 'x-requested-with',
      'Content-Type': 'application/json',
      'x-cors-api-key': 'temp_48a6373ffbf3cbeb6fa49454f554945f',
    },
    baseURL: baseURL || `${host}`,
    timeout: 7000,
    transformRequest: function (data) {
      data = JSON.stringify(data);
      return data;
    },
  });

  return instance;
};

export {axios};
export default axios();
