import React, {useState, useEffect} from 'react';
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  Image,
  SafeAreaView,
  Platform,
  StyleSheet,
} from 'react-native';
import * as i18n from '../../i18n/i18n';
import {useSelector, useDispatch} from 'react-redux';
import axios from '../../component/AxiosNet';
import {setUserToken, setUserId} from '../../redux/actions';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

import * as ImagePicker from 'react-native-image-picker';
import {set} from 'lodash';

const MyAccountScreen = ({navigation}) => {
  const [showChangeImg, setShowChangeImg] = useState(false);

  const [userInfo, setUserInfo] = useState([]);
  const [userImg, setUserImg] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAddress, setUserAddress] = useState('');

  i18n.setI18nConfig();
  const {userId} = useSelector(state => state.loginReducer);

  const dispatch = useDispatch();
  //img
  const [response, setResponse] = useState(null);
  const includeExtra = true;

  async function fetchMyAPI() {
    const userInfo = await axios.get('user/getUserInfoPhone', {
      params: {
        uid: userId,
      },
    });
    if (userInfo) {
      setUserInfo(userInfo.data.data);
      setUserImg(userInfo.data.data.headImg);
      setUserName(userInfo.data.data.name);
      setUserEmail(userInfo.data.data.email);
      setUserAddress(userInfo.data.data.address);
    }
  }

  const imgPicker = React.useCallback(() => {
    launchImageLibrary(
      {
        maxHeight: 200,
        maxWidth: 200,
        selectionLimit: 0,
        mediaType: 'photo',
        includeBase64: false,
        includeExtra,
      },
      response => {
        if (response.assets[0].uri) {
          setUserImg(response.assets[0].uri);
          setShowChangeImg(false);
          console.log(response.assets[0]);
          var form = new FormData();
          form.append('img', {
            uri:
              Platform.OS === 'android'
                ? `file:///${userImg}`
                : userImg == '' || null
                ? require('../../img/userImg.png')
                : {uri: userImg},
            type: 'image/jpeg',
            name: response.assets[0].fileName,
          });
        }
      },
    );
  });
  async function delUser() {
    Alert.alert(i18n.t('del_ac'), '', [
      {
        text: i18n.t('logout_q_no'),
        style: 'cancel',
      },
      {
        text: i18n.t('logout_q_yes'),
        onPress: async () => {
          const userInfo = await axios
            .post('account/delAcc', {
              uid: userId,
              type: 'phone',
            })
            .then(function (response) {
              if (response.data.code == 200) {
                dispatch(setUserToken(null));
                dispatch(setUserId(null));
                navigation.navigate('UserScreen');
              }
            });
        },
      },
    ]);
  }
  async function saveUser() {
    const userInfo = await axios
      .post('user/saveUserInfo', {
        id: userId,
        name: userName,
        address: userAddress,
        //email: userEmail
      })
      .then(function (response) {
        console.log(response);
        navigation.pop();
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
  }, []);

  return (
    <SafeAreaView style={{backgroundColor: '#F7F7F7', height: '100%'}}>
      <View
        style={{
          marginTop: '10%',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 12,
        }}>
        <View
          //profile pic
          style={{
            height: '30%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              // setShowChangeImg(!showChangeImg);
              console.log();
            }}>
            {!showChangeImg ? (
              <>
                <Image
                  style={{
                    opacity: 1,
                    borderRadius: 100,
                    height: 126,
                    width: 126,
                  }}
                  source={
                    userImg ? {uri: userImg} : require('../../img/userImg.png')
                  }
                />
              </>
            ) : (
              <>
                {false ? (
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#112222',
                      borderRadius: 15,
                      zIndex: 1,
                      position: 'absolute',
                      height: '5%',
                      top: '15%',
                      margin: '5%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onPress={async () => {
                      try {
                        imgPicker();
                      } catch (e) {}
                    }}>
                    <Text
                      style={{color: 'white', fontWeight: '800', fontSize: 15}}>
                      {i18n.t('ch_photo')}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <></>
                )}
                <Image
                  style={{
                    opacity: 0.2,
                    borderWidth: Platform.OS === 'ios' ? 0.33 : 1,
                    borderRadius: 100,
                    height: 130,
                    width: 130,
                  }}
                  source={{uri: userImg ? userImg : ''}}
                />
              </>
            )}
          </TouchableWithoutFeedback>
          {/* <Text style={{marginTop: '4%', fontSize: 16, fontWeight: 'bold'}}>
            {userInfo.Name}
          </Text> */}
        </View>
        {/* info column */}
        <View
          style={{
            paddingHorizontal: 13,
            marginTop: 23,
            marginBottom: 40,
            width: '100%',
            height: 199,
            borderRadius: 10,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: Platform.OS === 'ios' ? 3 : 3,
            },
            shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0.2,
            shadowRadius: Platform.OS === 'ios' ? 3 : 3,
          }}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              marginLeft: '5%',
              marginTop: Platform.OS === 'ios' ? 30 : 20,
              marginBottom: Platform.OS === 'ios' ? 16 : 0,
            }}>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <Text
                style={{fontSize: 18, fontWeight: 'normal', color: '#6A6A6A'}}>
                {i18n.t('login_name')}
              </Text>
            </View>

            <TextInput
              style={{
                fontSize: 14,
                fontWeight: Platform.OS == 'ios' ? '200' : '700',
                color: '#88888',
              }}
              onChangeText={test => {
                setUserName(test);
              }}
              value={userName}
              maxLength={30}
              placeholder="please input user name!"
            />
          </View>
          <View
            style={{
              borderBottomColor: '#E2E2E2',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              marginLeft: '5%',
              marginTop: Platform.OS === 'ios' ? 18 : 0,
              marginBottom: Platform.OS === 'ios' ? 16 : 0,
            }}>
            <View
              style={{
                width: '25%',

                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <Text
                style={{fontSize: 18, fontWeight: 'normal', color: '#6A6A6A'}}>
                {i18n.t('login_email')}
              </Text>
            </View>
            <TextInput
              editable={false}
              selectTextOnFocus={false}
              style={{
                fontSize: 14,
                fontWeight: Platform.OS == 'ios' ? '200' : '700',
              }}
              onChangeText={test => {
                setUserEmail(test);
              }}
              value={userEmail}
              maxLength={30}
              placeholder="please input your email!"
            />
          </View>
          <View
            style={{
              borderBottomColor: '#E2E2E2',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              marginLeft: '5%',
              marginTop: Platform.OS === 'ios' ? '4%' : 0,
              marginBottom: Platform.OS === 'ios' ? 16 : 0,
            }}>
            <View
              style={{
                width: '25%',
                justifyContent: 'center',
                alignContent: 'center',
              }}>
              <Text
                style={{fontSize: 18, fontWeight: 'normal', color: '#6A6A6A'}}>
                {i18n.t('login_address')}
              </Text>
            </View>
            <TextInput
              selectTextOnFocus={false}
              style={{
                fontSize: 15,
                fontWeight: Platform.OS == 'ios' ? '200' : '700',
              }}
              onChangeText={text => {
                setUserAddress(text);
              }}
              value={userAddress}
              maxLength={30}
              placeholder="please input your address!"
            />
          </View>
          <View
            style={{
              borderBottomColor: '#E2E2E2',
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />
        </View>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
          }}>
          {/* save btn */}
          <TouchableOpacity onPress={() => saveUser()}>
            <View
              style={{
                height: 50,
                width: '100%',
                backgroundColor: '#E5A43C',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                {i18n.t('search_save')}
              </Text>
            </View>
          </TouchableOpacity>
          {/* del acct */}
          <TouchableOpacity
            onPress={() => delUser()}
            style={{
              height: 50,
              marginTop: 10,
              backgroundColor: 'red',
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#F04E96',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}>
            <Text
              style={{
                fontSize: 16,
                color: 'black',
              }}>
              {i18n.t('del_ac')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default MyAccountScreen;
