import {
    Avatar,
    Box,
    Button,
    Center,
    FormControl,
    Heading,
    HStack, Icon,
    Image,
    Input,
    Link, Modal,
    NativeBaseProvider,
    Spinner,
    Text,
    VStack
} from "native-base";
import {Dimensions, Platform, StyleSheet, TouchableHighlight, TouchableOpacity} from 'react-native';
import * as RootNavigation from '../app/RootNavigation';
import React, {useState} from 'react';
import {avatarRendering, getUserAvatar, registerRequest, setUserAvatar} from "../service/UserService";
import {theme} from '../utils/theme';
import {Ionicons} from "@expo/vector-icons";
import {getData, getJsonData, getDataInCache} from "../service/InMemoryStorageService";
import * as ImagePicker from "expo-image-picker";

const win = Dimensions.get('window');
const ratio = ((win.width) > 290 ? 290 : win.width) / 1260;

const styles = StyleSheet.create({
    image: {
        width: (win.width) > 290 ? 290 : win.width,
        height: 818 * (ratio), //362 is actual height of image
        resizeMode: 'stretch',
        maxWidth: 290
    }
});

export default function Person({navigation}) {

    const default_avatar = "https://www.freeiconspng.com/uploads/profile-icon-9.png"
    const [avatar, setAvatar] = useState(default_avatar);
    const [user, setUser] = useState({});
    let avatarLoading = false;
    avatarRendering(avatarLoading, avatar, default_avatar, setAvatar)

    if (user.name === undefined || user.name == null) {
        getJsonData("user", setUser)
    }

    const [isModalVisible, setModalVisible] = useState(false);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
    const togglePasswordModal = () => {
        setPasswordModalVisible(!isPasswordModalVisible);
    };

    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [name, setName] = useState();
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [password, setPassword] = useState("");
    const [confirmedPassword, setConfirmedPassword] = useState("");
    const [error, setError] = useState({
        visible_email_error: false,
        visible_username_error: false,
        visible_name_error: false,
        visible_password_error: false,
        visible_password_confirmed_error: false
    })

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
            base64: true
        });

        if (!result.canceled) {
            await setUserAvatar(user.username, result, setAvatar);
        }
    };

    return (
        <NativeBaseProvider theme={theme}>
            <Center flex={1} px="3" bg="white">
                <Center w="100%">
                    <Box safeArea p="2" w="90%" maxW="290" py="8">
                        <Center py="3">
                            <TouchableOpacity onPress={() => toggleModal()}>
                                <Avatar bg="green.500" source={{
                                    uri: avatar
                                }} size="2xl" borderWidth="3" borderColor="warning.500">AJ
                                    <Avatar.Badge borderWidth="0" alignItems={"center"} justifyContent={"center"}
                                                  bg="warning.500"><Icon as={Ionicons} name="pencil"
                                                                         color={"coolGray.100"}
                                                                         size={"md"}/></Avatar.Badge>
                                </Avatar>
                            </TouchableOpacity>
                        </Center>
                        <VStack space={3} mt="5">
                            <FormControl>
                                <FormControl.Label
                                    style={{justifyContent: "space-between"}}>Email {error.visible_email_error ?
                                    <FormControl.HelperText>
                                        Email Invalido
                                    </FormControl.HelperText> : null}</FormControl.Label>
                                <Input value={user.email} onChangeText={email => setEmail(email)}/>
                            </FormControl>
                            <FormControl>
                                <FormControl.Label
                                    style={{justifyContent: "space-between"}}>Nome {error.visible_name_error ?
                                    <FormControl.HelperText _text={{fontSize: 'xs'}}>
                                        Nome inválido
                                    </FormControl.HelperText> : null}</FormControl.Label>
                                <Input value={user.name} onChangeText={name => setName(name)}/>
                            </FormControl>
                            <FormControl>
                                <FormControl.Label
                                    style={{justifyContent: "space-between"}}>Username {error.visible_username_error ?
                                    <FormControl.HelperText _text={{fontSize: 'xs'}}>
                                        Usuário Invalido
                                    </FormControl.HelperText> : null}</FormControl.Label>
                                <Input value={user.username} onChangeText={username => setUsername(username)}/>
                            </FormControl>
                            <Button mt="2" colorScheme="orange" onPress={() => console.log()}>
                                {loading ? <Spinner size={"lg"} color="warning.500"/> : "Atualizar Informações"}
                            </Button>
                            <Button mt="2" colorScheme="orange" onPress={() => togglePasswordModal()}>
                                {loading ? <Spinner size={"lg"} color="warning.500"/> : "Trocar Senha"}
                            </Button>
                        </VStack>
                    </Box>
                </Center>
                <Modal isOpen={isModalVisible} onClose={() => toggleModal()} safeAreaTop={true}>
                    <Modal.Content maxWidth="350">
                        <Modal.CloseButton/>
                        <Modal.Header>Avatar</Modal.Header>
                        <Modal.Body style={{borderTopWidth: 0}}>
                            <Button.Group justifyContent={"center"} space={2}>
                                <Button colorScheme="orange" onPress={pickImage}>Mudar avatar</Button>
                                <Button colorScheme="orange" onPress={pickImage}>Remover avatar</Button>
                            </Button.Group>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
                <Modal isOpen={isPasswordModalVisible} onClose={() => togglePasswordModal()} safeAreaTop={true}>
                    <Modal.Content maxWidth="350">
                        <Modal.CloseButton/>
                        <Modal.Header>Senha</Modal.Header>
                        <Modal.Body style={{borderTopWidth: 0}}>
                            <FormControl>
                                <FormControl.Label style={{justifyContent: "space-between"}} >Senha Antiga</FormControl.Label>
                                <Input onChangeText={oldPassword => setOldPassword(oldPassword)} type="password" />
                            </FormControl>
                            <FormControl>
                                <FormControl.Label style={{justifyContent: "space-between"}} >Nova Senha { error.visible_password_error ? <FormControl.HelperText _text={{fontSize: 'xs'}}>
                                    Senha Fraca
                                </FormControl.HelperText> : null }</FormControl.Label>
                                <Input onChangeText={password => setPassword(password)} type="password" />
                            </FormControl>
                            <FormControl>
                                <FormControl.Label style={{justifyContent: "space-between"}} >Confirme a senha {error.visible_password_confirmed_error ? <FormControl.HelperText _text={{fontSize: 'xs'}}>
                                    Senha diferente
                                </FormControl.HelperText> : null }</FormControl.Label>
                                <Input onChangeText={confirmedPassword => setConfirmedPassword(confirmedPassword)} type="password" />
                            </FormControl>
                        </Modal.Body>
                        <Modal.Footer style={{borderTopWidth: 0}}>
                            <Button.Group space={2}>
                                <Button backgroundColor={"orange.600"} color={"coolGray.200"} onPress={() => {
                                    togglePasswordModal()
                                }}>Alterar senha</Button>
                            </Button.Group>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </Center>
        </NativeBaseProvider>
    )
}