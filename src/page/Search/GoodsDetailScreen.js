import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  RefreshControl,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Dimensions,
  ScrollView,
  FlatList,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Carousel, {Pagination, ParallaxImage} from 'react-native-snap-carousel';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector, useDispatch} from 'react-redux';
import axios from '../../component/AxiosNet';
import {useIsFocused} from '@react-navigation/native';
import {Buffer} from 'buffer';

const SLIDER_WIDTH = Dimensions.get('window').width;
const SLIDER_HEIGHT = Dimensions.get('window').width / 1.5;
const ITEM_WIDTH = Dimensions.get('window').width;
const ITEM_HEIGHT = Dimensions.get('window').width / 1.5;
import * as i18n from '../../i18n/i18n';
import {setSearchListTitle} from '../../redux/actions';

const GoodsDetailScreen = ({route, navigation}) => {
  i18n.setI18nConfig();

  const dispatch = useDispatch();
  const {userId} = useSelector(state => state.loginReducer);
  const [refreshing, setRefreshing] = React.useState(false);
  const [index, setIndex] = useState(0);
  const [slider1Ref, setSlider1Ref] = useState();
  const [isFav, setIsFav] = useState(false);
  const [tour, setTour] = useState();
  const [tours, setTours] = useState();
  const [isLoading, seIsLoading] = useState(true);
  const [tourImage, setTourImage] = useState();

  const [quantity, setQuantity] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);

  const isFocused = useIsFocused();

  const {searchListTitle} = useSelector(state => state.shoppingReducer);
  var previousTitle = null;

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  async function fetchMyAPI() {
    const res = await axios.get('goods/getallgoods.html', {
      params: {
        id: route.params.goodsId,
      },
    });
    setTour(res.data.data[0]);
    var temp = [];
    var coverimg = res.data.data[0].coverImg;
    for (let i = 0; i < coverimg.length; i++) {
      temp.push({illustration: coverimg[i]});
    }

    setTourImage(temp);

    const tours = await axios.get('goods/getallgoods.html');
    setTours(tours.data.data);
    const ffavList = await axios.get('favorite/getFav', {
      params: {
        uid: userId,
      },
    });
    setIsFav(false);

    if (ffavList.data.data) {
      ffavList.data.data.map(obj => {
        if (res.data.data[0].id == obj.goodsId) {
          setIsFav(true);
        }
      });
    }

    const cart = await axios.get('cart/getAllCart.html', {
      params: {
        uid: userId,
        status: 0,
      },
    });
  }

  useEffect(() => {
    seIsLoading(true);
    try {
      fetchMyAPI().then(() => seIsLoading(false));
    } catch (e) {
      console.log(e);
    }
    return function cleanup() {
      fetchMyAPI();
    };
  }, [isFocused]);

  const [isProductInfoOpen, setIsProductInfoOpen] = useState(false);

  /* show/hide */
  const [shouldShow, setShouldShow] = useState(true);
  const [shouldShow2, setShouldShow2] = useState(true);

  /* show/hide */

  const addBag = async () => {
    const addCart = await axios.post('Cart/addCart', {
      uid: userId,
      goodsId: route.params.goodsId,
      quantity: quantity,
    });
    if (addCart.data.code == 0) {
      alert(addCart.data.msg);
      setQuantity('1');
    } else {
      alert(addCart.data.msg);
    }
  };
  const clickFav = async goodsId => {
    const isFav = await axios.get('favorite/isFav', {
      params: {
        uid: userId,
        goodsId,
      },
    });

    if (isFav.data.status == 1) {
      const res = await axios.get('favorite/delFav', {
        params: {
          uid: userId,
          goodsId,
        },
      });
    } else if (isFav.data.status == 2) {
      const res = await axios.get('favorite/addFav', {
        params: {
          uid: userId,
          goodsId,
        },
      });
    }
  };
  const carouselRef = useRef(null);

  const renderItem = ({item, index}, parallaxProps) => {
    console.log(item);
    return (
      <View style={{width: ITEM_WIDTH - 60, height: ITEM_WIDTH - 60}}>
        <ParallaxImage
          source={{uri: item.illustration}}
          containerStyle={{
            flex: 1,
            marginBottom: Platform.select({ios: 0, android: 1}), // Prevent a random Android rendering issue
            backgroundColor: 'white',
            borderRadius: 8,
          }}
          style={styles.image}
          parallaxFactor={0.4}
          {...parallaxProps}
        />
      </View>
    );
  };

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
        <SafeAreaView style={{backgroundColor: 'white', flex: 1}}>
          {/* name and price and mainexample */}
          <View>
            <Carousel
              ref={carouselRef}
              sliderWidth={ITEM_WIDTH}
              sliderHeight={ITEM_WIDTH}
              itemWidth={ITEM_WIDTH - 60}
              data={tourImage}
              renderItem={renderItem}
              hasParallaxImages={true}
            />

            {/* <Image
              style={{
                width: windowWidth * 1,
                height: windowWidth * 1,
              }}
              source={{uri: tourImage[0]}}
            /> */}
          </View>

          <View
            style={{
              borderColor: 'white',
              borderTopWidth: 10,
              borderRadius: 10,
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingLeft: '5%',
              }}>
              <Text
                style={{
                  fontWeight: Platform.OS === 'ios' ? '500' : '700',
                  fontSize: 20,
                  flex: 0.9,
                }}>
                {tour.name}
              </Text>
            </View>
            <View
              style={{
                paddingLeft: '5%',
                marginTop: '2.5%',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: Platform.OS === 'ios' ? '300' : '700',
                  marginBottom: '2%',
                  color: '#E3A23B',
                }}>
                $ {tour.price}
              </Text>
              {/* fav button */}
              {/* <Icon
                      name={isFav ? 'heart-sharp' : 'heart-outline'}
                      style={{top: '-8%', fontSize: 38}}
                      onPress={() => {
                        setIsFav(!isFav);
                        clickFav(tour.id);
                      }}
                    /> */}
            </View>
          </View>
          <ScrollView
            styles={{}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 22,
                }}>
                <View
                  style={{
                    margin: 20,
                    backgroundColor: '#fff',
                    borderRadius: 10,
                    padding: 35,
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      borderRadius: 10,
                      overflow: 'hidden',
                      fontSize: 20,
                    }}>
                    {' '}
                    {i18n.t('search_buy_qty')}{' '}
                  </Text>
                  <View
                    style={{
                      borderRadius: 15,
                      padding: 5,
                      margin: 5,
                      backgroundColor: 'white',
                      borderColor: '#E3A23B',
                      borderWidth: 1,
                    }}>
                    <TextInput
                      textAlign={'center'}
                      style={{
                        borderWidth: 0,
                        borderRadius: 8,
                        width: 200,
                        height: 30,
                      }}
                      onChangeText={text => {
                        if (text.match(/[^0-9]/g)) {
                          alert('Please enter an integer!');
                          setQuantity(text.replace(/[^0-9]/g, ''));
                        } else {
                          setQuantity(text);
                        }
                      }}
                      maxLength={3}
                      value={quantity}
                      defaultValue={'1'}
                      keyboardType="numeric"
                    />
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      style={{
                        borderRadius: 15,
                        padding: 10,
                        margin: 5,
                        borderWidth: 1,
                        backgroundColor: '#fff',
                      }}
                      onPress={() => setModalVisible(!modalVisible)}>
                      <Text
                        style={{
                          backgroundColor: '#fff',
                          textAlign: 'center',
                          borderRadius: 10,
                          width: 90,
                          overflow: 'hidden',
                          fontSize: 20,
                        }}>
                        {i18n.t('close')}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        borderRadius: 15,
                        padding: 10,
                        margin: 5,
                        borderWidth: 1,
                        backgroundColor: '#fff',
                        borderColor: '#E3A23B',
                      }}
                      onPress={() => {
                        if (quantity == '') {
                          alert(i18n.t('search_want_buy_qty'));
                        } else {
                          addBag();
                          setModalVisible(!modalVisible);
                        }
                      }}>
                      <Text
                        style={{
                          backgroundColor: '#fff',
                          textAlign: 'center',
                          borderRadius: 10,
                          width: 90,
                          overflow: 'hidden',
                          fontSize: 20,
                          color: '#E3A23B',
                        }}>
                        {i18n.t('add')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            {!isProductInfoOpen ? <>{/* add to bag */}</> : <></>}

            {/* product infor */}
            <View
              style={{
                backgroundColor: 'white',
              }}>
              <TouchableOpacity>
                <View
                  style={{
                    marginHorizontal: '5%',
                    width: '100%',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '400',
                      color: '#4B4848',
                      opacity: 0.75,
                      marginTop: '5%',
                    }}>
                    {i18n.t('search_product_information')}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.container12}>
                <Text style={{marginTop: '3%', color: '#4B4848', fontSize: 14}}>
                  {i18n.t('search_name')}：{tour.name}
                </Text>
                <Text style={{marginTop: '3%', color: '#4B4848', fontSize: 14}}>
                  {i18n.t('search_desc')}：{'\n'}
                  {Buffer.from(tour.desc, 'base64').toString('utf-8')}
                </Text>
              </View>
            </View>

            {/* product infor */}

            {/*  */}

            {/* <TouchableOpacity onPress={() => setShouldShow2(!shouldShow2)}>
              <View
                style={{
                  marginHorizontal: '5%',
                  width: '100%',
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: '#4B4848',
                    opacity: 0.75,
                  }}>
                  {i18n.t('search_tandc')}
                </Text>
                <Icon
                  name="chevron-up-outline"
                  style={{ fontSize: 20, right: -50 }}
                />
              </View>
            </TouchableOpacity> */}

            {/* <View style={styles.container12}>
              {!shouldShow2 ? (
                <>
                  <Text style={{ marginTop: '3%', color: '#4B4848' }}>
                    {i18n.t('search_tandc')}
                  </Text>
                </>
              ) : null}
            </View> */}

            <View>
              <View
                style={{
                  height: SLIDER_WIDTH * 0.65,
                  width: '100%',
                  backgroundColor: 'white',

                  marginBottom: SLIDER_WIDTH * 0.1,
                }}>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: Platform.OS === 'ios' ? '200' : '600',
                    marginLeft: '5%',
                    marginVertical: '2%',
                  }}>
                  {i18n.t('search_you_might_also_like')}
                </Text>
                <FlatList
                  data={tours}
                  horizontal={true}
                  renderItem={({item}) => (
                    <>
                      {item.id != tour.id ? (
                        //you might also like
                        <TouchableOpacity
                          style={{marginTop: 0}}
                          onPress={() =>
                            navigation.push('GoodsDetail', {
                              goodsId: item.id,
                              item,
                            })
                          }>
                          <View
                            style={{
                              display: 'flex',
                              marginLeft: 10,
                            }}>
                            <Image
                              style={{
                                borderColor: 'white',
                                borderWidth: 2,
                                borderRadius: 10,
                                width: SLIDER_WIDTH / 4.5,
                                height: SLIDER_WIDTH / 4.5,
                              }}
                              source={{uri: item.coverImg[0]}}
                            />

                            <Text
                              style={{
                                fontSize: 12,
                                marginTop: 5,
                                fontWeight:
                                  Platform.OS === 'ios' ? '500' : '700',
                                width: SLIDER_WIDTH / 4.5,
                                color: 'black',
                              }}
                              numberOfLines={1}>
                              {item.name}
                            </Text>

                            {/* <Text
                            style={{
                              fontSize: 10,
                              marginTop: 10,
                              fontWeight: Platform.OS === 'ios' ? '500' : '700',
                            }}>
                            ${item.price}{' '}
                          </Text> */}
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <></>
                      )}
                    </>
                  )}
                />
              </View>
            </View>
          </ScrollView>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: '5%',
              paddingVertical: '2%',
              alignItems: 'center',
              backgroundColor: 'white',
            }}>
            <View>
              {/* fav button */}

              <Icon
                name={isFav ? 'heart-sharp' : 'heart-outline'}
                style={{top: '-5%', fontSize: 38, color: '#FE2B1E'}}
                onPress={() => {
                  setIsFav(!isFav);
                  clickFav(tour.id);
                }}
              />
            </View>
            <View>
              {userId ? (
                <TouchableOpacity
                  style={{
                    backgroundColor: '#E3A23B',
                    borderRadius: 50,
                    width: 160,
                    height: 36,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#E3A23B',
                  }}
                  onPress={() => {
                    if (route.params.goodsId) setModalVisible(true);
                  }}>
                  <Text
                    style={{
                      fontsize: 19,
                      color: 'white',
                      fontWeight: '700',
                    }}>
                    {i18n.t('search_add_cart')}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: '#E3A23B',
                    borderRadius: 50,
                    width: 160,
                    height: 36,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: '#E3A23B',
                  }}
                  onPress={() => {
                    navigation.navigate('UserScreen', {screen: 'Login'});
                  }}>
                  <Text
                    style={{
                      fontsize: 19,
                      color: 'white',
                      fontWeight: '700',
                    }}>
                    {i18n.t('login_first')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  underline: {
    marginVertical: '2.5%',
    height: 1,
    borderBottomWidth: 1,
    borderColor: '#D9D9D9',
  },
  textStyle: {fontSize: 12, fontWeight: Platform.OS === 'ios' ? '200' : '600'},
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container12: {
    flex: 1,
    margin: 10,
    marginHorizontal: '5%',
  },
});

export default GoodsDetailScreen;
