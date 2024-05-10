import {Avatar, Box, HStack, Icon, IconButton, NativeBaseProvider, StatusBar, Text, VStack} from "native-base";
import {Ionicons, MaterialIcons} from "@expo/vector-icons";
import {theme} from '../../utils/theme';
import {TouchableOpacity} from "react-native";
import React, {useState} from "react";
import * as RootNavigation from "../../app/RootNavigation";
import {getData, getJsonData, getDataInCache} from "../../service/InMemoryStorageService";
import {useDispatch} from "react-redux";
import {logout} from "../../app/reducers/loginSlice";

function Header() {

    const dispatch = useDispatch();
    const default_avatar = "https://www.freeiconspng.com/uploads/profile-icon-9.png"
    const [avatar, setAvatar] = useState(default_avatar);
    const [user, setUser] = useState({});
    let avatarLoading = false;
    getDataInCache("user_avatar")
        .then(data => {
            setAvatar(`data:image/jpeg;base64,${data}`)
        })

    if (user.name === undefined || user.name == null) {
        getJsonData("user", setUser)
    }

    return (
        <NativeBaseProvider theme={theme}>
            <StatusBar bg="orange.600" barStyle="light-content"/>
            <Box safeAreaTop bg="orange.600" w="100%" h="90">
                <HStack safeAreaBottom safeAreaRight safeAreaLeft bg="orange.600" px="1" py="3"
                        justifyContent="space-between" alignItems="center">
                    <VStack bg="orange.600" w="100%">
                        <HStack px="3" pt="5" pb="3" justifyContent="space-between" alignItems="flex-start">
                            <HStack alignItems="center">
                                <TouchableOpacity onPress={() => RootNavigation.navigate("Person")}>
                                    <Avatar bg="warning.100" source={{
                                        uri: avatar
                                    }} size="2xl" borderWidth="3" borderColor="coolGray.50">AJ
                                    </Avatar>
                                </TouchableOpacity>
                            </HStack>
                            <HStack alignItems="flex-start">
                                <IconButton icon={<Icon as={MaterialIcons} name="settings" size="md" color="white"/>}/>
                                <IconButton
                                    icon={<Icon as={MaterialIcons} name="help-outline" size="md" color="white"/>}/>
                                <IconButton icon={<Icon as={MaterialIcons} name="logout" size="md" color="white"/>}
                                            onPress={() => dispatch(logout())}/>
                            </HStack>
                        </HStack>
                        <HStack px="5" pb="3" justifyContent="space-between" alignItems="center">
                            <Text color="white">Olá, {user.name}</Text>
                        </HStack>
                    </VStack>
                </HStack>
            </Box>

        </NativeBaseProvider>);
}

export default Header;
