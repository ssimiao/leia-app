import { Dimensions, Pressable, StyleSheet } from 'react-native';
import { NativeBaseProvider, ScrollView, Divider, VStack, View, Box, Stack, StatusBar, Text, Center, Image, Flex, Progress, IconButton, Icon, Link, Heading} from "native-base";
import * as RootNavigation from '../app/RootNavigation';
import { theme } from '../utils/theme';
import CharacterStatus from '../components/CharacterStatus';
import {FontAwesome5} from "@expo/vector-icons";
import BookReading from '../components/BookReading';
import { Ionicons } from "@expo/vector-icons";
import React, {useState} from 'react';
import * as InMemoryCache from "../service/InMemoryStorageService"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserRead } from '../service/UserService';


const win = Dimensions.get('window');

const styles = StyleSheet.create({
    image: {
      width: 88,
      height: 88, //362 is actual height of image
      resizeMode: 'stretch',
      maxWidth: 100
    }
  });

function BookShelf(callback) {

    const [reading, setReading] = useState(true);

    const statusDivide = {
        'reading_empty': true,
        'finish_empty': true,
    }

    const [reads, setReads] = useState([]);

    InMemoryCache.getJson("reads").then(read => {
        if (read != null) {
            setReads(read)
        }
    })

    var route = () => {
        if (callback.route.params !== undefined)
            return callback.route.params;

        return 'CharacterRpg';
    }

    function noneBooks() {
        return <Box><Text color={"coolGray.200"} style={{
            textAlign: "center",
            fontSize: 24,
            paddingTop: 8,
            marginTop: 13,
            marginBottom: 25,
            opacity: 0.7
        }}>Vazio</Text></Box>
    }


  return (
    <NativeBaseProvider>
        <StatusBar bg="white" barStyle="light-content" />
        <Box safeAreaTop bg="white" />
        <Box w="100%" maxWidth={win.width} height={win.height} bg={'white'}>
            <Box paddingTop={2} px={win.width - (win.width - 7)}>
                <Stack direction={'row'} space={"1/6"}>
                    <IconButton onPress={() => RootNavigation.navigate('CharacterRpg')} pr={3}  icon={<Icon size="2xl" color="#49454F" as={Ionicons} name="arrow-back"/>}/>
                    <Text mt={3} pl={1} ml={5} minW={'50'} fontSize={'lg'}>Mochila</Text>
                    <IconButton onPress={() => RootNavigation.navigate('AddBook')} ml={10} icon={<Icon as={Ionicons} name="add-outline" size="2xl" color="#49454F"/>}/>
                </Stack>
            </Box>
            <Box px={win.width - (win.width - 10)} py={6}>
                <Stack  direction="row" space={'1/6'}>
                    <Text bold={reading} onPress={() => setReading(true)}>Em andamento</Text>
                    <Divider orientation='vertical'/>
                    <Text bold={!reading} onPress={() => setReading(false)}>Finalizadas</Text>
                </Stack>
                {
                    reads.length > 0 ? reads.map((element, i) => {

                        if (reading && element.challenge_answered === false) {
                            if(statusDivide.reading_empty)
                                statusDivide.reading_empty = false
                            return (
                                <Pressable onPress={() => RootNavigation.navigate('BookInfo', {view: 'BookShelf', read: element})}>
                                    <Box py={5}>
                                        <Stack direction={'row'}>
                                            <Box>
                                                <Center>
                                                    <Image style={styles.image} source={require('../../assets/book.png')} alt="Alternate Text" />
                                                </Center>
                                            </Box>
                                            <Box pl={2} py={4}>
                                                <Heading fontSize={'xl'}>{element.book.name}</Heading>
                                                <Text pl={1}>{element.pages_read}/{element.book.pages} Paginas</Text>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Pressable>)
                        } else if (!reading && element.challenge_answered === true) {
                            if (statusDivide.finish_empty)
                                statusDivide.finish_empty = false
                            return (<Pressable onPress={() => RootNavigation.navigate('BookInfo', {view: 'BookShelf', read: element})}>
                                <Box py={5}>
                                    <Stack direction={'row'}>
                                        <Image style={styles.image} source={require('../../assets/book.png')} alt="Alternate Text" />
                                        <Box pl={2} py={4}>
                                            <Heading fontSize={'xl'}>{element.book.name}</Heading>
                                            <Text>{element.pages_read}/{element.book.pages} Paginas</Text>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Pressable>)
                        } /* else if (reads.length && reading && statusDivide.reading_empty) {
                            statusDivide.reading_empty = false
                            return noneBooks()
                        } else if (!reading && statusDivide.finish_empty) {
                            statusDivide.finish_empty = false
                            return noneBooks()
                        } */
                    }) : noneBooks()
                }
            </Box>
        </Box>
    </NativeBaseProvider>
  );
}

export default BookShelf;