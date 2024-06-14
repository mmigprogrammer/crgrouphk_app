import React from 'react';
import {SafeAreaView, View, Text, TouchableOpacity, Button} from 'react-native';
import {WebView} from 'react-native-webview';
import * as i18n from '../../i18n/i18n';
const CustomerServiceScreen = ({navigation}) => {
  i18n.setI18nConfig();
  const isCoupon = true;
  return (
    <SafeAreaView edges={['top']} style={{flex: 1, backgroundColor: 'white'}}>
      <WebView
        startInLoadingState={true}
        source={{
          uri: 'https://tawk.to/chat/63ef00aa474251287913d357/1gpepl6tg',
        }}
      />
    </SafeAreaView>
  );
};
export default CustomerServiceScreen;
