import { Dimensions, StyleSheet } from 'react-native';
import { NativeBaseProvider, Button, Pressable, Spinner, ScrollView, FormControl, Input, VStack, View, Box, Stack, StatusBar, Text, Center, Image, Flex, Progress, IconButton, Icon, Link, Heading} from "native-base";
import * as RootNavigation from '../app/RootNavigation';
import { theme } from '../utils/theme';
import CharacterStatus from '../components/CharacterStatus';
import {FontAwesome5} from "@expo/vector-icons";
import BookReading from '../components/BookReading';
import { Ionicons } from "@expo/vector-icons";
import { SvgUri } from 'react-native-svg';
import { useState } from 'react';
import { getScore } from '../service/BookService';
import { postBook, showMessageDefault } from '../service/UserService';
import { getPredictBook } from '../service/TeacherService';


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

function ReviewBook(componentParams) {

    const [loading, setLoading] = useState(false);
    const [review, setReview] = useState({probability:0});
    const [id, setId] = useState();
    const [text, setText] = useState();

    function getScoreView() {
        if (review.probability >= 90) 
            return <Box mx={5} pb={3} pt={3}>
                        <Button style={{backgroundColor: "#A87D54"}} shadow={3} onPress={() => { 
                                postBook(id, text, setLoading)
                                setLoading(true)
                            }}>{loading ? <Spinner size={"sm"} color="warmGray.100" /> : "Recomendar"}
                            </Button>
                        <Text mx={3} pt={1} color={'success.500'}>O livro foi aceito pelo nosso motor de recomendação! Pode recomendar :D</Text>
                    </Box>
        else if (review.probability > 80 && review.probability < 90)
            return <Center><Text>O livro precisa de uma segunda recomendação.</Text></Center>
        else if(review.probability > 1 && review.probability <= 80)
            return <Center><Text>Infelizmente o livro recomendado não está de acordo com os nossos parâmetros. :/</Text></Center>
        else
            return <Button mt="3" mx={5} style={{backgroundColor: "#A87D54"}} onPress={() => {
                setLoading(true);
            
                /*getScore({
                    "isbn": id,
                    "text": text
                })*/
                getPredictBook(text).then(response => {
                    if (response.ok) {
                        setReview(response.data)
                    } else {
                        showMessageDefault("Erro na busca do score do livro.")
                    }
                    setLoading(false)
                    console.log(response.data)
                })
            }}>
                {loading ? <Spinner size={"sm"} color="warmGray.100" /> : "Buscar Avaliação"}
            </Button>
    }

  return (
    <NativeBaseProvider>
        <StatusBar bg="white" barStyle="light-content" />
        <Box safeAreaTop bg="black" />
        <Box borderTopRadius={10} minHeight={win.height} w="100%" maxWidth={win.width} bg="#A87D54" safeArea>

          <VStack pt={3} px="1" w="100%">
            <View w="100%">
                <Center>
                    <Heading color={'warmGray.100'}>Curadoria e Recomendação</Heading>
                    <Box minW={380} minH={500} mt={'1'} borderRadius={'10'} bg={'coolGray.100'} shadow={3}>
                        <Center minH={20}>
                            <Image mt={10} style={styles.image} source={require('../../assets/owl_review.png')} alt="Alternate Text" />
                        </Center>

                        <Box mt={5} px={5}>
                            <Text>O livro precisa ser adequado para:</Text>
                            <Text>- crianças entre 7 a 11 anos.</Text>
                        </Box>

                        <Center mt={1} mx={5}>
                            <FormControl>
                                <Input backgroundColor={"coolGray.100"} placeholder="Nome/ISBN" onChangeText={data => setId(data)} />
                            </FormControl>
                            <FormControl pt={3}>
                                <Input backgroundColor={"coolGray.100"} placeholder="Trecho de no mínimo 100 palavras do livro" onChangeText={text => setText(text)} />
                            </FormControl>
                        </Center>

                        {
                            getScoreView()
                        }
                    </Box>
                </Center>
            </View>      
          </VStack>
        </Box>
    </NativeBaseProvider>
  );
}

export default ReviewBook;