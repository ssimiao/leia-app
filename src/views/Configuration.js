import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { Modal,  Avatar, NativeBaseProvider, Spinner, Button, Pressable, ScrollView, FormControl, Input, VStack, View, Box, Stack, StatusBar, Text, Center, Image, Flex, Progress, IconButton, Icon, Link, Heading} from "native-base";
import * as RootNavigation from '../app/RootNavigation';
import { theme } from '../utils/theme';
import CharacterStatus from '../components/CharacterStatus';
import {FontAwesome5} from "@expo/vector-icons";
import BookReading from '../components/BookReading';
import { Ionicons } from "@expo/vector-icons";
import { SvgUri } from 'react-native-svg';
import { useState } from 'react';
import { addBookToUserRead, getBook, updat, updatePassword, updateUserInfo } from '../service/UserService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as InMemoryCache from "../service/InMemoryStorageService"
import { avatar_images } from './SelectCharacter';

import {Calendar, LocaleConfig} from 'react-native-calendars';


const win = Dimensions.get('window');

const styles = StyleSheet.create({
    image: {
      width: 150,
      height: 150, 
      resizeMode: 'stretch',
      maxWidth: 150
    },
    icon: {
        width: 50,
        height: 50, 
        resizeMode: 'stretch',
        maxWidth: 100
    }
});

