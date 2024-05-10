import { Dimensions, StyleSheet } from 'react-native';
import { NativeBaseProvider, Button, Pressable, ScrollView, FormControl, Input, VStack, View, Box, Stack, StatusBar, Text, Center, Image, Flex, Progress, IconButton, Icon, Link, Heading} from "native-base";
import * as RootNavigation from '../app/RootNavigation';
import { theme } from '../utils/theme';
import CharacterStatus from '../components/CharacterStatus';
import {FontAwesome5} from "@expo/vector-icons";
import BookReading from '../components/BookReading';
import { Ionicons } from "@expo/vector-icons";
import { SvgUri } from 'react-native-svg';
import { useState } from 'react';
import {Calendar, LocaleConfig, CalendarList, Agenda} from 'react-native-calendars';


const win = Dimensions.get('window');

const styles = StyleSheet.create({
    image: {
      width: 150,
      height: 150, //362 is actual height of image
      resizeMode: 'stretch',
      maxWidth: 150
    },
    icon: {
        width: 50,
        height: 50, //362 is actual height of image
        resizeMode: 'stretch',
        maxWidth: 100
    }
});

function Goals(callback) {

    const [loading, setLoading] = useState(false);

  return (
    <NativeBaseProvider>
        <StatusBar bg="white" barStyle="light-content" />
        <Box safeAreaTop bg="black" />
        <Box borderTopRadius={10} minHeight={win.height} w="100%" maxWidth={win.width} bg="#041838" safeArea>

          <VStack px="1" w="100%">

            <View paddingTop={10} w="100%">
                <Center>
                    <Flex direction="row-reverse">
                        <Box>
                            <Center>
                                <Text bold fontSize="4xl" mt={3} pb={0} pr={3} color={"coolGray.200"}>0</Text>
                            </Center>
                            <Text bold fontSize="4xl" pr={3} color={"coolGray.200"}>Vitalidade</Text>
                        </Box>
                        <Icon as={Ionicons} name="heart" color={"coolGray.200"}  size={"128"}/>
                    </Flex>
                    
                    <Text textAlign={'justify'} bold pt={2} px={10} color={"coolGray.200"}>Vitalidade é a saúde do seu personagem, você precisa ler livros para adquirir poções para deixar o seu personagem mais saudável, todos os dias o seu personagem perderá 1 coração</Text>
                    <Button minW={330} onPressIn={() => RootNavigation.navigate('CharacterRpg')} bgColor={'#FFF'}  shadow={3} borderRadius={20}  color={"coolGray.200"}>
                        <Text bold color={'coolGray.600'}>Continuar</Text>
                    </Button>
                </Center>
            </View>      
          </VStack>
        </Box>
    </NativeBaseProvider>
  );
}

export default Goals;