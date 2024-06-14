import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  Image,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TextInput,
  Keyboard,
} from 'react-native';
import DeleteableItem from '../../component/FavDeleteableItem';
import {useIsFocused} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import axios from '../../component/AxiosNet';
import {searchdataset} from '../../fakedata/searchdata';
import {goodsData} from '../../fakedata/goodsdata';
import FeatherIcons from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {setSearchHistory, setSearchListTitle} from '../../redux/actions';
import Icon from 'react-native-vector-icons/Ionicons';
import * as i18n from '../../i18n/i18n';
const Favorite = ({navigation}) => {
  const [onSearchFocus, setOnSearchFocus] = useState(false);
  const {searchHistory} = useSelector(state => state.searchReducer);
  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);
  const dispatch = useDispatch();

  i18n.setI18nConfig();
  const {userId} = useSelector(state => state.loginReducer);
  const [fav, setFav] = useState([]);
  const [itemCount, setItemCount] = useState([]);

  const isFocused = useIsFocused();

  async function fetchMyAPI() {
    setFav([]);
    await axios
      .get('goods/getAllGoods', {
        params: {
          type: 'app',
        },
      })
      .then(async tourList => {
        await axios
          .get('favorite/getFav', {
            params: {
              uid: userId,
            },
          })
          .then(async favs => {
            var result = null;

            setItemCount(0);
            if (favs.data.data) {
              result = favs.data.data.map(fav => ({
                ...fav,
                type: tourList.data.data.filter(it => it.id === fav.goodsId),
              }));
              setFav(result);
              setItemCount(favs.data.data.length);

              const cartList = await axios
                .get('cart/getAllCart', {
                  params: {
                    uid: userId,
                  },
                })
                .then(cartList => {
                  cartList.data.data.map(obj => {
                    for (var i = 0; i < favs.data.data.length; i++) {
                      if (favs.data.data[i].goodsId == obj.goodsId) {
                        favs.data.data[i].isInCart = 1;
                      }
                    }
                  });
                });
            }
          });
      });
  }

  useEffect(() => {
    try {
      fetchMyAPI();
    } catch (e) {
      console.log(e);
    }
    return function cleanup() {
      fetchMyAPI();
    };
  }, [isFocused]);

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

  const addBag = async goodsId => {
    const isFav = await axios.post('Cart/addCart', {
      uid: userId,
      goodsId,
    });
  };

  const delFav = async goodsId => {
    const res = await axios.post('favorite/delFav', {
      uid: userId,
      goodsId,
    });
    fetchMyAPI();
  };

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{
          height: 40,
          backgroundColor: 'white',
          width: '100%',
          marginTop: 5,
        }}>
        <View style={{backgroundColor: '#F6F6F6'}}>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
              setOnSearchFocus(false);
            }}
            accessible={false}>
            <View
              style={{
                width: '100%',
                height: 40,
                //backgroundColor: 'white',
                //borderColor: 'white',
              }}>
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
                    //marginBottom: 9,
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
                            params: {
                              searchList: event.nativeEvent.text,
                            },
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
            </View>
          </TouchableWithoutFeedback>
        </View>
      </KeyboardAvoidingView>
      <View style={{height: '100%'}}>
        {!!fav.length ? (
          <View style={{height: '100%'}}>
            <View style={{height: '100%'}}>
              {/* <Text
                style={{
                  height: Platform.OS == 'ios' ? '2%' : '3.5%',
                  alignItems: 'center',
                  marginLeft: '5%',
                }}>
                {itemCount} {i18n.t('item')}
              </Text> */}
              <FlatList
                data={fav}
                renderItem={({item}) => (
                  <DeleteableItem
                    moveBtn={() => {
                      addBag(item.goodsId);
                      fetchMyAPI();
                    }}
                    touchFun={() => {
                      navigation.navigate('SearchScreen', {
                        screen: 'GoodsDetail',
                        params: {goodsId: item.goodsId},
                      });
                    }}
                    moveToCart={() => {
                      navigation.navigate('ShopScreen', {
                        screen: 'Shop',
                      });
                    }}
                    inCart={item.isInCart}
                    itemData={item.type[0]}
                    type="fav"
                    delPress={() => {
                      delFav(item.goodsId);
                    }}
                  />
                )}
              />
            </View>
          </View>
        ) : (
          <View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '42.5%',
              }}>
              <View style={{backgroundColor: '#E3A23B', borderRadius: 100}}>
                <MaterialCommunityIcons
                  style={{color: '#fff', padding: 20}}
                  name="heart-plus-outline"
                  size={100}
                />
              </View>
              <Text style={{fontSize: 20, color: '#707070', marginTop: 30}}>
                {i18n.t('nothing_in_fav')}
              </Text>
            </View>
            <TouchableOpacity
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                width: '90%',
                height: '10%',
                marginHorizontal: '6%',
                marginTop: '10%',
                shadowColor: '#E3A23B',
                shadowOffset: {
                  width: 0,
                  height: 3,
                },
                shadowOpacity: 0.4,
                shadowRadius: 2,
                elevation: 1,
              }}
              onPress={() => navigation.navigate('Home')}>
              <Text style={{fontSize: 16, color: '#E3A23B'}}>
                {i18n.t('keep_shop')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
export default Favorite;
