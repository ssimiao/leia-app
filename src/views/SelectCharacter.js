import { Box, Stack, Heading, Icon, Select, CheckIcon, WarningOutlineIcon, VStack, HStack, Link, Text, FormControl, Input, Button, Center, NativeBaseProvider, Image, ScrollView, StatusBar, Spinner } from "native-base";
import { Dimensions, StyleSheet } from 'react-native';
import * as RootNavigation from '../app/RootNavigation';
import { useState } from 'react';
import { registerRequest } from "../service/UserService";
import { themeLogin, theme } from '../utils/theme';
import { login } from '../app/reducers/loginSlice';
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system';

const win = Dimensions.get('window');
const ratio = ((win.width) > 290 ? 290 : win.width)/1260;

const styles = StyleSheet.create({
    image_dino: {
        marginRight: 10,
        width: 183,
        height: 199,
        resizeMode: 'stretch'
    },
    icon_dino: {
        width: 50,
        height: 50,
        resizeMode: 'stretch',
        maxWidth: 50
    },
    icon_duck: {
        width: 45,
        height: 45, 
        resizeMode: 'stretch',
        maxWidth: 45
    }
});

export const images = {
  dino_green : 'https://ipfs.filebase.io/ipfs/QmWrAiuprNKPdGgdWwKKLNrpfDbJA8PDeVJxpwCxVpLqBm',
  dino_blue : 'https://ipfs.filebase.io/ipfs/QmUf1hc7HWmfLBMD63smJxUaLSv3JxrfE3vRRR9ggfZGnu',
  duck_green : 'https://ipfs.filebase.io/ipfs/QmWxkWYT7LFmnPZJ91hFo1pjeLaax3fvB4sZoXQFshywZP/duck-green.png',
  owl_brown : 'https://ipfs.filebase.io/ipfs/QmeyCd6S43zFc8QHBe2W5uhcNq3HaEu1aVFcgBArjhHA9E',
  duck_snow : 'https://ipfs.filebase.io/ipfs/QmWxkWYT7LFmnPZJ91hFo1pjeLaax3fvB4sZoXQFshywZP/duck-white.png',
  dino_green_guerreiro: 'https://ipfs.filebase.io/ipfs/QmWxkWYT7LFmnPZJ91hFo1pjeLaax3fvB4sZoXQFshywZP/dino-green-guerreiro.png',
  dino_green_mago: 'https://ipfs.filebase.io/ipfs/QmPEoE6frmoWmsR44BJiZ1NwjfSFYbbdQs1HjHbVykSP7X',
  duck_snow_mago: 'https://ipfs.filebase.io/ipfs/QmWxkWYT7LFmnPZJ91hFo1pjeLaax3fvB4sZoXQFshywZP/duck-white-mage.png',
  dino_blue_mago: 'https://ipfs.filebase.io/ipfs/QmWxkWYT7LFmnPZJ91hFo1pjeLaax3fvB4sZoXQFshywZP/dino-blue-mago.png',
  dino_blue_guerreiro: 'https://ipfs.filebase.io/ipfs/QmWxkWYT7LFmnPZJ91hFo1pjeLaax3fvB4sZoXQFshywZP/dino-cyanblue-guerreiro.png',
  duck_green_mago: 'https://ipfs.filebase.io/ipfs/QmWxkWYT7LFmnPZJ91hFo1pjeLaax3fvB4sZoXQFshywZP/duck-green-mago.png',
  duck_green_guerreiro: 'https://ipfs.filebase.io/ipfs/QmWxkWYT7LFmnPZJ91hFo1pjeLaax3fvB4sZoXQFshywZP/duck-green-guerreiro.png',
  duck_snow_guerreiro: 'https://ipfs.filebase.io/ipfs/QmWxkWYT7LFmnPZJ91hFo1pjeLaax3fvB4sZoXQFshywZP/duck-white-guerreiro.png',
  dino_green_avatar: 'https://ipfs.filebase.io/ipfs/QmWxkWYT7LFmnPZJ91hFo1pjeLaax3fvB4sZoXQFshywZP/dino-green-avatar.jpg'
}

