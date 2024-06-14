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
              marginTop: '6%',
              borderColor: '#F04E96',
              borderWidth: 1,
              width: '40%',
              height: Platform.OS === 'ios' ? '22%' : '18%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              props.moveToCart();
            }}>
            <Text style={{fontSize: 10, fontWeight: '800', color: '#F04E96'}}>
              {i18n.t('shop_go_to_bag')}
            </Text>
          </TouchableOpacity>
        );
      }
      return (
        <TouchableOpacity
          style={{
            marginTop: '6%',
            borderColor: '#4F58C4',
            borderWidth: 1,
            width: '40%',
            height: Platform.OS === 'ios' ? '22%' : '18%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            props.moveBtn();
          }}>
          <Text
            style={{
              fontSize: 10,
              fontWeight: Platform.OS === 'ios' ? '300' : '700',
              color: '#0033ff',
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
            marginBottom: '6%',
            flexDirection: 'row',
            transform: [{translateX: currentLeft}],
          }}>
          <View
            {...panResponder.panHandlers}
            style={{
              padding: 10,
            }}>
            <TouchableOpacity
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
                height: 160,
                width: '100%',
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
                    width: 100,
                    height: 130,
                    marginLeft: '12%',
                    marginVertical: '12%',
                  }}></Image>
              </View>
              <View
                style={{marginVertical: '2%', width: '65%', marginLeft: '5%'}}>
                <View>
                  <Text
                    style={{
                      fontWeight: Platform.OS === 'ios' ? '600' : '700',
                      fontSize: 17,
                    }}
                    numberOfLines={1}>
                    {item.name}{' '}
                  </Text>
                  <Text
                    style={{
                      fontWeight: Platform.OS === 'ios' ? '600' : '700',
                      marginTop: '1%',
                    }}
                    numberOfLines={1}>
                    {item.subject}{' '}
                  </Text>
                  <Text
                    style={{
                      marginTop: '6%',
                      fontSize: 12,
                      fontWeight: Platform.OS === 'ios' ? '300' : '700',
                    }}>
                    $&nbsp;{item.price}/{i18n.t('shop_unit')}{' '}
                  </Text>

                  {typeFunction()}
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: 'red',
              width: '21%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              setCurrentLeft(0);
              props.delPress();
            }}>
            <Text style={{color: 'white', fontWeight: '800'}}>Delete</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
    </>
  );
};
export default DeleteableItem;
