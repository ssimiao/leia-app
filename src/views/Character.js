import { Dimensions } from 'react-native';
import { NativeBaseProvider, ScrollView, VStack, View, Box, StatusBar } from "native-base";
import * as RootNavigation from '../app/RootNavigation';
import { theme } from '../utils/theme';
import CharacterStatus from '../components/CharacterStatus';
import BookReading from '../components/BookReading';

const win = Dimensions.get('window');


function Character() {
  return (
    <NativeBaseProvider theme={theme}>
        <StatusBar bg="white" barStyle="light-content" />
        <Box safeAreaTop bg="white" />
        <Box w="100%" maxWidth={win.width} bg="white" safeArea>
          <VStack px="1" w="100%">
            <ScrollView w="100%">
              <View ml="1" mr="3" justifyContent="space-between" alignItems="center" py="4">
                <CharacterStatus></CharacterStatus>
              </View>        
              <View>
              </View>            
            </ScrollView>      
          </VStack>
        </Box>
    </NativeBaseProvider>
  );
}

export default Character;