export const imagesHardware = {
  dino_green : 'dino-green-ok-black',
  dino_blue : 'https://ipfs.filebase.io/ipfs/QmUf1hc7HWmfLBMD63smJxUaLSv3JxrfE3vRRR9ggfZGnu',
  duck_green : 'https://ipfs.filebase.io/ipfs/QmWxkWYT7LFmnPZJ91hFo1pjeLaax3fvB4sZoXQFshywZP/duck-green.png',
  owl_brown : 'https://ipfs.filebase.io/ipfs/QmeyCd6S43zFc8QHBe2W5uhcNq3HaEu1aVFcgBArjhHA9E',
  duck_snow : 'https://ipfs.filebase.io/ipfs/QmWxkWYT7LFmnPZJ91hFo1pjeLaax3fvB4sZoXQFshywZP/duck-white.png',
  dino_green_guerreiro: 'dino-green-guerreiro-black',
  dino_green_mago: 'dino-green-mago-ok-black',
  duck_snow_mago: 'https://ipfs.filebase.io/ipfs/QmWxkWYT7LFmnPZJ91hFo1pjeLaax3fvB4sZoXQFshywZP/duck-white-mage.png',
  dino_blue_mago: 'https://ipfs.filebase.io/ipfs/QmWxkWYT7LFmnPZJ91hFo1pjeLaax3fvB4sZoXQFshywZP/dino-blue-mago.png',
  dino_blue_guerreiro: 'https://ipfs.filebase.io/ipfs/QmWxkWYT7LFmnPZJ91hFo1pjeLaax3fvB4sZoXQFshywZP/dino-cyanblue-guerreiro.png',
  duck_green_mago: 'https://ipfs.filebase.io/ipfs/QmWxkWYT7LFmnPZJ91hFo1pjeLaax3fvB4sZoXQFshywZP/duck-green-mago.png',
  duck_green_guerreiro: 'https://ipfs.filebase.io/ipfs/QmWxkWYT7LFmnPZJ91hFo1pjeLaax3fvB4sZoXQFshywZP/duck-green-guerreiro.png',
  duck_snow_guerreiro: 'https://ipfs.filebase.io/ipfs/QmWxkWYT7LFmnPZJ91hFo1pjeLaax3fvB4sZoXQFshywZP/duck-white-guerreiro.png',
}

export const avatar_images = {
  avatar_1: 'https://ipfs.filebase.io/ipfs/QmWxkWYT7LFmnPZJ91hFo1pjeLaax3fvB4sZoXQFshywZP/avatar_1.jpg',
  avatar_2: 'https://ipfs.filebase.io/ipfs/QmWxkWYT7LFmnPZJ91hFo1pjeLaax3fvB4sZoXQFshywZP/avatar_2.jpg',
  avatar_3: 'https://ipfs.filebase.io/ipfs/QmWxkWYT7LFmnPZJ91hFo1pjeLaax3fvB4sZoXQFshywZP/avatar_3.jpg',
  avatar_4: 'https://ipfs.filebase.io/ipfs/QmWxkWYT7LFmnPZJ91hFo1pjeLaax3fvB4sZoXQFshywZP/avatar_4.jpg'
} 

