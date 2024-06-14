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

const Login = ({navigation, route}) => {
  i18n.setI18nConfig();
  const {userToken, userEmail} = useSelector(state => state.loginReducer);
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState(userEmail);
  const [resetEmail, setResetEmail] = useState(userEmail);
  const [userInfo, setUserInfo] = useState();
  const [password, setPassword] = useState('');
  const isFocused = useIsFocused();
  useEffect(() => {
    setEmail(userEmail);
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
  const forgotPw = async () => {
    if (resetEmail) {
      const res = await axios.post('account/sendRecoverPWEmail', {
        email: resetEmail,
      });
      if (res.data.code == '200') {
        alert('Recovery email sent.');
        setModalVisible(!modalVisible);
      } else {
        alert('Please check the email is correct');
      }
    } else {
      alert('please fill your email!');
    }
  };
  const connectfb = async () => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      result => {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          console.log(
            'Login success with permissions: ' +
              result.grantedPermissions.toString(),
          );
          AccessToken.getCurrentAccessToken().then(data => {
            console.log(data);
            const {accessToken} = data;
            fetch(
              'https://graph.facebook.com/v2.5/me?fields=email,first_name,last_name,friends&access_token=' +
                accessToken,
            )
              .then(response => {
                response.json().then(async json => {
                  let id = json.id;
                  console.log(json);
                  let email = json.email;
                  try {
                    const res = await axios.post('account/loginData', {
                      email,
                      platformLogin: id,
                    });
                    if (res.data.code != 0) {
                      if (res.data.code == 11) {
                        console.log();
                        navigation.navigate('Register', {
                          email,
                          platformLogin: id,
                          platform: 'facebook',
                        });
                      } else {
                        alert(res.data.message);
                      }
                    } else {
                      if (res.data.data.userInfo.isVerified == 1) {
                        dispatch(setUserEmail(email));
                        dispatch(setUserId(res.data.data.userInfo.uid));
                        if (res.data.data.userInfo.udid) {
                          dispatch(setUserToken(res.data.data.userInfo.udid));
                        } else {
                          dispatch(setUserToken(getUniqueId()));
                        }
                        navigation.navigate('Home');
                      }
                    }
                  } catch (error) {
                    alert(error);
                  }
                });
              })
              .catch(() => {
                console.log('ERROR GETTING DATA FROM FACEBOOK');
              });
          });
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error);
      },
    );
  };
  const onAppleButtonPress = async () => {
    // performs login request
    const x = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(x.user);
    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
      const {email, email_verified, is_private_email, sub} = jwt_decode(
        x.identityToken,
      );
      try {
        const res = await axios.post('account/loginData', {
          email,
          platformLogin: x.user,
        });
        if (res.data.code != 0) {
          //console.log(res);
          if (res.data.code == 11) {
            console.log(res);
            //dispatch(setUserEmail(email));
            //navigation.navigate('Register', { email, platformLogin: x.user, platform: 'apple' });
            navigation.navigate('Register', {
              email,
              platformLogin: x.user,
              platform: 'apple',
            });
            // if (res1.data.code != 0) {
            //   console.log(res1.data);s
            //   alert(res1.data.message);
            // } else if (res1.data.code == 0) {
            //   console.log(res1.data);
            //   const login = await axios.post('account/loginData', {
            //     email,
            //     platformLogin: x.user,
            //   });
            //   if (login) {
            //     console.log(res.data);

            //     //go Register, Register page check is apple button go login , if true only need phone input
            //     // alert(res.data.message);
            //     // dispatch(setUserId(res.data.id));
            //     // dispatch(setUserToken(getUniqueId()));
            //     //navigation.navigate('Home');
            //   }
            // }
          } else {
            //console.log(res.data);
            alert(res.data.message);
          }
        } else {
          if (res.data.data.userInfo.isVerified == 1) {
            dispatch(setUserEmail(email));
            dispatch(setUserId(res.data.data.userInfo.uid));
            if (res.data.data.userInfo.udid) {
              dispatch(setUserToken(res.data.data.userInfo.udid));
            } else {
              dispatch(setUserToken(getUniqueId()));
            }
            navigation.navigate('Home');
          }
        }
      } catch (error) {
        alert(error);
      }
    }
  };
  const googleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo.user.email);
      console.log(userInfo.user.id);
      const login = await axios
        .post('account/loginData', {
          email: userInfo.user.email,
          platformLogin: userInfo.user.id,
        })
        .then(res => {
          console.log(res.data);
          navigation.navigate('Register', {
            email: userInfo.user.email,
            platform: 'google',
            platformLogin: userInfo.user.id,
          });
          if (res.data.code == 0) {
            alert(res.data.message);
            dispatch(setUserId(res.data.data.userInfo.uid));
            dispatch(setUserToken(getUniqueId()));
            navigation.navigate('Home');
          } else {
            console.log(res.data);
            setUserInfo(userInfo);
            dispatch(setUserEmail(email));
          }
        });
    } catch (error) {
      console.log('=====');

      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        alert('登入已取消');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        alert('處理中，請等候片刻');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        alert('Google play services not available, please try the other way.');
      } else {
        // some other error happened
        alert('錯誤代碼： ' + error.code);
      }
    }
  };
  try {
    setEmail(route.params.email);
  } catch {}
  const login = async () => {
    try {
      const res = await axios.post('account/loginData', {
        email,
        password,
        udid: getUniqueId(),
      });
      if (res.data.code != 0) {
        alert(res.data.message);
        //console.log(res.data);
      } else {
        console.log(res.data.data.userInfo.uid);
        //if (res.data.data.userInfo.isVerified == 1) {

        dispatch(setUserEmail(email));
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
                  color: 'black',
                }}
                placeholderTextColor={'gray'}
                placeholder={i18n.t('login_email')}
                value={resetEmail}
                onChangeText={text => setResetEmail(text)}
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
                placeholder={i18n.t('login_email')}
                value={email}
                onChangeText={text => setEmail(text)}
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
            <View
              style={{
                flexDirection: 'row',
                marginTop: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '60%',
                }}
              />
              <View
                style={{
                  justifyContent: 'flex-end',
                  width: '40%',
                }}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Text
                    style={{
                      fontSize: 12,
                      color: 'black',
                      textAlign: 'right',
                      fontWeight: '300',
                    }}>
                    {i18n.t('login_forget_password')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
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
                  borderColor: '#E3A23B',
                  borderWidth: 1,
                }}
                text={i18n.t('staff_login')}
                btnFunction={() => {
                  //alert('123');
                  navigation.navigate('StaffLogin');
                }}
                textStyle={{fontWeight: '600', color: '#E3A23B', fontSize: 16}}
              />
            </View>
          </View>

          {/* or  */}
          <View
            style={{
              flexDirection: 'row',
              marginTop: 42,
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                width: '40%',
                height: 2,
                backgroundColor: '#babab5',
              }}
            />
            <View style={{width: '20%', bottom: '2%'}}>
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  color: 'black',
                  fontSize: 16,
                }}>
                {i18n.t('login_or')}
              </Text>
            </View>
            <View
              style={{
                width: '40%',
                height: 2,
                backgroundColor: '#babab5',
              }}
            />
          </View>
          {/* login other way */}
          <View
            style={{
              marginTop: 24,
              display: 'flex',
              flexDirection: 'row-reverse',
              justifyContent: 'space-around',
              paddingHorizontal: 85,
            }}>
            {/* facebook */}
            <View
              style={{
                marginHorizontal: '10%',
                backgroundColor: 'white',
                width: 48,
                height: 48,
                borderRadius: 50,
                borderColor: '#707070',
                borderWidth: 1,
              }}>
              <View style={{}}>
                <TouchableOpacity
                  onPress={connectfb}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}>
                  <EvilIcon
                    style={{bottom: '0.5%'}}
                    color="#464343"
                    name="sc-facebook"
                    size={35}
                  />
                  {/* <Text
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      color: 'white',
                    }}>
                    {i18n.t('facebook_login')}
                  </Text> */}
                </TouchableOpacity>
              </View>
            </View>
            {/* ios */}
            {Platform.OS == 'ios' ? (
              <View
                style={{
                  marginHorizontal: 30,
                  backgroundColor: 'white',
                  width: 48,
                  height: 48,
                  borderRadius: 50,
                  borderColor: '#707070',
                  borderWidth: 1,
                }}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                  }}
                  onPress={() => onAppleButtonPress()}>
                  <Icon
                    style={{bottom: '0.5%'}}
                    color="#464343"
                    name="apple"
                    size={30}
                  />
                  {/* <Text
                    style={{
                      fontSize: 15,
                      fontWeight: 'bold',
                      color: '#464343',
                    }}>
                    {i18n.t('use_apple_login')}
                  </Text> */}
                </TouchableOpacity>
              </View>
            ) : (
              <></>
            )}
            {/* google */}
            <View
              style={{
                marginHorizontal: '10%',
                backgroundColor: 'white',
                width: 48,
                height: 48,
                borderRadius: 50,
                borderColor: '#707070',
                borderWidth: 1,
              }}>
              <TouchableOpacity
                onPress={googleLogin}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                }}>
                <Icon
                  style={{bottom: '0.5%'}}
                  color="#464343"
                  name="google"
                  size={25}
                />
                {/* <Text
                  style={{
                    fontSize: 15,
                    fontWeight: 'bold',
                    color: '#fff',
                  }}>
                  {i18n.t('use_google_login')}
                </Text> */}
              </TouchableOpacity>
            </View>
          </View>
          {/* tandc */}
          <View style={{marginHorizontal: '20%', marginTop: 24}}>
            <Text style={{textAlign: 'center', fontSize: 12, color: 'gray'}}>
              {i18n.t('login_whencreateagree')}
              {'\n'}
              <Text
                style={{fontWeight: 'bold', color: 'black'}}
                onPress={() => OpenURL(uri + 'index.php/Home/index/tandc')}>
                {i18n.t('login_tandc')}
              </Text>
              &nbsp;{i18n.t('login_and')}&nbsp;
              <Text
                style={{fontWeight: 'bold', color: 'black'}}
                onPress={() => {
                  OpenURL(uri + 'index.php/Home/index/privacy_policy');
                }}>
                {i18n.t('login_pp')}
              </Text>
            </Text>
          </View>
          {/* sign up now */}
          <View style={{marginTop: 26}}>
            <Text style={{textAlign: 'center', fontSize: 12.5, color: 'gray'}}>
              {i18n.t('login_noaccount')}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text
                style={{
                  color: '#65C091',
                  textAlign: 'center',
                  fontSize: 12.5,
                  fontWeight: 'bold',
                }}>
                {i18n.t('login_registernow')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default Login;
