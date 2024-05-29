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

function AddBook() {

    const [loading, setLoading] = useState(false);
    const [loadingBookShelf, setLoadingBookShelf] = useState(false);

    const [isbn, setIsbn] = useState("");
    const [book, setBook] = useState({});
    const [bookshelf, setBookShelf] = useState([]);

    InMemoryCache.getJson("search_book").then(book => {
        if (book != null) {
            setBook(book)
            AsyncStorage.removeItem("search_book")
        }
    })

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
        <StatusBar backgroundColor={"#ADD8E6"} barStyle="dark-content" />
        <Box borderTopRadius={10} minHeight={win.height} w="100%" maxWidth={win.width} bg="#ADD8E6" safeArea>

          <VStack px="1" w="100%">

            <View pt={1} w="100%">
                <Center>
                    <Heading pr={3}>Adicione uma missão</Heading>
                    <Heading pr={3}>de leitura</Heading>
                    <Box minW={380} minH={400} mt={'1'} borderRadius={'10'} bg={'coolGray.100'} shadow={3}>
                        <Center minH={20}>
                            <Image mt={10} style={styles.image} source={require('../../assets/addbook.png')} alt="Alternate Text" />
                            
                        </Center>
                        {
                            book.name != undefined ? <Center pt={3} mx={5}>
                                <Text>Nome do livro: <Text bold>{book.name}</Text></Text>
                                <Text>Número de paginas: <Text bold>{book.pages}</Text></Text>
                                <Text>Categoria: <Text bold>{book.category}</Text></Text>
                                <Text>Número de recomendações: <Text bold>{book.number_of_recommendation}</Text></Text>
                                <Stack direction={'row'} space={'2'}>
                                    <Button minW={'150'} mt="2" color={"#65B3FE"} onPress={() => {
                                        addBookToUserRead(book.isbn, setLoading, setBook)
                                        setLoading(true)
                                    }}>
                                        {loading ? <Spinner size={"sm"} color="coolGray.100" /> : "Adicionar Missão"}
                                    </Button>
                                    <Button minW={'150'} mt="2" color={"#65B3FE"} onPress={() => {setBook({})}}>
                                        Buscar Outra
                                    </Button>
                                </Stack>
                            </Center> : 
                            <Box>
                                <Center mt={5} mx={5}>
                                    <FormControl>
                                        <Input backgroundColor={"coolGray.100"} value={isbn} placeholder="Nome/ISBN" onChangeText={isbn => {setIsbn(isbn)}} />
                                    </FormControl>
                                </Center>
                                
                                    <Button mx={5} minW={'150'} mt="2" color={"#65B3FE"} onPress={() => {
                                        getBook(isbn, setLoading)
                                        setLoading(true)
                                    }}>
                                        {loading ? <Spinner size={"sm"} color="coolGray.100" /> : "Buscar"}
                                    </Button>
                            </Box>
                        }
                    </Box>
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
                                            <Pressable style={({ pressed }) => [ pressed ? { backgroundColor : '#cbcfd3' } : {}]} onPress={() => setIsbn(element.isbn)}>
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
                </Center>
            </View>      
          </VStack>
        </Box>
    </NativeBaseProvider>
  );
}

export default AddBook;