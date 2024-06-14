import React from 'react';
import {Text} from 'react-native';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FeatherIcons from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';

// Importing the screens

import LoginScreen from './Login/LoginScreen';
import StaffLoginScreen from './Login/StaffLoginScreen';
import HomeScreen from './Home/HomeScreen';
import BookingScreen from './Search/BookingScreen';
import SearchScreen from './Search/SearchScreen';
import SearchListScreen from './Search/SearchListScreen';
import GoodsDetailScreen from './Search/GoodsDetailScreen';
import ShopScreen from './Shop/ShopScreen';
import ShopCheckOutScreen from './Shop/ShopCheckOutScreen';
import PaypalScreen from './Shop/PaypalScreen';
import ShopRLScreen from './Shop/RequireLoginShop';
import FavoriteScreen from './Favorite/FavoriteScreen';
import FavoriteRLScreen from './Favorite/RequireLoginFav';
import UserProfileScreen from './User/UserProfileScreen';
import MyAccountScreen from './User/MyAccountScreen';
import OrderScreen from './User/OrderScreen';
import OrderDetailScreen from './User/OrderDetailScreen';
import CouponScreen from './User/CouponScreen';
import CustomerServiceScreen from './User/CustomerServiceScreen';
import CouponHistoryScreen from './User/CouponHistoryScreen';
import RedeemScreen from './User/RedeemScreen';
import SettingScreen from './Setting/SettingScreen';
import SignupScreen from './Login/SignupScreen';
import SMSScreen from './Login/SMSScreen';
import RegisterScreen from './Login/RegisterScreen';

import * as i18n from '../i18n/i18n';

import {View} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import style from '../utils/style';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainNavigator = ({navigation}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Page" component={TabNavigator} />
      <Stack.Screen
        name="Setting"
        options={{headerShown: true}}
        component={SettingScreen}
      />
    </Stack.Navigator>
  );
};

