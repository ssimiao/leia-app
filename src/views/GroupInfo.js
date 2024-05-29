import { Dimensions, StyleSheet } from 'react-native';
import { NativeBaseProvider, Avatar, FormControl, Spinner, Pressable, Button, Modal, ScrollView, VStack, View, Box, Stack, StatusBar, Text, Center, Image, Flex, Progress, IconButton, Icon, Link, Input, Heading, HStack, Row, Divider} from "native-base";
import * as RootNavigation from '../app/RootNavigation';
import { theme } from '../utils/theme';
import CharacterStatus from '../components/CharacterStatus';
import {FontAwesome5} from "@expo/vector-icons";
import BookReading from '../components/BookReading';
import { Ionicons } from "@expo/vector-icons";
import { SvgUri } from 'react-native-svg';
import React, {useState, useEffect} from 'react';
import { addBookToGroup, addUserToGroup, showMessageDefault, updateBookReading } from '../service/UserService';
import * as InMemoryCache from "../service/InMemoryStorageService"
import { avatar_images } from './SelectCharacter';


const win = Dimensions.get('window');

const styles = StyleSheet.create({
    image: {
      width: 100,
      height: 100, //362 is actual height of image
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

function GroupInfo(componentParams) {

    const [isModalVisible, setModalVisible] = useState(false);
    const [isBookModalVisible, setBookModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [charactersId, setCharactersId] = useState("");
    const [isbn, setIsbn] = useState("");

    const [groupInfo, setGroupInfo] = useState(componentParams.route.params);
  return (
    <NativeBaseProvider>
        <StatusBar backgroundColor={'#16376C'} barStyle="light-content" />
        <Flex>
            <Center paddingTop={2} px={win.width - (win.width - 7)}>
                <Stack direction={'row'} space={"1/6"}>
                    <Text mt={3}  minW={'50'} fontSize={'lg'} color={"coolGray.100"}>Grupo</Text>
                </Stack>
            </Center>
            <Center mt={5}>
                <Image style={styles.image} source={require('../../assets/group.png')} alt="Alternate Text" />
            </Center>
        </Flex>
        <Modal isOpen={isModalVisible} onClose={() => setModalVisible(false)} safeAreaTop={true}>
            <Modal.Content maxWidth="350">
                <Modal.CloseButton/>
                <Modal.Header>Gerenciamento de Integrantes</Modal.Header>
                <Modal.Body style={{borderTopWidth: 0}}>
                <FormControl>
                    <FormControl.Label style={{justifyContent: "space-between"}}>Código/Nome do usuário dos integrantes</FormControl.Label>
                    <Input backgroundColor={"coolGray.100"} value={charactersId} placeholder='Exemplo de inserção dos códigos: 1-10-20-3' onChangeText={ids => {
                        setCharactersId(ids)
                    }} />
                </FormControl>
                <Button mt={3} backgroundColor={"coolGray.600"} onPress={() => {
                        setLoading(true)
                        addUserToGroup({
                            'name': groupInfo.data.group_name,
                            'characters_id': charactersId.split('-').map(id => {
                                if(!isNaN(id))
                                    return Number.parseInt(id)

                                return id
                            })  
                        }, groupInfo.data.owner, groupInfo.data.id, setGroupInfo, setLoading, setModalVisible)
                        .then(() => setLoading(false))
                    }}>
                    {loading ? <Spinner size={"lg"} color="coolGray.100" /> : "Adicionar"}
                </Button>
                </Modal.Body>
            </Modal.Content>
        </Modal>

        <Modal isOpen={isBookModalVisible} onClose={() => setBookModalVisible(false)} safeAreaTop={true}>
            <Modal.Content maxWidth="350">
                <Modal.CloseButton/>
                <Modal.Header>Adicionar livro para grupo</Modal.Header>
                <Modal.Body style={{borderTopWidth: 0}}>
                <FormControl>
                    <FormControl.Label style={{justifyContent: "space-between"}}>ISBN do livro</FormControl.Label>
                    <Input backgroundColor={"coolGray.100"} value={isbn}  onChangeText={isbn => {
                        setIsbn(isbn)
                    }} />
                </FormControl>
                <Button mt={3} backgroundColor={"coolGray.600"} onPress={() => {
                        setLoading(true)
                        addBookToGroup({
                            'name': groupInfo.data.group_name,
                            'characters_id': charactersId.split('-').map(id => Number.parseInt(id)),
                            'isbn': isbn,
                        }, groupInfo.data.owner, groupInfo.data.id, setGroupInfo, setLoading)
                        .then(() => setLoading(false))
                    }}>
                    {loading ? <Spinner size={"lg"} color="coolGray.100" /> : "Adicionar"}
                </Button>
                </Modal.Body>
            </Modal.Content>
        </Modal>

        <Box borderTopRadius={10} minHeight={win.height} w="100%" maxWidth={win.width} bg="white" safeArea>

          <VStack px="1" w="100%">
            <Center pt={1}>
                <Box px="1">
                    <Text fontSize="md" textAlign="left" bold color="coolGray.400">{groupInfo.data.group_name}</Text>
                </Box>
            </Center>

            <Stack mt={3} mx={5} direction='row' pl={3} space={'3/6'}>
                <Heading pl={2} mt={3} fontSize="lg" color="coolGray.800">Aventureiros</Heading>
                <IconButton onPress={() => setModalVisible(true)} icon={<Icon as={Ionicons} name="add" size="xl" color="coolGray.800"/>}/>
            </Stack>
            <ScrollView mb={3} mx={4} borderRadius={20} px={7} bg="coolGray.100" maxH={200} minH={200} minWidth={win.width - (win.width - 7)} shadow={3}>
                {
                    groupInfo.data.student.length > 0 ? groupInfo.data.student.map((element, i) => {
                        return (
                            <Box my={i < 1 ? 2 : 1}>
                                <Pressable>
                                    <Stack direction='row' space={'1'}>
                                        <Stack direction={'row'} minWidth={130}>
                                            <Avatar bg="coolGray.500" source={{
                                                uri: avatar_images["avatar_" + element.user.avatar_id]
                                            }} size="sm" borderWidth="3" borderColor="coolGray.500">
                                            </Avatar>
                                            <Center pl={1}>
                                                <Text bold>{element.name}</Text>
                                            </Center>
                                        </Stack>
                                        <Center alignItems={'initial'} pl={1} minWidth={100}>
                                            <Text bold>{element.classe.name}</Text>
                                        </Center>
                                        <Center pl={1} >
                                            <Text bold>Level: {element.level}</Text>
                                        </Center>
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
                    }}>Vazio</Text></Center>
                }
            </ScrollView>
            
            <Stack mt={3} mx={5} direction='row' pl={3} space={'4/6'}>
                <Heading pl={3}  mt={3} fontSize="lg" color="coolGray.800">Livros</Heading>
                <IconButton onPress={() => setBookModalVisible(true)} icon={<Icon as={Ionicons} name="add" size="xl" color="coolGray.800"/>}/>
            </Stack>
            <ScrollView mb={3} mx={4} borderRadius={20} px={7} bg="coolGray.100" maxH={200} minH={200} minWidth={win.width - (win.width - 7)} shadow={3}>
                {
                    groupInfo.data.books_recommended.length > 0 ? groupInfo.data.books_recommended.map((element, i) => {
                        const percentage = (element.finish_readers / element.number_of_readers) * 100
                        return (
                            <Box my={1}>
                                
                                <Stack pb={2} direction={'row'}>
                                    <Pressable>
                                        <Text bold>{element.name}</Text>
                                        <Progress  minW={320} size={'sm'}  value={percentage} colorScheme="blueGray"/>
                                    </Pressable>
                                </Stack>
                                <Divider/>
                            </Box>
                        )
                    }) : <Center><Text color={"coolGray.200"} style={{
                        textAlign: "center",
                        fontSize: 24,
                        paddingTop: 66,
                        marginTop: 13,
                        marginBottom: 25,
                        opacity: 0.7
                    }}>Vazio</Text></Center>
                }
            </ScrollView>
          </VStack>
        </Box>
    </NativeBaseProvider>
  );
}

export default GroupInfo;