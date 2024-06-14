// SearchBar.js
import React, {useState, useEffect} from "react";
import { TouchableOpacity,FlatList ,StyleSheet, TextInput, View, Keyboard, Text, useWindowDimensions } from "react-native";
import * as i18n from '../i18n/i18n';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from '../component/AxiosNet';

import { useNavigation ,useRoute} from '@react-navigation/native';
import { setSearchHistory, setSearchListTitle } from '../redux/actions';


const SearchBar = () => {
    
    const navigation = useNavigation();
    const route = useRoute();
    i18n.setI18nConfig()
    const dispatch = useDispatch();
    const layout = useWindowDimensions();
    const { searchListTitle, searchHistory } = useSelector(state => state.searchReducer);
  
    const [onSearchFocus, setOnSearchFocus] = useState(false);
    const [searchText, setSearchText] = useState(false);
  
    const [tours, setTours] = useState();
    const [cate, setCate] = useState();
    const [goodsData, setGoodsData] = useState();
  
    const [filteredDataSource, setFilteredDataSource] = useState([]);
    const [masterDataSource, setMasterDataSource] = useState([]);
  
  
  
    async function fetchMyAPI() {
      console.log(searchHistory)
      const cate = await axios.get("cate/getAllCate.html");
      if (cate) {
        setCate(cate.data.data);
      }
      const tours = await axios.get("goods/getallgoods.html");
      if (tours) {
        
        setTours(tours.data.data);
        var temp = searchHistory.slice(searchHistory.length - 3);
  
        var k = 3;
        if (temp.length < 3) {
          k = temp.length
        }
        for (var i = 0; i < k; i++) {
          tours.data.data.unshift({ id: tours.data.data.length + 1, name: temp[i], state: 99 })
        }
        setFilteredDataSource(tours.data.data);
        setMasterDataSource(tours.data.data);
      }
      const result = tours.data.data.map(tour => ({
        ...tour,
        type: cate.data.data.filter(it => it.cateId === tour.cateId),
      }));
      setGoodsData(result);
    }
  
    useEffect(() => {
      fetchMyAPI()
    }, []);
  
    const searchFilterFunction = (text) => {
      if (text) {
        const newData = masterDataSource.filter(function (item) {
          const itemData = item.name
            ? item.name.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
        setFilteredDataSource(newData);
      } else {
  
        setFilteredDataSource(masterDataSource);
      }
  
    };
  
    return (
        <View style={{}}>
            <View style={{
                marginTop: '1.5%',
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: '5%',
                height: 34,
                borderRadius: 20,
                backgroundColor: '#E1E1E1',
                paddingLeft: '1.5%'
            }}>
                <Icon name="search" size={30} style={{ fontSize: 20, color: '#848484' }} />
                <TextInput style={{ marginLeft: '1%', color: '#707070', height: '100%', width: '90%' }}
                    blurOnSubmit={true}
                    onSubmitEditing={(event) => {
                        if (event.nativeEvent.text != "") {

                            if (searchHistory) {
                                if (route.name == "Home"){
                                    navigation.navigate('SearchList', { searchList: event.nativeEvent.text })
                                }else{
                                navigation.push('SearchList', { searchList: event.nativeEvent.text })
                                }
                                var temp = searchHistory;
                                temp.push(event.nativeEvent.text);
                                dispatch(setSearchHistory(temp));
                                fetchMyAPI();
                            }
                        }
                    }}
                    onChangeText={(text) => {
                        setSearchText(text);
                        searchFilterFunction(text);

                    }}
                    onClear={(text) => searchFilterFunction('')}
                    placeholder='Search'
                    onFocus={() => {
                        setOnSearchFocus(true)
                    }
                    } onBlur={() => setOnSearchFocus(false)} />
            </View>
            {onSearchFocus === true ? (
                <>
                    {searchHistory.length == 0 ? (
                        <View style={{
                            height: '100%',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Icon name="search" style={{ fontSize: 22 }} />
                            <Text style={{ fontSize: 15, marginTop: '8%', fontWeight: "200" }}>You have no recent searches</Text>
                        </View>
                    ) : (
                        <View style={{
                            height: '100%',
                            marginLeft: '6%',
                            justifyContent: 'center'
                        }}>
                            <FlatList data={filteredDataSource.slice(0, 10)}
                                style={{ width: '100%' }}
                                renderItem={({ item }) => (
                                    <TouchableOpacity style={{ width: '90%', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', }}
                                        onPress={() => {
                                            if (route.name == "Home"){
                                                navigation.navigate('SearchList', { searchList: item.name })
                                            }else{
                                                navigation.push('SearchList', { searchList: item.name })
                                            }
                                        }}>
                                        {item.state != 1 ? (
                                            <View style={{ width: '100%', borderBottomWidth: 0.3, borderColor: '#D9D9D9' }} onPress={() => alert()}>
                                                <Text style={{ marginLeft: '1.5%', fontSize: 16, fontWeight: '300', marginVertical: '3%', }}>{item.name}</Text>
                                            </View>
                                        ) : (
                                            <View style={{ width: '100%', borderBottomWidth: 0.3, borderColor: '#D9D9D9' }} onPress={() => alert()}>
                                                <Text style={{ marginLeft: '1.5%', fontSize: 16, fontWeight: '300', marginVertical: '3%', }}>{item}</Text>
                                            </View>

                                        )}
                                    </TouchableOpacity>
                                )}>
                            </FlatList>
                        </View>
                    )}
                </>
            ) : (
                <></>
            )}
        </View>
    );
};
export default SearchBar;

// styles
const styles = StyleSheet.create({
    container: {
        margin: 15,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        width: "90%",

    },
    searchBar__unclicked: {
        padding: 10,
        flexDirection: "row",
        width: "95%",
        backgroundColor: "#d9dbda",
        borderRadius: 15,
        alignItems: "center",
    },
    searchBar__clicked: {
        padding: 10,
        flexDirection: "row",
        width: "80%",
        backgroundColor: "#d9dbda",
        borderRadius: 15,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    input: {
        fontSize: 20,
        marginLeft: 10,
        width: "90%",
    },
});