const SearchScreenStack = ({navigation}) => {
  const {searchListTitle} = useSelector(state => state.shoppingReducer);
  return (
    <Stack.Navigator
      initialRouteName={'Search'}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Search"
        component={SearchScreen}
        // options={{
        //   headerRight: () => (
        //     <Icon
        //       style={{ fontSize: 25, marginRight: 10 }}
        //       name="settings-sharp"
        //       onPress={() => navigation.navigate('Setting')}
        //       title="Info"
        //       color="#404040"
        //     />
        //   ),
        // }}
      />
      <Stack.Screen
        name="Booking"
        component={BookingScreen}
        options={{
          title: '預約',
          headerShown: true,
          headerLeft: () => (
            <Icon
              style={{fontSize: 35}}
              name="chevron-back"
              onPress={() =>
                navigation.cangoback
                  ? navigation.goBack()
                  : navigation.replace('Search')
              }
            />
          ),
          // headerRight: () => (
          //   <Icon
          //     style={{fontSize: 25, marginRight: 10}}
          //     name="settings-sharp"
          //     onPress={() => navigation.navigate('Setting')}
          //     title="Info"
          //     color="#404040"
          //   />
          // ),
        }}
      />
      <Stack.Screen
        name="SearchList"
        component={SearchListScreen}
        options={{
          headerTitle: () => (
            <Text style={{fontSize: 16, color: '#6A6A6A'}}>
              {searchListTitle}
            </Text>
          ),
          title: searchListTitle,
          headerShown: true,
          headerLeft: () => (
            <Icon
              style={{fontSize: 15}}
              name="chevron-back"
              onPress={() =>
                navigation.cangoback
                  ? navigation.goBack()
                  : navigation.replace('Search')
              }
            />
          ),
          // headerRight: () => (
          //   <Icon
          //     style={{ fontSize: 25, marginRight: 10 }}
          //     name="settings-sharp"
          //     onPress={() => navigation.navigate('Setting')}
          //     color="#404040"
          //   />
          // ),
        }}
      />
      <Stack.Screen
        name="GoodsDetail"
        component={GoodsDetailScreen}
        options={{
          headerTitle: () => (
            <Text style={{fontSize: 16, color: '#6A6A6A'}}>
              {i18n.t('goodsDetail')}
            </Text>
          ),
          headerShown: true,
          headerLeft: () => (
            <Icon
              style={{fontSize: 15, color: '#494949'}}
              name="chevron-back"
              // onPress={() =>
              //   navigation.cangoback
              //     ? navigation.goBack()
              //     : navigation.replace('Search')
              // }
              onPress={() => navigation.pop()}
            />
          ),
          // headerRight: () => (
          //   <Icon
          //     style={{ fontSize: 25, marginRight: 10 }}
          //     name="settings-sharp"
          //     onPress={() => navigation.navigate('Setting')}
          //     color="#404040"
          //   />
          // ),
        }}
      />
    </Stack.Navigator>
  );
};
const ShopScreenStack = ({navigation, route}) => {
  const {userToken} = useSelector(state => state.loginReducer);
  return (
    <Stack.Navigator
      initialRouteName={userToken == null ? 'ShopRL' : 'Shop'}
      screenOptions={{
        headerShown: false,
      }}>
      {userToken == null ? (
        <>
          <Stack.Screen
            name="ShopRL"
            component={ShopRLScreen}
            options={{
              headerRight: () => (
                <Icon
                  style={{fontSize: 25, marginRight: 10}}
                  name="settings-sharp"
                  onPress={() => navigation.navigate('Setting')}
                  title="Info"
                  color="#404040"
                />
              ),
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Shop"
            component={ShopScreen}
            options={{
              headerRight: () => (
                <Icon
                  style={{fontSize: 25, marginRight: 10}}
                  name="settings-sharp"
                  onPress={() => navigation.navigate('Setting')}
                  title="Info"
                  color="#404040"
                />
              ),
            }}
          />
          <Stack.Screen
            name="ShopCheckOut"
            component={ShopCheckOutScreen}
            // options={{
            //   headerRight: () => (
            //     <Icon
            //       style={{ fontSize: 25, marginRight: 10 }}
            //       name="settings-sharp"
            //       onPress={() => navigation.navigate('Setting')}
            //       title="Info"
            //       color="#404040"
            //     />
            //   ),
            // }}
          />
          <Stack.Screen name="Paypal" component={PaypalScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
const FavoriteScreenStack = ({navigation}) => {
  const {userToken} = useSelector(state => state.loginReducer);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {userToken == null ? (
        <>
          <Stack.Screen
            name="FavoriteRL"
            component={FavoriteRLScreen}
            // options={{
            //   headerRight: () => (
            //     <Icon
            //       style={{ fontSize: 25, marginRight: 10 }}
            //       name="settings-sharp"
            //       onPress={() => navigation.navigate('Setting')}
            //       title="Info"
            //       color="#404040"
            //     />
            //   ),
            // }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Favorite"
          component={FavoriteScreen}
          options={
            {
              // headerRight: () => (
              //   <Icon
              //     style={{fontSize: 25, marginRight: 10}}
              //     name="settings-sharp"
              //     onPress={() => navigation.navigate('Setting')}
              //     title="Info"
              //     color="#404040"
              //   />
              // ),
            }
          }
        />
      )}
    </Stack.Navigator>
  );
};
const UserScreenStack = ({navigation}) => {
  const {userToken} = useSelector(state => state.loginReducer);
  return (
    <Stack.Navigator
      initialRouteName={userToken == null ? 'Login' : 'User'}
      screenOptions={{
        title: i18n.t('account'),
        headerRight: () => (
          <Text
            style={{fontSize: 14, marginRight: 10, color: '#AEAEAE'}}
            //name="settings-sharp"
            onPress={() => navigation.navigate('Setting')}
            //title="Info"
            //color="#404040"
          >
            {i18n.t('more')}
          </Text>
        ),
      }}>
      {userToken == null ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="StaffLogin" component={StaffLoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="SMS" component={SMSScreen} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="User"
            component={UserProfileScreen}
            options={{
              headerTitle: () => (
                <Text style={{fontSize: 16, color: '#6A6A6A'}}>
                  {i18n.t('account')}
                </Text>
              ),
            }}
          />
          <Stack.Screen
            name="MyAccount"
            component={MyAccountScreen}
            options={{
              headerTitle: () => (
                <Text style={{fontSize: 16, color: '#6A6A6A'}}>
                  {i18n.t('account')}
                </Text>
              ),
              headerLeft: () => (
                <Icon
                  style={{fontSize: 35}}
                  name="chevron-back"
                  onPress={() => navigation.pop()}
                />
              ),
            }}
          />
          <Stack.Screen
            name="Order"
            component={OrderScreen}
            options={{
              headerTitle: () => (
                <Text style={{fontSize: 16, color: '#6A6A6A'}}>
                  {i18n.t('record')}
                </Text>
              ),
              headerLeft: () => (
                <Icon
                  style={{fontSize: 35}}
                  name="chevron-back"
                  onPress={() => {
                    navigation.reset({routes: [{name: 'UserScreen'}]});
                  }}
                />
              ),
            }}
          />
          <Stack.Screen
            name="OrderDetail"
            component={OrderDetailScreen}
            options={{
              headerTitle: () => (
                <Text style={{fontSize: 16, color: '#6A6A6A'}}>
                  {i18n.t('record')}
                </Text>
              ),
              headerLeft: () => (
                <Icon
                  style={{fontSize: 35}}
                  name="chevron-back"
                  onPress={() =>
                    navigation.navigate('UserScreen', {screen: 'Order'})
                  }
                />
              ),
            }}
          />
          <Stack.Screen
            name="Coupon"
            component={CouponScreen}
            options={{
              headerTitle: () => (
                <Text style={{fontSize: 16, color: '#6A6A6A'}}>
                  {i18n.t('my_coupon')}
                </Text>
              ),
              headerLeft: () => (
                <Icon
                  style={{fontSize: 35}}
                  name="chevron-back"
                  onPress={() => navigation.pop()}
                />
              ),
            }}
          />
          <Stack.Screen
            name="CustomerService"
            component={CustomerServiceScreen}
            options={{
              title: '客戶服務',
              headerLeft: () => (
                <Icon
                  style={{fontSize: 35}}
                  name="chevron-back"
                  onPress={() => navigation.pop()}
                />
              ),
            }}
          />
          <Stack.Screen
            name="CouponHistory"
            component={CouponHistoryScreen}
            options={{
              headerTitle: () => (
                <Text style={{fontSize: 16, color: '#6A6A6A'}}>
                  {i18n.t('my_coupon')}
                </Text>
              ),
              headerLeft: () => (
                <Icon
                  style={{fontSize: 35}}
                  name="chevron-back"
                  onPress={() => navigation.pop()}
                />
              ),
            }}
          />
          <Stack.Screen
            name="Redeem"
            component={RedeemScreen}
            options={{
              title: '積分換領',
              headerLeft: () => (
                <Icon
                  style={{fontSize: 35}}
                  name="chevron-back"
                  onPress={() => navigation.pop()}
                />
              ),
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const TabNavigator = ({navigation}) => {
  const {userToken} = useSelector(state => state.loginReducer);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabel: () => {
          return null;
        },
        tabBarActiveTintColor: '#E3A23B',
        tabBarInactiveTintColor: '#D0D7D4',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        tabBarOptions={{}}
        options={HomeScreen.navigationOptions}
      />
      <Tab.Screen
        name="SearchScreen"
        component={SearchScreenStack}
        //add a listener that when user click searchtab, always show the searchscreen
        listeners={{
          tabPress: e => {
            navigation.navigate('SearchScreen', {
              screen: 'Search',
            });
          },
        }}
        options={{
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
                  <FeatherIcons color={color} name="grid" size={22} />
                </View>

                <Text
                  style={{
                    color: '#E3A23B',
                  }}>
                  {i18n.t('items')}
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
                <FeatherIcons color={color} name="grid" size={22} />
                <Text
                  style={{
                    color: '#79757F',
                  }}>
                  {i18n.t('items')}
                </Text>
              </View>
            ),
        }}
      />
      <Tab.Screen
        name="ShopScreen"
        component={ShopScreenStack}
        options={{
          headerTitle: () => (
            <Text style={{fontSize: 16, color: '#6A6A6A'}}>
              {i18n.t('booking')}
            </Text>
          ),
          unmountOnBlur: true,
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
                  <FeatherIcons color={color} name="shopping-bag" size={22} />
                </View>

                <Text
                  style={{
                    color: '#E3A23B',
                  }}>
                  {i18n.t('booking')}
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
                <FeatherIcons color={color} name="shopping-bag" size={22} />
                <Text
                  style={{
                    color: '#79757F',
                  }}>
                  {i18n.t('booking')}
                </Text>
              </View>
            ),

          // headerRight: () => (
          //   <Icon
          //     style={{ fontSize: 25, marginRight: 10 }}
          //     name="settings-sharp"
          //     onPress={() => navigation.navigate('Setting')}
          //     title="Info"
          //     color="#404040"
          //   />
          // ),
        }}
      />
      <Tab.Screen
        name="FavoriteScreen"
        component={FavoriteScreenStack}
        options={{
          headerTitle: () => (
            <Text style={{fontSize: 16, color: '#6A6A6A'}}>
              {i18n.t('fav')}
            </Text>
          ),
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
                  <MaterialCommunityIcons
                    color={color}
                    name="heart-plus-outline"
                    size={22}
                  />
                </View>

                <Text
                  style={{
                    color: '#E3A23B',
                  }}>
                  {i18n.t('fav')}
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
                <MaterialCommunityIcons
                  color={color}
                  name="heart-plus-outline"
                  size={22}
                />
                <Text
                  style={{
                    color: '#79757F',
                  }}>
                  {i18n.t('fav')}
                </Text>
              </View>
            ),

          // headerRight: () => (
          //   <Icon
          //     style={{fontSize: 25, marginRight: 10}}
          //     name="settings-sharp"
          //     onPress={() => navigation.navigate('Setting')}
          //     title="Info"
          //     color="#404040"
          //   />
          //),
        }}
      />
      <Tab.Screen
        name="UserScreen"
        component={UserScreenStack}
        options={{
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
                  <MaterialIcons
                    color={color}
                    name="person-outline"
                    size={22}
                  />
                </View>

                <Text
                  style={{
                    color: '#E3A23B',
                  }}>
                  {i18n.t('account')}
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
                <MaterialIcons color={color} name="person-outline" size={22} />
                <Text
                  style={{
                    color: '#79757F',
                  }}>
                  {i18n.t('account')}
                </Text>
              </View>
            ),

          unmountOnBlur: true,
        }}
        tabBarLabel=""
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
