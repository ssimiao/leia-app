import { TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { NativeBaseProvider, Spinner, Button, Pressable, ScrollView, FormControl, Input, VStack, View, Box, Stack, StatusBar, Text, Center, Image, Flex, Progress, IconButton, Icon, Link, Heading} from "native-base";
import * as RootNavigation from '../app/RootNavigation';
import { theme } from '../utils/theme';
import CharacterStatus from '../components/CharacterStatus';
import {FontAwesome5} from "@expo/vector-icons";
import BookReading from '../components/BookReading';
import { Ionicons } from "@expo/vector-icons";
import { SvgUri } from 'react-native-svg';
import { useState } from 'react';
import { addBookToUserRead, getBook } from '../service/UserService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as InMemoryCache from "../service/InMemoryStorageService"
import MapView from 'react-native-maps';

const win = Dimensions.get('window');

function Map(callback) {

  const [loading, setLoading] = useState(false);
  const [loadingScan, setLoadingScan] = useState(false);

  const [isbn, setIsbn] = useState("");
  const [book, setBook] = useState({});

  return (
    <NativeBaseProvider>
        <StatusBar bg="white" barStyle="light-content" />
        <Box safeAreaTop bg="black" />
        <Center backgroundColor={'coolGray.100'} style={{ padding: 10 }}>
          <Heading>Mapa</Heading>
          <Text>Visite Bibliotecas e ganhe recompensas</Text>
				</Center>
        <MapView style={{'width': '100%', 'height': '100%'}} />

    </NativeBaseProvider>
  );
}

export default Map;