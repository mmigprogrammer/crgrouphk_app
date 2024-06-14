import React, {useState, useEffect} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  Keyboard,
  View,
  TextInput,
  SafeAreaView,
  useWindowDimensions,
  TouchableWithoutFeedback,
  Button,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import axios from '../../component/AxiosNet';
import {useSelector, useDispatch} from 'react-redux';
import * as i18n from '../../i18n/i18n';
import Icon from 'react-native-vector-icons/Ionicons';
import {setSearchHistory, setSearchListTitle} from '../../redux/actions';
import {useIsFocused} from '@react-navigation/native';

const Search = ({navigation}) => {
  i18n.setI18nConfig();
  const dispatch = useDispatch();
  const layout = useWindowDimensions();
  const {searchListTitle, searchHistory} = useSelector(
    state => state.searchReducer,
  );

  const [onSearchFocus, setOnSearchFocus] = useState(false);
  const [searchText, setSearchText] = useState(false);

  const [cate, setCate] = useState();
  const [tours, setTours] = useState();

  const [filteredDataSource, setFilteredDataSource] = useState([]);
  const [masterDataSource, setMasterDataSource] = useState([]);

  const isFocused = useIsFocused();

  async function fetchMyAPI() {
    const cate = await axios.get('cate/getAllCate.html');
    if (cate) {
      setCate(cate.data.data);
    }
    const tours = await axios.get('goods/getallgoods.html');
    if (tours) {
      setTours(tours.data.data);
      var temp = searchHistory.slice(searchHistory.length - 3);

      var k = 3;
      if (temp.length < 3) {
        k = temp.length;
      }
      for (var i = 0; i < k; i++) {
        tours.data.data.unshift({
          id: tours.data.data.length + 1,
          name: temp[i],
          status: 99,
        });
      }
      setFilteredDataSource(tours.data.data);
      setMasterDataSource(tours.data.data);
    }

    const result = tours.data.data.map(tour => ({
      ...tour,
      type: cate.data.data.filter(it => it.cateId === tour.cateId),
    }));
  }

  useEffect(() => {
    try {
      fetchMyAPI();
    } catch (e) {
      console.log(e);
    }
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <SafeAreaView
        style={{flex: 1, backgroundColor: 'white', justifyContent: 'center'}}>
        <TouchableWithoutFeedback
          onPress={() => Keyboard.dismiss()}
          accessible={false}>
          <View style={{justifyContent: 'center'}}>
            <View
              style={{
                marginTop: '1.5%',
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: '5%',
                height: 34,
                borderRadius: 20,
                backgroundColor: '#E1E1E1',
                overflow: 'hidden',
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
                      navigation.push('SearchList', {
                        searchList: event.nativeEvent.text,
                        type: 'keyword',
                      });
                      var temp = searchHistory;

                      temp.push(event.nativeEvent.text);

                      dispatch(setSearchHistory(temp));
                      fetchMyAPI();
                    }
                  }
                }}
                onChangeText={text => {
                  setSearchText(text);
                  searchFilterFunction(text);
                }}
                onClear={text => searchFilterFunction('')}
                placeholder="Search"
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
                        fontWeight: Platform.OS === 'ios' ? '200' : '700',
                      }}>
                      {i18n.t('no_record')}
                    </Text>
                  </View>
                ) : (
                  <View
                    style={{
                      height: '100%',
                      justifyContent: 'center',
                    }}>
                    <FlatList
                      keyboardShouldPersistTaps="handled"
                      data={filteredDataSource.slice(0, 10)}
                      style={{width: '100%'}}
                      renderItem={({item}) => (
                        <TouchableOpacity
                          style={{
                            width: '90%',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                          onPress={() => {
                            console.log(item.name);
                            navigation.push('SearchList', {
                              searchList: item.name,
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
                      )}></FlatList>
                  </View>
                )}
              </>
            ) : (
              <></>
            )}
          </View>
        </TouchableWithoutFeedback>
        <View></View>
        <FlatList
          style={{flex: 1}}
          data={cate}
          renderItem={({item, index}) => (
            <>
              {index == 0 ? (
                <>
                  {/* booking */}
                  {/* <TouchableOpacity
                    style={{
                      backgroundColor: '#E8E8E8',
                      paddingLeft: '3%',
                      justifyContent: 'center',
                      marginTop: '5%',
                      marginHorizontal: '8%',
                      height: 113,
                      position: 'relative',
                      alignItems: 'center',
                      borderRadius: 10
                    }}
                    onPress={() => {
                      navigation.push('Booking');
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: '400',
                        color: 'white',
                        position: 'absolute',
                        textShadowColor: '#000000',
                        textShadowOffset: {width: -1, height: 1},
                        textShadowRadius: 8,
                        width: '100%',
                        textAlign: 'center',
                      }}>
                      {i18n.t('booking_consult')}
                    </Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#E8E8E8',
                      justifyContent: 'center',
                      marginTop: 22,
                      marginHorizontal: '8%',
                      height: 143,
                      width: '84%',
                      borderRadius: 10,
                    }}
                    onPress={() => {
                      navigation.push('SearchList', {
                        cate,
                        itemType: item.name,
                        itemCateId: item.cateId,
                      });
                      dispatch(setSearchListTitle(item.name));
                    }}>
                    {item.cateImage ? (
                      <ImageBackground
                        source={{uri: item.cateImage}}
                        imageStyle={{borderRadius: 10}}
                        style={{
                          marginVertical: '2.5%',
                          height: 143,
                          position: 'relative',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 10,
                        }}>
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: '400',
                            color: 'white',
                            position: 'absolute',
                            textShadowColor: '#000000',
                            textShadowOffset: {width: -1, height: 1},
                            textShadowRadius: 8,
                            width: '100%',
                            textAlign: 'center',
                          }}>
                          {item.name}{' '}
                        </Text>
                        <Text
                          style={{
                            fontWeight: '400',
                            color: 'white',
                            position: 'absolute',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            textAlign: 'center',
                          }}>
                          {item.subject}{' '}
                        </Text>
                      </ImageBackground>
                    ) : (
                      <View
                        style={{
                          marginVertical: '2.5%',
                          height: 143,
                          position: 'relative',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: '400',
                            color: 'white',
                            position: 'absolute',
                            textShadowColor: '#000000',
                            textShadowOffset: {width: -1, height: 1},
                            textShadowRadius: 8,
                            width: '100%',
                            textAlign: 'center',
                          }}>
                          {item.name}{' '}
                        </Text>
                        <Text
                          style={{
                            fontWeight: '400',
                            color: 'white',
                            position: 'absolute',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            textAlign: 'center',
                          }}>
                          {item.subject}{' '}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={{
                    //backgroundColor: '#E8E8E8',
                    justifyContent: 'center',
                    marginTop: '5%',
                    marginHorizontal: '8%',
                    height: 143,
                  }}
                  onPress={() => {
                    navigation.push('SearchList', {
                      cate,
                      itemType: item.name,
                      itemCateId: item.cateId,
                    });
                    dispatch(setSearchListTitle(item.name));
                  }}>
                  {item.cateImage ? (
                    <ImageBackground
                      imageStyle={{borderRadius: 10}}
                      source={{uri: item.cateImage}}
                      style={{
                        marginVertical: '2.5%',
                        height: 143,
                        width: '100%',
                        position: 'relative',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: '400',
                          color: 'white',
                          position: 'absolute',
                          textShadowColor: '#000000',
                          textShadowOffset: {width: -1, height: 1},
                          textShadowRadius: 8,
                          width: '100%',
                          textAlign: 'center',
                        }}>
                        {item.name}{' '}
                      </Text>
                      <Text
                        style={{
                          fontWeight: '400',
                          color: 'white',
                          position: 'absolute',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%',
                          textAlign: 'center',
                        }}>
                        {item.subject}{' '}
                      </Text>
                    </ImageBackground>
                  ) : (
                    <View
                      style={{
                        marginVertical: '2.5%',
                        height: 113,
                        position: 'relative',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: '400',
                          color: 'white',
                          position: 'absolute',
                          textShadowColor: '#000000',
                          textShadowOffset: {width: -1, height: 1},
                          textShadowRadius: 8,
                          width: '100%',
                          textAlign: 'center',
                        }}>
                        {item.name}{' '}
                      </Text>
                      <Text
                        style={{
                          fontWeight: '400',
                          color: 'white',
                          position: 'absolute',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%',
                          textAlign: 'center',
                        }}>
                        {item.subject}{' '}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              )}
            </>
          )}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
export default Search;
