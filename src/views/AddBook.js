import { Dimensions, StyleSheet } from 'react-native';
import { NativeBaseProvider, Spinner, Button, Pressable, ScrollView, FormControl, Input, VStack, View, Box, Stack, StatusBar, Text, Center, Image, Flex, Progress, IconButton, Icon, Link, Heading} from "native-base";
import * as RootNavigation from '../app/RootNavigation';
import { theme } from '../utils/theme';
import CharacterStatus from '../components/CharacterStatus';
import {FontAwesome5} from "@expo/vector-icons";
import BookReading from '../components/BookReading';
import { Ionicons } from "@expo/vector-icons";
import { SvgUri } from 'react-native-svg';
import { useState } from 'react';
import { addBookToUserRead, getBook } from '../service/UserService';
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

function AddBook(callback) {

    const [loading, setLoading] = useState(false);
    const [loadingScan, setLoadingScan] = useState(false);

    const [isbn, setIsbn] = useState("");
    const [book, setBook] = useState({});

    InMemoryCache.getJson("search_book").then(book => {
        console.log("cache: " + book)
        if (book != null) {
            setBook(book)
            AsyncStorage.removeItem("search_book")
        }
    })

    console.log(book)
  return (
    <NativeBaseProvider>
        <StatusBar bg="white" barStyle="light-content" />
        <Box safeAreaTop bg="black" />
        <Box borderTopRadius={10} minHeight={win.height} w="100%" maxWidth={win.width} bg="#ADD8E6" safeArea>

          <VStack pt={100} px="1" w="100%">

            <View w="100%">
                <Center>
                    <Heading pr={3}>Adicione uma missão</Heading>
                    <Heading pr={3}>de leitura</Heading>
                    <Box minW={330} minH={500} mt={'1'} borderRadius={'10'} bg={'coolGray.100'} shadow={3}>
                        <Center minH={20}>
                            <Image mt={10} style={styles.image} source={require('../../assets/addbook.png')} alt="Alternate Text" />
                            
                        </Center>
                        {
                            book.name != undefined ? <Box pt={3} mx={5}>
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
                            </Box> : 
                            <Box>
                                <Center mt={5} mx={5}>
                                    <FormControl>
                                        <Input backgroundColor={"coolGray.100"} placeholder="Nome/ISBN" onChangeText={isbn => {setIsbn(isbn)}} />
                                    </FormControl>
                                </Center>
                                <Stack direction={'row'} space={'2'} mx={5}>
                                    <Button minW={'150'} mt="2" color={"#65B3FE"} onPress={() => {
                                        getBook(isbn, setLoading)
                                        setLoading(true)
                                    }}>
                                        {loading ? <Spinner size={"sm"} color="coolGray.100" /> : "Buscar"}
                                    </Button>
                                    <Button minW={'150'} mt="2" color={"#65B3FE"} onPress={() => {}}>
                                        {loadingScan ? <Spinner size={"sm"} color="warning.500" /> : "Escanear"}
                                    </Button>
                                </Stack>
                            </Box>
                        }
                    </Box>
                </Center>
            </View>      
          </VStack>
        </Box>
    </NativeBaseProvider>
  );
}

export default AddBook;