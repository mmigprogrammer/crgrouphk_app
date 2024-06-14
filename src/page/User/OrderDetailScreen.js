import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Image,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {Icon} from 'react-native-vector-icons/Icon';
import * as i18n from '../../i18n/i18n';
import {useIsFocused} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import axios from '../../component/AxiosNet';
import DeleteableItem from '../../component/DeleteableItem';
import {legacy_createStore} from 'redux';
import {constants} from 'buffer';
import {log} from 'console';
import cgaxios from '../../component/ColorGroupAxiosNet';
import {Alert} from 'react-native';

const OrderDetailScreen = ({navigation, route}) => {
  i18n.setI18nConfig();
  const isFocused = useIsFocused();
  const [orderItem, setOrderItem] = useState([]);

  const {userId} = useSelector(state => state.loginReducer);
  const {userMemberId} = useSelector(state => state.loginReducer);
  const [bookDetail, setBookDetail] = useState();
  const [selectBranch, setSelectBranch] = useState();
  const [selectBranchPhone, setSelectBranchPhone] = useState();
  const [selectService, setSelectService] = useState();
  const [selectStylist, setSelectStylist] = useState();
  const [bookId, setBookId] = useState();

  async function fetchMyAPI() {
    //console.log(route.params); //98
    //setBookId(parseInt(route.params.cgbookId));
    //console.log(bookId);
    console.log(userMemberId);
    await axios
      .get('user/getAllOrderItem', {
        params: {
          bookingId: route.params.bookingId,
        },
      })
      .then(async data => {
        console.log(data.data.data);
        //bookdeteil cannot be called when the page just load and fetch,
        //if wanna use data of bookdetail inside the fetchapi,
        //use data.data.data instead of use bookdetail directly
        setBookDetail(data.data.data);
        setSelectStylist(data.data.data[0].stylist_name);
        setBookId(parseInt(data.data.data[0].book_id));
        //console.log(bookDetail);
        var temp = [];
        console.log(data.data.data[0].goodslist);
        data.data.data[0].goodslist.map(list => {
          temp.push(list.name);
        });
        temp = temp.join(`/`);
        console.log(temp);
        setSelectService(temp);
        //avoid to use the same key(data) as the above step,here use data1
        await cgaxios
          .post('Common/BranchInfo', {
            AccessCode: 'ColorGroup',
            LastUpdateTime: '19000101000000000',
          })
          .then(data1 => {
            console.log(data1.data.data);
            let temp = '';
            let phone = '';
            data1.data.data.map(branch => {
              if (branch.BranchId == data.data.data[0].branchId) {
                temp = branch.BranchAddress;
                phone = branch.BranchPhone;
              }
            });
            console.log(typeof temp);
            setSelectBranch(temp);
            setSelectBranchPhone(phone);
          });

        // await axios
        //   .get('booking/getStylists', {
        //     params: {
        //       branchId: data.data.data[0].branchId,
        //     },
        //   })
        //   .then(data2 => {
        //     console.log(data.data.data);
        //     var temp = '';
        //     data2.data.data.map(stylist => {
        //       if (stylist.sid == data.data.data[0].stylist_id) {
        //         temp = stylist.name;
        //       }
        //     });
        //     console.log(temp);
        //     setSelectStylist(temp);
        //   });
      })
      .catch(e => {
        console.log('cannot get');
      });
  }

  //console.log(bookDetail.goodslist[0]);
  //console.log(bookDetail.goodslist);

  // const goodListName = () => {
  //   var temp = [];
  //   bookDetail.goodslist.map(list => {
  //     temp.push(list.name);
  //   });
  //   console.log(temp);
  // };
  // goodListName();

  //console.log(selectStylist);

  // async function fetchMyAPI() {
  //   try {
  //     const [orderDetail, orderList, goods] = await Promise.all([
  //       axios.get("user/getAllOrderItem", { params: { orderId: route.params.orderId } }),
  //       axios.get("user/getAllOrder", { params: { uid: userId } }),
  //       axios.get("goods/getAllGoods")
  //     ]);

  //     const status = [];
  //     for (const order of orderDetail.data.data) {
  //       for (const obj of orderList.data.data) {
  //         if (obj.id === order.orderId) {
  //           status.push(obj.orderStatus);
  //           break;
  //         }
  //       }
  //     }

  //     const temp = [];
  //     for (const obj of goods.data.data) {
  //       for (const order of orderDetail.data.data) {
  //         if (obj.id === order.goodsId) {
  //           temp.push({ obj, status });
  //           break;
  //         }
  //       }
  //     }

  //     setOrderItem(temp);
  //     console.log(temp);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  const StatusImg = orderStatus => {
    switch (orderStatus) {
      case '1':
        return (
          <Image
            style={{width: 40, height: 40}}
            source={require('../../img/confirmed.png')}
          />
        );
      case '2':
        return (
          <Image
            style={{width: 40, height: 40}}
            source={require('../../img/cancelled.png')}
          />
        );
      case '3':
        return (
          <Image
            style={{width: 40, height: 40}}
            source={require('../../img/finished.png')}
          />
        );
      default:
        return (
          <Image
            style={{width: 40, height: 40}}
            source={require('../../img/unconfirmed.png')}
          />
        );
    }
  };

  const StatuStatement = orderStatus => {
    switch (orderStatus) {
      case '1':
        return (
          <Text style={{fontSize: 16, color: '#3ABB69'}}>
            {' '}
            {i18n.t('booking_confirmed')}{' '}
          </Text>
        );
      case '2':
        return (
          <Text style={{fontSize: 16, color: '#6A6A6A'}}>
            {' '}
            {i18n.t('booking_cancelled')}{' '}
          </Text>
        );
      case '3':
        return (
          <Text style={{fontSize: 16, color: '#6DCBFF'}}>
            {' '}
            {i18n.t('booking_finished')}{' '}
          </Text>
        );
      default:
        return (
          <Text style={{fontSize: 16, color: '#F88D2B'}}>
            {' '}
            {i18n.t('booking_unconfirmed')}{' '}
          </Text>
        );
    }
  };

  const cancelBooking = async () => {
    const cancelBook = axios
      .get('booking/cancelBooking', {
        params: {
          bookingId: route.params.bookingId,
        },
      })
      .then(data2 => {
        console.log(data2);
      });
    await cgaxios
      .post('Common/DeleteRecord', {
        AccessCode: 'ColorGroup',
        DeleteType: 'Appointment',
        Id: bookId,
      })
      .then(data3 => {
        console.log(data3);
      });
  };

  useEffect(() => {
    try {
      fetchMyAPI();
    } catch (e) {
      console.log(e);
    }
    return function cleanup() {
      fetchMyAPI();
    };
  }, [isFocused]);

  return (
    <SafeAreaView>
      <View style={{height: '100%'}}>
        <View style={{height: '100%', paddingHorizontal: 10}}>
          <View
            style={{
              height: 588,
              marginTop: 13,
              backgroundColor: 'white',
              paddingTop: 34,
              borderRadius: 6,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,

              elevation: 5,
            }}>
            {bookDetail !== null ? (
              <FlatList
                data={bookDetail}
                renderItem={({item}) => (
                  <View style={{flexDirection: 'column', alignItems: 'center'}}>
                    <View>{StatusImg(item.status[0])}</View>
                    <View style={{marginTop: 20}}>
                      {StatuStatement(item.status)}
                    </View>
                    <View
                      style={{
                        width: 244,
                        height: 330,
                        marginTop: 40,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '75%',
                        }}>
                        <Text style={{fontSize: 16, marginRight: 26}}>
                          {i18n.t('branch')}:
                        </Text>
                        <Text numberOfLines={2} style={{fontSize: 16}}>
                          {selectBranch ? selectBranch : ''}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 13,
                        }}>
                        <Text style={{fontSize: 16, marginRight: 26}}>
                          {i18n.t('branch_phone')}:
                        </Text>
                        <Text style={{fontSize: 16}}>{selectBranchPhone}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 13,
                          width: '85%',
                        }}>
                        <Text style={{fontSize: 16, marginRight: 26}}>
                          {i18n.t('service')}:
                        </Text>
                        <View>
                          <Text numberOfLines={1} style={{fontSize: 16}}>
                            {selectService}
                          </Text>
                          <Text
                            style={{
                              fontSize: 12,
                              color: '#E3A23B',
                              textDecorationLine: 'underline',
                            }}
                            onPress={() => {
                              Alert.alert(i18n.t('detail'), selectService);
                            }}>
                            {i18n.t('click_for_detail')}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 13,
                        }}>
                        <Text style={{fontSize: 16, marginRight: 11}}>
                          {i18n.t('stylist')}:
                        </Text>
                        <Text style={{fontSize: 16}}>{selectStylist}</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 13,
                        }}>
                        <Text style={{fontSize: 16, marginRight: 26}}>
                          {i18n.t('date')}:
                        </Text>
                        <Text style={{fontSize: 16}}>
                          {item.booking_start_time.slice(0, 10)}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 13,
                        }}>
                        <Text style={{fontSize: 16, marginRight: 26}}>
                          {i18n.t('time')}:
                        </Text>
                        <Text style={{fontSize: 16}}>
                          {' '}
                          {item.booking_start_time.slice(11, 19)}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          marginTop: 13,
                        }}>
                        <Text style={{fontSize: 16, marginRight: 26}}>
                          {i18n.t('price')}:
                        </Text>
                        <Text style={{fontSize: 16}}>${item.amount} UP</Text>
                      </View>
                      <View>
                        {item.status[0] < 2 ? (
                          <View
                            style={{
                              flexDirection: 'row',
                              marginTop: 13,
                              width: 166,
                            }}>
                            <Text style={{fontSize: 16, marginRight: 20}}>
                              {i18n.t('remark')}:
                            </Text>
                            <Text
                              style={{
                                fontSize: 15,
                                lineHeight: 19.5,
                                fontWeight: '400',
                                color: '#494949',
                              }}>
                              {i18n.t('remark_content')}
                            </Text>
                          </View>
                        ) : (
                          <></>
                        )}
                      </View>
                    </View>
                    <View>
                      {item.status[0] < 2 ? (
                        <TouchableOpacity
                          style={{
                            backgroundColor: '#D3D3D3',
                            borderRadius: 8,
                            width: 100,
                            height: 38,
                            marginTop: 50,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onPress={() => {
                            Alert.alert('Cancel Booking', 'Are you sure?', [
                              {
                                text: 'no',
                                onPress: () => console.log('cancel'),
                                style: 'cancel',
                              },
                              {
                                //By removing the parentheses, you are passing a reference to the cancelBooking function as a callback to the "yes" button's onPress property, instead of immediately invoking the function.

                                text: 'yes',
                                onPress: () => {
                                  cancelBooking();
                                  navigation.navigate('UserScreen', {
                                    screen: 'Order',
                                  });
                                },
                              },
                            ]);
                          }}>
                          <Text style={{color: 'black', fontSize: 13}}>
                            {i18n.t('cancel')}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <></>
                      )}
                    </View>
                  </View>
                )}
              />
            ) : (
              <></>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default OrderDetailScreen;
