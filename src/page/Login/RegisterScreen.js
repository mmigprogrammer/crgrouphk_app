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
  Image,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import CustButtom from '../../component/CustButtom';
import axios from '../../component/AxiosNet';
import * as i18n from '../../i18n/i18n';
import {useSelector, useDispatch} from 'react-redux';
import {setUserId, setUserToken, setUserEmail} from '../../redux/actions';
import {useIsFocused} from '@react-navigation/native';
import {getUniqueId} from 'react-native-device-info';
import DatePicker from 'react-native-date-picker';
import {uri} from '@env';
import appleAuth from '@invertase/react-native-apple-authentication';

const Register = ({route, navigation}) => {
  i18n.setI18nConfig();
  const {userToken, userEmail} = useSelector(state => state.loginReducer);
  const dispatch = useDispatch();

  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [date, setDate] = useState();
  const [open, setOpen] = useState(false);

  const [email, setEmail] = useState(route.params.email);
  const [platform, setPlatform] = useState(route.params.platform);

  const [password, setPassword] = useState(route.params.platform == 'apple' ? '12345678' : '');
  const [name, setName] = useState(route.params.name);
  const [tel, setTel] = useState('');

  const [dob, setDob] = useState();

  const isFocused = useIsFocused();

  const checkPW = password => {
    const isWhitespace = /^(?=.*\s)/;
    if (isWhitespace.test(password)) {
      return 'Password must not contain Whitespaces.';
    }

    //  const isContainsUppercase = /^(?=.*[A-Z])/;
    //  if (!isContainsUppercase.test(password)) {
    //    return 'Password must have at least one Uppercase Character.';
    //  }
    //  const isContainsLowercase = /^(?=.*[a-z])/;
    //  if (!isContainsLowercase.test(password)) {
    //    return 'Password must have at least one Lowercase Character.';
    //  }
    const isContainsNumber = /^(?=.*[0-9])/;
    if (!isContainsNumber.test(password)) {
      return 'Password must contain at least one Digit.';
    }
    //  const isContainsSymbol = /^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/;
    //  if (!isContainsSymbol.test(password)) {
    //    return 'Password must contain at least one Special Symbol.';
    //  }
    const isValidLength = /^.{8,16}$/;
    if (!isValidLength.test(password)) {
      return 'Password must be 8-16 Characters Long.';
    }
    return null;
  };

  

  const signup = async () => {
    console.log(route.params);
    console.log(tel);
    console.log(password);
    console.log(name);
    console.log(getUniqueId());

    if (!email) {
      alert('Please input email!');
    } else if (!name && platform !== 'apple') {
      alert('Please input your name!');
    } else if (!tel || tel.length <= 7) {
      alert('Please input your phone currently!');
    } else if (!password) {
      alert('Please input password!');
    } else {
      let msg = checkPW(password);
      const isValidateEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!isValidateEmail.test(email)) {
        return 'Email not validate.';
      }
      if (msg) {
        alert(msg);
      } else {
        const res = await axios
          .post('account/registerAdd', {
            email,
            password,
            name,
            platform: route.params.platform,
            platformLogin: route.params.platformLogin,
            //date: dob,
            udid: getUniqueId(),
            tel,
          })
          .then(data => {
            if (data.data.code != 0) {
              alert(data.data.message);
            } else if (data.data.code == 0) {
              console.log(data.data);
              alert(data.data.message);
              dispatch(setUserEmail(email));
              dispatch(setUserId(data.data.id));
              dispatch(setUserToken(getUniqueId()));
              navigation.navigate('Home');
            }
          })
          .catch(error => {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
          });
      }
    }
  };

  const rtDate = date => {
    if (date) {
      return (
        date.getFullYear() +
        '  年  ' +
        (date.getMonth() + 1) +
        '  月  ' +
        date.getDate() +
        '  日'
      );
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View
        style={{
          marginTop: '4%',
          height: '100%',
        }}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '30%',
          }}>
          <Image
            style={{width: '80%', height: '100%'}}
            resizeMode="contain"
            source={{uri: uri + '/Public/image/favicon.ico'}}
          />
        </View>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Text
            style={{
              width: '100%',
              textAlign: 'center',
              fontSize: 18,
              color: 'black',
              fontWeight: 'bold',
            }}>
            {i18n.t('login_input_register')}
          </Text>
        </View>
        <View
          style={{
            marginVertical: '1%',
            height: 30,
            justifyContent: 'center',
          }}
        />
        <View
          style={{
            height: '100%',
          }}>
          <View style={{marginHorizontal: '10%', marginTop: '2%'}}>
            {!email ? (
              <View
                style={{
                  marginTop: '3%',
                  borderColor: 'gray',
                  borderWidth: 1,
                }}>
                <TextInput
                  style={{
                    height: 40,
                    marginLeft: '4%',
                    color: 'black',
                  }}
                  placeholderTextColor={'gray'}
                  placeholder={i18n.t('login_email')}
                  onChangeText={text => setEmail(text)}
                />
              </View>
            ) : (
              <></>
            )}
            <View
              style={{
                marginTop: '3%',
                borderColor: 'gray',
                borderWidth: 1,
              }}>
              <TextInput
                style={{
                  height: 40,
                  marginLeft: '4%',
                  display: platform == 'apple' ? 'none' : 'flex',
                  color: 'black',
                }}
                placeholderTextColor={'gray'}
                placeholder={i18n.t('login_name')}
                onChangeText={text => setName(text)}
              />
            </View>
            <View
              style={{
                marginTop: '3%',
                borderColor: 'gray',
                borderWidth: 1,
              }}>
              <TextInput
                style={{
                  height: 40,
                  marginLeft: '4%',
                  color: 'black',
                }}
                placeholderTextColor={'gray'}
                placeholder={i18n.t('login_phone')}
                onChangeText={text => setTel(text)}
              />
            </View>
            <View
              style={{
                marginTop: '3%',
                borderColor: 'gray',
                borderWidth: 1,
                display: platform == 'apple' ? 'none' : 'flex'
              }}>
              <TextInput
                style={{
                  height: 40,
                  marginLeft: '4%',
                  color: 'black',
                }}
                secureTextEntry={true}
                placeholderTextColor={'gray'}
                placeholder={i18n.t('login_password')}
                onChangeText={text => setPassword(text)}
              />
            </View>
            <TouchableOpacity
              style={{
                marginTop: '3%',
                borderColor: 'gray',
                borderWidth: 1,
              }}
              onPress={() => {
                setOpen(true);
              }}>
              {/* <Text
                style={{
                  paddingTop: '3%',
                  height: 40,
                  fontSize: 15,
                  marginLeft: '5%',
                  color: 'gray',
                }}>
                {rtDate(date) || '生日'}
              </Text>
              <DatePicker
                modal
                mode="date"
                open={open}
                date={new Date()}
                onConfirm={date => {
                  setOpen(false);
                  setDate(date);
                  setDob(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              /> */}
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: '1%',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: '10%',
                marginVertical: '3%',
              }}>
              {Platform.OS === 'ios' ? (
                <CheckBox
                  boxType="square"
                  style={{height: 20, width: 20}}
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                />
              ) : (
                <CheckBox
                  boxType="square"
                  style={{height: 20, width: 20, marginLeft: '-2.5%'}}
                  disabled={false}
                  value={toggleCheckBox}
                  onValueChange={newValue => setToggleCheckBox(newValue)}
                />
              )}
              <Text style={{fontSize: 13, marginLeft: '3%'}}>
                {i18n.t('login_latestinfo')}
              </Text>
            </View>
            <CustButtom
              style={{
                width: '80%',
                marginHorizontal: '10%',
                height: 40,
                backgroundColor: '#d1d1d1',
                marginTop: '1%',
              }}
              text={i18n.t('submit')}
              textStyle={{fontWeight: '800'}}
              btnFunction={() => signup()}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default Register;
