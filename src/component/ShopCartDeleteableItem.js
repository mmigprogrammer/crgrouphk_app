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
  TextBase,
  ColorPropType,
  navigation,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import * as i18n from '../i18n/i18n';
import {setSearchListTitle} from '../redux/actions';

const DeleteableItem = props => {
  const [currentLeft, setCurrentLeft] = useState(0);
  const panResponder = React.useRef(
    PanResponder.create({
      // Ask to be the responder:

      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        //this only can be true when dx move more than 50px,then the function active
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

  const [isSelect, setIsSelect] = useState(false);
  //set default select conditon of each item is false

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
            justifyContent: 'space-around',
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
                {/* {' '}
                {i18n.t('shop_total_price')}: ${' '}
                {(item.price * props.qty).toFixed(2)}{' '} */}
              </Text>
            ) : (
              <></>
            )}
          </View>
          <View
            style={{
              width: '45%',
              flexDirection: 'row',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => {
                props.decreaseBtn();
              }}>
              <View
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 22,
                  borderWidth: 1,
                  height: '100%',
                  borderRadius: 50,
                  borderColor: '#D9D9D9',
                  position: 'relative',
                  marginRight: 15,
                }}>
                <Text style={{fontSize: 20, position: 'absolute'}}>-</Text>
              </View>
            </TouchableOpacity>
            <Text style={{fontSize: 16}}>{props.qty}</Text>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 22,
                height: '100%',
                borderRadius: 50,
                backgroundColor: '#E3A23B',
                marginLeft: 15,
              }}
              onPress={() => {
                props.increaseBtn();
              }}>
              <Text
                style={{
                  fontSize: 20,
                  color: 'white',
                  position: 'absolute',
                }}>
                +
              </Text>
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
            justifyContent: 'center',
          }}>
          <View
            {...panResponder.panHandlers}
            style={{
              paddingHorizontal: 21,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: Platform.OS === 'ios' ? 3 : 3,
              },
              shadowOpacity: Platform.OS === 'ios' ? 0.2 : 0.2,
              shadowRadius: Platform.OS === 'ios' ? 3 : 3,
              elevation: Platform.OS === 'ios' ? 2 : 14,
            }}>
            <View style={{borderRadius: 10}}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'red',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 10,
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
                  transform: [{translateX: currentLeft}],
                  backgroundColor: 'white',

                  flexDirection: 'row',
                  height: 130,
                  width: '100%',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  {/* checkbox */}
                  <TouchableOpacity
                    onPress={() => {
                      props.handleItemSelection();
                      setIsSelect(!isSelect);
                    }}>
                    <View
                      style={{
                        height: '100%',
                        width: 22,
                        marginLeft: 6,
                        zIndex: 100,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <View
                        style={{
                          transform:
                            Platform.OS === 'ios'
                              ? [{scaleX: 0}, {scaleY: 0}]
                              : [{scaleX: 1}, {scaleY: 1}],
                          //backgroundColor: 'white',
                          backgroundColor: isSelect ? 'orange' : 'white', //
                          width: 22,
                          height: 22,
                          borderRadius: 50,
                          borderColor: 'orange',
                          borderWidth: 2,
                        }}></View>
                      <CheckBox
                        style={{
                          marginTop: -30,
                          transform:
                            Platform.OS === 'ios'
                              ? [{scaleX: 0.8}, {scaleY: 0.8}]
                              : [{scaleX: 0}, {scaleY: 0}],
                          display: Platform.OS === 'ios' ? 'flex' : 'none',
                        }}
                        tintColor="orange"
                        onFillColor="orange"
                        onCheckColor="orange"
                        onTintColor="orange"
                        boxType="circle"
                        animationDuration={0}
                        value={isSelect}
                        onValueChange={newValue => setIsSelect(newValue)}

                        //when checkbox is selected,trigger handleitemselection function of the responsible item.

                        // }
                      ></CheckBox>
                    </View>
                  </TouchableOpacity>
                  {/* good cover */}
                  <View
                    onPress={() => {
                      setCurrentLeft(0);
                    }}>
                    <Image
                      source={{
                        uri: item.coverImg ? item.coverImg[0] : '',
                      }}
                      style={{
                        width: 110,
                        height: 107,
                        borderRadius: 10,
                        marginHorizontal: 12,
                      }}></Image>
                  </View>
                  {/* good name */}
                  <View
                    style={{
                      marginTop: '2%',
                      width: 185,
                      display: 'flex',
                      flexDirection: 'column',
                    }}>
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
                        }}>
                        {item.subject}{' '}
                      </Text>
                      <Text
                        style={{
                          // marginTop: '6%',
                          fontSize: 17,
                          fontWeight: Platform.OS === 'ios' ? '300' : '700',
                          color: '#E3A23B',
                          marginTop: '-6%',
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
