import React, {useEffect, useState, useCallback} from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  Dimensions,
  View,
  Text,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Alert,
  TextInput,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  ScrollView,
  Linking,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import SliderEntry from '../../component/SliderEntry';
import Icon from 'react-native-vector-icons/Ionicons';
import {useIsFocused} from '@react-navigation/native';
import {} from '../../redux/actions';

import * as i18n from '../../i18n/i18n';
//import {createProxyMiddleware} from 'http-proxy-middleware';
//redux
import {useSelector, useDispatch} from 'react-redux';
import {setSearchHistory, setSearchListTitle} from '../../redux/actions';
import cgaxios from '../../component/ColorGroupAxiosNet';
import axios from '../../component/AxiosNet'; //axios
import I18n from 'i18n-js';

const IS_IOS = Platform.OS === 'ios';
const SLIDER_WIDTH = Dimensions.get('window').width;
const SLIDER_HEIGHT = 200;
const ITEM_WIDTH = 180;
const ITEM_HEIGHT = 150;

const HomeScreen = ({navigation}) => {
  i18n.setI18nConfig();
  const [index, setIndex] = useState(0);
  const [slider1Ref, setSlider1Ref] = useState();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [appBanner, setAppBanner] = useState();
  const [banner, setBanner] = useState();
  const [promote, setPromote] = useState();
  //search
  const [cate, setCate] = useState();
  const [goods, setGoods] = useState();
  const [isLoading, seIsLoading] = useState(true);
  const [onSearchFocus, setOnSearchFocus] = useState(false);
  const {searchHistory} = useSelector(state => state.searchReducer);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const {userId} = useSelector(state => state.loginReducer);

  const updateMemberId = () => {
    axios
      .get('user/getUserInfoPhone', {
        params: {
          uid: userId,
        },
      })
      .then(data => {
        console.log(data.data.data);
        console.log(data.data.data.tel);
        if (!data.data.data.memberId) {
          cgaxios
            .post('Common/MemberInfo', {
              AccessCode: 'ColorGroup',
              Phone: data.data.data.tel,
            })
            .then(memberInfo => {
              console.log(memberInfo);
              if (memberInfo.data.data.length > 0) {
                console.log(memberInfo.data.data[0].MemberId);
                axios
                  .get('user/updateMemberId', {
                    params: {
                      uid: userId,
                      balance: memberInfo.data.data[0].AmountBalance,
                      score: memberInfo.data.data[0].PointsBalance,
                      memberId: memberInfo.data.data[0].MemberId,
                    },
                  })
                  .then(data1 => {
                    console.log(data1);
                  });
              } else {
                console.log('dont have memberid');
              }
            });
        } else {
          cgaxios
            .post('Common/MemberInfo', {
              AccessCode: 'ColorGroup',
              Phone: data.data.data.tel,
            })
            .then(memberInfo => {
              console.log(memberInfo);
              if (memberInfo.data.data.length > 0) {
                console.log(memberInfo.data.data[0]);
                axios
                  .get('user/updateMemberId', {
                    params: {
                      uid: userId,
                      balance: memberInfo.data.data[0].AmountBalance,
                      score: memberInfo.data.data[0].PointsBalance,
                      memberId: memberInfo.data.data[0].MemberId,
                    },
                  })
                  .then(data1 => {
                    console.log(data1);
                  });
              } else {
                console.log('dont have memberid');
              }
            });
        }
      })
      .catch(e => {
        console.log('cannot get');
      });
  };

  const searchFilterFunction = text => {
    if (text) {
      const newData = masterDataSource.filter(function (item) {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredDataSource(newData);
    } else {
      setFilteredDataSource(masterDataSource);
    }
  };
  const OpenURL = async url => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`wrong url : ${url}`);
    }
  };

  //get api
  async function fetchMyAPI() {
    // cgaxios
    //   .post('Common/BranchInfo', {
    //     AccessCode: 'ColorGroup',
    //     LastUpdateTime: '19000101000000000',
    //   })
    //   .then(data => {
    //     console.log(data.data);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    updateMemberId();
    const getAppBanner = await axios
      .get('index/getAppBanner')
      .catch(error => {
        console.log(error);
      })
      .then(data => {
        console.log(data.data.data);

        setAppBanner(data.data.data);
      });
    const banner = await axios
      .get('index/getBanner')
      .catch(error => {
        console.log(error);
      })
      .then(data => {
        console.log(data.data.data);

        setBanner(data.data.data);
      });
    const promote = await axios
      .get('index/getPromote')
      .catch(error => {
        console.log(error);
      })
      .then(data => {
        console.log(data.data.data);
        setPromote(data.data.data);
      });
    const cate = await axios
      .get('cate/getAllCate')
      .catch(error => {
        console.log(error);
      })
      .then(async data => {
        setCate(data.data.data);
        await axios
          .get('goods/getallgoods')
          .then(data1 => {
            var temp = searchHistory.slice(searchHistory.length - 3);
            var k = 3;

            if (temp.length < 3) {
              k = temp.length;
            }
            for (var i = 0; i < k; i++) {
              data1.data.data.unshift({
                id: data1.data.data.length + 1,
                name: temp[i],
                status: 99,
              });
            }
            setGoods(data1.data.data);
            setFilteredDataSource(data1.data.data);
            setMasterDataSource(data1.data.data);
            const result = data1.data.data.map(item => ({
              ...item,
              type: data.data.data.filter(it => it.cateId === item.cateId),
            }));
          })
          .catch(error => {
            console.log(error);
          });
      });
  }
  const _renderItemWithParallax = ({item, index}, parallaxProps) => {
    return (
      <View style={{}} key={index}>
        <SliderEntry
          navigation={navigation}
          data={item}
          even={(index + 1) % 2 === 0}
          parallax={true}
          parallaxProps={parallaxProps}
          touchaostyle={{
            paddingHorizontal: 0,
            paddingBottom: 0,
            width: ITEM_WIDTH,
            height: 180,
          }}
          textContainer={{
            height: 60,
            justifyContent: 'center',
            paddingTop: 8,
            paddingBottom: 20,
            paddingHorizontal: 16,
            backgroundColor: '#dde3da',
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          }}
        />
      </View>
    );
  };
  const mainExample = (number, title) => {
    //console.log(promote);
    return (
      <View style={{height: IS_IOS ? 200 : 250}}>
        <Carousel
          ref={c => setSlider1Ref(c)}
          data={promote}
          renderItem={_renderItemWithParallax}
          sliderWidth={SLIDER_WIDTH}
          sliderHeight={SLIDER_HEIGHT}
          itemWidth={ITEM_WIDTH}
          itemHeight={ITEM_HEIGHT}
          slideStyle={{paddingVertical: 0}}
          hasParallaxImages={true}
          firstItem={0}
          containerCustomStyle={{
            overflow: 'visible',
          }}
          contentContainerCustomStyle={{paddingVertical: 0}}
          loop={true}
          loopClonesPerSide={2}
          autoplay={true}
          autoplayDelay={500}
          autoplayInterval={3000}
          onSnapToItem={i => setIndex(i)}
        />
        <Pagination
          dotsLength={banner.length}
          activeDotIndex={index}
          containerStyle={{}}
          dotStyle={{
            width: 10,
            height: 10,
            borderRadius: 5,
            marginHorizontal: -8,
            top: IS_IOS ? 25 : 0,
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          carouselRef={slider1Ref}
          tappableDots={!!slider1Ref}
        />
      </View>
    );
  };
  const _renderItem = item => {
    return (
      <TouchableOpacity
        style={{
          width: '90%',
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => {
          navigation.navigate('SearchScreen', {
            screen: 'SearchList',
            params: {searchList: item.name},
          });
        }}>
        {item.status != 1 ? (
          <View
            style={{
              width: '100%',
              borderBottomWidth: 0.3,
              borderColor: '#D9D9D9',
            }}>
            <Text
              style={{
                marginLeft: '1.5%',
                fontSize: 16,
                fontWeight: '300',
                marginVertical: '3%',
                color: '#AAAAAA',
              }}>
              {item.name}
            </Text>
          </View>
        ) : (
          <View
            style={{
              width: '100%',
              borderBottomWidth: 0.3,
              borderColor: '#D9D9D9',
            }}>
            <Text
              style={{
                marginLeft: '1.5%',
                fontSize: 16,
                fontWeight: '300',
                marginVertical: '3%',
              }}>
              {item.name}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    seIsLoading(true);
    try {
      fetchMyAPI().then(() => seIsLoading(false));
    } catch (e) {
      console.log(e);
    }
  }, [isFocused]);
  return (
    <>
      {isLoading ? (
        <View>
          <ActivityIndicator
            color="#009b88"
            size="large"
            style={{marginTop: '40%'}}
          />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <SafeAreaView style={{backgroundColor: '#F6F6F6'}}>
            <TouchableWithoutFeedback
              onPress={() => {
                Keyboard.dismiss();
                setOnSearchFocus(false);
              }}
              accessible={false}>
              <View style={{width: '100%', height: '100%'}}>
                <View style={{}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginHorizontal: '5%',
                      height: 34,
                      borderRadius: 20,
                      backgroundColor: '#E1E1E1',
                      paddingLeft: '1.5%',
                      marginBottom: 9,
                    }}>
                    <Icon
                      name="search"
                      size={30}
                      style={{fontSize: 20, color: '#848484'}}
                    />
                    <TextInput
                      style={{
                        marginLeft: '1%',
                        color: '#707070',
                        height: '100%',
                        width: '90%',
                      }}
                      onSubmitEditing={event => {
                        if (event.nativeEvent.text != '') {
                          if (searchHistory) {
                            navigation.navigate('SearchScreen', {
                              screen: 'SearchList',
                              params: {searchList: event.nativeEvent.text},
                            });
                            var temp = searchHistory;
                            temp.push(event.nativeEvent.text);
                            dispatch(setSearchHistory(temp));
                            fetchMyAPI();
                          }
                        }
                      }}
                      onChangeText={text => {
                        searchFilterFunction(text);
                      }}
                      onClear={text => searchFilterFunction('')}
                      placeholder={i18n.t('search')}
                      onFocus={() => {
                        setOnSearchFocus(true);
                      }}
                      onBlur={() => setOnSearchFocus(false)}
                    />
                  </View>
                  {onSearchFocus === true ? (
                    <>
                      {searchHistory.length == 0 ? (
                        <View
                          style={{
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Icon name="search" style={{fontSize: 22}} />
                          <Text
                            style={{
                              fontSize: 15,
                              marginTop: '8%',
                              fontWeight: '200',
                            }}>
                            You have no recent searches
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={{
                            height: '100%',
                            marginLeft: '6%',
                            justifyContent: 'center',
                          }}>
                          <FlatList
                            keyboardShouldPersistTaps="handled"
                            data={filteredDataSource.slice(0, 10)}
                            style={{width: '100%'}}
                            renderItem={({item}) => _renderItem(item)}
                          />
                        </View>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </View>
                <ScrollView>
                  {/* <View
                    style={{
                      width: '100%',
                      height: Platform.OS === 'ios' ? 0.33 : 1,
                      backgroundColor: 'black',
                    }}
                  /> */}
                  <View
                    onStartShouldSetResponder={() => true}
                    style={{
                      marginTop: '0%',
                      height: '12.55%',
                      width: '100%',

                      alignItems: 'center',
                    }}>
                    <Image
                      style={{
                        height: 200,
                        width: '100%',
                        backgroundColor: 'black',
                        marginBottom: 23,
                      }}
                      resizeMode={'stretch'}
                      source={{uri: appBanner.homeBanner}}
                    />
                    <Text>{i18n.t('suggested_item')}</Text>
                    <View style={{paddingTop: '4%'}}>{mainExample()}</View>
                    <Text>{i18n.t('selected_choices')}</Text>

                    <View
                      style={{
                        width: '100%',
                        height: 'auto',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        paddingTop: 10,
                        paddingLeft: 5,
                      }}>
                      {cate.map(item => (
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate('SearchScreen', {
                              screen: 'SearchList',
                              initial: true,
                              params: {
                                itemCateId: item.cateId,
                                searchList: null,
                              },
                            });
                          }}
                          key={item.id}
                          style={{
                            // zIndex:-1,
                            paddingTop: 10,
                            paddingRight: 7,
                          }}>
                          <ImageBackground
                            style={{
                              width: 185,
                              height: 120,
                              justifyContent: 'flex-end',
                            }}
                            imageStyle={{borderRadius: 10}}
                            source={{uri: item.cateImage}}>
                            <Text
                              style={{
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 'bold',
                                fontSize: 16,
                                textShadowColor: '#000000',
                                textShadowOffset: {width: -1, height: 1},
                                textShadowRadius: 8,
                              }}>
                              {item.name}
                            </Text>
                          </ImageBackground>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </SafeAreaView>
        </KeyboardAvoidingView>
      )}
    </>
  );
};
HomeScreen.navigationOptions = screenProps => ({
  headerShown: false,
  tabBarIcon: ({color, size, focused}) =>
    focused ? (
      <View
        style={{
          width: '100%',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: '80%',
            backgroundColor: 'rgba(227, 162, 59, 0.1)',
            borderRadius: 50,
            alignItems: 'center',
          }}>
          <MaterialCommunityIcons name="home-outline" size={25} color={color} />
        </View>

        <Text
          style={{
            color: '#E3A23B',
          }}>
          {i18n.t('home')}
        </Text>
      </View>
    ) : (
      <View
        style={{
          width: '100%',

          //backgroundColor: 'rgba(227, 162, 59, 0.1)',
          borderRadius: 50,

          alignItems: 'center',
        }}>
        <MaterialCommunityIcons name="home-outline" size={25} color={color} />
        <Text
          style={{
            color: '#79757F',
          }}>
          {i18n.t('home')}
        </Text>
      </View>
    ),
});
export default HomeScreen;
