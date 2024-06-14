import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  SafeAreaView,
  useWindowDimensions,
  FlatList,
  Image,
  ImageBackground,
} from 'react-native';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {useSelector} from 'react-redux';
import * as i18n from '../../i18n/i18n';
import {useIsFocused} from '@react-navigation/native';
import axios from '../../component/AxiosNet';
import cgaxios from '../../component/ColorGroupAxiosNet';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {uri} from '@env';

const CouponHistoryScreen = ({route, navigation}) => {
  i18n.setI18nConfig();
  const isFocused = useIsFocused();
  const [userCoupon, setCoupon] = useState([]);
  const [yhcard, setYhcard] = useState([]);
  const {userId} = useSelector(state => state.loginReducer);
  const {userMemberId} = useSelector(state => state.loginReducer);

  console.log(userMemberId);
  async function fetchMyAPI() {
    try {
      const allyhcard = await axios
        .get('user/getAllyhcard', {
          params: {
            isdel: 1,
          },
        })
        .then(yhcards => {
          console.log(yhcards.data);
          for (let i = 0; i < yhcards.data.data.length; i++) {
            if (new Date() > new Date(yhcards.data.data[i].endDate)) {
              yhcards.data.data[i].status = 0;
              console.log(new Date());
              console.log(new Date(yhcards.data.data[i].endDate));
            } else {
              yhcards.data.data[i].status = 1;
              console.log(new Date() > new Date(yhcards.data.data[i].endDate));
            }
          }
          console.log(yhcards.data.data);
          return yhcards.data.data;
        });
      console.log(allyhcard);
      setYhcard(allyhcard);

      const useryhcard = await axios
        .get('user/getUseryhcard', {
          params: {
            uid: userId,
          },
        })
        .then(useryhcard => {
          console.log(useryhcard.data.data);
          for (let i = 0; i < useryhcard.data.data.length; i++) {
            if (new Date() > new Date(useryhcard.data.data[i].endDate)) {
              useryhcard.data.data[i].status = 0;
            } else {
              useryhcard.data.data[i].status = 1;
            }
          }
          console.log(useryhcard.data.data);
          setCoupon(useryhcard.data.data);
          var temp = [];
          console.log(useryhcard.data.data);
          console.log(allyhcard);

          allyhcard.map(obj => {
            for (let i = 0; i < useryhcard.data.data.length; i++) {
              if (obj.id && useryhcard.data.data[i].yhId) {
                if (obj.id == useryhcard.data.data[i].yhId) {
                  temp.push({
                    usableTime: useryhcard.data.data[i].usableTime,
                    ...obj,
                  });
                }
              }
            }
          });

          setCoupon(temp);
          console.log(temp);
          return useryhcard.data.data;
        });

      // setYhcard(allyhcard);

      // console.log('22222');
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchMyAPI();
  }, [isFocused]);

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'first', title: i18n.t('get_coupon')},
    {key: 'second', title: i18n.t('have_coupon')},
  ]);

  console.log(userId);

  const addCoupon = async item => {
    console.log(item);
    await cgaxios
      .post('Common/DeductionPoints', {
        AccessCode: 'ColorGroup',
        MemberId: userMemberId ? userMemberId : 0,
        Points: item.redeemScore,

        //MemberId: ,
      })
      .then(data => {
        console.log(data);
      });
    await axios
      .get('user/addCard', {
        params: {
          uid: userId,
          cardId: item.id,
        },
      })
      .then(data1 => {
        console.log(data1);

        if (data1.data.code == 4) {
          alert(i18n.t('already_redeemed'));
        }
        fetchMyAPI();
      });
  };

  const FirstRoute = () => (
    <View
      style={{flex: 1, backgroundColor: '#F6F6F6', justifyContent: 'center'}}>
      <View style={{marginTop: 20, justifyContent: 'center'}} />
      {yhcard != null ? (
        <FlatList
          data={yhcard}
          renderItem={({item}) =>
            item.status == 1 ? (
              <TouchableOpacity
                style={{
                  height: 131,
                  width: '100%',
                  marginHorizontal: '5%',
                  marginBottom: 27,
                }}
                // onPress={() => {
                //   navigation.navigate('ShopScreen');
                // }}
              >
                <ImageBackground
                  style={{height: 131, width: '95%'}}
                  source={require('../../img/ticket.png')}
                  resizeMode="stretch">
                  <View style={{flexDirection: 'row', height: 100}}>
                    <Image
                      style={{
                        height: 32,
                        width: 32,
                        marginLeft: '5%',
                        marginTop: '5%',
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: 'gray',
                        borderStyle: 'dotted',
                      }}
                      source={{uri: uri + item.image}}
                    />
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        borderRadius: 10,
                        width: '50%',
                        marginLeft: 20,
                      }}>
                      <Text
                        style={{
                          marginTop: '8%',
                          fontSize: 12,
                          fontWeight: '300',
                          color: '#4B4848',
                        }}>
                        {item.yhNum}
                      </Text>
                      <Text style={{fontSize: 12, fontWeight: '500'}}>
                        {item.name}
                      </Text>
                      <Text
                        style={{
                          fontWeight: '300',
                          fontSize: 12,
                          color: '#4B4848',
                        }}>
                        {i18n.t('use')}
                        {item.redeemScore}
                        {i18n.t('score_redeem')}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      height: 30,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        marginLeft: '5%',
                        fontSize: 12,
                        justifyContent: 'center',
                        marginHorizontal: 119,
                      }}>
                      {i18n.t('exp_date')}
                      {item.endDate.toString()}{' '}
                    </Text>
                    <View
                      style={{
                        right: 20,
                      }}>
                      {item.available == 0 ? (
                        <TouchableOpacity
                          onPress={() => addCoupon(item)}
                          style={{
                            backgroundColor: '#E3A23B',
                            borderRadius: 10,
                            width: 60,
                            height: 24,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={{color: 'white', fontSize: 14}}>
                            {i18n.t('get')}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={{
                            backgroundColor: '#6a6a6a',
                            borderRadius: 10,
                            width: 60,
                            height: 24,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Text style={{color: 'white', fontSize: 14}}>
                            {i18n.t('out_of_stock')}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <View></View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ) : (
              <></>
            )
          }
        />
      ) : (
        <View
          style={{flex: 0.6, alignItems: 'center', justifyContent: 'center'}}>
          <Text>{i18n.t('no_refund')}</Text>
        </View>
      )}
    </View>
  );

  const SecondRoute = () => (
    <View
      style={{flex: 1, backgroundColor: '#F6F6F6', justifyContent: 'center'}}>
      <View style={{marginTop: 20, justifyContent: 'center'}} />
      {userCoupon.length != 0 ? (
        <FlatList
          data={userCoupon}
          renderItem={({item}) =>
            item.status == 1 && item.usableTime > 0 ? (
              <TouchableOpacity
                style={{
                  height: 131,
                  marginHorizontal: '5%',
                  marginBottom: 27,
                  width: '100%',
                }}
                // onPress={() => {
                //   navigation.navigate('ShopScreen');
                // }}
              >
                <ImageBackground
                  style={{height: 131, width: '95%'}}
                  source={require('../../img/ticket.png')}
                  resizeMode="stretch">
                  <View style={{flexDirection: 'row', height: 100}}>
                    <Image
                      style={{
                        height: 32,
                        width: 32,
                        marginLeft: '5%',
                        marginTop: '5%',
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: 'gray',
                        borderStyle: 'dotted',
                      }}
                      source={{uri: uri + item.image}}
                    />
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        borderRadius: 10,
                        width: '50%',
                        marginLeft: 20,
                      }}>
                      <Text
                        style={{
                          marginTop: '8%',
                          fontSize: 12,
                          fontWeight: '300',
                          color: '#4B4848',
                        }}>
                        {item.couponId}
                      </Text>
                      <Text style={{fontSize: 12, fontWeight: '500'}}>
                        {item.name}
                      </Text>

                      <View style={{}}>
                        {item.usableTime > 0 ? (
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: '300',
                              color: '#4B4848',
                            }}>
                            {i18n.t('usable_time')}:{item.usableTime}
                            {i18n.t('time_unit')}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: '300',
                              color: '#4B4848',
                            }}>
                            {i18n.t('used')}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      height: 30,
                      alignItems: 'center',
                      paddingHorizontal: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 10,
                        justifyContent: 'center',
                      }}>
                      {i18n.t('exp_date')}
                      {item.endDate}{' '}
                    </Text>
                    <View style={{}}>
                      <Text
                        style={{
                          fontSize: 10,
                          justifyContent: 'center',

                          right: 15,
                        }}>
                        {i18n.t('get_date')} : {item.addDate.split(' ')[0]}{' '}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  height: 131,
                  marginHorizontal: '5%',
                  marginBottom: 27,
                }}
                // onPress={() => {
                //   navigation.navigate('ShopScreen');
                // }}
              >
                <ImageBackground
                  style={{height: 131, width: '100%'}}
                  source={require('../../img/ticket_gray.png')}
                  resizeMode="stretch">
                  <View style={{flexDirection: 'row', height: 100}}>
                    <Image
                      style={{
                        height: 32,
                        width: 32,
                        marginLeft: '5%',
                        marginTop: '5%',
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: 'gray',
                        borderStyle: 'dotted',
                      }}
                      source={{uri: uri + item.image}}
                    />
                    <View
                      style={{
                        justifyContent: 'flex-start',
                        borderRadius: 10,
                        width: '50%',
                        marginLeft: 20,
                      }}>
                      <Text
                        style={{
                          marginTop: '8%',
                          fontSize: 12,
                          fontWeight: '300',
                          color: '#4B4848',
                        }}>
                        {item.couponId}
                      </Text>
                      <Text style={{fontSize: 12, fontWeight: '500'}}>
                        {item.name}
                      </Text>

                      <View>
                        {item.usableTime == 0 ? (
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: '300',
                              color: '#4B4848',
                            }}>
                            {i18n.t('used')}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              fontSize: 12,
                              fontWeight: '300',
                              color: '#4B4848',
                            }}>
                            {i18n.t('expired')}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      height: 30,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        marginLeft: '5%',
                        fontSize: 10,
                        justifyContent: 'center',
                      }}>
                      {i18n.t('exp_date')}
                      {item.endDate}{' '}
                    </Text>
                    <View style={{}}>
                      <Text
                        style={{
                          marginLeft: '1%',
                          fontSize: 10,
                          justifyContent: 'center',

                          right: 15,
                        }}>
                        {i18n.t('get_date')} : {item.addDate.split(' ')[0]}{' '}
                      </Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            )
          }
        />
      ) : (
        <View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 39,
            }}>
            <View style={{backgroundColor: '#D9D9D9', borderRadius: 100}}>
              <MaterialCommunityIcons
                style={{color: '#fff', padding: 20}}
                name="ticket-confirmation-outline"
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
              {i18n.t('no_coupon')}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  return (
    <TabView
      navigationState={{index, routes}}
      renderTabBar={props => (
        <TabBar
          {...props}
          renderLabel={({route, color}) => (
            <Text style={{color: 'black', margin: 8}}>{route.title}</Text>
          )}
          indicatorStyle={{backgroundColor: 'black', height: 2}}
          style={{
            backgroundColor: 'white',
            borderBottomColor: 'black',
          }}
        />
      )}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={layout}
    />
  );
};

export default CouponHistoryScreen;
