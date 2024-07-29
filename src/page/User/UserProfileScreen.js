import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  Image,
  Platform,
  StatusBar,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from '../../component/AxiosNet';
import cgaxios from '../../component/ColorGroupAxiosNet';
import {useSelector, useDispatch} from 'react-redux';
import {setUserToken, setUserId} from '../../redux/actions';

import {useIsFocused} from '@react-navigation/native';

import * as i18n from '../../i18n/i18n';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EIcon from 'react-native-vector-icons/EvilIcons';
import OIcon from 'react-native-vector-icons/Octicons';

const User = ({navigation}) => {
  i18n.setI18nConfig();
  const isFocused = useIsFocused();

  const [thtColor, setThtColor] = useState([
    '#707070',
    '#707070',
    '#707070',
    '#707070',
    '#707070',
  ]);
  const [thiColor, setThiColor] = useState([
    '#707070',
    '#707070',
    '#707070',
    '#707070',
    '#707070',
  ]);

  const {userId, userToken} = useSelector(state => state.loginReducer);

  const dispatch = useDispatch();

  const [userInfo, setUserInfo] = useState('');
  const [userName, setUserName] = useState('');

  const logoutAlert = () =>
    Alert.alert(i18n.t('logout_q'), '', [
      {
        text: i18n.t('logout_q_no'),
        style: 'cancel',
      },
      {
        text: i18n.t('logout_q_yes'),
        onPress: () => {
          dispatch(setUserToken(null));
          dispatch(setUserId(null));

          navigation.navigate('UserScreen');
        },
      },
    ]);

  async function fetchMyAPI() {
    console.log(userId);
    // Common / BranchInfo

    // await cgaxios.get('Common/BranchInfo', {
    //   params: {
    //     AccessCode: 'ColorGroup',
    //     LastUpdateTime: '20001101123000000'
    //   },
    // }).then(data => {
    //   console.log(data);
    // })

    const userInfo = await axios
      .get('user/getUserInfoPhone', {
        params: {
          uid: userId,
        },
      })
      .then(data => {
        console.log(data);
        setUserInfo(data.data.data);
        setUserName(data.data.data.name);
      })
      .catch(e => {
        console.log('cannot get');
      });
  }

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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#F5F5F5',
        height: '100%',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: 185,
        }}>
        {/* propic and score */}

        <View
          style={{
            height: 137,
            width: 370,
            borderRadius: 10,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingLeft: 11,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
          }}>
          <View>
            <Image
              style={{
                height: 90,
                width: 90,
                borderRadius: 100,
                borderWidth: 1,
                borderColor: 'lightgray',
              }}
              source={
                userInfo
                  ? userInfo.headImg
                    ? {uri: userInfo.headImg}
                    : require('../../img/userImg.png')
                  : require('../../img/userImg.png')
              }
            />
          </View>
          <View
            style={{
              paddingLeft: 21,
              paddingTop: 23,
              paddingBottom: 32,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
            <View>
              <Text
                style={{
                  color: '#6A6A6A',
                  fontSize: 22,
                  opacity: 0.75,
                  fontWeight: '600',
                }}>
                {userInfo ? userInfo.name : ''}
              </Text>
            </View>
            <View>
              {/* <Text
            style={{
              color: 'black',
              fontSize: 26,
              marginVertical: '10%',
              
            }}>
            {userInfo.name}
          </Text> */}
              {/* <Text style={{ color:'white',left: 200, fontSize:16}}>ID  {userId}</Text> */}
              <View
                style={{
                  display: 'flex',
                  //flexDirection: 'row',
                  //gap: 10
                }}>
                <Text
                  style={{
                    color: 'grey',
                    fontSize: 16,
                    opacity: 0.75,
                    marginBottom: 8,
                  }}>
                  {i18n.t('user_score')} | {userInfo ? userInfo.score : 0}
                </Text>
                <Text
                  style={{
                    color: 'grey',
                    fontSize: 16,
                    opacity: 0.75,
                  }}>
                  {i18n.t('user_balance')} | HK$
                  {userInfo && userInfo.amountBalance  ? userInfo.amountBalance : 0}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View
        style={{
          marginTop: 30,
          //backgroundColor: '#f6f6f6',
          width: 370,
          marginHorizontal: 9,
          backgroundColor: 'white',
          borderRadius: 10,
          height: 260,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,

          elevation: 2,
        }}>
        {/* account info list */}
        <TouchableHighlight
          style={{
            paddingHorizontal: 9,
            paddingVertical: 9,
            height: 51,
          }}
          onPress={() => {
            navigation.push('MyAccount');
          }}
          onPressIn={() => {
            setThtColor(thtColor => ({...thtColor, [0]: '#FFFFFF'}));
            setThiColor(thiColor => ({...thiColor, [0]: '#FFFFFF'}));
          }}
          onPressOut={() => {
            setThtColor(thtColor => ({...thtColor, [0]: '#707070'})),
              setThiColor(thiColor => ({...thiColor, [0]: '#707070'}));
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingLeft: '3%',
              paddingTop: 9,
            }}>
            <View style={{flexDirection: 'row'}}>
              <EIcon name="user" style={{fontSize: 20, color: 'grey'}} />
              <Text
                style={{
                  fontWeight: Platform.OS == 'ios' ? '300' : '700',
                  fontSize: 16,
                  color: thtColor[0],
                  paddingLeft: 2,
                }}>
                &nbsp;&nbsp;{i18n.t('my_account')}
              </Text>
            </View>
            <Icon name="navigate-next" style={{fontSize: 16, color: 'grey'}} />
          </View>
        </TouchableHighlight>
        <View
          style={{
            borderBottomColor: '#E2E2E2',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        {/* account */}
        {/* order */}
        <TouchableHighlight
          style={{
            paddingHorizontal: 9,
            paddingVertical: 9,
            backgroundColor: '#ffffff',
            height: 51,
          }}
          onPress={() => {
            navigation.push('Order');
          }}
          onPressIn={() => {
            setThtColor(thtColor => ({...thtColor, [1]: '#FFFFFF'}));
            setThiColor(thiColor => ({...thiColor, [1]: '#FFFFFF'}));
          }}
          onPressOut={() => {
            setThtColor(thtColor => ({...thtColor, [1]: '#707070'})),
              setThiColor(thiColor => ({...thiColor, [1]: '#707070'}));
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingLeft: '3%',
              paddingTop: 9,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Icon name="list-alt" style={{fontSize: 18, color: 'grey'}} />
              <Text
                style={{
                  fontWeight: Platform.OS == 'ios' ? '300' : '700',
                  fontSize: 16,
                  color: thtColor[1],
                }}>
                &nbsp;&nbsp;&nbsp;{i18n.t('my_order')}
              </Text>
            </View>
            <Icon name="navigate-next" style={{fontSize: 16, color: 'grey'}} />
          </View>
        </TouchableHighlight>
        {/* order */}
        <TouchableHighlight
          style={{
            paddingHorizontal: 9,
            paddingVertical: 9,
            backgroundColor: '#ffffff',
            height: 51,
          }}
          onPress={() => {
            navigation.push('Record');
          }}
          onPressIn={() => {
            setThtColor(thtColor => ({...thtColor, [1]: '#FFFFFF'}));
            setThiColor(thiColor => ({...thiColor, [1]: '#FFFFFF'}));
          }}
          onPressOut={() => {
            setThtColor(thtColor => ({...thtColor, [1]: '#707070'})),
              setThiColor(thiColor => ({...thiColor, [1]: '#707070'}));
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingLeft: '3%',
              paddingTop: 9,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Icon name="list-alt" style={{fontSize: 18, color: 'grey'}} />
              <Text
                style={{
                  fontWeight: Platform.OS == 'ios' ? '300' : '700',
                  fontSize: 16,
                  color: thtColor[1],
                }}>
                &nbsp;&nbsp;&nbsp;{i18n.t('my_booking')}
              </Text>
            </View>
            <Icon name="navigate-next" style={{fontSize: 16, color: 'grey'}} />
          </View>
        </TouchableHighlight>
        <View
          style={{
            borderBottomColor: '#E2E2E2',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        {/* order */}
        {/* coupon */}
        <TouchableHighlight
          underlayColor="#707070"
          style={{
            paddingHorizontal: 9,
            paddingVertical: 9,
            backgroundColor: '#ffffff',
            height: 51,
          }}
          onPress={() => {
            navigation.push('CouponHistory');
          }}
          onPressIn={() => {
            setThtColor(thtColor => ({...thtColor, [2]: '#FFFFFF'}));
            setThiColor(thiColor => ({...thiColor, [2]: '#FFFFFF'}));
          }}
          onPressOut={() => {
            setThtColor(thtColor => ({...thtColor, [2]: '#707070'})),
              setThiColor(thiColor => ({...thiColor, [2]: '#707070'}));
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingLeft: '3%',
              paddingTop: 9,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Icon
                name="label-outline"
                style={{fontSize: 20, color: 'grey'}}
              />
              <Text
                style={{
                  fontWeight: Platform.OS == 'ios' ? '300' : '700',
                  fontSize: 16,
                  color: thtColor[2],
                }}>
                &nbsp;&nbsp;&nbsp;{i18n.t('my_coupon')}
              </Text>
            </View>
            <Icon name="navigate-next" style={{fontSize: 16, color: 'grey'}} />
          </View>
        </TouchableHighlight>
        <View
          style={{
            borderBottomColor: '#E2E2E2',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        {/* coupon */}
        {/* cs */}
        {/* <TouchableHighlight
          underlayColor="#707070"
          style={{
            paddingHorizontal: 9,
            paddingVertical: 9,
          }}
          onPress={() => {
            navigation.push('CustomerService');
          }}
          onPressIn={() => {
            setThtColor(thtColor => ({...thtColor, [3]: '#FFFFFF'}));
            setThiColor(thiColor => ({...thiColor, [3]: '#FFFFFF'}));
          }}
          onPressOut={() => {
            setThtColor(thtColor => ({...thtColor, [3]: '#707070'})),
              setThiColor(thiColor => ({...thiColor, [3]: '#707070'}));
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingLeft: '3%',
              paddingTop: 9,
            }}>
            <View style={{flexDirection: 'row'}}>
              <OIcon
                name="comment-discussion"
                style={{fontSize: 20, color: 'grey'}}
              />
              <Text
                style={{
                  fontWeight: Platform.OS == 'ios' ? '300' : '700',
                  fontSize: 16,
                  color: thtColor[3],
                }}>
                &nbsp;&nbsp;&nbsp;{i18n.t('client_services')}
              </Text>
            </View>
            <Icon name="navigate-next" style={{fontSize: 16, color: 'grey'}} />
          </View>
        </TouchableHighlight> */}
        <View
          style={{
            borderBottomColor: '#E2E2E2',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        {/* css */}
        {/* logout */}
        <TouchableHighlight
          underlayColor="#707070"
          style={{
            paddingHorizontal: 9,
            paddingVertical: 9,
            backgroundColor: '#ffffff',
            height: 51,
          }}
          onPress={logoutAlert}
          onPressIn={() => {
            setThtColor(thtColor => ({...thtColor, [4]: '#FFFFFF'}));
            setThiColor(thiColor => ({...thiColor, [4]: '#FFFFFF'}));
          }}
          onPressOut={() => {
            setThtColor(thtColor => ({...thtColor, [4]: '#707070'})),
              setThiColor(thiColor => ({...thiColor, [4]: '#707070'}));
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingLeft: '3%',
              paddingTop: 9,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Icon name="logout" style={{fontSize: 20, color: 'grey'}} />
              <Text
                style={{
                  fontWeight: Platform.OS == 'ios' ? '300' : '700',
                  fontSize: 16,
                  color: thtColor[4],
                }}>
                &nbsp;&nbsp;&nbsp;{i18n.t('logout')}
              </Text>
            </View>
            <Icon name="navigate-next" style={{fontSize: 16, color: 'grey'}} />
          </View>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
};
export default User;
