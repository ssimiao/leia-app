import { NativeBaseProvider, Box, Button, Text, View, Modal, FormControl, Input, Icon, Center, ScrollView  } from "native-base";
import React, { useState, useEffect } from 'react';
import { Camera } from 'expo-camera';
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity} from "react-native";

export default function Scan({ navigation }) {
    const flashOff = Camera.Constants.FlashMode.off;
    const flashOn = Camera.Constants.FlashMode.torch;
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [flash, setFlash] = useState(flashOff);
  
    const toggleFlash = () => {
      setFlash(flash === flashOff ? flashOn : flashOff);
    };
  
    useEffect(() => {
      const getBarCodeScannerPermissions = async () => {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === 'granted')
      };
  
      getBarCodeScannerPermissions();
    }, []);
  
    const handleBarCodeScanned = ({ type, data }) => {
      setScanned(true);
      alert(`Barcode com o tipo de dado ${type} e valor ${data} foi scaneado!`);
    };
  
    if (hasPermission === null) {
      return <NativeBaseProvider><Text>Habilite a permissão da camera</Text></NativeBaseProvider>;
    } else if (hasPermission === false) {
      return <NativeBaseProvider><Text>Sem acesso a camera</Text></NativeBaseProvider>;
    }
  
    return (
      <NativeBaseProvider style={{ flex: 1 }}>
        <Camera  style={{ flex: 1, justifyContent: "flex-end" }}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          flashMode={flash}
        >
          
          <TouchableOpacity style={{ marginBottom: 40, marginLeft: 40 }} onPress={() => toggleFlash()}>
            <Icon as={Ionicons} name="flashlight" size="10" />
          </TouchableOpacity>
          
  
        </Camera>
        {scanned && <Button title={'Escanear novamente'} onPress={() => setScanned(false)} />}
      </NativeBaseProvider>
    );
  }