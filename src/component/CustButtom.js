import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  icon,
  TextInput,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/FontAwesome5';

const CustButtom = props => {
  const isIcon = () => {};

  return (
    <View style={props.style}>
      <TouchableOpacity
        onPress={props.btnFunction}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}>
        {props.icon}
        <Text style={props.textStyle}>{props.text}</Text>
      </TouchableOpacity>
    </View>
  );
};
export default CustButtom;
