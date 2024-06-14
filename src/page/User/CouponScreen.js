import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import axios from '../../component/AxiosNet';
import {useSelector} from 'react-redux';

import * as i18n from '../../i18n/i18n';
const CouponScreen = ({navigation}) => {
  i18n.setI18nConfig();
  const isFocused = useIsFocused();
  const {userId} = useSelector(state => state.loginReducer);
  const [isLoading, setIsLoading] = useState(true);

  const [coupon, setCoupon] = useState([]);
  async function fetchMyAPI() {
    const {data} = await axios.get('user/getAVyhcard'); //a coupon

    const useryhcard = await axios.get('user/getUseryhcard', {
      //user coupon
      params: {
        uid: userId,
      },
    });
    let userCoupon = [];
    if (data.data && useryhcard.data.data) {
      useryhcard.data.data.map(obj => {
        for (var i = 0; i < data.data.length; i++) {
          if (data.data[i].id == obj.id) {
            userCoupon[userCoupon.length] = data.data[i];
          }
        }
      });
      if (useryhcard.data.data.length >= 0) {
        setCoupon(userCoupon);
      }
    }
  }
  useEffect(() => {
    try {
      fetchMyAPI().then(() => setIsLoading(false));
    } catch (e) {
      console.log(e);
    }
    return function cleanup() {
      fetchMyAPI();
    };
  }, [isFocused]);

  return (
    <SafeAreaView edges={['top']} style={{flex: 1, backgroundColor: 'white'}}>
      <>
        {isLoading ? (
          <View>
            <ActivityIndicator
              color="#009b88"
              size="large"
              style={{marginTop: '40%'}}
            />
          </View>
        ) : coupon === null || coupon == '' ? (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '50%',
            }}>
            <Text style={{fontSize: 20, color: '#707070'}}>
              {i18n.t('no_gift_certificate')}
            </Text>
          </View>
        ) : (
          <>
            <View style={{backgroundColor: 'white', flex: 1}}>
              <View style={{justifyContent: 'center'}}>
                <FlatList
                  data={coupon}
                  renderItem={({item}) => (
                    <View
                      style={{
                        backgroundColor: '#E7F6F7',
                        borderBottomWidth: Platform.OS === 'ios' ? 0.33 : 1,
                        padding: '5%',
                      }}>
                      <Text style={{marginTop: '2%', fontSize: 25}}>
                        {item.name}
                      </Text>

                      <Text
                        style={{
                          fontWeight: '700',
                          fontSize: 18,
                          marginTop: '3%',
                        }}>
                        {i18n.t('you_have')}
                      </Text>
                      <Text
                        style={{
                          fontWeight: '700',
                          fontSize: 16,
                          marginTop: '2%',
                        }}>
                        HK$ {item.deduMoney}
                      </Text>
                      <Text style={{marginTop: '2%'}}>
                        {i18n.t('cash_rebateve_avaliable')}
                      </Text>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.push('CouponHistory', {coupon: coupon})
                        }>
                        <Text
                          style={{color: '#225491', marginVertical: '7.5%'}}>
                          {i18n.t('check_record')}
                        </Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          marginBottom: '2%',
                          height: 1,
                          backgroundColor: '#D9D9D9',
                        }}
                      />
                      <View>
                        <Text>
                          HK$ {item.deduMoney} {i18n.t('cash_rebateve_expire')}
                          {item.endDate.toString()} {i18n.t('expire')}
                        </Text>
                      </View>
                    </View>
                  )}
                />
              </View>
            </View>
          </>
        )}
      </>
    </SafeAreaView>
  );
};
export default CouponScreen;
