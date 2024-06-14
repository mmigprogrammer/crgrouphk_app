import React, { useState, useEffect } from 'react';
import { View, Text, TouchableHighlight, Image, Platform, StatusBar, Alert, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import axios from '../../component/AxiosNet';

import { useIsFocused } from '@react-navigation/native';

import * as i18n from '../../i18n/i18n';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DeleteableItem from '../../component/DeleteableItem';
import moment from 'moment';
import { useSelector } from 'react-redux';

const RedeemScreen = ({ navigation }) => {
  const [redeem, setRedeem] = useState([]);
  const [useryhcard, setUseryhcard] = useState([]);

  const isFocused = useIsFocused();
  const { userId } = useSelector(state => state.loginReducer);

  async function fetchMyAPI() {
    const { data } = await axios.get("user/getAVyhcard");

    const useryhcard = await axios.get("user/getUseryhcard", {
      params: {
        uid: userId,
      }
    });

    if (data.data && useryhcard.data.data) {      
      useryhcard.data.data.map((obj) => {

        for (var i = 0; i < data.data.length; i++) {
          if (data.data[i].id == obj.id) {
            data.data[i].status = 3;
          }
        }
      });
      setRedeem(data.data);
    }
  }
  async function getyhcard(item) {
    const { data } = await axios.get("user/getyhcard", {
      params: {
        uid: userId,
        yhcardId:item.id,
      }
    });
    if (data.status==111) {
      navigation.push('Coupon')
    }else {
      alert(data.message);
    }
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
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white', height: '100%', paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }}>
      <View style={{ height: '100%', backgroundColor: 'white' }}>

        <View style={{ height: '100%' }}>
          <View style={{ height: '100%' }}>
            {redeem !== null ? (
              <FlatList data={redeem}
                renderItem={({ item }) => (
                  <View style={{ backgroundColor: '#E7F6F7', borderBottomWidth: Platform.OS === 'ios' ? 0.33 : 1, padding: '5%' }}>
                    <Text style={{ marginTop: '2%', fontSize: 25 }}>{item.name}</Text>
                    <Text style={{ fontSize: 18, marginTop: '3%' }}>{i18n.t('you_have')}</Text>
                    <Text style={{ fontWeight: "600", fontSize: 16, marginTop: '1%' }}>HK$ {item.deduMoney}</Text>
                    <Text style={{ marginTop: '1%', fontSize: 18 }}>{i18n.t('cash_rebateve_exchange')}</Text>
                    {item.score > 0 ? <Text style={{ marginTop: '3%', fontSize: 18 }}>{i18n.t('only')}{item.score}{i18n.t('point')}</Text>
                      : <Text style={{ marginTop: '3%', fontSize: 18 }}></Text>}
                    {item.status == 0?
                    <TouchableOpacity
                      style={{ alignItems: 'flex-end' }}
                      onPress={() => getyhcard(item)}>
                      <Text style={{ color: '#225491', marginVertical: '2.5%', fontSize: 24 }}>{i18n.t('exchange_now')}</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity
                      style={{ alignItems: 'flex-end' }}
                      onPress={() => navigation.navigate('Home')}>
                      <Text style={{ color: '#225491', marginVertical: '2.5%', fontSize: 24 }}>{i18n.t('use_now')}</Text>
                    </TouchableOpacity>
                    }
                    <View style={{ marginBottom: '2%', height: 1, backgroundColor: '#D9D9D9' }}></View>
                    <View><Text>HK$ {item.deduMoney} {i18n.t('cash_rebateve_before')} {item.endDate.toString()} {i18n.t('be_exchange')}</Text></View>
                  </View>
                )} />) : (<></>)}
          </View>
        </View>

      </View>
    </SafeAreaView>
  );
};
export default RedeemScreen;
