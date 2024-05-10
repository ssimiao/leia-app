import { Dimensions } from 'react-native';
import { NativeBaseProvider, ScrollView, VStack, View, Box, StatusBar, Text } from "native-base";
import * as RootNavigation from '../app/RootNavigation';
import { theme } from '../utils/theme';
import CharacterStatus from '../components/CharacterStatus';
import BookReading from '../components/BookReading';

const win = Dimensions.get('window');

function Home() {
  return (
    <NativeBaseProvider theme={theme}>
        <StatusBar bg="white" barStyle="light-content" />
        <Box safeAreaTop bg="white" />
        <Box mt="200" w="100%" maxWidth={win.width} bg="white" safeArea>
          <VStack px="1" w="100%">
            <ScrollView w="100%">
              <View ml="1" mr="3" justifyContent="space-between" alignItems="center" py="4">
              <CharacterStatus></CharacterStatus>
              </View>        
              <View>
                <Text>Últimas leituras</Text>
                <BookReading title="O Hobbit" pages="290" xp="145" author="J. R. R. Tolkien" categories={["Ficção", "Romance"]}></BookReading>
                <BookReading title="Harry Potter e o Prisioneiro de Azkaban" pages="416" xp="416" author="J. K. Rowling" categories={["Ficção", "Romance"]}></BookReading>
                <BookReading title="Clean Code" pages="448" xp="448" author="Robert Martin"  categories={["Didático","Conhecimento"]}></BookReading>
              </View>            
            </ScrollView>      
          </VStack>
        </Box>
    </NativeBaseProvider>
  );
}

export default Home;