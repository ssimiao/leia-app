import { Dimensions, StyleSheet } from 'react-native';
import { NativeBaseProvider, ImageBackground, Pressable, ScrollView, VStack, View, Box, Stack, StatusBar, Text, Center, Image, Flex, Progress, IconButton, Icon, Link} from "native-base";
import * as RootNavigation from '../app/RootNavigation';
import { theme } from '../utils/theme';
import CharacterStatus from '../components/CharacterStatus';
import {FontAwesome5} from "@expo/vector-icons";
import BookReading from '../components/BookReading';
import { Ionicons } from "@expo/vector-icons";
import { SvgUri } from 'react-native-svg';
import React, {useState} from 'react';
import * as InMemoryCache from "../service/InMemoryStorageService"
import * as Service from '../service/UserService';
import { images } from './SelectCharacter';

const win = Dimensions.get('window');

const styles = StyleSheet.create({
    image: {
      width: 410,
      height: 410, //362 is actual height of image
      resizeMode: 'stretch',
      minWidth: 410,
      minHeight: 410

    },
    classe_guerreiro: {
        marginTop: 40,
        width: 150,
        height: 150, //362 is actual height of image
        resizeMode: 'stretch'
    },
    classe_mago: {
        width: 150,
        height: 190, //362 is actual height of image
        resizeMode: 'stretch'
    },
});

function Forge(callback) {

    const [classes, setClasses] = useState([])

    InMemoryCache.getJson("classes").then(classesCache => {
        if (classesCache != null && JSON.stringify(classesCache) != JSON.stringify(classes)) {
            setClasses(classesCache)
        } else if (classes.length == 0) {
            Service.getUserClasses(callback.route.params.id).then(response => {
                setClasses(response.data)
            })
        }
    })

    function changeClasse(classe) {
        Service.setUserClasses(callback.route.params.id, classe)
    }

  return (
    <NativeBaseProvider>
        <StatusBar backgroundColor={'white'} barStyle="dark-content" />
        <Image style={styles.image} source={require('../../assets/guilda.jpg')} alt="Alternate Text" />

        <Box borderTopRadius={10} minHeight={win.height} w="100%" maxWidth={win.width} bg="warning.300" safeArea>

          <VStack px="1" w="100%">
                <Text fontSize="md" textAlign="center" bold color="coolGray.800">Escolha sua nova classe | <Text fontSize="sm" textAlign="center" bold color="coolGray.800">Custo: 50 Moedas</Text></Text>
                
            
            <View paddingTop={1} w="100%">
                <Box>
                    <Stack mx={30} direction={'row'} space={'lg'}>
                        {
                            classes.map((element, i) => {
                                return (
                                    <Pressable onPress={() => {
                                        if (element.blocked == false)
                                            changeClasse(element.classe)
                                        else
                                            Service.showMessageDefault("Classe bloqueada, precisa atender os requisitos necessários")
                                    }} minW={120} borderRadius={'10'} bg={element.blocked == true ? 'warning.200' : 'warning.100'} shadow={3}>
                                        <Center pt={3} px={1}>
                                            <Image style={styles['classe_' + element.classe]} source={{uri: images[callback.route.params.race + "_" + callback.route.params.color + "_" + element.classe]}} alt="Alternate Text" />
                                        </Center>
                                        <Box px={1}>
                                            <Center>
                                                <Text>Status: {element.blocked == true ? "Bloqueada" : "Liberada"}</Text>
                                                {
                                                   element.blocked == true ? <Center>
                                                        <Text>Necessario melhorar</Text>
                                                        <Text>os atributos</Text>
                                                        <Text>do Personagem</Text>
                                                   </Center> : <Center>
                                                        <Text>Você pode</Text>
                                                        <Text>mudar para essa</Text>
                                                        <Text>classe</Text>
                                                   </Center>
                                                }
                                            </Center>
                                        </Box>
                                    </Pressable>
                                )
                            })
                        }
                    </Stack>
                </Box>
            </View>      
          </VStack>
        </Box>
    </NativeBaseProvider>
  );
}

export default Forge;