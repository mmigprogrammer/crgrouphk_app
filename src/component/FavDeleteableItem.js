import {update} from 'lodash';
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  Animated,
  StyleSheet,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import * as i18n from '../i18n/i18n';

const DeleteableItem = props => {
  const [currentLeft, setCurrentLeft] = useState(0);
  const panResponder = React.useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return Math.abs(gestureState.dy) < 50 && Math.abs(gestureState.dx) > 50;
      },
      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
        setCurrentLeft(0);
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        let nowLeft = gestureState.dx / 0.5;
        if (nowLeft > 100) {
          nowLeft = 50;
        }
        if (nowLeft > 0) {
          nowLeft = Math.min(nowLeft, 0);
        }
        if (nowLeft < -60) {
          setCurrentLeft(-80);
        } else setCurrentLeft(nowLeft);
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    }),
  ).current;

  const item = props.itemData;

  const typeFunction = () => {
    if (props.type === 'fav') {
      if (props.inCart) {
        return (
          <TouchableOpacity
            style={{
              borderColor: '#4F58C4',
              borderWidth: 1,
              width: '35%',
              height: Platform.OS === 'ios' ? '45%' : '40%',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 50,
              marginRight: 22,
              backgroundColor: '#E3A23B',
            }}
            onPress={() => {
              props.moveToCart();
            }}>
            <Text
              style={{
                fontSize: 12,
                fontWeight: Platform.OS === 'ios' ? '300' : '700',
                color: 'white',
                fontWeight: 'bold',
              }}>
              {i18n.t('shop_go_to_bag')}
            </Text>
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity
          style={{
            // shadowColor: "#000",
            //  shadowOffset: {
            //  width: 0,
            // height: 2,
            // },
            // shadowOpacity: 0.25,
            // shadowRadius: 3.84,
            // elevation: 5,
            width: 80,
            height: 32,
            // height: Platform.OS === 'ios' ? '45%' : '40%',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 50,
            marginRight: 22,
            backgroundColor: '#E3A23B',
            bottom: 5,
          }}
          onPress={() => {
            props.moveBtn();
          }}>
          <Text
            style={{
              fontSize: 12,
              fontWeight: Platform.OS === 'ios' ? '300' : '700',
              color: 'white',
              fontWeight: 'bold',
            }}>
            {i18n.t('shop_add_to_bag')}
          </Text>
        </TouchableOpacity>
      );
    } else if (props.type === 'bag') {
      return (
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginTop: '15%',
            width: '100%',
            height: Platform.OS === 'ios' ? '22%' : '20%',
          }}>
          <View style={{marginTop: '6%'}}>
            {props.type === 'bag' ? (
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: Platform.OS === 'ios' ? '400' : '700',
                }}>
                {' '}
                {i18n.t('shop_total_price')}: ${' '}
                {(item.price * props.qty).toFixed(2)}{' '}
              </Text>
            ) : (
              <></>
            )}
          </View>
          <View
            style={{
              borderWidth: 1,
              width: '40%',
              justifyContent: 'space-between',
              flexDirection: 'row',
              marginRight: 10,
            }}>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '20%',
                borderRightWidth: 1,
                height: '100%',
              }}
              onPress={() => {
                props.decreaseBtn();
              }}>
              <Text style={{fontSize: 20}}>-</Text>
            </TouchableOpacity>
            <Text style={{fontSize: 20}}>{props.qty}</Text>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '20%',
                borderLeftWidth: 1,
                height: '100%',
              }}
              onPress={() => {
                props.increaseBtn();
              }}>
              <Text style={{fontSize: 20}}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  return (
    <>
      {item ? (
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <View
            {...panResponder.panHandlers}
            style={{
              padding: 10,
            }}>
            <View
              style={{
                backgroundColor: 'red',
                width: '98%',
                height: 137,
                position: 'relative',
                borderRadius: 10,
                overflow: 'hidden',
              }}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'red',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                }}
                onPress={() => {
                  setCurrentLeft(0);
                  props.delPress();
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontWeight: '800',
                    position: 'absolute',
                    right: 20,
                  }}>
                  Delete
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  if (props.touchFun) {
                    props.touchFun();
                  }
                  setCurrentLeft(0);
                }}
                style={{
                  backgroundColor: 'white',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: Platform.OS === 'ios' ? 3 : 3,
                  },
                  shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0.2,
                  shadowRadius: Platform.OS === 'ios' ? 3 : 3,
                  elevation: Platform.OS === 'ios' ? 2 : 14,
                  flexDirection: 'row',
                  height: 137,
                  width: 366,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: 5,
                  transform: [{translateX: currentLeft}],
                }}>
                <View
                  style={{width: '30%'}}
                  onPress={() => {
                    setCurrentLeft(0);
                  }}>
                  <Image
                    source={{
                      uri: item.coverImg ? item.coverImg[0] : '',
                    }}
                    style={{
                      width: 102,
                      height: 98,
                      marginLeft: '12%',
                      marginVertical: '12%',
                      borderRadius: 10,
                    }}></Image>
                </View>
                <View
                  style={{
                    marginVertical: '2%',
                    width: '65%',
                    marginLeft: '5%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                  <View style>
                    {/* productname */}
                    <Text
                      style={{
                        fontWeight: Platform.OS === 'ios' ? '500' : '700',
                        fontSize: 17,
                        paddingRight: 4,
                      }}
                      numberOfLines={1}>
                      {item.name}{' '}
                    </Text>
                    <Text
                      style={{
                        fontWeight: Platform.OS === 'ios' ? '500' : '700',
                        marginTop: '1%',
                      }}
                      numberOfLines={1}>
                      {item.subject}{' '}
                    </Text>
                    {/* product price and add to bag btn */}
                    <View
                      style={{
                        position: 'relative',
                        top: 22,
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: '#E3A23B',
                          fontWeight: Platform.OS === 'ios' ? '300' : '700',
                        }}>
                        $&nbsp;{item.price}/{i18n.t('shop_unit')}{' '}
                      </Text>

                      {typeFunction()}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <></>
      )}
    </>
  );
};
export default DeleteableItem;
