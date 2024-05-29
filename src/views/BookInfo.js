import { Dimensions, StyleSheet } from 'react-native';
import { NativeBaseProvider, Spinner, Pressable, Button, Modal, ScrollView, VStack, View, Box, Stack, StatusBar, Text, Center, Image, Flex, Progress, IconButton, Icon, Link, Input} from "native-base";
import * as RootNavigation from '../app/RootNavigation';
import { theme } from '../utils/theme';
import CharacterStatus from '../components/CharacterStatus';
import {FontAwesome5} from "@expo/vector-icons";
import BookReading from '../components/BookReading';
import { Ionicons } from "@expo/vector-icons";
import { SvgUri } from 'react-native-svg';
import React, {useState, useEffect} from 'react';
import { showMessageDefault, updateBookReading } from '../service/UserService';
import * as InMemoryCache from "../service/InMemoryStorageService"


const win = Dimensions.get('window');

const styles = StyleSheet.create({
    image: {
      width: 88,
      height: 88, //362 is actual height of image
      resizeMode: 'stretch',
      maxWidth: 100
    },
    icon: {
        width: 50,
        height: 50, //362 is actual height of image
        resizeMode: 'stretch',
        maxWidth: 100
    }
});

function BookInfo(callback) {
    console.log(callback.route.params)

    const [read, setRead] = useState(callback.route.params.read);
    const [isModalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [sumAttribute, setSumAttribute] = useState(0);
    const [myTime, setMyTime] = useState(new Date());

    useEffect(() => {
        var timerID = setInterval(() => tick(), 2000);
        
        return () => clearInterval(timerID);
    });
    
    function tick() {
        setMyTime(new Date());
    }

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    InMemoryCache.getJson("reads").then(readCache => {
        if (readCache != null) {
            readCache.map((element) => {
                if(element.id === read.id && JSON.stringify(read) !== JSON.stringify(element)) {
                    setRead(element)
                }
            })
        }
    })

    console.log(read.pages_read)
    console.log(sumAttribute)

  return (
    <NativeBaseProvider>
        <StatusBar backgroundColor={'#16376C'} barStyle="light-content" />
        <Flex>
            <Box paddingTop={2} px={win.width - (win.width - 7)}>
                <Stack direction={'row'} space={"1/6"}>
                    <IconButton onPress={() => RootNavigation.navigate(callback.route.params.view)} pr={3}  icon={<Icon size="2xl" color="coolGray.100" as={Ionicons} name="arrow-back"/>}/>
                    <Text mt={3} ml={10} pl={1} minW={'50'} fontSize={'lg'} color={"coolGray.100"}>Livro</Text>
                    <IconButton pl={10} icon={<Icon as={Ionicons} name="share-social-outline" size="2xl" color="coolGray.100"/>}/>
                </Stack>
            </Box>
            <Center mt={10} mb={3}>
                <Image style={styles.image} source={require('../../assets/book.png')} alt="Alternate Text" />
            </Center>
        </Flex>
        <Box borderTopRadius={10} minHeight={win.height} w="100%" maxWidth={win.width} bg="white" safeArea>

          <VStack px="1" w="100%">
            <Center pt={1}>
                <Box px="1">
                    <Text fontSize="md" textAlign="left" bold color="coolGray.400">{read.book.name}</Text>
                </Box>
            </Center>

            <Box px="7">
                <Text fontSize="2xs" textAlign="right" color="warmGray.700">{Math.floor(read.pages_read * 0.2)} XP</Text>
            </Box>
            <Box paddingX={win.width - (win.width - 7)}>
                <Progress maxWidth={350} value={read.pages_read * 100 / read.book.pages} colorScheme="blueGray"/>
            </Box>
            <View paddingTop={10} w="100%">
                <Center>
                    <Stack mx={30} direction={'row'} space={'lg'}>
                        <Box minW={260} borderRadius={'10'} bg={'coolGray.100'} shadow={3}>
                            <Center minH={20} mx={2}>
                                Categoria: {read.book.category}
                            </Center>
                        </Box>
                    </Stack>
                    <Box minW={260} mt={'5'} borderRadius={'10'} bg={'coolGray.100'} shadow={3}>
                        <Pressable onPress={() => toggleModal()}>
                            <Center minH={20}>
                                <Stack direction={'row'} space={'1/6'}>
                                    <Text  pr={3}>Paginas</Text>
                                    <Text  pr={3}>{read.pages_read}/{read.book.pages}</Text>
                                </Stack>
                            </Center>
                        </Pressable>
                    </Box>
                    <Pressable onPress={() => {
                            if(read.pages_read !== read.book.pages) {
                                showMessageDefault("Você precisa terminar de ler o livro para resolver esse desafio")
                            } else if(read.challenge_answered === false) {
                                RootNavigation.navigate('Challenge', read)
                            } else {
                                showMessageDefault("Você já resolveu o desafio desse livro")
                            }
                        }}>
                        <Box minW={260} mt={'5'} borderRadius={'10'} bg={'coolGray.100'} shadow={3}>
                            <Center minH={20}>
                                <Stack direction={'row-reverse'} space={'1/6'}>
                                    <Text pl={1} pt={1} pr={3}>Desafio</Text>
                                    <Icon as={FontAwesome5} name="puzzle-piece" size="lg" color="#49454F"/>
                                </Stack>
                            </Center>
                        </Box>
                    </Pressable>
                    
                    <Modal isOpen={isModalVisible} onClose={() => toggleModal({})} safeAreaTop={true}>
                        <Modal.Content maxWidth="350">
                            <Modal.CloseButton/>
                            <Modal.Header>Paginas Lidas</Modal.Header>
                            <Modal.Body style={{borderTopWidth: 0}}>


                            <Stack direction={'row'} space={2}>
                                    <Center pl={12}>
                                        <Text pt={1} pb={3}>Paginas: </Text>
                                    </Center>
                                    <Input minW={60} maxH={35} keyboardType='numeric' onChangeText={value => setSumAttribute(parseInt(value) - read.pages_read)}>{(read.pages_read + (isNaN(sumAttribute) ? 0 : sumAttribute))}</Input>
                                    <Pressable onPress={() => {
                                            setSumAttribute(sumAttribute + 1)
                                        }}>
                                        <Icon as={Ionicons} colorScheme={'blue'} name="chevron-up-outline" size="2xl"/>
                                    </Pressable>
                            </Stack>
                                <Button.Group pt={2} justifyContent={"center"} >
                                    <Button minW={100} colorScheme="darkBlue" onPress={() => {
                                        setLoading(true)
                                        if((sumAttribute + read.pages_read) > read.pages_read) {
                                            updateBookReading({
                                                'read_id': read.id,
                                                'pages_read': sumAttribute + read.pages_read,
                                                'chapter': 1
                                            }, read.user.id, setLoading, setSumAttribute, toggleModal)
                                        } else {
                                            showMessageDefault("Você não pode diminuir o valor das paginas lidas")
                                            setLoading(false)
                                        }
                                    }}>{loading ? <Spinner/> : 'Alterar Paginas' }</Button>
                                </Button.Group>
                            </Modal.Body>
                        </Modal.Content>
                    </Modal>
                </Center>
            </View>      
          </VStack>
        </Box>
    </NativeBaseProvider>
  );
}

export default BookInfo;