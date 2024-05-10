import {
    NativeBaseProvider,
    Box,
    Button,
    Text,
    View,
    Modal,
    FormControl,
    Input,
    Icon,
    Center,
    ScrollView,
    Card
} from "native-base";
import React, {useState, useEffect} from 'react';
import {Ionicons} from "@expo/vector-icons";
import {theme} from '../utils/theme';
import {getUserBooks, patchBookReading, searchBook, searchBookOpenLibrary} from "../service/BookService";
import * as InMemoryCache from "../service/InMemoryStorageService"

export default function Inventory({navigation}) {
    const [isModalVisible, setModalVisible] = useState(false);

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [searchBook, setSearchBook] = useState({});
    const [displayBook, setDisplayBook] = useState(false);
    const [books, setBooks] = useState([])

    InMemoryCache.getJson("user_books").then(books => {
        if (books == null) {
            getUserBooks().then(response => {
                setBooks(response)
            })
        }
    })

    function getButtonGroupStyle(elementIndex, listSize) {
        if (elementIndex === 0) {
            return {
                borderBottomLeftRadius: 0, borderBottomRightRadius: 0
            }
        } else if (listSize === (elementIndex - 1)) {
            return {
                borderTopLeftRadius: 0, borderTopRightRadius: 0, borderBottomLeftRadius: 10, borderBottomRightRadius: 10
            }
        } else {
            return {
                borderRadius: 0
            }
        }
    }

    return (
        <NativeBaseProvider theme={theme}>
            <Center flex={1} px="3">
                <Box marginTop={5} marginBottom={"1.5"} justifyContent={"flex-start"}>
                    <Text bold fontSize="md" color={"coolGray.200"}>Inventário</Text>
                </Box>
                <ScrollView width="90%" marginBottom={5}>

                    {
                        books.length > 0 ? books.map((element, i) => {
                            return (
                                <Button textDecorationColor={"coolGray.200"} justifyContent={"flex-start"} size={"lg"}
                                        variant={"outline"}
                                        leftIcon={<Icon as={Ionicons} name="book" size="sm" color={"coolGray.200"}/>}
                                        onPress={() =>
                                            navigation.navigate('Scan')
                                        } style={getButtonGroupStyle(i, books.length)}><Text
                                    color={"coolGray.200"}>{element.book.bookName}</Text></Button>
                            )
                        }) : <Box><Text color={"coolGray.200"} style={{
                            textAlign: "center",
                            fontSize: 24,
                            paddingTop: 8,
                            marginTop: 13,
                            marginBottom: 25,
                            opacity: 0.7
                        }}>Vazio</Text></Box>
                    }
                </ScrollView>
                <Text bold fontSize="md" marginBottom={"1.5"} color={"coolGray.200"}>Nova Leitura</Text>

                <Box width="90%" marginBottom={5}>
                    <Button justifyContent={"flex-start"} size={"lg"} variant={"outline"}
                            leftIcon={<Icon as={Ionicons} color={"coolGray.200"} name="barcode" size="sm"/>}
                            onPress={() =>
                                navigation.navigate('Scan')
                            } style={{borderBottomLeftRadius: 0, borderBottomRightRadius: 0}}><Text
                        color={"coolGray.200"}>Escanear código de barras do livro</Text></Button>

                    <Button color={"coolGray.200"} justifyContent={"flex-start"} size={"lg"} variant={"outline"}
                            leftIcon={<Icon as={Ionicons} color={"coolGray.200"} name="search" size="sm"/>}
                            onPress={toggleModal} borderTopWidth={0}
                            style={{borderTopLeftRadius: 0, borderTopRightRadius: 0}}>
                        <Text color={"coolGray.200"}>Buscar pelo titulo do livro</Text></Button>

                    <Modal isOpen={isModalVisible} onClose={() => toggleModal()} safeAreaTop={true}>
                        <Modal.Content maxWidth="350">
                            <Modal.CloseButton/>
                            <Modal.Header>Encontre um livro</Modal.Header>
                            <Modal.Body>
                                <FormControl>
                                    <FormControl.Label>Titulo</FormControl.Label>
                                    <Input onChangeText={title => setTitle(title)}/>
                                </FormControl>
                                {displayBook === true ?
                                    <Center paddingTop={5} justifyContent={""} alignContent={"center"}>
                                        {searchBook.bookName !== undefined ?
                                            <Card>
                                                <Text>Livro: {searchBook.bookName}</Text>
                                                <Text>Xp: {searchBook.xp}</Text>
                                                <Text>Pages: {searchBook.pages}</Text>
                                                <Text>isbn13: {searchBook.isbn13}</Text>
                                                <Text>isbn10: {searchBook.isbn10}</Text>
                                            </Card> : <Text>Livro não encontrado</Text>
                                        }
                                    </Center> : <Box></Box>
                                }
                            </Modal.Body>
                            <Modal.Footer style={{borderTopWidth: 0}}>
                                <Button.Group space={2}>
                                    {searchBook.bookName !== undefined ?
                                        <Button backgroundColor={"orange.600"} color={"coolGray.200"} onPress={() => {
                                            setLoading(true)
                                            patchBookReading(searchBook.isbn13,
                                                {
                                                    "reading_chapter": 0,
                                                    "reading_percentage": 0.0,
                                                    "pages_read": 0,
                                                    "quiz_answered": false
                                                }).then(response => {
                                                if (response.ok) {
                                                    books.push(searchBook)
                                                }

                                                setLoading(false)
                                            })
                                        }}>Adicionar</Button> : <Box></Box>
                                    }
                                    <Button backgroundColor={"orange.600"} color={"coolGray.200"} onPress={() => {
                                        searchBookOpenLibrary({
                                            title: title,
                                            isbn: null
                                        }).then(response => {
                                            if (response.ok) {
                                                setSearchBook(response.data)
                                            } else {
                                                setSearchBook({})
                                            }
                                            setDisplayBook(true)
                                            setLoading(false)
                                        })
                                        setLoading(true)
                                    }}>Buscar</Button>
                                </Button.Group>
                            </Modal.Footer>
                        </Modal.Content>
                    </Modal>
                </Box>
            </Center>
        </NativeBaseProvider>
    );
}

