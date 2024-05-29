import { Alert, Dimensions, Pressable, StyleSheet, DeviceEventEmitter, BackHandler } from 'react-native';
import { NativeBaseProvider, Modal, Button, Input, ScrollView, VStack, View, Box, Stack, StatusBar, Text, Center, Image, Flex, Progress, IconButton, Icon, Link, Spinner, HStack} from "native-base";
import * as RootNavigation from '../app/RootNavigation';
import { theme } from '../utils/theme';
import CharacterStatus from '../components/CharacterStatus';
import {FontAwesome5} from "@expo/vector-icons";
import BookReading from '../components/BookReading';
import { Ionicons } from "@expo/vector-icons";
import React, {useState, useEffect} from 'react';
import * as InMemoryCache from "../service/InMemoryStorageService"
import { changeUserAttribute, getUser, getUserRead, updatePotionVitality } from '../service/UserService';
import { images } from './SelectCharacter';
import _ from 'lodash';
import { backAction } from '../utils/ActionUtil';

const win = Dimensions.get('window');

const styles = StyleSheet.create({
    image: {
      width: 166,
      height: 166, //362 is actual height of image
      resizeMode: 'stretch',
      maxWidth: 290
    }
  });

function CharacterRpg(componentParams) {

    const [user, setUser] = useState(componentParams.route.params.user);
    const [character, setCharacter] = useState([])
    const [reads, setReads] = useState([])
    const [groups, setGroups] = useState([])
    const [loaded, setLoaded] = useState("false");
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setModalVisible] = useState({});
    const [isPotionModalVisible, setPotionModalVisible] = useState(false);
    const [sumAttribute, setSumAttribute] = useState(0);
    const [myTime, setMyTime] = useState(new Date());

    useEffect(() => {
        var timerID = setInterval(() => tick(), 2000);
        
        return () => clearInterval(timerID);
    });
    
    function tick() {
        setMyTime(new Date());
    }

    InMemoryCache.getJson("char").then(characterCache => {
        if (characterCache != null && JSON.stringify(characterCache) != JSON.stringify(character)) {
            setCharacter(characterCache)
        }
    })

    InMemoryCache.getJson("reads").then(read => {
        if (read != null && JSON.stringify(read) != JSON.stringify(reads)) 
            setReads(read)
    })

    InMemoryCache.getJson("studentGroup").then(group => {
        if (group != null && JSON.stringify(group) != JSON.stringify(groups)) 
            setGroups(group)
    })

    function toggleModal(attribute) {
        setSumAttribute(0)
        setModalVisible(attribute)
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          backAction,
        );
    
        return () => backHandler.remove();
    }, []);

  return (
    <NativeBaseProvider>
        <StatusBar backgroundColor={'#16376C'} barStyle="light-content" />
        <Flex>
            <Box paddingTop={2} space={2.5} px={win.width - (win.width - 7)}>
                {user.user_type === 'Aluno' ?
                    <Flex direction="row-reverse">
                        <IconButton ml={5} onPress={() => backAction()} icon={<Icon as={Ionicons} name="power" size="lg" color="yellow.300"/>}/>
                        <Center><Text color="coolGray.100">{character.coins}</Text></Center>
                        <Center>
                            <Icon mr={3} as={FontAwesome5} name="coins" size="md" color="yellow.300"/>
                        </Center>
                        <Center pr={6}><Text color="coolGray.100">{character.potions}</Text></Center>
                        <IconButton onPress={() => setPotionModalVisible(true)} icon={<Icon as={Ionicons} name="flask" size="md" color="yellow.300"/>}/>
                        <Center pr={5}><Text color="coolGray.100">{character.vitality}</Text></Center>
                        <IconButton onPress={() => RootNavigation.navigate('Goals')} icon={<Icon as={Ionicons} name="heart" size="md" color="yellow.300"/>}/>
                    </Flex> : 
                    null
                }
            </Box>
            <Center mt={10}>
                <Pressable onPress={() => RootNavigation.navigate('Forge', {"id": character.user.id, "race": character.race.name, "color": character.race.color})}>
                    <Image style={styles.image} source={{uri: images[character.race != undefined ? character.race.name + "_" + character.race.color + (character.classe.name != "Novato" && character.classe.name != "Professor" && character.classe.name != "Responsavel" ? "_" + character.classe.name : "")  : null]}} alt="Alternate Text" />
                </Pressable>
            </Center>
        </Flex>
        <Box borderTopRadius={45} minHeight={win.height} w="100%" maxWidth={win.width} bg="white" safeArea>

          <VStack px="1" w="100%">
            <Center>
                <HStack>
                    <Center pt={1}>
                        <Box px="1">
                                
                                <Text fontSize="md" textAlign="left" color="coolGray.400">{character.name} <Text textAlign={'right'} bold>{character.classe != undefined ? character.classe.name === "Responsavel" ? "Responsável" : character.classe.name : null}</Text></Text>
                                { user.user_type === 'Aluno' ? <Text fontSize="xs" textAlign="left" color="warmGray.700">Nível {character.level}</Text> : null }
                        </Box>
                    </Center>
                    { user.user_type === 'Aluno' ?
                        <Center>
                            <IconButton onPress={() => RootNavigation.navigate('Bluetooth', character)} icon={<Icon as={Ionicons} name="game-controller" color={"coolGray.500"} size="xl"/>}/>
                        </Center> : null
                    }
                </HStack>
            </Center>

            { user.user_type === 'Aluno' ? <Box px="7">
                <Text fontSize="2xs" textAlign="right" color="warmGray.700">{character.xp}/{character.xp_to_level_up} XP</Text>
            </Box> : null}

            { user.user_type === 'Aluno' ? <Box paddingX={win.width - (win.width - 7)}>
                <Progress maxWidth={350} value={((character.xp - (character.level == 1 ? 0 : character.level * 100)) * 100 / character.xp_to_level_up)} colorScheme="blueGray"/>
            </Box> : null}

            {user.user_type === 'Aluno' ? 
            <View paddingTop={5} w="100%">
      
              <View>
                <Stack mt={3} mx={4} direction='row' pl={3} space={'2/6'}>
                    <Text mt={3} fontSize="md" color="coolGray.600">Atributos</Text>
                    <Text textAlign={'right'} pl={2} mt={4} fontSize="sm" color="coolGray.600">
                        Pontos Disponiveis: {character.enable_attribute_points}
                    </Text>
                </Stack>
                <Box mx={4} borderRadius={20} px={7} bg="coolGray.100" minWidth={win.width - (win.width - 7)} shadow={3}>
                    <Center>
                        <Stack direction="row" mb="2.5" mt="1.5" space={'lg'}>
                            <Pressable onPress={() => toggleModal({
                                    'path': "intelligence_attribute",
                                    'display': "Inteligência"
                                })}>
                                <Box minWidth={70}>
                                    <Text bold fontSize="xs" color="blue.400">Inteligência </Text><Text fontSize="xs" color="coolGray.800">{character.intelligence_attribute}</Text>
                                </Box>
                            </Pressable>
                            <Pressable onPress={() => toggleModal({
                                    'path': "force_attribute",
                                    'display': "Força"
                                })}>
                                <Box minWidth={70}>
                                    <Text bold fontSize="xs" color="red.400">Força</Text><Text fontSize="xs" color="coolGray.800">{character.force_attribute}</Text>
                                </Box>
                            </Pressable>
                            <Pressable onPress={() => toggleModal({
                                    'path': "dex_attribute",
                                    'display': "Destreza"
                                })}>
                                <Box minWidth={70}>
                                    <Text bold fontSize="xs" color="coolGray.800">Destreza</Text><Text fontSize="xs" color="coolGray.800">{character.dex_attribute}</Text>
                                </Box>
                            </Pressable>
                        </Stack>
                        <Stack direction="row" mb="2.5" mt="1.5" space={'lg'}>
                            <Pressable onPress={() => toggleModal({
                                    'path': "charisma_attribute",
                                    'display': "Carisma"
                                })}>
                                <Box minWidth={70}>
                                    <Text bold textAlign={'left'} fontSize="xs" color="yellow.600">Carisma</Text><Text fontSize="xs" color="coolGray.800">{character.charisma_attribute}</Text>
                                </Box>
                            </Pressable>
                            <Pressable onPress={() => toggleModal({
                                    'path': "agility_attribute",
                                    'display': "Agilidade"
                                })}>
                                <Box minWidth={70}>
                                    <Text bold fontSize="xs" color="green.600">Agilidade</Text><Text fontSize="xs" color="coolGray.800">{character.agility_attribute}</Text>
                                </Box>
                            </Pressable>
                            <Pressable onPress={() => toggleModal({
                                    'path': "resistence_attribute",
                                    'display': "Resistência"
                                })}>
                                <Box minWidth={70}>
                                    <Text bold fontSize="xs" color="blue.700">Resistência</Text>
                                    <Text fontSize="xs" color="coolGray.800">{character.resistence_attribute}</Text>
                                </Box>
                            </Pressable>
                        </Stack>
                    </Center>
                </Box>
                <Stack mt={3} mx={4} direction='row' pl={3} space={'3/6'}>
                    <Text mt={3} fontSize="sm" color="coolGray.600">Missões</Text>
                    <Link textAlign={'right'} mt={3} fontSize="xs" color="coolGray.600" onPress={() => RootNavigation.navigate('BookShelf', user)}>
                        Visualizar tudo
                    </Link>
                </Stack>
                <Box mb={3} mx={4} borderRadius={20} px={7} bg="coolGray.100" minWidth={win.width - (win.width - 7)} shadow={3}>
                {
                    reads.length > 0 ? reads.map((element, i) => {
                        if(i < 4) {
                            return (
                                <Box key={i} my={1}>
                                    <Pressable justifyContent={"flex-start"} size={"lg"}>
                                        <Text bold>Leia - {element.book.name}</Text>
                                    </Pressable>
                                </Box>
                            )
                        }
                    }) : <Box><Text color={"coolGray.200"} style={{
                        textAlign: "center",
                        fontSize: 24,
                        paddingTop: 8,
                        marginTop: 13,
                        marginBottom: 25,
                        opacity: 0.7
                    }}>Vazio</Text></Box>
                }
                </Box>

                <Modal isOpen={isPotionModalVisible} onClose={() => setPotionModalVisible(false)} safeAreaTop={true}>
                    <Modal.Content maxWidth="350">
                        <Modal.CloseButton/>
                        <Modal.Header>Poções</Modal.Header>
                        <Modal.Body style={{borderTopWidth: 0}}>

                            <Button.Group pt={2} justifyContent={"center"} >
                                <Button colorScheme="darkBlue" onPress={() => {
                                    setLoading(true)
                                    updatePotionVitality(character.id, setLoading)
                                }}>{loading ? <Spinner/> : 'Beber Poção' }</Button>
                            </Button.Group>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
                
                <Modal isOpen={isModalVisible.path !== undefined} onClose={() => toggleModal({})} safeAreaTop={true}>
                    <Modal.Content maxWidth="350">
                        <Modal.CloseButton/>
                        <Modal.Header>Atributo <Text>Pontos Disponiveis: {character.enable_attribute_points - sumAttribute}</Text></Modal.Header>
                        <Modal.Body style={{borderTopWidth: 0}}>


                        <Stack direction={'row'} space={2}>
                                <Center pl={20}>
                                    <Text>{isModalVisible.display}: <Text bold>{character[isModalVisible.path] + sumAttribute}</Text></Text>
                                </Center>
                                <Pressable onPress={() => {
                                        if((character.enable_attribute_points - sumAttribute) > 0)
                                            setSumAttribute(sumAttribute + 1)
                                    }}>
                                    <Icon my={1} mx={1} as={Ionicons} colorScheme={'blue'} name="chevron-up-outline" size="xl"/>
                                </Pressable>
                        </Stack>
                            <Button.Group pt={2} justifyContent={"center"} >
                                <Button colorScheme="darkBlue" onPress={() => {
                                    setLoading(true)
                                    isModalVisible.value = sumAttribute
                                    changeUserAttribute(isModalVisible, character.id, setLoading, setSumAttribute, toggleModal)
                                }}>{loading ? <Spinner/> : 'Alterar Atributo' }</Button>
                            </Button.Group>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
              </View>            
            </View> : 
            <View>
                <Stack mx={4} direction='row' pl={3} space={'1/5'}>
                    <Text mt={3} fontSize="sm" color="coolGray.600">Grupos de aventureiros</Text>
                    <Link textAlign={'right'} mt={3} fontSize="xs" color="coolGray.600" onPress={() => RootNavigation.navigate('StudentGroup', 'CharacterRpg')}>
                        Visualizar tudo
                    </Link>
                </Stack>
                <Box mb={3} mx={4} borderRadius={20} mt={0.5} px={7} bg="coolGray.100" minH={win.height - (win.height - 440)} minWidth={win.width - (win.width - 7)} shadow={3}>
                    {
                        groups.length > 0 ? groups.map((element, i) => {
                            if(i < 4) {
                                return (
                                    <Box my={4}>
                                        <Pressable onPress={() => RootNavigation.navigate('GroupInfo', {view: 'GroupInfo', data: element})}  justifyContent={"flex-start"} size={"lg"}>
                                            <Box bg={'coolGray.300'} borderRadius={10} shadow={3}>
                                                <Text fontSize={'lg'} pl={3} bold>{element.group_name}</Text>
                                                <Text pl={3} >Número de participantes: {element.student.length}</Text>
                                            </Box>
                                        </Pressable>
                                    </Box>
                                )
                            }
                        }) : <Box><Text color={"coolGray.200"} style={{
                            textAlign: "center",
                            fontSize: 24,
                            paddingTop: 8,
                            marginTop: 13,
                            marginBottom: 25,
                            opacity: 0.7
                        }}>Vazio</Text></Box>
                    }
                </Box>
            </View> 
            }      
          </VStack>
        </Box>
    </NativeBaseProvider>
  );
}

export default CharacterRpg;