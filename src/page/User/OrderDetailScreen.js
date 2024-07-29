import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Button, Image, SafeAreaView, FlatList } from 'react-native';
import { Icon } from 'react-native-vector-icons/Icon';
import * as i18n from '../../i18n/i18n';
import { useIsFocused } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../../component/AxiosNet';
import DeleteableItem from '../../component/DeleteableItem';


const OrderDetailScreen = ({ navigation, route }) => {
  i18n.setI18nConfig()
  const isFocused = useIsFocused();
  const [orderItem, setOrderItem] = useState([]);
  const { userId } = useSelector(state => state.loginReducer);

  async function fetchMyAPI() {
    const { data } = await axios.get("user/getAllOrderItemOld", {
      params: {
        uid: userId,
        orderId: route.params.orderId,
      }
    })
    //setOrderItem(data.data);

    const tourList = await axios.get("goods/getAllGoods");
    
    var temp = [];
    if (tourList.data.data && data.data) {
      console.log(data.data);

      tourList.data.data.map((obj) => {
        for (var i = 0; i < data.data.length; i++) {
          if (obj.id == data.data[i].goodsId) {
            temp.push(obj)
          }
        }
      });
      setOrderItem(temp);
      console.log(temp);

    }

    //console.log(tourList);
  }

  useEffect(() => {
    try {
      fetchMyAPI()
    } catch (e) {
      console.log(e);
    }
    return function cleanup() {
      fetchMyAPI()
    }
  }, [isFocused]);

  return (
    <SafeAreaView>
      <View style={{ height: '100%', backgroundColor: 'white' }}>

        <View style={{ height: '100%' }}>
          <View style={{ height: '100%' }}>
            {orderItem!==null?(
            <FlatList data={orderItem}
              renderItem={({ item }) => (
                <DeleteableItem
                  touchFun={() => {
                    navigation.navigate('SearchScreen', { screen: 'GoodsDetail', params: { goodsId: item.id },initial: false, })
                  }}
                  itemData={item}
                />
              )} />):(<></>)}
          </View>
        </View>

      </View>

    </SafeAreaView>
  );
};
export default OrderDetailScreen;
