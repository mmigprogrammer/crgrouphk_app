import React, {useState, AsyncStorage} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Linking,
  StyleSheet,
  Image,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import * as i18n from '../../i18n/i18n';
import Icon from 'react-native-vector-icons/MaterialIcons';
import EntyIcon from 'react-native-vector-icons/Entypo';

import {useIsFocused} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {
  setLanguage,
  setDeliver,
  setCurrency,
  setNotifications,
} from '../../redux/actions';
import axios from '../../component/AxiosNet';
import {uri} from '@env';
import style from '../../utils/style';

const Setting = ({navigation}) => {
  i18n.setI18nConfig();
  const {language, deliver, currency, notifications} = useSelector(
    state => state.settingReducer,
  );
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  async function changeLang(lang) {
    if (lang == 'zh_tw') {
      await axios.get('/', {
        params: {
          l: 'zh-tw',
        },
      });
    } else if (lang == 'zh_cn') {
      await axios.get('/', {
        params: {
          l: 'zh-cn',
        },
      });
    } else if (lang == 'en') {
      await axios.get('/', {
        params: {
          l: 'en-us',
        },
      });
    }
  }

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
    <View
      style={{
        flex: 1,
        backgroundColor: '#F6F6F6',
      }}>
      <View
        style={{
          marginTop: 16,
          height: 250,
          width: '90%',
          marginHorizontal: '5%',
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          borderRadius: 10,
          paddingHorizontal: 5,
        }}>
        {/* area */}
        <View
          style={{
            height: 56,
            paddingHorizontal: 9,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <EntyIcon
              name="location-pin"
              style={{
                fontSize: 21,
                color: '#6A6A6A',
                marginRight: 10,
              }}></EntyIcon>
            <Text style={{fontSize: 16, color: '#6A6A6A'}}>
              {i18n.t('setting_area')}
            </Text>
          </View>
          <View>
            <RNPickerSelect
              onValueChange={(itemValue, itemIndex) => {
                dispatch(setDeliver(itemValue));
              }}
              value={deliver || 'HK'}
              items={[
                {label: 'Taiwan', value: 'TW'},
                {label: 'United Kingdom', value: 'UK'},
                {label: 'United States', value: 'US'},
                {label: 'Hong Kong', value: 'HK'},
                {label: 'China', value: 'CN'},
              ]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: '#6A6A6A'}}>{deliver}</Text>
                <Icon
                  style={{fontSize: 12, color: '#6A6A6A'}}
                  name="navigate-next"
                />
              </View>
            </RNPickerSelect>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: '#E2E2E2',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        {/* <View style={{ flex: 0.1, flexDirection: 'row', alignItems: 'center', borderBottomWidth: Platform.OS==='ios'?0.33:1, justifyContent: 'space-between', paddingLeft: '3%' }}>
          <Text>{i18n.t('setting_currency')}</Text>

          <RNPickerSelect
            onValueChange={(itemValue, itemIndex) => {
              dispatch(setCurrency(itemValue));
            }}
            value={currency || 'en'}
            items={[
              { label: 'TWD', value: 'TWD' },
              { label: 'USD', value: 'USD' },
              { label: 'HKD', value: 'HKD' },
              { label: 'RMB', value: 'RMB' },
            ]} >
            <View
              style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text>{currency}</Text>
              <Icon style={{ fontSize: 35 }} name="navigate-next" />
            </View>
          </RNPickerSelect>
        </View> */}
        {/* language */}
        <View
          style={{
            height: 56,
            paddingHorizontal: 9,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              style={{
                width: 16,
                height: 16,
                marginRight: 13,
              }}
              source={require('../../img/Language.png')}
            />
            <View>
              <Text style={{fontSize: 16, color: '#6A6A6A'}}>
                {i18n.t('setting_language')}
              </Text>
            </View>
          </View>
          <View>
            <RNPickerSelect
              onValueChange={(itemValue, itemIndex) => {
                dispatch(setLanguage(itemValue));
                changeLang(itemValue);
              }}
              value={language}
              items={[
                {label: 'English', value: 'en'},
                {label: '繁體中文', value: 'zh_tw'},
                {label: '简体中文', value: 'zh_cn'},
                // { label: '日文', value: 'ja_jp' },
              ]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: '#6A6A6A'}}>{i18n.t('languageTag')}</Text>
                <Icon
                  style={{fontSize: 12, color: '#6A6A6A'}}
                  name="navigate-next"
                />
              </View>
            </RNPickerSelect>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: '#E2E2E2',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />

        {/* notification */}
        <View
          style={{
            height: 56,
            paddingHorizontal: 9,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  width: 16,
                  height: 16,
                  marginRight: 13,
                }}
                source={require('../../img/Alarm.png')}
              />
              <Text style={{fontSize: 16, color: '#6A6A6A'}}>
                {i18n.t('setting_notifications')}
              </Text>
            </View>
          </View>
          <View>
            <RNPickerSelect
              onValueChange={(itemValue, itemIndex) => {
                dispatch(setNotifications(itemValue));
              }}
              value={notifications}
              items={[
                {label: i18n.t('accept'), value: true},
                {label: i18n.t('reject'), value: false},
              ]}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={{color: '#6A6A6A'}}>
                  {notifications ? i18n.t('accept') : i18n.t('reject')}
                </Text>
                <Icon
                  style={{fontSize: 12, color: '#6A6A6A'}}
                  name="navigate-next"
                />
              </View>
            </RNPickerSelect>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: '#E2E2E2',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        {/* privacy_policy */}
        <View
          style={{
            height: 56,
            paddingHorizontal: 9,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View>
              <Image
                style={{
                  width: 16,
                  height: 16,
                  marginRight: 13,
                }}
                source={require('../../img/Privacy.png')}
              />
            </View>
            <Text style={{textAlign: 'center', fontSize: 16, color: '#6A6A6A'}}>
              <Text
                style={{color: '#6A6A6A'}}
                onPress={() => OpenURL(uri + 'index.php/Home/index/tandc')}>
                {i18n.t('setting_tandc')}
              </Text>
              &nbsp;--&nbsp;
              <Text
                style={{color: '#6A6A6A'}}
                onPress={() => {
                  OpenURL(uri + 'index.php/Home/index/privacy_policy');
                }}>
                {i18n.t('setting_pp')}
              </Text>
            </Text>
          </View>
        </View>
        <View
          style={{
            borderBottomColor: '#E2E2E2',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        {/* 
        <View style={{ flex: 0.5, flexDirection: 'row', alignItems: 'center', borderBottomWidth: Platform.OS==='ios'?0.33:1, justifyContent: 'space-between', paddingLeft: '3%' }}>

        </View> */}
      </View>
    </View>
  );
};
export default Setting;
