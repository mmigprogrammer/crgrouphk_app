import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {WebView} from 'react-native-webview';
import axios from '../../component/AxiosNet';
import {useSelector} from 'react-redux';
import moment from 'moment-timezone';

const PaypalScreen = ({route, navigation}) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {userId} = useSelector(state => state.loginReducer);

  async function fetchMyAPI() {
    const {data} = await axios.post('cart/paypalIntent', {
      uid: userId,
      coupon: route.params.coupon,
      date: moment(route.params.date).zone('+0800').format(),
    });
    console.log(route.params.date);

    if (data) {
      setData(data);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    try {
      fetchMyAPI();
    } catch (e) {
      console.log(e);
    }
    return function cleanup() {
      fetchMyAPI();
      setData([]);
    };
  }, []);
  const onMessage = e => {
    if (e.nativeEvent.data == 'success') {
      alert('Success');
      navigation.navigate('UserScreen', {screen: 'Order', initial: false});
    } else {
      alert(e.nativeEvent.data);
    }
  };
  return (
    <>
      {data.links && isLoading ? (
        <View>
          <ActivityIndicator
            color="#009b88"
            size="large"
            style={{marginTop: '40%'}}
          />
        </View>
      ) : (
        <WebView
          onMessage={onMessage}
          startInLoadingState={true}
          source={{uri: data.data ? data.data : null}}
        />
      )}
    </>
  );
};
export default PaypalScreen;
