import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { store } from './src/app/store';
import { Provider } from 'react-redux';
import { navigationRef } from './src/app/RootNavigation';
import { navTheme } from './src/utils/navTheme';
import MainTab from './src/views/Main';
import FlashMessage from "react-native-flash-message";
import {
  useFonts,
  GrenzeGotisch_100Thin,
  GrenzeGotisch_200ExtraLight,
  GrenzeGotisch_300Light,
  GrenzeGotisch_400Regular,
  GrenzeGotisch_500Medium,
  GrenzeGotisch_600SemiBold,
  GrenzeGotisch_700Bold,
  GrenzeGotisch_800ExtraBold,
  GrenzeGotisch_900Black,
} from "@expo-google-fonts/grenze-gotisch";

import {
  Oswald_200ExtraLight,
  Oswald_300Light,
  Oswald_400Regular,
  Oswald_500Medium,
  Oswald_600SemiBold,
  Oswald_700Bold
} from "@expo-google-fonts/oswald";

const Stack = createNativeStackNavigator();

function App() {
  let [fontsLoaded] = useFonts({
    GrenzeGotisch_100Thin,
    GrenzeGotisch_200ExtraLight,
    GrenzeGotisch_300Light,
    GrenzeGotisch_400Regular,
    GrenzeGotisch_500Medium,
    GrenzeGotisch_600SemiBold,
    GrenzeGotisch_700Bold,
    GrenzeGotisch_800ExtraBold,
    GrenzeGotisch_900Black,
    Oswald_200ExtraLight,
    Oswald_300Light,
    Oswald_400Regular,
    Oswald_500Medium,
    Oswald_600SemiBold,
    Oswald_700Bold
  });

  if (!fontsLoaded) {
    return <></>;
  }

  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef} theme={navTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#fff' } }} initialRouteName="Main">
          <Stack.Screen name="Main" component={MainTab} />
        </Stack.Navigator>
        <FlashMessage position="top" />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
