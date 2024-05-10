import {Dimensions} from 'react-native';
import {NativeBaseProvider, IconButton, Icon, Flex, Center, VStack, HStack, Progress, Avatar, Text} from "native-base";
import * as RootNavigation from '../app/RootNavigation';
import {theme} from '../utils/theme';
import {FontAwesome5} from "@expo/vector-icons";
import {useState} from "react";
import {getData, getJsonData} from "../service/InMemoryStorageService";

const win = Dimensions.get('window');

function CharacterStatus() {

    const [user, setUser] = useState({});

    if (user.name === undefined || user.name == null) {
        getJsonData("user", setUser)
    }

    return (
        <NativeBaseProvider theme={theme}>
            <HStack w="100%" ml="1" mr="3" justifyContent="space-between" alignItems="center" py="4">
                <VStack px="1" flex="4">
                    <Text fontSize="sm" fontWeight="bold" textAlign="left" color="coolGray.400">{user.class}</Text>
                    <Text fontSize="xs" textAlign="left" color="warmGray.700">nível {user.level}</Text>
                </VStack>
                <VStack px="1" flex="1">
                    <Text fontSize="xs" textAlign="right" color="warmGray.700">EXP</Text>
                </VStack>
                <VStack flex="5">
                    <Progress value={user.level_xp % 100} colorScheme="yellow"/>
                </VStack>
                <VStack space={2.5} px="3" flex="3">
                    <Flex direction="row-reverse">
                        <Center><Text color="amber.900">{user.coins}</Text></Center>
                        <Center>
                            <IconButton icon={<Icon as={FontAwesome5} name="coins" size="lg" color="yellow.300"/>}/>
                        </Center>
                    </Flex>
                </VStack>
            </HStack>
        </NativeBaseProvider>
    );
}

export default CharacterStatus;