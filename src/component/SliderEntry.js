import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity, Platform} from 'react-native';
import PropTypes from 'prop-types';
import {ParallaxImage} from 'react-native-snap-carousel';
import styles from '../utils/style';
import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
const IS_IOS = Platform.OS === 'ios';

export default class SliderEntry extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    action: PropTypes.func,
    even: PropTypes.bool,
    parallax: PropTypes.bool,
    parallaxProps: PropTypes.object,
    touchaostyle: PropTypes.object,
    imageStyle: PropTypes.object,
    textContainer: PropTypes.object,
    navigation: PropTypes.object, // Add navigation prop
  };

  get image() {
    const {
      data: {image},
      parallax,
      parallaxProps,
      even,
      imageStyle,
    } = this.props;
    return parallax ? (
      <ParallaxImage
        source={{uri: image}}
        containerStyle={[
          styles.imageContainer,
          even ? styles.imageContainerEven : {},
        ]}
        style={styles.image}
        parallaxFactor={0.35}
        showSpinner={true}
        spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
        {...parallaxProps}
      />
    ) : (
      <Image source={{uri: image}} style={styles.image} />
    );
  }

  render() {
    const {
      action,
      data: {id, title, subtitle, route_url},
      even,
      touchaostyle,
      textContainer,
      navigation,
    } = this.props;
    // Add navigation prop

    const uppercaseTitle = title ? (
      <View
        style={
          IS_IOS
            ? [textContainer, even ? styles.textContainerEven : {}]
            : [styles.textContainer, even ? styles.textContainerEven : {}]
        }>
        <Text
          style={[styles.title, {height: 'auto'}, even ? styles.titleEven : {}]}
          numberOfLines={2}>
          {title.toUpperCase()}
        </Text>
        <Text
          style={[styles.subtitle, even ? styles.subtitleEven : {}]}
          numberOfLines={2}>
          {subtitle}
        </Text>
      </View>
    ) : (
      false
    );

    return (
      <TouchableOpacity
        activeOpacity={1}
        style={touchaostyle}
        onPress={() =>
          //console.log(this.props.data.title)
          navigation.navigate('SearchScreen', {
            screen: 'GoodsDetail',
            params: {goodsId: this.props.data.route_url},
          })
        }>
        <View
          style={[
            styles.imageContainer,
            even ? styles.imageContainerEven : {},
          ]}>
          {this.image}
          {/* <View
            style={[styles.radiusMask, even ? styles.radiusMaskEven : {}]}
          /> */}
        </View>
      </TouchableOpacity>
    );
  }
}
