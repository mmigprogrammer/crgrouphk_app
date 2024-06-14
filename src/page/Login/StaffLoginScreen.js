import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  icon,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Modal,
  Platform,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import CustButtom from '../../component/CustButtom';
import axios from '../../component/AxiosNet';
import * as i18n from '../../i18n/i18n';
import {useSelector, useDispatch} from 'react-redux';
import {
  setUserId,
  setUserToken,
  setUserEmail,
  setUserMemberId,
} from '../../redux/actions';
import {useIsFocused} from '@react-navigation/native';
import {getUniqueId} from 'react-native-device-info';
import {
  appleAuth,
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import jwt_decode from 'jwt-decode';
import {LoginManager, Profile, AccessToken} from 'react-native-fbsdk-next';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {isIOS} from 'react-native-elements/dist/helpers';
import {uri} from '@env';

const StaffLoginScreen = ({navigation, route}) => {
  i18n.setI18nConfig();
  const {userToken, userEmail} = useSelector(state => state.loginReducer);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState(userEmail);
  const [userName, setUserName] = useState(userName);
  const [resetEmail, setResetEmail] = useState(userEmail);
  const [resetUserName, setResetUserName] = useState(userName);
  const [userInfo, setUserInfo] = useState();
  const [password, setPassword] = useState('');
  const isFocused = useIsFocused();
  useEffect(() => {
    setUserName(userName);
  }, [isFocused]);
  useEffect(() => {
    GoogleSignin.configure();
    // onCredentialRevoked returns a function that will remove the event listener. useEffect will call this function when the component unmounts
    if (Platform.OS == 'ios') {
      return appleAuth.onCredentialRevoked(async () => {
        console.warn(
          'If this function executes, User Credentials have been Revoked',
        );
      });
    }
  }, []); // passing in an empty array as the second argument ensures this is only ran once when component mounts initially.

  const login = async () => {
    try {
      const res = await axios.post('account/StaffLoginData', {
        userName,
        password,
        udid: getUniqueId(),
      });
      if (res.data.code != 0) {
        alert(res.data.message);
      } else {
        console.log(res.data.data.userInfo.uid);
        //if (res.data.data.userInfo.isVerified == 1) {

        dispatch(setUserId(res.data.data.userInfo.uid));
        dispatch(setUserMemberId(res.data.data.userInfo.memberId));
        if (res.data.data.userInfo.udid) {
          dispatch(setUserToken(res.data.data.userInfo.udid));
        } else dispatch(setUserToken(getUniqueId()));
        navigation.navigate('Home');
      }
    } catch (error) {
      alert(error);
    }
  };

  const OpenURL = async url => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`wrong url : ${url}`);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View
        style={{
          height: '100%',
          backgroundColor: '#F5F5F5',
        }}>
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
                height: 250,
                margin: 20,
                backgroundColor: 'white',
                borderRadius: 20,

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
              <Text style={{fontWeight: '700', fontSize: 20, paddingTop: 35}}>
                {i18n.t('login_recover_email')}
              </Text>
              <TextInput
                style={{
                  width: 250,
                  height: '15%',
                  borderColor: 'gray',
                  borderWidth: 1,
                  paddingLeft: '3%',
                  marginTop: '7%',
                }}
                placeholderTextColor={'gray'}
                placeholder={'userName'}
                value={resetUserName}
                onChangeText={text => setResetUserName(text)}
              />
              <TouchableOpacity
                style={{
                  borderRadius: 20,
                  padding: 10,
                  elevation: isIOS ? 2 : 0,
                }}
                onPress={() => {
                  forgotPw();
                }}>
                <Text
                  style={{
                    backgroundColor: '#2dcc5d',
                    textAlign: 'center',
                    borderRadius: 10,
                    width: 90,
                    marginTop: 20,
                    overflow: 'hidden',
                    fontSize: 20,
                  }}>
                  {i18n.t('send')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  borderRadius: 20,
                  padding: 10,
                  elevation: isIOS ? 2 : 0,
                }}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}>
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
        {/* view start */}
        <View
          style={{
            marginTop: '4%',
            height: '100%',
          }}>
          <View
            style={{
              alignItems: 'center',
              marginBottom: 42,
            }}>
            <Text
              style={{
                width: '100%',
                textAlign: 'center',
                fontSize: 16,
                color: 'black',
                fontWeight: 'bold',
              }}>
              {i18n.t('login_welcome')}
            </Text>
          </View>
          {/* login for enjoy text */}
          {/* <View
            style={{
              marginVertical: '1%',
              height: 'auto',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                paddingHorizontal: '10%',
                textAlign: 'center',
                fontSize: 14,
                color: 'black',
              }}>
              {i18n.t('login_logintoenjoy')}
            </Text>
          </View> */}

          <View
            style={{
              paddingHorizontal: 32,
            }}>
            {/* account */}
            <View
              style={{
                height: 41,
              }}>
              <TextInput
                style={{
                  height: 41,
                  width: 326,
                  borderColor: 'gray',
                  borderWidth: 1,
                  paddingLeft: '3%',
                  borderRadius: 10,
                  fontSize: 12,
                  color: '#585858',
                }}
                placeholderTextColor={'gray'}
                placeholder={'userName'}
                value={userName}
                onChangeText={text => setUserName(text)}
              />
            </View>
            {/* password */}
            <View
              style={{
                marginTop: '3%',
                height: 41,
              }}>
              <TextInput
                style={{
                  height: 41,
                  width: 326,
                  borderColor: 'gray',
                  borderWidth: 1,
                  paddingLeft: '3%',
                  borderRadius: 10,
                  fontSize: 12,
                  color: '#585858',
                }}
                placeholderTextColor={'gray'}
                secureTextEntry={true}
                placeholder={i18n.t('login_password')}
                onChangeText={text => setPassword(text)}
              />
            </View>
            {/* forgetpassword */}

            {/* login btn */}
            <View
              style={{
                height: '6.5%',
                marginTop: 25,
              }}>
              <CustButtom
                style={{
                  borderRadius: 10,
                  width: 324,
                  height: 36,
                  backgroundColor: '#E3A23B',
                }}
                text={i18n.t('login')}
                btnFunction={() => {
                  login();
                }}
                textStyle={{fontWeight: '600', color: 'white', fontSize: 16}}
              />
            </View>
            <View
              style={{
                height: '6.5%',
                marginTop: 25,
              }}>
              <CustButtom
                style={{
                  borderRadius: 10,
                  width: 324,
                  height: 36,
                  borderWidth: 1,
                  borderColor: '#E3A23B',
                }}
                text={i18n.t('member_login')}
                btnFunction={() => {
                  navigation.navigate('Login');
                }}
                textStyle={{fontWeight: '600', color: '#E3A23B', fontSize: 16}}
              />
            </View>
          </View>

          {/* login other way */}

          {/* tandc */}

          {/* sign up now */}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default StaffLoginScreen;
