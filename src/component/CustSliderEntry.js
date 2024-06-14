import React, {Component} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {ParallaxImage} from 'react-native-snap-carousel';
import styles from '../utils/custStyle';

export default class CustSliderEntry extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    even: PropTypes.bool,
    parallax: PropTypes.bool,
    parallaxProps: PropTypes.object,
    touchaostyle: PropTypes.object,
    imageStyle: PropTypes.object,
  };

  get image() {
    const {
      data: {illustration},
      parallax,
      parallaxProps,
      even,
      imageStyle,
    } = this.props;

    return parallax ? (
      <ParallaxImage
        source={{uri: illustration}}
        containerStyle={[
          styles.imageContainer,
          even ? styles.imageContainerEven : {},
        ]}
        style={[styles.image, imageStyle]}
        parallaxFactor={0.35}
        showSpinner={true}
        spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
        {...parallaxProps}
      />
    ) : (
      <Image source={{uri: illustration}} style={styles.image} />
    );
  }

  render() {
    const {
      data: {title, subtitle},
      even,
      touchaostyle,
    } = this.props;

    const uppercaseTitle = title ? (
      <View
        style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
        <Text
          style={[styles.title, even ? styles.titleEven : {}]}
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
        onPress={() => {
          alert(`You've clicked '${title}'`);
        }}>
        <View
          style={[
            styles.imageContainer,
            even ? styles.imageContainerEven : {},
          ]}>
          {this.image}
        </View>
      </TouchableOpacity>
    );
  }
}
