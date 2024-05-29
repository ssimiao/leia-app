import { Dimensions, StyleSheet } from 'react-native';
import { NativeBaseProvider, Spinner, Button, Pressable, ScrollView, FormControl, Input, VStack, View, Box, Stack, StatusBar, Text, Center, Image, Flex, Progress, IconButton, Icon, Link, Heading, Divider} from "native-base";
import * as RootNavigation from '../app/RootNavigation';
import { theme } from '../utils/theme';
import CharacterStatus from '../components/CharacterStatus';
import {FontAwesome5} from "@expo/vector-icons";
import BookReading from '../components/BookReading';
import { Ionicons } from "@expo/vector-icons";
import { SvgUri } from 'react-native-svg';
import { useEffect, useState } from 'react';
import { addBookToUserRead, getBook, getBookshelf } from '../service/UserService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as InMemoryCache from "../service/InMemoryStorageService"

const win = Dimensions.get('window');

function BookShelfGlobal({setIsbn}) {
    const [bookshelf, setBookShelf] = useState([]);
    const [loadingBookShelf, setLoadingBookShelf] = useState(false);

    useEffect(() => {
        setLoadingBookShelf(true)
        getBookshelf().then(response => {
            if (response.ok) { 
                setBookShelf(response.data)
                InMemoryCache.storeJsonData("bookshelf", response.data)
            }
            else
                showMessageDefault("Erro ao buscar livro")
            setLoadingBookShelf(false)
        })
    }, [])

    return (
        <NativeBaseProvider>
            <View>
            <Box minW={380} minH={270} mt={'5'} borderRadius={'10'} bg={'coolGray.100'} shadow={3}>
                <Center>
                    <Text bold fontSize={'lg'}>Acervo de aventuras curadas</Text>
                </Center>
                <ScrollView mb={1} mt={2} mx={1} bg="coolGray.100" maxH={220} minH={200} minWidth={win.width - (win.width - 7)}>
                    {
                        bookshelf.length > 0 ? bookshelf.map((element, i) => {
                            return (
                                <Box my={i < 1 ? 2 : 1}>
                                    <Divider/>
                                    <Pressable onPress={() => setIsbn(element.isbn)}>
                                        <Stack direction='column' space={'1'}>
                                            <Stack direction={'row'} minWidth={130}>
                                                <Center pl={1}>
                                                    <Text bold>{element.name}</Text>
                                                </Center>
                                            </Stack>
                                            <Center alignItems={'initial'} pl={1} minWidth={100}>
                                                <Text bold>{element.isbn} | {element.isbn13}</Text>
                                            </Center>
                                            <Box pl={1} >
                                                <Text bold>Número de paginas: {element.pages}</Text>
                                            </Box>
                                        </Stack>
                                    </Pressable>
                                </Box>
                            )
                        }) : <Center><Text color={"coolGray.200"} style={{
                            textAlign: "center",
                            fontSize: 24,
                            paddingTop: 66,
                            marginTop: 13,
                            marginBottom: 25,
                            opacity: 0.7
                        }}>{loadingBookShelf ? <Spinner size={"lg"} color="coolGray.500" />  : "Vazio" }</Text></Center>
                    }
                </ScrollView>
            </Box>    
            </View>
        </NativeBaseProvider>
    );
}

export default BookShelfGlobal;