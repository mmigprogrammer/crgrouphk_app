import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FeatherIcons from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import MainNavigator from './src/page/MainNavigator';
import { Provider } from 'react-redux';
import { Store } from './src/redux/store';
import { StripeProvider } from '@stripe/stripe-react-native';
import memoize from 'lodash.memoize';
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './src/redux/store';
import { publishableKey,merchantId } from '@env';
import { LogBox } from 'react-native';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';


async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}


const App = ({ navigation }) => {
  LogBox.ignoreLogs(['Warning: ...']); 
  requestUserPermission();
  return (
    <StripeProvider
      publishableKey={publishableKey}
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      merchantIdentifier={merchantId} // required for Apple Pay
    >
      <Provider store={Store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavigationContainer>
            <MainNavigator />
          </NavigationContainer>
        </PersistGate>
      </Provider>
    </StripeProvider >
  );
};

export default App;
