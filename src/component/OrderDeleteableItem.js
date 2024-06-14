import { update } from 'lodash';
import React, { useState } from 'react';
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


 

  return (
    <>
      {item ? (
        <View
          style={{
            width: '100%',
            flexDirection: 'row',

          }}>
          <View
            {...panResponder.panHandlers}
            style={{
              padding: 10,
            }}>
            <View style={{
              
              width:354,
              height: 188,
              position:'relative',
              borderRadius:10,
              overflow:'hidden'
            }}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'red',
                  width: '21%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position:'absolute',
                  width:'100%',
                  height:'100%'

                }}
                onPress={() => {
                  setCurrentLeft(0);
                  props.delPress();
                }}>
                <Text style={{ color: 'white', fontWeight: '800' ,position:'absolute', right: 20}}>Delete</Text>
              </TouchableOpacity>
              {/* ordertime and id */}
              <View style={{
                  height:28,
                  display:'flex',
                  flexDirection:'row',
                  justifyContent:'space-between',
                  paddingLeft:9,
                  paddingRight:16,
                  alignItems:"center"
              }}>
                 <Text>{item.id}</Text>
                  <Text>{item.id}</Text>
                </View>
              <View>
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
                  height: 162,
                  width: '100%',
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  marginRight: 5,
                  transform: [{ translateX: currentLeft }],

                }}>
                
                <View
                  style={{ width: '30%' }}
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
                      borderRadius: 10
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
                  <View
                    style>
                    {/* productname */}
                    <Text
                      style={{
                        fontWeight: Platform.OS === 'ios' ? '500' : '700',
                        fontSize: 17,
                        paddingRight:4

                      }}
                      numberOfLines={1} >

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
                    <View style={{
                      position:'relative',
                      top: 22,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center'                     
                    }}>
                      <Text
                        style={{
                          fontSize: 16,
                          color: '#E3A23B',
                          fontWeight: Platform.OS === 'ios' ? '300' : '700',

                        }}>
                        $&nbsp;{item.price}/{i18n.t('shop_unit')}{' '}
                      </Text>

                     
                    </View>

                  </View>
                </View>
              </TouchableOpacity>
              </View>
             
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
