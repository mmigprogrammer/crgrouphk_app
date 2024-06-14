import React from 'react';
import {View, Text, TouchableOpacity, Button, SafeAreaView} from 'react-native';
import * as i18n from '../../i18n/i18n';
const Shop = ({navigation}) => {
  i18n.setI18nConfig()
  return (
    <SafeAreaView>
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
    </SafeAreaView>
  );
};
export default Shop;

