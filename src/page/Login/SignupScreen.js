import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  icon,
  TextInput,
  ScrollView,
  Pressable,
  Platform,
  Modal,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/FontAwesome5';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import CustButtom from '../../component/CustButtom';
import DatePicker from 'react-native-date-picker';
import axios from '../../component/AxiosNet';
import {getUniqueId, getManufacturer} from 'react-native-device-info';
import {useDispatch} from 'react-redux';
import {setUserId, setUserToken, setUserEmail} from '../../redux/actions';
import * as i18n from '../../i18n/i18n';
import {
  appleAuth,
  AppleAuthCredentialState,
  AppleAuthRequestOperation,
  AppleAuthRequestScope,
  AppleButton,
} from '@invertase/react-native-apple-authentication';
import jwt_decode from 'jwt-decode';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import cgaxios from '../../component/ColorGroupAxiosNet';
const Signup = ({navigation}) => {
  i18n.setI18nConfig();
  const dispatch = useDispatch();
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [date, setDate] = useState();
  const [open, setOpen] = useState(false);
  const [userInfo, setUserInfo] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState();
  const [resetEmail, setResetEmail] = useState();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  // const [dob, setDob] = useState();
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
            const {accessToken} = data;
            fetch(
              'https://graph.facebook.com/v2.5/me?fields=email,first_name,last_name,friends&access_token=' +
                accessToken,
            )
              .then(response => {
                response.json().then(async json => {
                  console.log(json);
                  let id = json.id;
                  let email = json.email;
                  //let first_name = json.first_name
                  try {
                    const res = await axios.post('account/loginData', {
                      email,
                      platformLogin: id,
                    });
                    if (res.data.code != 0) {
                      if (res.data.code == 11) {
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
                        } else dispatch(setUserToken(getUniqueId()));
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
      const login = await axios
        .post('account/loginData', {
          email: userInfo.user.email,
          platformLogin: userInfo.user.id,
        })
        .then(res => {
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
            setUserInfo(userInfo);
            dispatch(setUserEmail(email));
            navigation.navigate('Register', {
              email: userInfo.user.email,
              platform: 'google',
              platformLogin: userInfo.user.id,
            });
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
  const rtDate = date => {
    if (date)
      return (
        date.getFullYear() +
        '  年  ' +
        (date.getMonth() + 1) +
        '  月  ' +
        date.getDate() +
        '  日'
      );
  };
  const signup = async () => {
    try {
      const getMemberInfo = await cgaxios.post('common/MemberInfo', {
        AccessCode: 'ColorGroup',
        Phone: phone,
      });

      console.log(getMemberInfo.data);
      var temp = 0;
      if (getMemberInfo.data.data.length !== 0) {
        for (var i = 0; i < getMemberInfo.data.data.length; i++) {
          temp += getMemberInfo.data.data[i].PointsBalance;
        }

        console.log(temp);
        console.log(getMemberInfo.data.data[0].Gender);
        const res = await axios.post('account/registerAdd', {
          email,
          tel: phone,
          password,
          name: getMemberInfo.data.data[0].CardOwner,
          score: temp,
          memberId: getMemberInfo.data.data[0].MemberId,
          branchId: getMemberInfo.data.data[0].BranchId,
          lastStaffId: getMemberInfo.data.data[0].LastStaffId,
          lastStaffNameEn: getMemberInfo.data.data[0].LastStaffNameEn,
          branchName: getMemberInfo.data.data[0].BranchName,
          cardNum: getMemberInfo.data.data[0].CardNum,
          cardOwner: getMemberInfo.data.data[0].CardOwner,
          gender: getMemberInfo.data.data[0].Gender,
          validUntil: getMemberInfo.data.data[0].ValidUntil,
          amountBalance: getMemberInfo.data.data[0].AmountBalance,
          udid: getUniqueId(),
        });

        console.log(res);
        if (res.data.code !== 0) {
          alert(res.data.message);
        } else {
          alert('成功註冊');
          navigation.navigate('Login');
        }
      } else {
        // Handle the case when data1.data.data.length === 0
        console.log('Member Info not found');
        const res = await axios.post('account/registerAdd', {
          email,
          tel: phone,
          password,
          udid: getUniqueId(),
          score: 0,
          amountBalance: 0,
          gender: '女',
        });
        console.log(res);
        if (res.data.code === 0) {
          alert('成功註冊');
          navigation.navigate('Login');
        } else {
          alert(res.data.message);
        }
        // Handle the response for res (if needed)
      }
    } catch (error) {
      console.error('Error occurred:', error);
      // Handle the error appropriately (show an error message, etc.)
    }
  };

  return (
    <ScrollView
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
              paddingHorizontal: 35,
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
              Send recover email
            </Text>
            <TextInput
              style={{
                width: 250,
                height: '15%',
                borderColor: '#707070',
                borderWidth: 1,
                paddingLeft: '3%',
                marginTop: '7%',
                color: 'black',
              }}
              placeholderTextColor={'black'}
              placeholder="電郵地址"
              value={resetEmail}
              onChangeText={text => setResetEmail(text)}
            />
            <TouchableOpacity
              style={{
                borderRadius: 20,
                padding: 10,
                elevation: 2,
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
                send
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderRadius: 20,
                padding: 10,
                elevation: 2,
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
                close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View
        style={{
          marginTop: '4%',
          height: '100%',
        }}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Text
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: 16,
              color: 'black',
              fontWeight: 'bold',
            }}>
            {i18n.t('register_ac')}
          </Text>
        </View>
        <View
          style={{
            marginHorizontal: '10%',
            marginTop: 40,
          }}>
          <View
            style={{
              borderColor: '#707070',
              borderWidth: 1,
              borderRadius: 10,
            }}>
            <TextInput
              style={{
                height: 40,
                marginLeft: '4%',
                fontSize: 12,
                color: 'black',
              }}
              placeholderTextColor={'#707070'}
              placeholder={i18n.t('login_email')}
              onChangeText={text => setEmail(text)}
            />
          </View>
          <View
            style={{
              marginTop: '3%',
              borderColor: '#707070',
              borderWidth: 1,
              borderRadius: 10,
            }}>
            <TextInput
              style={{
                height: 40,
                marginLeft: '4%',
                fontSize: 12,
                color: 'black',
              }}
              placeholderTextColor={'#707070'}
              placeholder={i18n.t('login_phone')}
              onChangeText={text => setPhone(text)}
            />
          </View>
          <View
            style={{
              marginTop: '3%',
              borderColor: '#707070',
              borderWidth: 1,
              borderRadius: 10,
            }}>
            <TextInput
              style={{
                height: 40,
                marginLeft: '4%',
                fontSize: 12,
                color: 'black',
              }}
              secureTextEntry={true}
              placeholderTextColor={'#707070'}
              placeholder={i18n.t('login_password')}
              onChangeText={text => setPassword(text)}
            />
          </View>
          <View
            style={{
              marginTop: '3%',
              borderColor: '#707070',
              borderWidth: 1,
              borderRadius: 10,
            }}>
            <TextInput
              style={{
                height: 40,
                marginLeft: '4%',
                fontSize: 12,
                color: 'black',
              }}
              placeholderTextColor={'#707070'}
              placeholder={i18n.t('login_name')}
              onChangeText={text => setName(text)}
            />
          </View>
          {/* <TouchableOpacity
              style={{
                marginTop: '3%',
                borderColor: '#707070',
                borderWidth: 1,
              }}
              onPress={() => {
                setOpen(true);
              }}>
              <Text
                style={{
                  paddingTop: '3%',
                  height: 40,
                  fontSize: 15,
                  marginLeft: '5%',
                  color: '#707070',
                }}>
                {rtDate(date) || "生日"}
              </Text>
              <DatePicker
                modal
                mode="date"
                open={open}
                date={new Date}
                onConfirm={date => {
                  setOpen(false);
                  setDate(date);
                  setDob(date)
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            </TouchableOpacity> */}
        </View>
        {/* signup CustButtom */}
        <View
          style={{
            marginTop: 46,
          }}>
          {/* <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: '10%',
              }}>
              {Platform.OS === 'ios' ? <CheckBox
                boxType="square"
                style={{ height: 20, width: 20 }}
                disabled={false}
                value={toggleCheckBox}
                onValueChange={newValue => setToggleCheckBox(newValue)}
              /> : <CheckBox
                boxType="square"
                style={{ height: 20, width: 20, marginLeft: '-2.5%' }}
                disabled={false}
                value={toggleCheckBox}
                onValueChange={newValue => setToggleCheckBox(newValue)}
              />}
              <Text style={{ fontSize: 13, marginLeft: '3%' }}>{i18n.t('login_latestinfo')}</Text>
            </View> */}
          {/* <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginHorizontal: '10%', alignItems: 'flex-end' }} >
              <Text style={{ fontSize: 12.5, color: 'black' }}>
                {i18n.t('login_forget_password')}
              </Text>
            </TouchableOpacity> */}
          <CustButtom
            style={{
              width: '80%',
              marginHorizontal: '10%',
              height: 40,
              backgroundColor: '#E3A23B',
              borderRadius: 10,
            }}
            text={i18n.t('signup')}
            textStyle={{fontWeight: '600', color: 'white'}}
            btnFunction={() => signup()}></CustButtom>
        </View>
        {/* or */}
        <View
          style={{
            flexDirection: 'row',
            marginTop: 45,
            marginBottom: 12,
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              width: '40%',
              height: 2,
              backgroundColor: '#babab5',
            }}></View>
          <View style={{width: '20%', bottom: '2%'}}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                color: 'black',
                fontSize: 15,
              }}>
              {i18n.t('login_or')}
            </Text>
          </View>
          <View
            style={{
              width: '40%',
              height: 2,
              backgroundColor: '#babab5',
            }}></View>
        </View>
        {/* login to enjoy */}
        {/* <View   
          style={{
            marginVertical: '1%',
            height: 'auto',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: 14,
              color: 'black',
            }}>
            {i18n.t('login_logintoenjoy')}
          </Text>
        </View> */}
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: '#00000',
              opacity: 0.5,
            }}>
            {i18n.t('login_other_way')}
          </Text>
        </View>
        {/* login other way */}
        <View
          style={{
            height: '100%',
            marginTop: 24,
            display: 'flex',
            flexDirection: 'row-reverse',
            justifyContent: 'space-around',
            paddingHorizontal: 85,
          }}>
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
              </TouchableOpacity>
            </View>
          </View>
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

          {/* <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text
              style={{ textAlign: 'center', fontSize: 15, fontWeight: '600' }}>
              {i18n.t('login_keep_email')}
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>

      <View style={{marginHorizontal: '20%'}}>
        <Text style={{textAlign: 'center', fontSize: 12}}>
          <Text style={{opacity: 0.5}}>
            {i18n.t('login_whencreateagree')}
            {'\n'}
          </Text>
          <Text style={{fontWeight: 'bold', color: 'black', opacity: 1}}>
            {i18n.t('login_tandc')}
          </Text>
          <Text style={{opacity: 0.5}}>{i18n.t('login_and')}</Text>
          <Text style={{fontWeight: 'bold', color: 'black'}}>
            {i18n.t('login_pp')}
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
};

export default Signup;
