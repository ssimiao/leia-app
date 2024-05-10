import { Dimensions, StyleSheet } from 'react-native';
import { NativeBaseProvider, Modal, Spinner, Button, Pressable, ScrollView, FormControl, Input, VStack, View, Box, Stack, StatusBar, Text, Center, Image, Flex, Progress, IconButton, Icon, Link, Heading} from "native-base";
import * as RootNavigation from '../app/RootNavigation';
import { theme } from '../utils/theme';
import CharacterStatus from '../components/CharacterStatus';
import {FontAwesome5} from "@expo/vector-icons";
import BookReading from '../components/BookReading';
import { Ionicons } from "@expo/vector-icons";
import { SvgUri } from 'react-native-svg';
import { useState } from 'react';
import { addBookToUserRead, createGroup, getBook } from '../service/UserService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as InMemoryCache from "../service/InMemoryStorageService"
import { images } from './SelectCharacter';

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

function StudentGroup(componentParams) {

  const [loading, setLoading] = useState(false);
  const [addGroupModalOpen, setAddGroupModalOpen] = useState(false);
  const [groups, setGroups] = useState([])
  const [user, setUser] = useState(componentParams.route.params.user)
  const [nameGroup, setNameGroup] = useState("")


  InMemoryCache.getJson("studentGroup").then(group => {
    if (group != null && JSON.stringify(group) != JSON.stringify(groups)) 
        setGroups(group)
  })

  function noneGroups() {
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
        <Box safeAreaTop bg="black" />
        <Box borderTopRadius={10} minHeight={win.height - 150} h={"100%"} w="100%" maxWidth={win.width} bg="coolGray.100" safeArea>
          <Box paddingTop={2} px={win.width - (win.width - 7)}>
              <Stack direction={'row'} space={"1/6"}>
                  <IconButton onPress={() => RootNavigation.navigate('CharacterRpg')} mr={2}  icon={<Icon size="2xl" color="#49454F" as={Ionicons} name="arrow-back"/>}/>
                  <Text mt={3} pl={7} minW={'50'} fontSize={'lg'}>Grupos</Text>
                  <IconButton onPress={() => setAddGroupModalOpen(true)} ml={10} icon={<Icon as={Ionicons} name="add-outline" size="2xl" color="#49454F"/>}/>
              </Stack>
          </Box>
          <ScrollView px={5}>
                {
                    groups.length > 0 ? groups.map((element, i) => {
                      console.log(element)
                        return <Pressable onPress={() => RootNavigation.navigate('GroupInfo', {view: 'GroupInfo', data: element})}>
                            <Box py={5}>
                                <Stack direction={'row'}>
                                    <Box>
                                        <Center>
                                            <Image style={styles.image} source={require('../../assets/pessoas.png')} alt="Alternate Text" />
                                        </Center>
                                    </Box>
                                    <Box pl={2} py={4}>
                                        <Heading pl={0.5} fontSize={'xl'}>{element.group_name}</Heading>
                                        <Text pl={1}>Número de Participantes:</Text>
                                        <Center>
                                          <Heading fontSize={'xl'}>{element.student.length}</Heading>
                                        </Center>
                                    </Box>
                                </Stack>
                            </Box>
                        </Pressable>
                    }) : noneGroups()
                }
          </ScrollView>
          <Modal isOpen={addGroupModalOpen} onClose={() => setAddGroupModalOpen(false)} safeAreaTop={true}>
              <Modal.Content maxWidth="350">
                  <Modal.CloseButton/>
                  <Modal.Header>Criar Grupo</Modal.Header>
                  <Modal.Body style={{borderTopWidth: 0}}>
                    <FormControl>
                      <FormControl.Label style={{justifyContent: "space-between"}}>Nome Grupo</FormControl.Label>
                        <Input backgroundColor={"coolGray.100"} value={nameGroup} onChangeText={name => {
                          setNameGroup(name)
                        }} />
                    </FormControl>
                    <Button mt={3} backgroundColor={"coolGray.600"} onPress={() => {
                        setLoading(true)
                        createGroup({'name': nameGroup}, user.id, setLoading, groups).then(() => setAddGroupModalOpen(false))
                      }}>
                      {loading ? <Spinner size={"lg"} color="coolGray.100" /> : "Criar"}
                    </Button>
                  </Modal.Body>
              </Modal.Content>
            </Modal>
        </Box>
    </NativeBaseProvider>
  );
}

export default StudentGroup;