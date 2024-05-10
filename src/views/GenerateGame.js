import { Dimensions, StyleSheet } from 'react-native';
import { NativeBaseProvider, Select, Button, Pressable, Spinner, ScrollView, FormControl, Input, VStack, View, Box, Stack, StatusBar, Text, Center, Image, Flex, Progress, IconButton, Icon, Link, Heading} from "native-base";
import * as RootNavigation from '../app/RootNavigation';
import { theme } from '../utils/theme';
import CharacterStatus from '../components/CharacterStatus';
import {FontAwesome5} from "@expo/vector-icons";
import BookReading from '../components/BookReading';
import { Ionicons } from "@expo/vector-icons";
import { SvgUri } from 'react-native-svg';
import { useState } from 'react';
import { getScore } from '../service/BookService';
import { postBookChallenge, showMessageDefault } from '../service/UserService';


const win = Dimensions.get('window');

const styles = StyleSheet.create({
    image: {
      width: 200,
      height: 190, //362 is actual height of image
      resizeMode: 'stretch',
      maxWidth: 258
    },
    icon: {
        width: 50,
        height: 50, //362 is actual height of image
        resizeMode: 'stretch',
        maxWidth: 100
    }
});

function GenerateGame(callback) {

    const [loading, setLoading] = useState(false);
    const [gameType, setGameType] = useState();
    const [manualGame, setManualGame] = useState(false);
    const [quiz, setQuiz] = useState();
    const [primeiraAlternativa, setPrimeiraAlternativa] = useState();
    const [segundaAlternativa, setSegundaAlternativa] = useState();
    const [terceiraAlternativa, setTerceiraAlternativa] = useState();
    const [quartaAlternativa, setQuartaAlternativa] = useState();
    const [alternativaCorreta, setAlternativaCorreta] = useState();
    const [dicaPalavra, setDicaPalavra] = useState();
    const [words, setWords] = useState();


    function getAlternativaCorreta() {
        return {
            a : primeiraAlternativa,
            b : segundaAlternativa,
            c : terceiraAlternativa,
            d : quartaAlternativa,
        }
    }

    function manualGameForm() {
        if(gameType === "memory")
            return  <Box mx={5}>
                    <Text>Não implementado. :/</Text>
                    {
                        decisionGame()
                    }
                </Box>
        else if(gameType === "caça palavras")
            return  <Box mx={5}>
                    <FormControl my={1}>
                        <Input backgroundColor={"coolGray.100"} placeholder="Dica que ajude a identificar as palavras" onChangeText={dica => setDicaPalavra(dica)} />
                    </FormControl>
                    <FormControl>
                        <Input backgroundColor={"coolGray.100"} placeholder="Palavras neste formato: Corrida/Ciclismo/Ciclista" onChangeText={words => setWords(words)} />
                    </FormControl>
                    {
                        decisionGame()
                    }
                </Box>
        else if(gameType === "quiz") {
            return  <Box px={5}>
                        <FormControl my="1">
                            <Input backgroundColor={"coolGray.100"} placeholder="Qual a pergunta?" onChangeText={quiz => setQuiz(quiz)} />
                        </FormControl>
                        <FormControl my="1">
                            <Input backgroundColor={"coolGray.100"} placeholder="Alternativa A" onChangeText={alternativa => setPrimeiraAlternativa(alternativa)} />
                        </FormControl>
                        <FormControl my="1">
                            <Input backgroundColor={"coolGray.100"} placeholder="Alternativa B" onChangeText={alternativa => setSegundaAlternativa(alternativa)}  />
                        </FormControl>
                        <FormControl my="1">
                            <Input backgroundColor={"coolGray.100"} placeholder="Alternativa C" onChangeText={alternativa => setTerceiraAlternativa(alternativa)}  />
                        </FormControl>
                        <FormControl my="1">
                            <Input backgroundColor={"coolGray.100"} placeholder="Alternativa D" onChangeText={alternativa => setQuartaAlternativa(alternativa)} />
                        </FormControl>
                        <FormControl>
                            <Select backgroundColor={"coolGray.100"} onValueChange={alternativa => setAlternativaCorreta(alternativa)} minWidth="200" accessibilityLabel="Choose Service" placeholder="Alternativa Correta" _selectedItem={{
                                    bg: "teal.600"
                                    }} my="1">
                                <Select.Item label="A" value="a" />
                                <Select.Item label="B" value="b" />
                                <Select.Item label="C" value="c" />
                                <Select.Item label="D" value="d" />
                            </Select>
                        </FormControl>
                        {
                            decisionGame()
                        }
                    </Box>
        }
    }

    
    function decisionGame() {
        return <Stack direction={'row'} space={'2'} mx={5}>
            <Button shadow={3} minW={'150'} my="2" style={{backgroundColor: "#A87D54"}} onPress={() => { 
                    setManualGame(true)
                    postBookChallenge({
                        "challenge_type": gameType,
                        "quiz": {
                            "question": quiz,
                            "answers": [primeiraAlternativa, segundaAlternativa, terceiraAlternativa, quartaAlternativa],
                            "correct": getAlternativaCorreta()[alternativaCorreta],
                            "time": 60    
                        }
                    } , setLoading)
                    setLoading(true)
                }}>
                {loading ? <Spinner size={"sm"} color="coolGray.100" /> : "Cadastrar desafio"}
            </Button>
            <Button shadow={3} minW={'150'} my="2" style={{backgroundColor: "#A87D54"}} onPress={() => { 
                        setManualGame(false)
                        setLoading(false)
                    }}>
                Voltar
            </Button>
        </Stack>
    }

  return (
    <NativeBaseProvider>
        <StatusBar bg="white" barStyle="light-content" />
        <Box safeAreaTop bg="black" />
        <Box borderTopRadius={10} minHeight={win.height} w="100%" maxWidth={win.width} bg="#A87D54" safeArea>

          <VStack pt={3} px="1" w="100%">

            <View w="100%">
                <Center>
                    <Heading color={'warmGray.100'}>Criação de desafios</Heading>
                    <Box minW={380} minH={500} mt={'1'} borderRadius={'10'} bg={'coolGray.100'} shadow={3}>
                        <Center minH={20}>
                            <Image mt={10} style={styles.image} source={require('../../assets/owl_game.png')} alt="Alternate Text" />
                        </Center>

                        <Center mt={5} mx={5}>

                            <FormControl>
                                <Select backgroundColor={"coolGray.100"} onValueChange={gameType => setGameType(gameType)} minWidth="200" accessibilityLabel="Choose Service" placeholder="Selecione um jogo" _selectedItem={{
                                        bg: "teal.600"
                                        }} my="1">
                                    <Select.Item label="Jogo da memoria" value="memory" />
                                    <Select.Item label="Caça Palavras" value="search" />
                                    <Select.Item label="Quiz" value="quiz" />
                                </Select>
                            </FormControl>
                        </Center>
                        { 
                            manualGame ? manualGameForm() :
                            <Stack direction={'row'} space={'2'} mx={7}>
                                <Button minW={'150'} mt="2" style={{backgroundColor: "#A87D54"}} onPress={() => setManualGame(true)}>
                                    {loading ? <Spinner size={"sm"} color="warning.500" /> : "Criar Desafio Manual"}
                                </Button>
                                <Button minW={'150'} mt="2" style={{backgroundColor: "#A87D54"}} onPress={() => {}}>
                                    {loading ? <Spinner size={"sm"} color="warning.500" /> : "Gerar Desafio"}
                                </Button>
                            </Stack>
                        }
                    </Box>
                </Center>
            </View>      
          </VStack>
        </Box>
    </NativeBaseProvider>
  );
}

export default GenerateGame;