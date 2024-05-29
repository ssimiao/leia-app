import { Alert } from 'react-native';
import * as RootNavigation from '../app/RootNavigation';
import * as InMemoryCache from "../service/InMemoryStorageService"

export const backAction = () => {
    if(RootNavigation.navigationRef.getCurrentRoute().name === "CharacterRpg") {
      Alert.alert('Logout', 'Você quer sair da sua conta?', [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Sim', onPress: () => {
          InMemoryCache.clearCache()
          RootNavigation.navigate("Login")
        }},
      ]);
      return true;
    }
};