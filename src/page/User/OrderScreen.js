import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Button, Image, SafeAreaView, FlatList } from 'react-native';
import { Icon } from 'react-native-vector-icons/Icon';
import * as i18n from '../../i18n/i18n';
import { useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../../component/AxiosNet';
import FeatherIcons from 'react-native-vector-icons/Feather';

const OrderScreen = ({ navigation }) => {
  i18n.setI18nConfig()
  const isFocused = useIsFocused();
  const [order, setOrder] = useState([]);
  const { userId } = useSelector(state => state.loginReducer);

  async function fetchMyAPI() {
    const { data } = await axios.get("user/getAllOrder", {
      params: {
        uid: userId
      }
    })
    setOrder(data.data);
    //console.log(data.data);
  }

  useEffect(() => {
    try {
      fetchMyAPI();
    } catch (e) {
      console.log(e);
    }
    return function cleanup() {
      fetchMyAPI()
    }
  }, [isFocused]);



  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: 'white' }}>
      {order ?
        <View style={{ width: '100%', height: '100%' }}>
          <FlatList data={order.sort((a, b) => b.id - a.id)}
            renderItem={({ item }) => (
              <View style={{ marginVertical: '5%', borderWidth: 1, borderColor: '#e6f5f3' }}>
                <TouchableOpacity style={{
                  backgroundColor: 'white', width: '100%', height: 120, shadowColor: "#b7dea4",
                  shadowOffset: {
                    width: 0,
                    height: 7,
                  },
                  shadowOpacity: 0.91,
                  shadowRadius: 9.11,

                  elevation: 14,
                }}
                  onPress={() => { navigation.navigate('OrderDetail', { orderId: item.id }) }}>
                  <View style={{ backgroundColor: '#b7dea4', width: '100%', height: '100%', justifyContent: 'space-evenly' }}>

                    <View style={{ marginHorizontal: '10%', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ fontSize: 28 }}>{i18n.t('order_id')}</Text>
                      <Text style={{ fontSize: 28 }}>{item.id}</Text>

                    </View>
                    <View style={{ marginHorizontal: '10%', flexDirection: 'row', justifyContent: 'space-between' }}>

                      <Text style={{ fontSize: 16, color: '#579c35' }}>{i18n.t('order_price')}</Text>

                      <Text style={{ fontSize: 16, color: '#579c35' }}>{item.money}</Text>
                      </View>
                    <View style={{ marginHorizontal: '10%', flexDirection: 'row', justifyContent: 'space-between' }}>

                      {item.deduMoney == 0 ? <></> : <>
                        <Text style={{ fontSize: 16, color: '#579c35' }}>{i18n.t('discount')} </Text>

                        <Text style={{ fontSize: 16 , color: '#579c35'}}>{item.deduMoney}</Text>
                      </>
                      }
                    </View>
                    <View style={{ marginHorizontal: '10%', flexDirection: 'row', justifyContent: 'space-between' }}>


                        <Text style={{ fontSize: 16, color: '#579c35' }}>{i18n.t('total_price')} </Text>
                        <Text style={{ fontSize: 16, color: '#579c35' }}>{item.allMoney}</Text>
                      
                    </View>
                    <View style={{ marginHorizontal: '10%', flexDirection: 'row', justifyContent: 'space-between' }}>

                      <Text style={{ fontSize: 16 }}>{i18n.t('creat_time')}</Text>

                      <Text style={{ fontSize: 16 }}>{item.addDate}</Text>

                    </View>
                  </View>
                </TouchableOpacity>
              </View>

            )}>

          </FlatList>
        </View>
        :
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
      }


    </SafeAreaView>
  );
};
export default OrderScreen;
