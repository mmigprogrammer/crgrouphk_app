import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Image,
  SafeAreaView,
  FlatList,
  PanResponder,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as i18n from '../../i18n/i18n';
import {useIsFocused} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import axios from '../../component/AxiosNet';
import DeleteableItem from '../../component/OrderDeleteableItem';
import I18n from 'i18n-js';
import FeatherIcons from 'react-native-vector-icons/Feather';

const OrderScreen = ({navigation}) => {
  i18n.setI18nConfig();
  const isFocused = useIsFocused();
  const [order, setOrder] = useState([]);
  const [orderItem, setOrderItem] = useState([]);
  const {userId} = useSelector(state => state.loginReducer);
  const {userMemberId} = useSelector(state => state.loginReducer);
  const [bookList, setBookList] = useState([]);
  console.log(userId);
  console.log(userMemberId);

  async function fetchMyAPI() {
    try {
      // const orderList = await axios.get('user/getAllOrder', {
      //   params: {
      //     uid: userId,
      //   },
      // });
      // //console.log('11111');
      // setOrder(orderList.data.data);
      // //console.log(orderList.data.data[0].id); //280

      const bookingList = await axios

        .get('booking/getUserBooking', {
          params: {
            uid: userId,
          },
        })
        .then(data => {
          console.log(data.data.data);
          setBookList(data.data.data);

          //console.log(JSON.parse(data.data.data[0].goodslist[0].coverImg)[0]);
        });
    } catch (error) {
      console.error(error);
    }
  }

  const sortedBookList = [...bookList].sort((a, b) => a.id - b.id);
  console.log(sortedBookList);

  function orderStatus(orderStatus) {
    if (orderStatus == 1) {
      return (
        <View
          style={{
            paddingVertical: 3,
            paddingHorizontal: 17,
            backgroundColor: '#3ABB69',
            borderRadius: 6,
          }}>
          <Text style={{fontSize: 13}}>{i18n.t('booking_status_1')}</Text>
        </View>
      );
    } else if (orderStatus == 2) {
      return (
        <View
          style={{
            paddingVertical: 3,
            paddingHorizontal: 17,
            backgroundColor: '#D3D3D3',
            borderRadius: 6,
          }}>
          <Text style={{fontSize: 13}}>{i18n.t('booking_status_2')}</Text>
        </View>
      );
    } else if (orderStatus == 3) {
      return (
        <View
          style={{
            paddingVertical: 3,
            paddingHorizontal: 17,
            backgroundColor: '#6DCBFF',
            borderRadius: 6,
          }}>
          <Text style={{fontSize: 13}}>{i18n.t('booking_status_3')}</Text>
        </View>
      );
    } else {
      return (
        <View
          style={{
            paddingVertical: 3,
            paddingHorizontal: 17,
            backgroundColor: '#FFEECC',
            borderRadius: 6,
          }}>
          <Text style={{fontSize: 13}}>{i18n.t('booking_status_0')}</Text>
        </View>
      );
    }
  }

  useEffect(() => {
    try {
      fetchMyAPI();
      console.log(bookList);
    } catch (e) {
      console.log(e);
    }
    return function cleanup() {
      fetchMyAPI();
    };
  }, [isFocused]);

  // const delOrder = async orderId => {
  //   const res = await axios.post('order/delOrder', {
  //     //key:value
  //     id: orderId,
  //   }).then(data => {
  //     console.log(data);
  //     if (data.data.status == 111) {
  //       alert('success')
  //     } else {
  //       alert('fail')
  //     }
  //   })
  //   fetchMyAPI();

  return (
    <SafeAreaView edges={['top']} style={{flex: 1, backgroundColor: '#F5F5F5'}}>
      {sortedBookList.length !== 0 ? (
        <View style={{width: '100%', height: '100%', justifyContent: 'center'}}>
          <FlatList
            data={sortedBookList}
            keyExtractor={item => item.id.toString()}
            //item = order = orderlist

            renderItem={({item}) => {
              return (
                <View
                  style={{
                    marginVertical: 12,
                    borderWidth: 1,
                    borderColor: '#e6f5f3',
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'white',
                      width: '85%',
                      height: 140,
                      shadowColor: '#b7dea4',
                      marginHorizontal: '7%',
                      borderRadius: 10,
                      overflow: 'hidden',
                    }}
                    onPress={() => {
                      navigation.navigate('OrderDetail', {bookingId: item.id});
                    }}>
                    <View
                      style={{
                        width: '100%',
                        height: '100%',
                      }}>
                      {/* order added time */}
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          height: 28,
                          borderBottomWidth: 2,
                          borderBottomColor: 'rgba(0, 0, 0, 0.05)',
                          paddingHorizontal: 9,
                        }}>
                        <Image
                          style={{
                            width: 13,
                            height: 13,
                            marginRight: 7,
                          }}
                          source={require('../../img/time.png')}
                        />

                        <Text
                          style={{
                            fontSize: 12,
                            color: '#B3B3B3',
                          }}>
                          {item.creact_time}
                        </Text>
                      </View>
                      {/* cover and GoodsDetail */}
                      <View
                        style={{
                          flexDirection: 'row',
                          paddingTop: 5,
                          justifyContent: 'space-around',
                        }}>
                        <View
                          style={{
                            width: 94,
                            height: 94,
                            marginLeft: 5,
                            borderRadius: 10,
                            overflow: 'hidden',
                            marginRight: 10,
                          }}>
                          <Image
                            style={{
                              width: '100%',
                              height: '100%',
                            }}
                            source={{
                              uri:
                                item.goodslist && item.goodslist.length > 0
                                  ? item.goodslist[0].coverImg
                                  : '',
                            }}
                          />
                        </View>
                        <View
                          style={{
                            flex: 1,
                          }}>
                          {/* <View style={{ marginHorizontal: '10%', flexDirection: 'row', justifyContent: 'space-between' }}>

              {item.deduMoney == 0 ? <></> : <>
                <Text style={{ fontSize: 16, color: '#579c35' }}>{i18n.t('discount')} </Text>

                <Text style={{ fontSize: 16, color: '#579c35' }}>{item.deduMoney}</Text>
              </>
              }
            </View> */}
                          {/* <View style={{ marginHorizontal: '10%', flexDirection: 'row', justifyContent: 'space-between' }}>


              <Text style={{ fontSize: 16, color: '#579c35' }}>{i18n.t('total_price')} </Text>
              <Text style={{ fontSize: 16, color: '#579c35' }}>{item.allMoney}</Text>

            </View> */}
                          {/* <View style={{ marginHorizontal: '10%', flexDirection: 'row', justifyContent: 'space-between' }}>

              <Text style={{ fontSize: 16 }}>{i18n.t('creat_time')}</Text>

              <Text style={{ fontSize: 16 }}>{item.addDate}</Text>

            </View> */}
                          <View>
                            <Text
                              stye={{fontSize: 16, fontWeight: '500'}}
                              numberOfLines={1}>
                              {item.goodslist && item.goodslist.length > 0
                                ? item.goodslist[0].name
                                : ''}
                            </Text>
                          </View>
                          <View style={{paddingVertical: 7}}>
                            <Text style={{fontSize: 13, fontWeight: '400'}}>
                              {i18n.t('booking_date')} :{' '}
                              {item.booking_start_time
                                ? item.booking_start_time.slice(0, 10)
                                : 'reserve date'}
                            </Text>
                          </View>
                          <View>
                            <Text style={{fontSize: 13, fontWeight: '400'}}>
                              {i18n.t('booking_time')} :{' '}
                              {item.booking_start_time
                                ? item.booking_start_time.slice(11, 19)
                                : 'reserve time'}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              marginTop: 7,
                              height: 23,
                            }}>
                            <Text style={{fontSize: 13, fontWeight: '400'}}>
                              {i18n.t('booking_status')} :&nbsp;
                            </Text>
                            <View>
                              <Text>{orderStatus(item.status)}</Text>
                            </View>
                          </View>
                        </View>
                        <View
                          style={{
                            width: 50,

                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Icon
                            name="navigate-next"
                            style={{fontSize: 18, color: 'grey'}}
                          />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      ) : (
        <View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '42.5%',
            }}>
            <View style={{backgroundColor: '#E3A23B', borderRadius: 100}}>
              <FeatherIcons
                style={{color: '#fff', padding: 20}}
                name="shopping-bag"
                size={100}
              />
            </View>
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '10%',
            }}>
            <Text style={{fontSize: 20, color: '#707070'}}>
              {i18n.t('no_order')}
            </Text>
          </View>

          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
              width: '90%',
              height: '10%',
              marginHorizontal: '6%',
              marginTop: '10%',
              shadowColor: '#E3A23B',
              shadowOffset: {
                width: 0,
                height: 3,
              },
              shadowOpacity: 0.4,
              shadowRadius: 2,
              elevation: 1,
            }}
            onPress={() => navigation.navigate('Home')}>
            <Text style={{fontSize: 16, color: '#E3A23B'}}>
              {i18n.t('keep_shop')}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};
export default OrderScreen;
