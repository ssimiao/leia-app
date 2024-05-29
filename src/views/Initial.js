import { Box, Text, Heading, VStack, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider, Image, StatusBar, ScrollView, Spinner } from "native-base";
import { Dimensions, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { theme } from '../utils/theme';
import * as RootNavigation from '../app/RootNavigation';
import {useState} from "react";


const win = Dimensions.get('window');
const ratio = ((win.width) > 290 ? 290 : win.width)/1260;

const styles = StyleSheet.create({
  image: {
    width: 166,
    height: 166, //362 is actual height of image
    resizeMode: 'stretch',
    maxWidth: 290
  }
});

function Initial( params ) {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);

    return (
      <NativeBaseProvider theme={theme}>
        <StatusBar backgroundColor={'white'} barStyle="dark-content" />
        <Center paddingTop={100} flex={1} px="3" bg="white">
          <ScrollView w="100%">          
            <Center w="100%">
              <Box safeArea p="2" py="8" w="90%" maxW="290">
                <Center py="3">
                    <Image style={styles.image} source={require('../../assets/robot.png')} alt="Alternate Text" />
                    <Heading bold paddingTop={5} size="xl" fontWeight="800" color="rgba(4, 24, 56, 1)">
                        LEIA
                    </Heading>
                    <Heading mt="1" _dark={{color: "coolGray.200"}} color="warmGray.600" fontWeight="medium" size="xs">
                        Leia, evolua, imagine e alcance
                    </Heading>
                </Center>
                
                <VStack space={3} mt="5">
                  <Link onPress={() => RootNavigation.navigate('SignUp')} _text={{
                      fontSize: "xs",
                      fontWeight: "500",
                      color: "coolGray.600"
                    }} alignSelf="flex-end" >
                      É professor ou responsável? clique aqui.
                  </Link>
                  <Button style={{backgroundColor: "rgba(4, 24, 56, 1)"}} onPress={() => {
                      RootNavigation.navigate('SelectCharacter')
                    }}>
                      {loading ? <Spinner size={"sm"} color="warning.500" /> : "Vamos começar"}
                  </Button>
                  <Button mt="2" variant="outline" style={{backgroundColor: "white"}}  onPress={() => { 
                      RootNavigation.navigate('Login')
                    }}>
                      {loading ? <Spinner size={"sm"} color="warning.500" /> : <Text color={"rgba(4, 24, 56, 1)"}>Eu já tenho uma conta</Text>}
                  </Button>
                  
                </VStack>
              </Box>
            </Center>
          </ScrollView>
        </Center>
      </NativeBaseProvider>
    )
  };

  export default Initial;