function SelectCharacter(callback) {

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [species, setSpecies] = useState("dino");
  const [color, setColor] = useState("green");
  
  const [error, setError] = useState({
    visible_species_error: false,
    visible_name_error: false,
    visible_color_error: false
  })

  const speciesColor = {
    dino : ["green", "blue"],
    duck : ["green", "snow"]
  }


  const speciesHistory = {
    dino: "Os dinossauros, apesar de sua aparência temível, são pacíficos e valorizam a harmonia em sua comunidade, estão sempre em busca de conhecimento e são muito criativos.",
    duck: "Os patos são soldados treinados desde muito cedo, suas asas longas e fortes proporcionam força para batalhas, enquanto suas patas são adaptadas para a natação.",
    owl: ""
  }
  
  function setSelected(specie) {
    if(species === specie)
        return "gray";
    else
        return "white"
  }

  function getJson() {
    return {
        "name": name,
        "raceId": species,
        "colorId": color
    }
  }

  return (
    <NativeBaseProvider theme={theme}>
      <StatusBar bg="white" barStyle="light-content" />
      <Box safeAreaTop bg="white" />
      <Center flex={1} px="3" bg="white">
        <ScrollView w="100%"> 
            <Center w="100%">

            <Box safeArea p="2" w="90%" maxW="290" pb="8">
              <Heading paddingTop={5} size="lg" color="coolGray.800" _dark={{
              color: "warmGray.50"
            }} fontWeight="semibold">
                Escolha seu Personagem
              </Heading>
              <Heading mt="1" color="coolGray.600" _dark={{
              color: "warmGray.200"
            }} fontWeight="medium" size="xs">
                Ele irá te acompanhar durante a sua jornada
              </Heading>
              </Box>
            </Center>
            
            
            <Center w="100%">
                <Image style={styles.image_dino} source={{uri: images[species + "_" + color]}} alt="Alternate Text" />

              <Box safeArea p="2" w="90%" maxW="290" py="5">

              <Text>{speciesHistory[species]}</Text>

              <Heading pt="4" color="coolGray.600" _dark={{
                  color: "warmGray.200"
                }} fontWeight="medium" size="xs">
                Escolha a especie dele:
              </Heading>

            <Stack direction="row" mb="2.5" mt="1.5" space={'sm'}>
                <Button maxW={60} maxHeight={50} mt="2" style={{backgroundColor: setSelected("dino")}} onPress={() => {
                    setSpecies("dino")
                    setColor("green")
                }}>
                  <Image style={styles.icon_dino} source={require('../../assets/dino-icon.png')} alt="Alternate Text" />
                </Button>
                
                <Button maxW={60} maxHeight={50} mt="2" style={{backgroundColor: setSelected("duck")}} onPress={() => {
                    setSpecies("duck")
                    setColor("green")
                }}>
                  <Image style={styles.icon_duck} source={require('../../assets/duck-icon.png')} alt="Alternate Text" />
                </Button>
            </Stack>

            <Heading mt="1" color="coolGray.600" _dark={{
              color: "warmGray.200"
            }} fontWeight="medium" size="xs">
                Escolha a cor dele:
              </Heading>

            <Stack direction="row" mb="2.5" mt="1.5" space={'sm'}>
                {
                    Object.entries(speciesColor).map(([key, value]) => {
                        if(species === key) {
                            {
                                return value.map((element, i) => {
                                    return <Button minW={50} minHeight={50} mt="2" style={{backgroundColor: element}} onPress={() => setColor(element)}/>
                                })
                            }
                        }
                    })
                }
            </Stack>

            <FormControl>
                  <FormControl.Label style={{justifyContent: "space-between"}}  >Nome do personagem {error.visible_name_error ?  <FormControl.HelperText _text={{fontSize: 'xs'}}>
                    Nome Invalido
                  </FormControl.HelperText> : null }</FormControl.Label>
                  <Input backgroundColor={"coolGray.100"} value={name} onChangeText={name => setName(name)} />
            </FormControl>
            
              <VStack space={3} mt="5">
                <Button mt="2" style={{backgroundColor: "rgba(4, 24, 56, 1)"}} onPress={() => {
                    RootNavigation.navigate("SignUp", getJson())
                    setName("")
                  }}>
                  {loading ? <Spinner size={"lg"} color="coolGray.100" /> : "Continuar"}
                </Button>
              </VStack>
            </Box>
          </Center>
        </ScrollView>
      </Center>
    </NativeBaseProvider>
  )
}

export default SelectCharacter;