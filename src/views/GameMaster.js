import {Box, Button, Center, Icon, Image, NativeBaseProvider, Spinner, View, VStack} from "native-base";
import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {theme} from '../utils/theme';
import {Ionicons} from "@expo/vector-icons";
import TypeWriter from "@sucho/react-native-typewriter";

const win = Dimensions.get('window');
const ratio = ((win.width) > 290 ? 290 : win.width) / 1260;

export default function GameMaster({navigation}) {

    const BACKGROUND = '#263238'
    const WHITE = '#ffffff'
    const PINK = '#c2185b'

    const [loading, setLoading] = useState(false);
    const styles = StyleSheet.create({
        image: {
            width: (win.width) > 200 ? 200 : win.width,
            height: 818 * (ratio), //362 is actual height of image
            resizeMode: 'stretch',
            maxWidth: 220
        },
        container: {
            padding: 15,
            justifyContent: 'center',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: '#6d6d6d'
        },
        typeWriterText: {
            fontSize: 13,
        },
        typeWriterCursorText: {
            color: WHITE,
            fontSize: 13,
        }
    });

    return (
        <NativeBaseProvider theme={theme}>
            <Center flex={1} px="3" bg="white">
                <Center w="100%">
                    <View style={styles.container}>
                        <TypeWriter
                            textArray={['Olá viajante, do que precisa?']}
                            speed={20}
                            delay={50}
                            textStyle={styles.typeWriterText}
                            cursorStyle={styles.typeWriterCursorText}
                        />
                    </View>
                    <Icon as={Ionicons} name="caret-down-outline" size="sm"/>
                    <Center>
                        <TouchableOpacity onPress={() => toggleModal()}>
                            <Center py="3">
                                <Image style={styles.image} source={require('../../assets/toucan.png')}
                                       alt="Alternate Text"/>
                            </Center>
                        </TouchableOpacity>
                    </Center>
                    <Box safeArea p="2" w="90%" maxW="290">
                        <VStack space={3} mt="5">
                            <Button mt="2" colorScheme="orange" onPress={() => console.log()}>
                                {loading ? <Spinner size={"lg"} color="warning.500"/> : "Classes disponiveis"}
                            </Button>
                            <Button mt="2" colorScheme="orange" onPress={() => console.log()}>
                                {loading ? <Spinner size={"lg"} color="warning.500"/> : "Desafios"}
                            </Button>
                            <Button mt="2" colorScheme="orange" onPress={() => console.log()}>
                                Me explique o sistema de classes
                            </Button>
                        </VStack>
                    </Box>
                </Center>
            </Center>
        </NativeBaseProvider>
    )
}