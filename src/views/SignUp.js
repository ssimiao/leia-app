import { Box, Heading, Modal, Icon, Select, CheckIcon, WarningOutlineIcon, VStack, HStack, Link, Text, FormControl, Input, Button, Center, NativeBaseProvider, Image, ScrollView, StatusBar, Spinner, IconButton, View } from "native-base";
import { Dimensions, StyleSheet, Platform, Keyboard, Pressable } from 'react-native';
import * as RootNavigation from '../app/RootNavigation';
import React, { useState } from 'react';
import { registerRequest } from "../service/UserService";
import { themeLogin, theme } from '../utils/theme';
import { login } from '../app/reducers/loginSlice';
import { Ionicons } from "@expo/vector-icons";
import Constants, { ExecutionEnvironment } from 'expo-constants'
import DatePicker from 'react-native-modern-datepicker';
import {Calendar, LocaleConfig, CalendarList, Agenda} from 'react-native-calendars';
import { Picker } from "react-native-web";


const win = Dimensions.get('window');
const ratio = ((win.width) > 290 ? 290 : win.width)/1260;

const styles = StyleSheet.create({
  image: {
    width: (win.width) > 290 ? 290 : win.width,
    height: 818 * (ratio), //362 is actual height of image
    resizeMode: 'stretch',
    maxWidth: 290
  }
});

LocaleConfig.locales.pt = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
  ],
  monthNamesShort: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez"
  ],
  dayNames: [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado"
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
};

LocaleConfig.defaultLocale = "pt";

