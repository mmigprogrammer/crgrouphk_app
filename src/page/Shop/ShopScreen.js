import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  Dimensions,
  ActivityIndicator,
  Modal,
} from 'react-native';
import DeleteableItem from '../../component/ShopCartDeleteableItem';
import * as i18n from '../../i18n/i18n';
import {useSelector, useDispatch} from 'react-redux';
import axios from '../../component/AxiosNet';
import RNPickerSelect from 'react-native-picker-select';
import {useIsFocused} from '@react-navigation/native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment-timezone';
import {isIOS} from 'react-native-elements/dist/helpers';
import FeatherIcons from 'react-native-vector-icons/Feather';
import {set} from 'lodash';

const Shop = ({route, navigation}) => {
  i18n.setI18nConfig();
  const {userId} = useSelector(state => state.loginReducer);
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState([]);
  const [selectedValue, setSelectedValue] = useState();

  const [useCoupon, setUseCoupon] = useState([]);
  const [couponP, setCouponP] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [sum, setSum] = useState(0);
  const [cartItemQTY, setCartItemQTY] = useState([]);
  //list of selected items
  const [selectedItems, setSelectedItems] = useState([]);
  const [amountTotal, setAmountTotal] = useState([]);
  const [selectedQuantity, setSelectedQuantity] = useState([]);

  const [date, setDate] = useState(
    moment(
      moment(new Date()).add(2, 'days').toDate().setMinutes(0, 0, 0),
    ).toDate(),
  );
  const [timeOpen, setTimeOpen] = useState(false);
  //model
  const [modalVisible, setModalVisible] = useState(false);
  const [dateModalVisible, setDateModalVisible] = useState(false);

  const isFocused = useIsFocused();

  const SLIDER_HEIGHT = Dimensions.get('window').height;

  const [minTime, setMinTime] = useState(
    moment(new Date().setHours(8, 0, 0, 0)).toDate(),
  );
  const [maxTime, setMaxTime] = useState(
    moment(new Date().setHours(17, 0, 0, 0)).toDate(),
  );

  async function fetchMyAPI() {
    const couponList = await axios
      .get('user/getAllUseryhcard', {
        params: {
          uid: userId,
          status: 0,
        },
      })
      .then(data => {
        setCoupon(data.data.data);
      });
    const cartList = await axios.get('cart/getAllCart', {
      params: {
        uid: userId,
        status: 0,
      },
    });

    const tourList = await axios.get('goods/getAllGoods', {
      params: {
        type: 'app',
      },
    });

    if (cartList.data.data) {
      const result = cartList.data.data.map(cart => ({
        ...cart,
        type: tourList.data.data.filter(it => it.id === cart.goodsId),
      }));
      var sum = 0;

      if (
        typeof cartList.data.data !== 'undefined' &&
        cartList.data.data.length > 0
      ) {
        setCart(result);
        var temp = [];
        var tempsum = 0;
        for (var i = 0; i < result.length; i++) {
          temp.push(result[i].quantity);
          tempsum += result[i].quantity * result[i].price;
        }
        console.log(cartList.data.data);
        setCartItemQTY(temp);
        setSum(tempsum.toFixed(0));
        //setSum(result.map(item => parseFloat(item.price)).reduce((partial_sum, a) => partial_sum + a, 0));
      } else {
        setCart(null);
        setSum(0);
      }
    } else {
      setCart(null);
    }
  }
  console.log(cart);

  useEffect(() => {
    setIsLoading(true);
    try {
      fetchMyAPI().then(() => setIsLoading(false));
    } catch (e) {
      console.log(e);
    }
  }, [isFocused]);

  const delCart = async item => {
    const res = await axios.post('cart/delCart', {
      cartId: item.cartId,
      uid: userId,
      goodsId: item.goodsId,
    });
    //console.log(res);
    //if item is not deleted yet,now can be deleted
    if (res.data.status == 1) {
      if (cart) {
        setCart(
          //item only can be deleted when can be found in cart.
          //filter is a for loop function ,plz check
          cart.filter(function (it) {
            return it != item;
          }),
        );
      } else setCart();
    }
    fetchMyAPI();
  };

  //update the selecteditem once selected condione updated
  useEffect(() => {
    // This code will run after myState has been updated
    console.log(selectedItems);
    getTotalAmount();
    getSelectedQuantity();
  }, [selectedItems]);

  useEffect(() => {
    // This code will run after myState has been updated
    console.log(cartItemQTY);
    getTotalAmount();
  }, [cartItemQTY]);

  const pickerItem = () => {
    let pickerItems = [];
    for (var i = 0; i < coupon.length; i++) {
      pickerItems[i] = {label: coupon[i].name, value: coupon[i].id};
    }
    return (
      <RNPickerSelect
        style={{
          inputIOS: {
            fontSize: 30,
            fontWeight: '900',
            padding: 20,
            color: '#ABABAB',
          },
        }}
        onValueChange={(itemValue, itemIndex) => {
          setSelectedValue(itemValue);
          if (itemValue != -1) {
            let reducePrice = 0;
            for (var i = 0; i < coupon.length; i++) {
              if (coupon[i].id == itemValue) {
                reducePrice = coupon[i].deduMoney;
              }
            }
            setUseCoupon(itemValue);

            setCouponP(reducePrice);
          } else setCouponP(0);
        }}
        placeholder={{label: '不使用', value: -1}}
        value={selectedValue}
        items={pickerItems}
      />
    );
  };

  const updateQty = async (id, action) => {
    const res = await axios.post('cart/updateCart', {
      uid: userId,
      goodsId: id,
      action,
    });
  };

  const getTotalAmount = () => {
    var totalAmount = 0;

    selectedItems.forEach(itemId => {
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].goodsId == itemId) {
          totalAmount += parseInt(cart[i].price) * cartItemQTY[i];
        } else {
          totalAmount += 0;
        }
      }
      return totalAmount;
    });

    setAmountTotal(totalAmount);
  };

  const getSelectedQuantity = () => {
    var temp = [];
    selectedItems.forEach(itemId => {
      for (var i = 0; i < cart.length; i++) {
        if (cart[i].goodsId == itemId) temp.push(cart[i].quantity);
      }
      return temp;
    });
    console.log(temp);
    setSelectedQuantity(temp);
  };

  console.log(cartItemQTY);

  return (
    <>
      {isLoading ? (
        <View>
          <ActivityIndicator
            color="#009b88"
            size="large"
            style={{marginTop: '40%'}}
          />
        </View>
      ) : (
        <SafeAreaView>
          <View style={{height: '100%', backgroundColor: '#F7F7F7'}}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 22,
                }}>
                <View
                  style={{
                    margin: 20,
                    backgroundColor: 'white',
                    borderRadius: 20,
                    padding: 35,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      borderRadius: 10,
                      overflow: 'hidden',
                      fontSize: 20,
                      fontWeight: '900',
                    }}>
                    {i18n.t('select_coupon')}
                  </Text>
                  <View style={{width: isIOS ? '100%' : 150}}>
                    {pickerItem()}
                  </View>
                  <TouchableOpacity
                    style={{
                      borderRadius: 20,
                      padding: 10,
                      elevation: 2,
                    }}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text
                      style={{
                        backgroundColor: '#ff262a',
                        textAlign: 'center',
                        borderRadius: 10,
                        width: 90,
                        overflow: 'hidden',
                        fontSize: 20,
                      }}>
                      {i18n.t('close')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            <Modal
              animationType="slide"
              transparent={true}
              visible={dateModalVisible}
              onRequestClose={() => {
                setDateModalVisible(!dateModalVisible);
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 22,
                }}>
                <View
                  style={{
                    marginBottom: 30,
                    backgroundColor: 'white',
                    borderRadius: 20,
                    padding: 30,
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4,
                    elevation: 5,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      borderRadius: 10,
                      overflow: 'hidden',
                      fontSize: 30,
                      fontWeight: '900',
                      marginBottom: 20,
                    }}>
                    {i18n.t('select_time')}
                  </Text>
                  <TouchableOpacity
                    style={{width: 220, height: 50, marginBottom: 20}}
                    onPress={() => {
                      setTimeOpen(true);
                    }}>
                    <Text
                      style={{
                        width: '100%',
                        height: '50%',
                        fontSize: 18,
                        textAlign: 'center',
                      }}>
                      {moment(date).format('yyyy-MM-DD')}
                    </Text>
                    <Text
                      style={{
                        width: '100%',
                        height: '50%',
                        fontSize: 18,
                        textAlign: 'center',
                      }}>
                      {i18n.t('time')}:
                      {moment(date).format('HH') +
                        i18n.t('hour') +
                        moment(date).format('mm') +
                        i18n.t('min')}
                    </Text>
                    <DatePicker
                      theme="auto"
                      modal
                      mode="datetime"
                      open={timeOpen}
                      minuteInterval={30}
                      date={date}
                      onConfirm={time => {
                        setTimeOpen(false);
                        setDate(time);
                      }}
                      onCancel={() => {
                        setTimeOpen(false);
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginVertical: 6,
                      backgroundColor: '#22A727',
                      borderRadius: 20,
                      padding: 10,
                      elevation: 2,
                    }}
                    onPress={() => {
                      setDateModalVisible(!dateModalVisible);
                      navigation.navigate('ShopCheckOut', {
                        coupon: useCoupon,
                        date,
                      });
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#FFFF',
                        borderRadius: 10,
                        width: 90,
                        overflow: 'hidden',
                        fontSize: 20,
                      }}>
                      {i18n.t('confirm')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginVertical: 6,
                      backgroundColor: '#ff262a',
                      borderRadius: 20,
                      padding: 10,
                      elevation: 2,
                    }}
                    onPress={() => setDateModalVisible(!dateModalVisible)}>
                    <Text
                      style={{
                        textAlign: 'center',

                        borderRadius: 10,
                        width: 90,
                        overflow: 'hidden',
                        fontSize: 20,
                      }}>
                      {i18n.t('close')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            {cart == null ? (
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
                  <Text style={{fontSize: 20, color: '#707070', marginTop: 30}}>
                    {i18n.t('nothing_in_cart')}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#fff',
                    width: '90%',
                    height: '10%',
                    marginHorizontal: '5%',
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
            ) : (
              <View
                style={{
                  height: '96.5%',
                  marginTop: '6%',
                  justifyContent: 'center',
                  width: '100%',
                }}>
                <FlatList
                  data={cart}
                  renderItem={({item, index}) => (
                    <DeleteableItem
                      // selected={selectedItems ? true : false}
                      //call handleitemselection function here(not in deletable item)
                      handleItemSelection={() => {
                        const index = selectedItems.indexOf(item.goodsId);
                        //when items is not selected ,its index should be -1
                        if (index > -1) {
                          //item index > -1 ,means the items is already selected, now need to unselected it when the checkbox is clicked again
                          setSelectedItems(prevSelectedItems =>
                            prevSelectedItems.filter(id => id !== item.goodsId),
                          );
                        } else {
                          setSelectedItems(prevSelectedItems => [
                            ...prevSelectedItems,
                            item.goodsId,
                          ]);
                        }
                      }}
                      onChange={text =>
                        setCartItemQTY({
                          ...cartItemQTY,
                          [index]: parseInt(text),
                        })
                      }
                      qty={cartItemQTY[index]}
                      decreaseBtn={() => {
                        if (cartItemQTY[index] > 1) {
                          updateQty(item.goodsId, 'decrease');
                          setCartItemQTY({
                            ...cartItemQTY,
                            [index]: parseInt(cartItemQTY[index]) - 1,
                          });
                          setSum(parseInt(sum) - parseInt(item.price));
                        }
                      }}
                      increaseBtn={() => {
                        if (cartItemQTY[index] >= 1) {
                          updateQty(item.goodsId, 'increase');
                          setCartItemQTY({
                            ...cartItemQTY,
                            [index]: parseInt(cartItemQTY[index]) + 1,
                          });
                          setSum(parseInt(sum) + parseInt(item.price));
                        }
                      }}
                      itemData={item.type[0]}
                      type="bag"
                      touchFun={() => {
                        navigation.navigate('SearchScreen', {
                          screen: 'GoodsDetail',
                          params: {
                            goodsId: item.goodsId,
                            goodsQty: cartItemQTY,
                          },
                        });
                      }}
                      delPress={() => {
                        delCart(item);
                      }}
                    />
                  )}
                />
                {/* bottom bar */}
                <View
                  style={{
                    bottom: 1,
                    height: '8%',
                    width: '100%',
                    backgroundColor: 'white',
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: 11,
                    },
                    shadowOpacity: 0.55,
                    shadowRadius: 14.78,
                    elevation: 22,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 8,
                  }}>
                  <View
                    style={{
                      justifyContent: 'flex-start',
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '42%',
                    }}>
                    <Text style={{marginLeft: 10, fontSize: 16}}>
                      {i18n.t('shop_total')} :
                    </Text>
                    <Text style={{fontSize: 20, color: '#E3A23B'}}>
                      {' '}
                      ${amountTotal}
                    </Text>
                  </View>
                  {/* <TouchableOpacity
                    style={{
                      width: 101,
                      height: 36,
                      backgroundColor: '#E3A23B',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginHorizontal: 12,
                      marginVertical: 10,
                      borderRadius: 50,
                    }}
                    onPress={() => {
                      if (coupon.length > 0) {
                        setModalVisible(true);
                      } else alert('你沒有優惠卷可用');
                    }}>
                    <Text style={{color: 'white', fontSize: 15}}>
                      {i18n.t('shop_use_coupon')}
                    </Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    style={{
                      width: '25%',
                      height: 36,
                      backgroundColor: '#E3A23B',
                      justifyContent: 'center',
                      alignItems: 'center',

                      marginVertical: 10,
                      borderRadius: 50,
                    }}
                    onPress={() => {
                      // setDateModalVisible(true);

                      navigation.navigate('UserScreen', {
                        screen: 'Order',
                      });
                      // navigation.navigate('Home');
                    }}>
                    <Text style={{color: 'white', fontSize: 15}}>
                      {i18n.t('record')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: '25%',
                      height: 36,
                      backgroundColor: '#E3A23B',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginVertical: 10,
                      borderRadius: 50,
                      marginRight: 8,
                    }}
                    onPress={() => {
                      // setDateModalVisible(true);

                      navigation.navigate('SearchScreen', {
                        screen: 'Booking',
                        params: {
                          //pass the below data to target screen
                          goodsId: selectedItems,
                          goodsQty: selectedQuantity,
                          goodsAmount: amountTotal,
                        },
                      });
                      // navigation.navigate('Home');
                    }}>
                    <Text style={{color: 'white', fontSize: 15}}>
                      {i18n.t('booking')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </SafeAreaView>
      )}
    </>
  );
};
export default Shop;
