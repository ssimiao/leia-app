import { Dimensions, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { NativeBaseProvider, Radio, Button, ScrollView, Divider, VStack, View, Box, Stack, StatusBar, Text, Center, Image, Flex, Progress, IconButton, Icon, Link, Heading, Input, HStack} from "native-base";
import * as RootNavigation from '../app/RootNavigation';
import { theme } from '../utils/theme';
import CharacterStatus from '../components/CharacterStatus';
import {FontAwesome5} from "@expo/vector-icons";
import BookReading from '../components/BookReading';
import { Ionicons } from "@expo/vector-icons";
import React, {useState, useEffect} from 'react';
import { captureChallengeResult, resolveChallenge, showMessageDefault } from '../service/UserService';
import _ from 'lodash';


const win = Dimensions.get('window');

const styles = StyleSheet.create({
    image: {
      width: 195,
      height: 257, //362 is actual height of image
      resizeMode: 'stretch',
    },
    image_memory: {
        width: 192,
        height: 165,
        resizeMode: 'stretch',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    header1: {
        fontSize: 36,
        marginBottom: 10,
        color: 'green',
    },
    header2: {
        fontSize: 18,
        marginBottom: 20,
        color: 'black',
        fontWeight: 'bold',
    },
    matchText: {
        fontSize: 18,
        color: 'black',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    },
    card: {
        width: 110,
        height: 110,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFD700',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'black',
    },
    cardFlipped: {
        backgroundColor: 'white',
    }
  });

    const randomArrFunction = (arr) => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j =
                Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

  const gameCardsFunction = (challengeParse, challengeType) => {
    if(challengeType === "quiz" || challengeType === "search")
        return {}
    const assets = String(challengeParse).split("|")
    const images = [
        assets[0],
        assets[0],
        assets[1],
        assets[1],
        assets[2],
        assets[2],
        assets[3],
        assets[3],
    ];

    const randomImages =
        randomArrFunction(images);

    return randomImages.map(
        (image, index) => ({
            id: index,
            symbol: image,
            isFlipped: false,
        }));
};

function Challenge(navigation) {

    const [read, setRead] = useState(navigation.route.params);  
    const [challenge, setChallenge] = useState(_.sample(read.book.challenge));  
    const [challengeParse, setChallengeParse] = useState(challenge.challenge_type === "memory" ? challenge.challenge : JSON.parse(challenge.challenge));  
    
    const [myTime, setMyTime] = useState(new Date());
    const [timer, setTimer] = useState(0);
    const [refreshData, setRefresh] = useState(0);

    //Variaveis Jogo da Memoria
    const [cards, setCards] = useState(gameCardsFunction(challengeParse, challenge.challenge_type));
    const [selectedCards, setSelectedCards] = useState([]);
    const [matches, setMatches] = useState(0);
    const [gameWon, setGameWon] = useState(false);
    const [chooses, setChooses] = useState(0);
    //

    //Variaveis Caça Palavra
    const [wordsDiscover, setWordsDiscover] = useState([])
    const [newWordsDiscover, setNewWordsDiscover] = useState([])
    const [wordSearchMatriz, setWordSearchMatriz] = useState([])
    //

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
    
    function validAnswer(choose) {
        if(choose != undefined && choose === challengeParse.correct) {
            showMessageDefault("Resposta Correta! Vamos te levar te volta pra tela do seu personagem")
            resolveChallenge(read.id, read.user.id)
        } else {
            showMessageDefault("Resposta Errada. Talvez na próxima tentativa você consiga!")
            captureChallengeResult(read.user.id, "F")
            RootNavigation.navigate('CharacterRpg')
        }
    }
    
    function refresh() {
        if(wordsDiscover !== newWordsDiscover)
            setNewWordsDiscover(wordsDiscover)
    }

    function handleWon(message) {
        showMessageDefault(message)
        resolveChallenge(read.id, read.user.id)
    }

    function gameType() {
        if (challenge.challenge_type === "quiz") {
            return <Box minW={350} mx={10} mt={'20'} borderRadius={'10'} bg={'coolGray.100'} shadow={3}>
                        <Center mx={5}>
                            <Image ml={5} style={styles.image} source={require('../../assets/think.png')} alt="Imagem" />
                        </Center>
                        <Heading bold pt={3} mx={5}>{challengeParse.question}</Heading>
                        <Box mx={5} mb={5}>
                            <Button minW={'150'} mt="2" color={"#65B3FE"} onPress={() => {
                                    validAnswer(challengeParse.answers[0])
                            }}>
                                {challengeParse.answers[0]}
                            </Button>
                            <Button minW={'150'} mt="2" color={"#65B3FE"} onPress={() => {
                                    validAnswer(challengeParse.answers[1])
                                }}>
                                {challengeParse.answers[1]}
                            </Button>
                            <Button minW={'150'} mt="2" color={"#65B3FE"} onPress={() => {
                                    validAnswer(challengeParse.answers[2])
                                }}>
                                {challengeParse.answers[2]}
                            </Button>
                            <Button minW={'150'} mt="2" color={"#65B3FE"} onPress={() =>
                                {
                                    validAnswer(challengeParse.answers[3])
                                }
                                }>
                                {challengeParse.answers[3]}
                            </Button>
                        </Box>
                    </Box>
        } else if (challenge.challenge_type === "search" ) {
            wordSearchMapPopulate()
            if(Array.from(challengeParse.words).every(word => wordsDiscover.includes(word))) {
                setWordsDiscover([])
                resolveChallenge(read.id, read.user.id)
                showMessageDefault("Parabéns, você concluiu o desafio! Vamos te levar te volta pra tela do seu personagem")
            }

            useEffect(() => {
                var timerID = setInterval(() => {
                    if (timer >= 60) {
                        captureChallengeResult(read.user.id, "F")
                        showMessageDefault("Você não conseguiu completar o desafio no tempo certo.")
                        RootNavigation.navigate('CharacterRpg')
                    } else {
                        setTimer(timer + 1)
                        tick()
                    }
                }, 1000);
                
                return () => clearInterval(timerID);
            });
            
            function tick() {
                setMyTime(new Date());
            }

            return <Box>
                        <Center mb={3}>
                            <Heading mt={20} bold pt={3} mx={5}>Caça Palavras</Heading>
                            <Text>Dica: {challengeParse.hint} | {challengeParse.words.length} palavras</Text>
                            <Text>Tempo: {timer}/60 segundos</Text>
                        </Center>
                        <Box minW={380} mx={10} borderRadius={'10'} bg={'coolGray.100'} shadow={3}>
                            <Center>
                                {
                                    wordSearchMatriz.map((element, i) => {
                                        return <Text fontSize="lg" style={{ letterSpacing: 5 }}>{element}</Text>
                                    })
                                }
                            </Center>
                        </Box>
                        <Input mx={10} mt={3} onChangeText={text => {
                            if((challengeParse.words.includes(text) || challengeParse.words.includes(text.toUpperCase()) ) && 
                                (!wordsDiscover.includes(text) || !wordsDiscover.includes(text.toUpperCase())) ) {
                                wordsDiscover.push(text.toUpperCase())
                                setWordsDiscover(wordsDiscover)
                                setRefresh(refreshData + 1)
                                showMessageDefault(`Você encontrou a palavra: ${text}`)
                            } 
                        }}></Input>
                        {
                            refresh()
                        }
                        
                        <Text bold mt={3} mx={10}>Palavras encontradas: </Text>
                        {
                            wordsDiscover.map((element) => {
                                if(challengeParse.words.includes(element) || challengeParse.words.includes(element.toUpperCase())) {
                                    return <Text mx={10}>{element}</Text>
                                }
                            })
                        }
                    </Box>
        } else if (challenge.challenge_type === "memory" ) {
            const cardClickFunction = (card) => {
                if (!gameWon && selectedCards.length < 2
                    && !card.isFlipped) {
                    const updatedSelectedCards =
                        [...selectedCards, card];
                    const updatedCards =
                        cards.map((c) =>
                            c.id ===
                                card.id ?
                                { ...c, isFlipped: true } : c
                        );
                    setSelectedCards(updatedSelectedCards);
                    setCards(updatedCards);
                    if (updatedSelectedCards.length === 2) {
                        if (updatedSelectedCards[0].symbol ===
                            updatedSelectedCards[1].symbol) {
                            setMatches(matches + 1);
                            setSelectedCards([]);
                            if (matches + 1 === cards.length / 2) {
                                setGameWon(true);
                            }
                        } else {
                            setTimeout(() => {
                                const flippedCards =
                                    updatedCards.map((c) =>
                                        updatedSelectedCards.some((s) =>
                                            s.id === c.id) ?
                                            { ...c, isFlipped: false } : c
                                    );
                                setSelectedCards([]);
                                setCards(flippedCards);
                            }, 3000);
                        }
                    }
                    setChooses(chooses + 1)
                }
            };

            useEffect(() => {
                if (matches === cards.length / 2) {
                    setGameWon(true);
                } 
            }, [matches]);
        
            if (chooses >= 16) {
                setTimeout(() => {
                    showMessageDefault("Você não conseguiu completar o desafio.")
                    captureChallengeResult(read.user.id, "F")
                    RootNavigation.navigate('CharacterRpg')
                }, 3000);
            }

            return <View >
                <Center marginTop={5} style={styles.header2}>
                    <Text fontSize={'2xl'} bold>Jogo da memoria</Text>
                    <Text>Giros feitos: {chooses}/16</Text>
                </Center>
                {gameWon ? handleWon("Você completou o jogo da memoria com sucesso! Vamos te levar te volta pra tela do seu personagem") : (
                    <View style={styles.grid}>
                        {cards.map((card) => (
                            <TouchableOpacity
                                key={card.id}
                                style={
                                    [styles.card,
                                    card.isFlipped && styles.cardFlipped]}
                                onPress={() => cardClickFunction(card)}
                            >
                                {card.isFlipped ?
                                    <Image style={{height: 90, width: 90, resizeMode: 'stretch'}} source={{uri: card.symbol}} alt="Imagem"></Image> : null}
                            </TouchableOpacity>
                        ))}
                        </View>
                    )}
                    <Center mt={5} mx={5}>
                        <Image ml={5} style={styles.image_memory} source={require('../../assets/robot_memory.png')} alt="Imagem" />
                    </Center>
                </View>
        }
    }

    function wordSearchMapPopulate() {
        if(wordSearchMatriz == null || wordSearchMatriz.length == 0) {
            const mapOfWord = challengeParse.words.map((element, i) => {
                const position = getRandomInt(0, 19 - element.length)
                var row = randStr(position) + element
                if(row.length !== 19) {
                    row = row + randStr(19 - row.length)
                }
                return row
            })
            setWordSearchMatriz(mapOfWord)
        }
    }

    function randStr(len, chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ') {
        let s = '';
        while (len--) s += chars[Math.floor(Math.random() * chars.length)];
        return s;
    }

    return (
        <NativeBaseProvider>
            <StatusBar backgroundColor={'white'} barStyle="dark-content" />
            <Box w="100%" maxWidth={win.width} height={win.height} bg={'white'}>
                <Box paddingTop={2} px={win.width - (win.width - 7)}>
                    <Stack direction={'row'} space={"1/6"}>
                        <IconButton pr={3}  icon={<Icon size="2xl" color="#49454F" as={Ionicons} name="arrow-back"/>}/>
                        <Text mt={3} ml={9} minW={'50'} fontSize={'lg'}>Desafio</Text>
                    </Stack>
                </Box>
                
                <Center>
                    {
                        gameType()
                    }
                </Center>
            </Box>
        </NativeBaseProvider>
    );
}

export default Challenge;