function SignUp(callback) {
  
  const [loading, setLoading] = useState(false);
  const [showableCalendar, setShowableCalendar] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("");
  const [birthDate, setbirthDate] = useState("");
  const [yearDate, setYearDate] = useState(new Date().getFullYear());
  const [monthDate, setMonthDate] = useState("1");
  const [dayDate, setDayDate] = useState("1");

  const [gender, setGender] = useState("");
  const [error, setError] = useState({
    visible_email_error: false,
    visible_username_error: false,
    visible_name_error: false,
    visible_password_error: false,
    visible_date_error: false,
    visible_password_confirmed_error: false
  })
  const [isModalVisible, setModalVisible] = useState(false);


  function clear() {
    setPassword("")
    setConfirmedPassword("")
    setName("")
    setEmail("")
    setbirthDate("")
    setUserType("")
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const currentYear = (new Date()).getFullYear();
  const range = (start, stop, step) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));


  function registerUser() {

    if(validateData()) {
      registerRequest({
        "request": {
            "character": callback.route.params != undefined ? callback.route.params : {
            "name": name
          },
          "account": {
            "username": username,
            "name": name,
            "password": password,
            "user_type": userType,
            "email": email,
            "birth_date": birthDate,
            "gender": gender
          }
        }
      }, setLoading, clear)
    }
  }

  function hasOneUppercaseChar(text) {
    let n = 0;
    for (n = 0; n < text.length; n++) {
      if ((text[n] <= 'z' && text[n] >= 'a') ||
        (text[n] <= 'Z' && text[n] >= 'A')) {
        let element = text[n].toString();
        if (element.toUpperCase() === element)
          return true;
      }
    }
    return false;
  }

  function hasOneNumber(text) {
    let n = 0;
    for (n = 0; n < text.length; n++) {
      if (text[n] <= '9' && text[n] >= '0' )
        return true;
    }
    return false;
  }

  function validateData() {
    const validateInfo = {
      visible_email_error: false,
      visible_username_error: false,
      visible_name_error: false,
      visible_password_error: false,
      visible_date_error: false,
      visible_password_confirmed_error: false
    }

    let isValid = true;
    
    if (name.length == 0) {
      validateInfo.visible_name_error = true
      isValid = false
    }

    if (username.length < 6) {
      validateInfo.visible_username_error = true
      isValid = false
    }

    if (password.length < 5 || !hasOneUppercaseChar(password) || !hasOneNumber(password)
    ) {
      isValid = false
      validateInfo.visible_password_error = true
    }

    if (confirmedPassword !== password) {
      isValid = false
      validateInfo.visible_password_confirmed_error = true
    }

    if(validateEmail()) {
      isValid = false
      validateInfo.visible_email_error = true
    }

    if(birthDate.length != 10 || !birthDate.includes("/")) {
      isValid = false
      validateInfo.visible_date_error = true
    }

    setError(validateInfo)
    return isValid
  }

  function validateEmail() {
    return email == "" || !String(email)
      .toLowerCase().match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/gi
      );
  }

  function formatData(data) {
    return data < 10 ? "0" + data : data;
  }

  console.log(Platform.OS)
  console.log(Constants.executionEnvironment)
  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar bg="white" barStyle="light-content" />
      <Box safeAreaTop bg="white" />
      <Center flex={1} px="3" bg="white">
        <ScrollView w="100%"> 
          <Center w="100%">

            <Box safeArea p="2" w="90%" maxW="290" py="8">
              <Box p="2" w="90%" maxW="50" style={{backgroundColor: "rgba(4, 24, 56, 1)", borderRadius: 10}}>
                <Icon onPress={() => RootNavigation.navigate('SelectCharacter')} as={Ionicons} name="arrow-back" color="coolGray.100" size="2xl" />
              </Box>

              <Heading paddingTop={5} size="lg" color="coolGray.800" _dark={{
              color: "warmGray.50"
            }} fontWeight="semibold">
                Criar Conta
              </Heading>
              <Heading mt="1" color="coolGray.600" _dark={{
              color: "warmGray.200"
            }} fontWeight="medium" size="xs">
                Realize o cadastro para continuar
              </Heading>

              <VStack space={3} mt="3">
                <FormControl>
                  <FormControl.Label style={{justifyContent: "space-between"}}>Email {error.visible_email_error ? <FormControl.HelperText>
                    Email Invalido
                  </FormControl.HelperText> : null }</FormControl.Label>
                  <Input keyboardType="email-address" backgroundColor={"coolGray.100"} value={email} onChangeText={email => setEmail(email)} />
                </FormControl>
                
                <FormControl>
                  <FormControl.Label style={{justifyContent: "space-between"}}>Username {error.visible_username_error ? <FormControl.HelperText>
                    Username Invalido
                  </FormControl.HelperText> : null }</FormControl.Label>
                  <Input backgroundColor={"coolGray.100"} value={username} onChangeText={username => setUsername(username)} />
                </FormControl>

                <FormControl>
                  <FormControl.Label>Qual sua função?</FormControl.Label>
                  <Select backgroundColor={"coolGray.100"} onValueChange={userType => setUserType(userType)} minWidth="200" accessibilityLabel="Choose Service" placeholder="Selecione uma função" _selectedItem={{
                  bg: "teal.600",
                  endIcon: <CheckIcon size={5} />
                }} mt="1">
                    <Select.Item label="Aluno" value="Aluno" />
                    <Select.Item label="Professor" value="Professor" />
                  </Select>
                  { false ? <FormControl.ErrorMessage isDisabled leftIcon={<WarningOutlineIcon size="xs" />}>
                    Por favor, selecione uma opção.
                  </FormControl.ErrorMessage> : null }
                </FormControl>

                <FormControl>
                  <FormControl.Label style={{justifyContent: "space-between"}}  >Data de nascimento {error.visible_date_error ?  <FormControl.HelperText _text={{fontSize: 'xs'}}>
                    Data invalida
                  </FormControl.HelperText> : null }</FormControl.Label>
                  <Input showSoftInputOnFocus={false} editable={!showableCalendar}   onPressIn={() => {
                    toggleModal()
                  }} backgroundColor={"coolGray.100"} value={birthDate} onChangeText={date => setbirthDate(date)} />
                  {
                    showableCalendar ? <Calendar current={new Date(yearDate, monthDate, dayDate)} customHeaderTitle={
                      <Pressable onPress={toggleModal}>
                        <Text>
                          {formatData(monthDate)}/{yearDate}
                        </Text>
                      </Pressable>
                    } onDayPress={date => {
                        setShowableCalendar(false)
                        setbirthDate(formatData(date.day) + "/" + formatData(date.month) + "/" + date.year)
                        setYearDate(date.year)
                        setDayDate(date.day)
                        setMonthDate(date.month)
                      }} style={{borderRadius: 5}} /> : null
                  }
                </FormControl>
                <Modal isOpen={isModalVisible} onClose={() => toggleModal({})} safeAreaTop={true}>
                        <Modal.Content pt={2} maxWidth="350">
                            <Modal.CloseButton/>
                            <HStack space={"1"}>
                              <Box marginLeft={30} minWidth={50}>
                                <Text>Dia</Text>
                              <ScrollView height={100}>
                                {
                                  range(31, 1, -1).map((element, index) => {
                                    return <Pressable style={({ pressed }) => [
                                      
                                      pressed ? { opacity: 0.5 } : {}
                                    ]} onPress={() => setDayDate(element)}><Text>{Number(element) < 10 ? "0" + element : element}</Text></Pressable>
                                  })
                                }
                              </ScrollView>
                              </Box>
                              <Box  minWidth={50}>
                                <Text>Mês</Text>
                              <ScrollView height={100}>
                                {
                                  range(12, 1, -1).map((element, index) => {
                                    return <Pressable style={({ pressed}) => [pressed ? { opacity: 0.5 } : {}]} onPress={() => setMonthDate(element)}><Text>{Number(element) < 10 ? "0" + element : element}</Text></Pressable>
                                  })
                                }
                              </ScrollView>
                              </Box>
                              <Box>
                                <Text>Ano</Text>
                                <ScrollView height={100}>
                                  {
                                    range(currentYear, currentYear - 70, -1).map((element, index) => {
                                      return <Pressable style={({ pressed}) => [pressed ? { opacity: 0.5 } : {}]} onPress={() => setYearDate(element)}><Text>{element}</Text></Pressable>
                                    })
                                  }
                                </ScrollView>
                              </Box>
                              <Box mt={70} mx={7}><Text>Data escolhida</Text><Text>{formatData(dayDate) + "/" + formatData(monthDate) + "/" + yearDate}</Text></Box>
                            </HStack>
                            <Button onPress={() => {
                             setbirthDate(formatData(dayDate) + "/" + formatData(monthDate) + "/" + yearDate)
                             toggleModal()
                            }} mt={2}>Confirmar</Button>
                  </Modal.Content>
                  
                </Modal>

                <FormControl>
                  <FormControl.Label style={{justifyContent: "space-between"}}  >Nome {error.visible_name_error ?  <FormControl.HelperText _text={{fontSize: 'xs'}}>
                    Nome Invalido
                  </FormControl.HelperText> : null }</FormControl.Label>
                  <Input backgroundColor={"coolGray.100"} value={name} onChangeText={name => setName(name)} />
                </FormControl>

                <FormControl>
                  <FormControl.Label style={{justifyContent: "space-between"}} >Senha { error.visible_password_error ? <FormControl.HelperText _text={{fontSize: 'xs'}}>
                    Senha Fraca
                  </FormControl.HelperText> : null }</FormControl.Label>
                  <Input backgroundColor={"coolGray.100"} onChangeText={password => setPassword(password)} type="password" />
                </FormControl>

                <FormControl>
                  <FormControl.Label style={{justifyContent: "space-between"}} >Confirme a senha {error.visible_password_confirmed_error ? <FormControl.HelperText _text={{fontSize: 'xs'}}>
                    Senha diferente
                  </FormControl.HelperText> : null }</FormControl.Label>
                  <Input backgroundColor={"coolGray.100"} onChangeText={confirmedPassword => setConfirmedPassword(confirmedPassword)} type="password" />
                </FormControl>

                <Button style={{backgroundColor: "rgba(4, 24, 56, 1)"}} onPress={() => {
                  registerUser()
                }}>
                  {loading ? <Spinner size={"lg"} color="coolGray.100" /> : "Me cadastrar!"}
                </Button>
                <HStack justifyContent="center">
                    <Text fontSize="sm" color="coolGray.600" _dark={{
                    color: "warmGray.200"
                  }}>
                      Já possuo conta.{" "}
                    </Text>
                    <Link _text={{
                    color: "coolGray.600",
                    fontWeight: "medium",
                    fontSize: "sm"
                  }} onPress={() => RootNavigation.navigate('Login')}>
                      Fazer login
                    </Link>
                  </HStack>
              </VStack>
            </Box>
          </Center>
        </ScrollView>
      </Center>
    </NativeBaseProvider>
  )
}

export default SignUp;