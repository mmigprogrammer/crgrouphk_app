import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Button, SafeAreaView, TextInput, Alert } from 'react-native';
import * as i18n from '../../i18n/i18n';
import axios from '../../component/AxiosNet';

const SMS = ({ route, navigation }) => {
  i18n.setI18nConfig()
  const [code, setCode] = useState('');


  const v = async() => {
    const res = await axios.post("account/verify", {
      uid: route.params.uid,
      code
    });
    if (res.data.code == 200){
      alert('Account verification succeeded')
      navigation.navigate('Login')
    }else {
      Alert.alert(
        "Message",
        "Fail!",
        [
          {
            text: "Resend SMS code",
            onPress: async() => {
              const resSms = await axios.get("account/getSMS", {
                params:{
                  uid:route.params.uid,
                }
              });
              if (resSms.data.code != 200){
                alert('something wrong')
              }
            }
          },
          {
            text: "Cancel",
            style: "cancel"
          },])
    }
  }

  return (
    <SafeAreaView>
      <View style={{ alignItems: 'center', justifyContent: 'center', height: '80%' }}>
        <Text style={{ fontSize: 20,marginBottom:20 }}>Please input SMS verification code</Text>
        <TextInput
          value={code}
          onChangeText={((text) => setCode(text))}
          style={{ backgroundColor: 'white', width: '35%', height: 40, textAlign: 'center', fontSize: 30, borderRadius: 20 }} maxLength={6} placeholder='******' />
        <Button title="Submit" onPress={() => v()} />
      </View>
    </SafeAreaView>
  );
};
export default SMS;

