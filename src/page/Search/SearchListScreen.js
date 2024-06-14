import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Platform,
  Modal,
  View,
  Text,
  TouchableOpacity,
  Button,
  SafeAreaView,
  FlatList,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import * as i18n from '../../i18n/i18n';
import DropDownPicker from 'react-native-dropdown-picker';
import {useSelector, useDispatch} from 'react-redux';
import {setSearchListTitle} from '../../redux/actions';
import {useIsFocused} from '@react-navigation/native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from '../../component/AxiosNet';
import {keyBy} from 'lodash';
import {placeholder} from 'i18n-js';
import {withTheme} from 'react-native-elements';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const SearchListScreen = ({route, navigation}) => {
  const {userId, userToken} = useSelector(state => state.loginReducer);

  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [daysModalVisible, setDaysModalVisible] = useState(false);

  const [isLoading, seIsLoading] = useState(true);

  const isFocused = useIsFocused();
  const [isFav, setIsFav] = useState([]);
  i18n.setI18nConfig();
  const dispatch = useDispatch();

  const [tours, setTours] = useState();
  const [masterTours, setMasterTours] = useState();

  const [favList, setFavList] = useState();

  // picker
  const [sortOpen, setSortOpen] = useState(false);
  const [sortValue, setSortValue] = useState([]);

  const [sortItems, setSortItems] = useState([
    // { label: 'Days', value: 'days' },
    {
      label: i18n.t('search_list_sort_price'),
      value: i18n.t('search_list_sort_price'),
    },
  ]);

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValue, setFilterValue] = useState([]);
  const [filterItems, setFilterItems] = useState([]);

  const [isFilter, setIsFilter] = useState(0);

  const [isFilterDays, setIsFilterDays] = useState(false);
  const [isFilterPrice, setIsFilterPrice] = useState(false);
  const [isFilterPlace, setIsFilterPlace] = useState(false);

  const [isSortDays, setIsSortDays] = useState(false);
  const [isSortPrice, setIsSortPrice] = useState(false);

  const [priceSlider, setPriceSlider] = useState([0, 500000]);
  const [daysSlider, setDaysSlider] = useState([3, 180]);

  const [previewFilter, setPreviewFilter] = useState([]);
  const [multipleText, setMultipleText] = useState(
    i18n.t('search_list_sort_price'),
  );

  async function fetchMyAPI() {
    const ffavList = await axios.get('favorite/getFav', {
      params: {
        uid: userId,
      },
    });
    var temp = [];
    if (ffavList.data.data) {
      ffavList.data.data.map(obj => {
        temp.push(obj.goodsId);
      });
      setFavList(ffavList.data.data);
      setIsFav(temp);
    }
    if (route.params.searchList) {
      const res = await axios
        .get('goods/getallgoods.html', {
          params: {
            name: route.params.searchList,
          },
        })
        .then(data => {
          setTours(data.data.data);
          setMasterTours(data.data.data);

          var temp = data.data.data;
          var tempCate = [];

          var filterItemsTemp = [];
          if (temp) {
            const unique = [...new Set(temp.map(item => item.place))];

            // filterItemsTemp.push({
            //   label: i18n.t('search_list_sort'),
            //   value: 'cate',
            //   disabled: true,
            // });

            // temp.map(item=>{
            //   console.log(filterItemsTemp);
            //   console.log(item);
            //   if(!filterItemsTemp.includes(item.cateName)){
            //     console.log(item.cateName);
            //     filterItemsTemp.push({
            //       label: item.cateName,
            //       value: item.cateId,
            //       parent: 'cate'
            //     })
            //   }
            // })
            // filterItemsTemp[0].disabled = true;

            filterItemsTemp.push({
              label: i18n.t('search_list_filter_place'),
              value: 'place',
              disabled: true,
            });

            // filterItemsTemp.push({
            //   label: i18n.t('search_list_sort_price'),
            //   value: 'price',
            // });
            // filterItemsTemp.push({ label: 'Days', value: 'days' });

            // unique.map(item => {
            //   filterItemsTemp.push({
            //     label: item,
            //     value: item,
            //     parent: 'place',
            //   });
            // });
            setFilterItems(filterItemsTemp);
          } else {
            setFilterItems([]);
          }
        });
    } else {
      const res = await axios.get('goods/getallgoods.html', {
        params: {
          cateId: route.params.itemCateId,
        },
      });

      setTours(res.data.data);
      setMasterTours(res.data.data);
      var temp = res.data.data;
      var filterItemsTemp = [];
      if (temp) {
        const unique = [...new Set(temp.map(item => item.place))];

        // filterItemsTemp.push({
        //   label: i18n.t('search_list_filter_place'),
        //   value: 'place',
        //   disabled: true,
        // });

        filterItemsTemp.push({
          label: i18n.t('search_list_sort_price'),
          value: 'price',
        });
        // filterItemsTemp.push({ label: 'Days', value: 'days' });

        // unique.map(item => {
        //   filterItemsTemp.push({
        //     label: item,
        //     value: item,
        //     parent: 'place',
        //   });
        // });
        setFilterItems(filterItemsTemp);
      } else {
        setFilterItems([]);
      }
    }
  }

  useEffect(() => {
    seIsLoading(true);
    dispatch(setSearchListTitle(route.params.itemType));
    try {
      fetchMyAPI().then(() => seIsLoading(false));
    } catch (e) {
      console.log(e);
    }
  }, [isFocused]);

  useEffect(() => {
    getFilterData();
  }, [isFilterDays, isFilterPrice, isFilterPlace]);

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
  const getFilterData = () => {
    setTours(masterTours);
    var newData = masterTours;
    isFilter;
    if (isFilterPrice) {
      newData = newData.filter(function (item) {
        const itemPrice = item.price;
        return itemPrice >= priceSlider[0] && itemPrice <= priceSlider[1];
      });
    }
    // if (isFilterDays) {
    //   newData = newData.filter(function (item) {
    //     const itemDays = item.days;
    //     return itemDays >= daysSlider[0] && itemDays <= daysSlider[1];
    //   });
    // }

    // if (isFilterPlace) {
    //   var temp = filterValue.filter(item => {
    //     return item != 'days' && item != 'price';
    //   });
    //   newData = newData.filter(function (item) {
    //     return temp.includes(item.place);
    //   });
    // }

    if (isSortPrice) {
      newData.sort((a, b) => {
        if (parseFloat(a['price']) < parseFloat(b['price'])) {
          return -1;
        }
        if (parseFloat(a['price']) > parseFloat(b['price'])) {
          return 1;
        }
        return 0;
      });
    }
    if (isSortDays) {
      newData.sort((a, b) => {
        if (a['days'] < b['days']) {
          return -1;
        }
        if (a['days'] > b['days']) {
          return 1;
        }
        return 0;
      });
    }

    setTours(newData);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F6F6F6'}}>
      <>
        {isLoading ? (
          <View>
            <ActivityIndicator
              color="#009b88"
              size="large"
              style={{marginTop: '40%'}}
            />
          </View>
        ) : masterTours ? (
          <>
            <View style={{flex: 1, backgroundColor: '#F6F6F6'}}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={priceModalVisible}>
                <View
                  style={{
                    borderRadius: 30,
                    borderWidth: 2,
                    marginHorizontal: '10%',
                    marginVertical: Platform.OS === 'ios' ? '80%' : '70%',
                    backgroundColor: 'white',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}>
                    <Text>$ {priceSlider[0]}</Text>
                    <Text> - </Text>
                    <Text>$ {priceSlider[1]}</Text>
                  </View>
                  <MultiSlider
                    values={[priceSlider[0], priceSlider[1]]}
                    sliderLength={250}
                    onValuesChange={value => {
                      setPriceSlider(value);
                    }}
                    min={0}
                    max={50000}
                    step={2000}
                    allowOverlap
                    snapped
                  />
                  <View
                    style={{
                      marginTop: '10%',
                      width: '100%',
                      flexDirection: 'row',
                      height: '20%',
                      justifyContent: 'space-evenly',
                    }}>
                    <TouchableOpacity
                      style={{
                        width: '30%',
                        borderRadius: 10,
                        borderWidth: 0.5,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => {
                        setIsFilterPrice(true);
                        setPriceModalVisible(false);
                      }}>
                      <Text>{i18n.t('confirm')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        width: '30%',
                        borderRadius: 10,
                        borderWidth: 0.5,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => {
                        var value = filterValue.filter(e => e !== 'price');
                        setFilterValue(value);
                        setPriceModalVisible(false);
                      }}>
                      <Text>{i18n.t('cancel')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              <Modal
                animationType="slide"
                transparent={true}
                visible={daysModalVisible}>
                <View
                  style={{
                    borderRadius: 30,
                    borderWidth: 2,
                    marginHorizontal: '10%',
                    marginVertical: Platform.OS === 'ios' ? '80%' : '70%',
                    backgroundColor: 'white',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}>
                    <Text>{daysSlider[0]}</Text>
                    <Text> - </Text>
                    <Text>{daysSlider[1]} days</Text>
                  </View>
                  <MultiSlider
                    values={[daysSlider[0], daysSlider[1]]}
                    sliderLength={250}
                    onValuesChange={value => {
                      setDaysSlider(value);
                    }}
                    min={3}
                    max={180}
                    step={1}
                    allowOverlap
                    snapped
                  />
                  <View
                    style={{
                      marginTop: '10%',
                      width: '100%',
                      flexDirection: 'row',
                      height: '20%',
                      justifyContent: 'space-evenly',
                    }}>
                    <TouchableOpacity
                      style={{
                        width: '30%',
                        borderRadius: 10,
                        borderWidth: 0.5,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => {
                        setIsFilterDays(true);
                        setDaysModalVisible(false);
                      }}>
                      <Text>{i18n.t('confirm')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        width: '30%',
                        borderRadius: 10,
                        borderWidth: 0.5,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => {
                        var value = filterValue.filter(e => e !== 'days');
                        setFilterValue(value);
                        setDaysModalVisible(false);
                      }}>
                      <Text>{i18n.t('cancel')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              <View
                style={{
                  flexDirection: 'row',
                  zIndex: 7,
                  paddingHorizontal: '3%',
                  width: '100%',
                  backgroundColor: 'white',
                }}>
                <View style={{width: '50%'}}>
                  <DropDownPicker
                    style={{
                      borderWidth: 0,
                      textAlign: 'center',
                      width: '100%',
                      color: '#313131',
                      fontSize: 12,
                      fontWeight: '600',
                      borderRadius: 0,
                    }}
                    placeholderStyle={{
                      fontSize: 12,
                      color: '#727272',
                    }}
                    arrowIconStyle={{
                      width: 10,
                      height: 10,
                      color: '#727272',
                    }}
                    dropDownContainerStyle={{
                      borderWidth: 0,
                    }}
                    listItemLabelStyle={{
                      color: '#727272',
                      fontSize: 12,
                    }}
                    multiple={true}
                    open={sortOpen}
                    placeholder={i18n.t('sort')}
                    multipleText={multipleText}
                    value={sortValue}
                    items={sortItems}
                    setOpen={() => {
                      if (filterOpen) {
                        setFilterOpen(!filterOpen);
                      }
                      setSortOpen(!sortOpen);
                    }}
                    setValue={setSortValue}
                    setItems={setSortItems}
                    showTickIcon={false}
                    onSelectItem={value => {}}
                    onChangeValue={value => {
                      //click price

                      if (value[value.length - 1] == 'price') {
                        if (isSortPrice) {
                          setIsSortDays(false);
                          setIsSortPrice(false);
                          value = '';
                        } else {
                          setMultipleText('Sort By Price');
                          value = sortValue.filter(e => e !== 'days');
                          setSortValue(value);
                          setIsSortDays(false);
                          setIsSortPrice(true);
                        }
                        getFilterData();
                      }

                      //click days
                      if (value[value.length - 1] == 'days') {
                        if (isSortDays) {
                          setIsSortDays(false);
                          setIsSortPrice(false);
                          value = '';
                        } else {
                          setMultipleText('Sort By Days');
                          value = sortValue.filter(e => e !== 'price');
                          setSortValue(value);
                          setIsSortPrice(false);
                          setIsSortDays(true);
                        }
                        getFilterData();
                      }
                    }}
                  />
                </View>

                <View
                  style={{
                    zIndex: 5,
                    display: 'flex',
                    flexDirection: 'row',
                    height: '7%',
                    width: '100%',
                  }}>
                  {route.params.searchList ? (
                    <>
                      {/* <View style={{width: '100%'}}>
                        <DropDownPicker
                          style={{
                            borderWidth: 0,
                            textAlign: 'center',
                            width: '100%',
                            color: '#313131',
                            fontSize: 12,
                            fontWeight: '600',
                            borderRadius: 0,
                          }}
                          multiple={true}
                          open={sortOpen}
                          placeholder={i18n.t('search_list_sort')}
                          multipleText={multipleText}
                          value={sortValue}
                          items={sortItems}
                          setOpen={() => {
                            if (filterOpen) {
                              setFilterOpen(!filterOpen);
                            }
                            setSortOpen(!sortOpen);
                          }}
                          setValue={setSortValue}
                          setItems={setSortItems}
                          showTickIcon={false}
                          onSelectItem={value => {}}
                          onChangeValue={value => {
                            //click price
                            if (value[value.length - 1] == 'price') {
                              if (isSortPrice) {
                                setIsSortDays(false);
                                setIsSortPrice(false);
                                value = '';
                              } else {
                                setMultipleText('Sort By Price');
                                value = sortValue.filter(e => e !== 'days');
                                setSortValue(value);
                                setIsSortDays(false);
                                setIsSortPrice(true);
                              }
                              getFilterData();
                            }

                            //click days
                            if (value[value.length - 1] == 'days') {
                              if (isSortDays) {
                                setIsSortDays(false);
                                setIsSortPrice(false);
                                value = '';
                              } else {
                                setMultipleText('Sort By Days');
                                value = sortValue.filter(e => e !== 'price');
                                setSortValue(value);
                                setIsSortPrice(false);
                                setIsSortDays(true);
                              }
                              getFilterData();
                            }
                          }}
                        />
                      </View> */}
                    </>
                  ) : (
                    <></>
                  )}
                  <View
                    style={{
                      width: '50%',
                      zIndex: 7,
                      elevation: 3,
                      borderRadius: 0,
                    }}>
                    <TouchableOpacity
                      style={{
                        //backgroundColor: 'black',
                        width: 200,
                        height: 50,
                        justifyContent: 'center',
                        paddingLeft: 10,
                      }}
                      onPress={() => {
                        setPriceModalVisible(true);
                      }}>
                      <View
                        style={{
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            color: '#727272',
                            fontSize: 12,
                          }}>
                          {i18n.t('search_list_filter')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {/* <DropDownPicker
                      listMode="MODAL"
                      scrollViewProps={{
                        nestedScrollEnabled: true,
                      }}
                      style={{
                        borderWidth: 0,
                        textAlign: 'center',
                        width: '100%',
                        color: '#313131',
                        fontSize: 15,
                        fontWeight: Platform.OS === 'ios' ? '600' : '900',
                        borderRadius: 0,
                      }}
                      placeholderStyle={{
                        fontSize: 12,
                        color: '#727272',
                      }}
                      arrowIconStyle={{
                        width: 10,
                        height: 10,
                        color: '#727272',
                      }}
                      multiple={true}
                      open={filterOpen}
                      placeholder={i18n.t('search_list_filter')}
                      value={filterValue}
                      items={filterItems}
                      onSelectItem={() => {}}
                      onChangeValue={value => {
                        // current value is null
                        if (value == '') {
                          setIsFilterDays(false);
                          setIsFilterPlace(false);
                          getFilterData();
                        }
                        //something deleted

                        if (previewFilter.length > value.length) {
                          if (!value.includes('days')) {
                            setIsFilterDays(false);
                          }
                          if (!value.includes('price')) {
                            setIsFilterPrice(false);
                          }
                          if (
                            value.length == 0 ||
                            (value.length == 1 &&
                              (value.includes('price') ||
                                value.includes('days'))) ||
                            (value.length == 2 &&
                              value.includes('price') &&
                              value.includes('days'))
                          ) {
                            setIsFilterPlace(false);
                          } else {
                            setIsFilterPlace(true);
                          }
                          getFilterData();
                        }

                        if (
                          value != '' &&
                          previewFilter.length < value.length
                        ) {
                          if (value.includes('days')) {
                            setDaysModalVisible(true);
                          } else if (value.includes('price')) {
                            setPriceModalVisible(true);
                          } else {
                            setIsFilterPlace(true);
                            getFilterData();
                          }
                          //
                          if (
                            (value.includes('days') &&
                              !previewFilter.includes('days')) ||
                            (value.includes('price') &&
                              !previewFilter.includes('price'))
                          ) {
                            setFilterOpen(false);
                          }
                        }
                        setPreviewFilter(value);
                      }}
                      setOpen={() => {
                        if (sortOpen) {
                          setSortOpen(!sortOpen);
                        }
                        setFilterOpen(!filterOpen);
                      }}
                      setValue={setFilterValue}
                      setItems={setFilterItems}
                    /> */}
                  </View>
                </View>
              </View>
              <View
                onStartShouldSetResponder={() => {
                  setSortOpen(false);
                  setFilterOpen(false);
                }}>
                <FlatList
                  style={{
                    width: '100%',
                    height: '100%',
                    paddingHorizontal: '2%',
                  }}
                  numColumns={2}
                  data={tours}
                  renderItem={({item, index}) => (
                    <View
                      key={index}
                      style={{
                        width: '42%',
                        height: 187,
                        marginHorizontal: '4%',
                        marginTop: '3%',
                        //borderWidth: 1,
                        borderColor: 'white',
                        borderRadius: 10,
                        backgroundColor: 'white',
                        shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 1,
                        },
                        shadowOpacity: 0.15,
                        shadowRadius: 3.84,
                        elevation: 2,
                        //overflow: 'hidden',
                      }}>
                      <View
                        style={{
                          width: '100%',
                          height: '70%',
                          borderRadius: 10,
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            navigation.push('GoodsDetail', {
                              goodsId: item.id,
                              itemType: route.params.itemType,
                            });
                            setSortOpen(false);
                            setFilterOpen(false);
                          }}>
                          <Image
                            style={{
                              width: '100%',
                              height: '100%',
                              borderTopLeftRadius: 10,
                              borderTopRightRadius: 10,
                            }}
                            source={{uri: item.coverImg[0]}}
                          />
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          justifyContent: 'space-between',
                          paddingLeft: 5,
                          backgroundColor: 'white',
                        }}>
                        <View style={{}}>
                          <Text
                            style={{
                              fontWeight: Platform.OS === 'ios' ? '500' : '600',
                              fontSize: 10,
                              width: 'auto',
                              marginVertical: 10,
                              marginLeft: 2,
                              color: 'black',
                            }}
                            numberOfLines={1}>
                            {item.name}
                          </Text>
                        </View>
                        <View
                          style={{
                            borderBottomColor: 'gray',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            marginRight: 9,
                            marginLeft: 4,
                          }}
                        />
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            alignItems: 'baseline',
                            paddingRight: 10,
                            top: 5,
                          }}>
                          <Text
                            style={{
                              // marginTop: 3,
                              fontSize: 8,
                              fontWeight: Platform.OS === 'ios' ? '500' : '600',
                            }}>
                            $ {item.price}
                          </Text>
                          {/* {userToken ? (
                          <Icon
                            name={
                              isFav.includes(item.id)
                                ? 'heart-sharp'
                                : 'heart-outline'
                            }
                            style={{fontSize: 30, color: '#F04E96',width:'20%'}}
                            onPress={({name}) => {
                              clickFav(item.id);
                              if (isFav.includes(item.id)) {
                                setIsFav(isFav.filter(e => e != item.id));
                              } else {
                                setIsFav([...isFav, item.id]);
                              }
                            }}></Icon>
                        ) : (
                          <></>
                        )} */}
                        </View>
                      </View>
                    </View>
                  )}
                />
              </View>
            </View>
            <View style={{height: '6.5%'}}></View>
          </>
        ) : (
          <View style={{justifyContent: 'center', height: '80%'}}>
            <Text style={{fontSize: 20, textAlign: 'center'}}>
              Sorry. Can't find about "{route.params.searchList}".
            </Text>
          </View>
        )}
      </>
    </SafeAreaView>
  );
};

export default SearchListScreen;
