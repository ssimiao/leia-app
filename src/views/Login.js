import { Box, Text, Heading, VStack, Modal, FormControl, Input, Link, Button, HStack, Center, NativeBaseProvider, Image, StatusBar, ScrollView, Spinner } from "native-base";
import { Dimensions, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import {login, loginSlice} from '../app/reducers/loginSlice';
import { theme } from '../utils/theme';
import * as RootNavigation from '../app/RootNavigation';
import {useState} from "react";
import { sendEmailAndGetCode, loginRequest, validCode, validateCode, updatePasswordForget } from "../service/UserService";
import * as InMemoryCache from '../service/InMemoryStorageService'


const win = Dimensions.get('window');
const ratio = ((win.width) > 290 ? 290 : win.width)/1260;

const styles = StyleSheet.create({
  image: {
    width: 166,
    height: 166, //362 is actual height of image
    resizeMode: 'stretch',
    maxWidth: 290
  }
});

function Login( params ) {
    const dispatch = useDispatch();

    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [password, setPassword] = useState("");
    const [code, setCode] = useState("");
    const [codeInput, setCodeInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingForget, setLoadingForget] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [validCode, setValidCode] = useState(false);

    const toggleModal = () => {
      setModalVisible(!isModalVisible);
    };

    function getEmailInput() {
      return <FormControl>
        <Input backgroundColor={"coolGray.100"} placeholder="Email ou Usuário" onChangeText={username => setUsernameOrEmail(username)} />
      </FormControl>
    }

    function handleForm() {
      if(code == "") { 
        return <Box>
          <HStack mx={3} pt={10} space={"1"}>
            {getEmailInput()}
          </HStack>
          <Button onPress={() => {
            setLoadingForget(true)
            sendEmailAndGetCode(usernameOrEmail, setLoadingForget, setCode)
          }} mt={2}>{loadingForget ? <Spinner size={"sm"} color="coolGray.500" /> : "Trocar Senha"}</Button>
        </Box>
      } else if (validCode) {
        return <Box>
        <HStack mx={3} pb={3} pt={10} space={"1"}>
          <FormControl>
            <Input type="password" backgroundColor={"coolGray.100"} placeholder="Nova senha" onChangeText={senha => setPassword(senha)} />
          </FormControl>
        </HStack>
        <Button onPress={() => {
          setLoadingForget(true)
          updatePasswordForget({
            "email": usernameOrEmail,
            "otp": code,
            "new_pass": password
          }, setLoadingForget)
        }} mt={2}>{loadingForget ? <Spinner size={"sm"} color="coolGray.500" /> : "Enviar Código"}</Button>
      </Box>
      } else {
        return <Box>
          <HStack mx={3} pb={3} pt={10} space={"1"}>
            <FormControl>
              <Input backgroundColor={"coolGray.100"} placeholder="Código recebido no email" onChangeText={code => setCodeInput(code)} />
            </FormControl>
          </HStack>
          { code == codeInput ? <Button onPress={() => {
            setLoadingForget(true)
            validateCode(usernameOrEmail, code, setLoadingForget, setValidCode)
          }} mt={2}>{loadingForget ? <Spinner size={"sm"} color="coolGray.500" /> : "Enviar Código"}</Button> : null }
        </Box>
      }
    }

    console.log(code)
    console.log(codeInput)
    return (
      <NativeBaseProvider theme={theme}>
        <StatusBar bg="white" barStyle="light-content" />
        <Box safeAreaTop bg="white" />
        <Center paddingTop={100} flex={1} px="3" bg="white">
          <ScrollView w="100%">          
            <Center w="100%">
              <Box safeArea p="2" py="8" w="90%" maxW="290">
                <Center py="3">
                  <Image style={styles.image} source={require('../../assets/robot_happy.png')} alt="Alternate Text" />
                  <Heading paddingTop={2} size="lg" fontWeight="600" color="coolGray.800" _dark={{color: "warmGray.50"}}>
                    LEIA
                  </Heading>
                </Center>

                <VStack space={3} mt="5">
                  <FormControl>
                    <Input backgroundColor={"coolGray.100"} placeholder="Email ou Usuário" onChangeText={username => setUsernameOrEmail(username)} />
                  </FormControl>
                  <FormControl>
                    <Input backgroundColor={"coolGray.100"} placeholder="Senha" onChangeText={password => setPassword(password)} type="password" />
                    <Link onPress={() => {
                        toggleModal()
                      }} _text={{
                        fontSize: "xs",
                        fontWeight: "500",
                        color: "coolGray.600"
                      }} alignSelf="flex-end" mt="1">
                      Esqueceu a senha?
                    </Link>
                  </FormControl>
                  <Button mt="2" style={{backgroundColor: "rgba(4, 24, 56, 1)"}} onPress={() => { 
                      loginRequest(
                        {
                          "username": usernameOrEmail,
                          "password": password
                        }, dispatch, setLoading
                      )
                      setLoading(true)
                    }}>
                      {loading ? <Spinner size={"sm"} color="coolGray.500" /> : "Estou pronto!"}
                  </Button>
                  <HStack mt="6" justifyContent="center">
                    <Text fontSize="sm" color="coolGray.600" _dark={{
                    color: "warmGray.200"
                  }}>
                      Sou novo aqui.{" "}
                    </Text>
                    <Link _text={{
                    color: "coolGray.600",
                    fontWeight: "medium",
                    fontSize: "sm"
                  }} onPress={() => RootNavigation.navigate('SelectCharacter')}>
                      Me cadastrar
                    </Link>
                  </HStack>
                </VStack>
                <Modal isOpen={isModalVisible} onClose={() => {
                    setCode("")
                    toggleModal({})
                  }} safeAreaTop={true}>
                  <Modal.Content pt={2} maxWidth="350">
                      <Modal.CloseButton/>
                      {
                        handleForm()
                      }
                  </Modal.Content>
                </Modal>
              </Box>
            </Center>
          </ScrollView>
        </Center>
      </NativeBaseProvider>
    )
  };

  export default Login;