function Configuration(componentParams) {

  console.log(componentParams.route.params)
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [user, setUser] = useState(componentParams.route.params.user);
  const [showableCalendar, setShowableCalendar] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
  const [username, setUsername] = useState("");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setbirthDate] = useState("");
  const [gender, setGender] = useState("");
  const [avatar, setAvatar] = useState(user != null ? user.avatar_id : "");
  const [character, setCharacter] = useState("");
  const [error, setError] = useState({
    visible_email_error: false,
    visible_username_error: false,
    visible_name_error: false,
    visible_password_error: false,
    visible_date_error: false,
    visible_password_confirmed_error: false
  })
  
  if (character === "") {
    InMemoryCache.getJson("char").then(characterCache => {
      setCharacter(characterCache)
    })
  }

  function updateUser() {
    setLoading(true)
    console.log(name)
    updateUserInfo({
      "username": username != "" ? username : user.username,
      "name": name != "" ? name : user.name,
      "email": email != "" ? email : user.email,
      "birth_date": birthDate != "" ? birthDate : user.birth_date,
      "avatar_id": avatar,
      "id": user.id
    }, setLoading)
  }

  function formatData(data) {
    return data < 10 ? "0" + data : data;
  }

  return (
    <NativeBaseProvider>
        <StatusBar bg="white" barStyle="light-content" />
        <Box safeAreaTop bg="black" />
        <ScrollView  borderTopRadius={10} minHeight={win.height} w="100%" maxWidth={win.width} bg="#FFF" safeArea>

          <VStack px="1" w="100%">

            <ScrollView paddingTop={10} w="100%">
                <Center>
                    <Heading>Configuração</Heading>
                </Center>

                <Modal isOpen={isModalVisible} onClose={() => setModalVisible(false)} safeAreaTop={true}>
                    <Modal.Content maxWidth="350">
                        <Modal.CloseButton/>
                        <Modal.Header>Perfil</Modal.Header>
                        <Modal.Body style={{borderTopWidth: 0}}>
                          <Center>
                            <TouchableOpacity onPress={() => setModalVisible(true)}>
                              <Avatar bg="coolGray.500" source={{
                                  uri: avatar_images["avatar_" + avatar]
                              }} size="lg" borderWidth="3" borderColor="coolGray.500">AJ
                              </Avatar>
                            </TouchableOpacity>
                          </Center>
                          <Center>
                            <Flex pt={2} direction='row'>
                              {
                                Object.values(avatar_images).map((element, i) => {
                                  if(i+1 != avatar) {
                                    return <TouchableOpacity style={{'paddingHorizontal': 1}} onPress={() => setAvatar(i+1)}>
                                      <Avatar bg="coolGray.500" source={{
                                          uri: element
                                      }} size="lg" borderWidth="3" borderColor="coolGray.500">AJ
                                      </Avatar>
                                    </TouchableOpacity>
                                  }
                                })
                              }
                            </Flex>
                          </Center>
                          <Center>
                            <Text mt={5} bold>Código Perfil</Text>
                            <Heading>{user.id}</Heading>
                          </Center>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>

                <Modal isOpen={isPasswordModalVisible} onClose={() => setPasswordModalVisible(false)} safeAreaTop={true}>
                    <Modal.Content maxWidth="350">
                        <Modal.CloseButton/>
                        <Modal.Header>Senha</Modal.Header>
                        <Modal.Body style={{borderTopWidth: 0}}>
                          <FormControl>
                            <FormControl.Label style={{justifyContent: "space-between"}}>Antiga Senha</FormControl.Label>
                              <Input backgroundColor={"coolGray.100"} value={oldPass} onChangeText={pass => {
                                setOldPass(pass)
                              }} />
                          </FormControl>
                          <FormControl>
                            <FormControl.Label style={{justifyContent: "space-between"}}>Nova Senha</FormControl.Label>
                              <Input backgroundColor={"coolGray.100"} value={newPass} onChangeText={pass => {
                                setNewPass(pass)
                              }} />
                          </FormControl>
                          <Button mt={3} backgroundColor={"coolGray.600"} onPress={() => {
                              setPassLoading(true)
                              updatePassword({
                                'old_pass': oldPass,
                                'new_pass': newPass,
                                'id': user.id
                              }, passLoading, setPasswordModalVisible)
                            }}>
                            {passLoading ? <Spinner size={"lg"} color="coolGray.100" /> : "Atualizar"}
                          </Button>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>

                <Center py="5">
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Avatar bg="green.500" source={{
                            uri: avatar_images["avatar_" + avatar]
                        }} size="2xl" borderWidth="3" borderColor="coolGray.500">AJ
                            <Avatar.Badge borderWidth="0" alignItems={"center"} justifyContent={"center"}
                                          bg="coolGray.500"><Icon as={Ionicons} name="pencil"
                                                                  color={"coolGray.100"}
                                                                  size={"md"}/></Avatar.Badge>
                        </Avatar>
                    </TouchableOpacity>
                </Center>
                
                <VStack space={3} mt="3" px={10}>
                <FormControl>
                  <FormControl.Label style={{justifyContent: "space-between"}}>Email {error.visible_email_error ? <FormControl.HelperText>
                    Email Invalido
                  </FormControl.HelperText> : null }</FormControl.Label>
                  <Input onPressIn={() => setShowableCalendar(false)} backgroundColor={"coolGray.100"} value={email === "" && character != "" ? character.user.email : email} onChangeText={email => {
                    setEmail(email)
                  }} />
                </FormControl>
                <FormControl>
                  <FormControl.Label style={{justifyContent: "space-between"}}>Username {error.visible_email_error ? <FormControl.HelperText>
                    Username Invalido
                  </FormControl.HelperText> : null }</FormControl.Label>
                  <Input backgroundColor={"coolGray.100"} value={username === "" && character != "" ? character.user.username : username} onPressIn={() => setShowableCalendar(false)} onChangeText={username => setUsername(username)} />
                </FormControl>
                <FormControl>
                  <FormControl.Label style={{justifyContent: "space-between"}}  >Data de nascimento {error.visible_date_error ?  <FormControl.HelperText _text={{fontSize: 'xs'}}>
                    Data invalida
                  </FormControl.HelperText> : null }</FormControl.Label>
                  <Input editable={!showableCalendar} value={birthDate === "" && character != "" ? character.user.birth_date : birthDate}  onPressIn={() => setShowableCalendar(true)} backgroundColor={"coolGray.100"} onChangeText={date => setbirthDate(date)} />
                  {
                    showableCalendar ? <Calendar  onDayPress={date => {
                        setShowableCalendar(false)
                        setbirthDate(formatData(date.day) + "/" + formatData(date.month) + "/" + date.year)
                      }} style={{borderRadius: 5}} /> : null
                  }
                </FormControl>
                <FormControl>
                  <FormControl.Label style={{justifyContent: "space-between"}} >Nome {error.visible_name_error ?  <FormControl.HelperText _text={{fontSize: 'xs'}}>
                    Nome Invalido
                  </FormControl.HelperText> : null }</FormControl.Label>
                  <Input onPressIn={() => setShowableCalendar(false)} backgroundColor={"coolGray.100"} value={name === "" && character != "" ? character.user.name : name} onChangeText={name => setName(name)} />
                </FormControl>
                <Box pt={3}>
                  <Button backgroundColor={"coolGray.600"} onPress={() => {
                    updateUser()
                  }}>
                    {loading ? <Spinner size={"sm"} color="coolGray.100" /> : "Atualizar Perfil"}
                  </Button>
                  <Button mt={3} backgroundColor={"coolGray.600"} onPress={() => {
                    setPasswordModalVisible(true)
                    setPassLoading(false)
                    }}>
                    Alterar Senha
                  </Button>
                </Box>
                
              </VStack>
            </ScrollView>      
          </VStack>
        </ScrollView>
    </NativeBaseProvider>
  );
}

export default Configuration;