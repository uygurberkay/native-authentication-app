import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import { Colors } from './constants/styles';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import { useCallback, useContext, useEffect, useState } from 'react';
import IconButton from './components/ui/IconButton'

const Stack = createNativeStackNavigator();
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

const AuthenticatedStack = () => {
  const authCtx = useContext(AuthContext)
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: 'white',
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{
        headerRight: ({tintColor}) => <IconButton icon={'exit'} color={tintColor} size={24} onPress={authCtx.logout} />
      }}/>
    </Stack.Navigator>
  );
}

const Navigation = () => {
  const authCtx = useContext(AuthContext)

  return (
      <NavigationContainer>
        { !authCtx.isAuthenticated && <AuthStack />}
        { authCtx.isAuthenticated && <AuthenticatedStack />}
      </NavigationContainer>
  );
}

const Root = () => {
  const authCtx = useContext(AuthContext);
  const [appIsReady, setAppIsReady] = useState(false);
  
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        
        if(storedToken) {
          authCtx.authenticate(storedToken)
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.warn(error);
      } finally{
          // Tell the application to render
          setAppIsReady(true);
      }
    }
    fetchToken()
}, [])

const onLayoutRootView = useCallback(async () => {
  if (appIsReady) {
    // This tells the splash screen to hide immediately! If we call this after
    // `setAppIsReady`, then we may see a blank screen while the app is
    // loading its initial state and rendering its first pixels. So instead,
    // we hide the splash screen once we know the root view has already
    // performed layout.
    await SplashScreen.hideAsync();
  }
}, [appIsReady]);

if (!appIsReady) {
  return null;
}

return <Navigation onLayout={onLayoutRootView}/>;
}

export default App = () => {

  

  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
    </>
  );
}
