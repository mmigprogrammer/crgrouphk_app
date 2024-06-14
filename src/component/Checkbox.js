import React, {useState} from 'react';
import {View, Text, CheckBox, StyleSheet} from 'react-native';

const RoundCheckBox = ({label, value, onValueChange}) => {
  const [isChecked, setIsChecked] = useState(value);

  const onPress = () => {
    setIsChecked(!isChecked);
    onValueChange(!isChecked);
  };

  return (
    <View style={styles.checkboxContainer}>
      <CheckBox
        style={styles.checkbox}
        value={isChecked}
        onValueChange={onPress}
      />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  checkbox: {
    borderRadius: 50,
  },
  label: {
    marginLeft: 8,
  },
});

export default RoundCheckBox;
