import React from 'react';
import {View, Text, TouchableOpacity, Button, SafeAreaView} from 'react-native';

import * as i18n from '../../i18n/i18n';
const requireLoginFav = ({navigation}) => {
  i18n.setI18nConfig();
  return (
    <SafeAreaView edges={['top']} style={{flex: 1}}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '70%',
        }}>
        <Text style={{fontSize: 20, color: '#707070', textAlign: 'center'}}>
          {i18n.t('fav_need_register')}
        </Text>
      </View>

      <TouchableOpacity
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          width: '80%',
          height: '6.5%',
          marginHorizontal: '10%',
          marginTop: '10%',
          shadowColor: '#E3A23B',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.4,
          shadowRadius: 2,
          elevation: 1,
        }}
        onPress={() => navigation.navigate('UserScreen', {screen: 'Login'})}>
        <Text style={{fontSize: 18, color: '#E3A23B'}}>{i18n.t('login')}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          backgroundColor: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          width: '80%',
          height: '6.5%',
          marginHorizontal: '10%',
          marginTop: '3%',
          shadowColor: '#E3A23B',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.4,
          shadowRadius: 2,
          elevation: 1,
        }}
        onPress={() => navigation.navigate('UserScreen', {screen: 'Signup'})}>
        <Text style={{fontSize: 18, color: '#E3A23B'}}>{i18n.t('signup')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default requireLoginFav;
