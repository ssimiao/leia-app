import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  Alert,
  View,
  FlatList,
  Platform,
  StatusBar,
  SafeAreaView,
  NativeModules,
  useColorScheme,
  TouchableOpacity,
  NativeEventEmitter,
  PermissionsAndroid,
  StyleSheet
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {DeviceList} from './DeviceList';
import { Box, Button, Center, Heading, NativeBaseProvider, Image } from 'native-base';
import { showMessageDefault } from '../service/UserService';
import LottieView from 'lottie-react-native';
import { Buffer } from 'buffer';
import { imagesHardware } from './SelectCharacter';


const BleManagerModule = NativeModules.BleManager;
const BleManagerEmitter = new NativeEventEmitter(BleManagerModule);

function Bluetooth(componentParams) {
  const [char, setChar] = useState(componentParams.route.params);
  const peripherals = new Map();
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState([]);
  const [connectedInfo, setConnectedInfo] = useState("");
  const [discoveredDevices, setDiscoveredDevices] = useState([]);
  const [isConnect, setIsConnect] = useState(false);
  const animation = useRef(null);
  
  function handleGetConnectedDevices() {
    BleManager.getConnectedPeripherals([]).then(results => {
      for (let i = 0; i < results.length; i++) {
        let peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
      }
    });
  };

  function initBluetooth()  {
    BleManager.enableBluetooth().then(() => {
      console.log('Bluetooth is turned on!');
    });
    
    BleManager.start({showAlert: false}).then(() => {
      console.log('BleManager initialized');
      showMessageDefault("BleManager iniciou")
      handleGetConnectedDevices();
    }).catch(() => {
      showMessageDefault("BleManager não iniciou")
    });
    
    let stopDiscoverListener = BleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      peripheral => {
        if (peripheral != undefined) {
          peripherals.set(peripheral.id, peripheral);
          setDiscoveredDevices(Array.from(peripherals.values()));
        }
      },
    );

    let stopConnectListener = BleManagerEmitter.addListener(
      'BleManagerConnectPeripheral',
      peripheral => {
        console.log('BleManagerConnectPeripheral:', peripheral);
      },
    );

    let stopScanListener = BleManagerEmitter.addListener(
      'BleManagerStopScan',
      () => {
        setIsScanning(false);
        console.log('scan stopped');
      },
    );

    if (Platform.OS === 'android' && Platform.Version < 31) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(result => {
            if (result) {
              console.log('User accepted');
            } else {
              console.log('User refused');
            }
          });
        }
      });
    } else if (Platform.OS === 'android' && Platform.Version >= 31) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          ).then(result => {
            if (result) {
              console.log('User accepted');
            } else {
              console.log('User refused');
            }
          });
        }
      });

      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          ).then(result => {
            if (result) {
              console.log('User accepted');
            } else {
              console.log('User refused');
            }
          });
        }
      });

      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(result => {
        if (result) {
          console.log('Permission is OK');
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(result => {
            if (result) {
              console.log('User accepted');
            } else {
              console.log('User refused');
            }
          });
        }
      });
  }
    return () => {
      stopDiscoverListener.remove();
      stopConnectListener.remove();
      stopScanListener.remove();
    };
  };
  
  function startScan() {
    if (!isScanning) {
      BleManager.scan([], 5, true)
        .then(() => {
          console.log('Scanning...');
          setIsScanning(true);
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  function connectToPeripheral(peripheral) {
    BleManager.connect(peripheral.id)
      .then(() => {
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
        setDiscoveredDevices(Array.from(peripherals.values()));
        console.log("connected to esp")
      })
      .catch((reason) => {
        console.log("failed to connect to esp: " + reason)
      });
  };

  function disconnectFromPeripheral(peripheral) {
    BleManager.disconnect(peripheral.id)
      .then(() => {
        peripheral.connected = false;
        peripherals.set(peripheral.id, peripheral);
        setConnectedDevices(Array.from(peripherals.values()));
        setDiscoveredDevices(Array.from(peripherals.values()));
        console.log("disconnect")
      })
      .catch(() => {
        console.log("failed to disconnect")
      });
  };
  
  const styles = StyleSheet.create({
    image: {
      width: 310,
      height: 160,
      resizeMode: 'stretch'
    },
    icon: {
        width: 50,
        height: 50,
        resizeMode: 'stretch',
        maxWidth: 100
    }
});

  function getImage() {
    if(isConnect)
      return <Image style={styles.image} source={require('../../assets/wireless-on.png')} alt="Conectado" />
    else if(isScanning)
      return <LottieView
          autoPlay
          ref={animation}
          style={{
            width: 320,
            height: 160,
          }}
          source={require('../../assets/wireless-animation.lottie.json')}
        />
    else
      return <Image style={styles.image} source={require('../../assets/wireless-off.png')} alt="Sem conexão" />
  }

  setTimeout(() => {
    if (connectedDevices.length > 0) {
      BleManager.retrieveServices(connectedDevices[0].id).then((peripheralInfo) => {
        BleManager.read(connectedDevices[0].id, "1b9d0504-79f2-11ee-b962-0242ac120002", "e7ca6c9c-79f3-11ee-b962-0242ac120002").then((dataConsole) => {
          setConnectedInfo(Buffer.from(dataConsole).toString())
          showMessageDefault(Buffer.from(dataConsole).toString())
        }).catch((reason) => {
          showMessageDefault("Erro ao tentar sincronizar os dados")
        })
      }).catch((reason) => {
        showMessageDefault("Falhou ao tentar ler dados do console via bluetooth")
      })
    }
  }, 5000);

  return (
    <NativeBaseProvider>
      <SafeAreaView>
        <StatusBar barStyle={'dark-content'}/>
        <View style={{pdadingHorizontal: 20, backgroundColor: '#fff', height: '100%' }}>
          <Center pb={3}>
            <Heading pb={5}>
              Transferência de dados
            </Heading>
            {
              getImage()
            }
          </Center>
          <Box px={3}>
            <Button
              activeOpacity={0.5}
              onPress={() => initBluetooth()}>
              <Text>
                Iniciar Módulo Bluetooth
              </Text>
            </Button>

            <Button
              mt={5}
              paddingTop={5}
              activeOpacity={0.5}
              onPress={() => startScan()}>
              <Text>
                {isScanning ? 'Conectando...' : 'Conectar no console'}
              </Text>
            </Button>

            <Button
              mt={5}
              paddingTop={5}
              activeOpacity={0.5}
              onPress={() => connectedDevices.length > 0 ?
                BleManager.retrieveServices(connectedDevices[0].id).then((peripheralInfo) => {
                  BleManager.write(connectedDevices[0].id, "1b9d0504-79f2-11ee-b962-0242ac120002", "e7ca6c9c-79f3-11ee-b962-0242ac120002",
                   Buffer.from(JSON.stringify({
                    "username": char.user.username,
                    "character": {
                      "name": char.name,
                      "class_name": char.classe.name,
                      "race": char.race.name,
                      "level": char.level,
                      "coins": char.coins,
                      "quests": [],
                      "attributes": [
                        {
                          "id": "forca",
                          "name": "Forca",
                          "points": char.force_attribute,
                          "color" : "#FFF"
                        },
                        {
                          "id": "destreza",
                          "name": "Destreza",
                          "points": char.dex_attribute,
                          "color" : "#FFF"
                        },
                        {
                          "id": "constituicao",
                          "name": "Constituicao",
                          "points": 10,
                          "color" : "#FFF"
                        },
                        {
                          "id": "inteligencia",
                          "name": "Inteligencia",
                          "points": char.intelligence_attribute,
                          "color" : "#FFF"
                        },
                        {
                          "id": "sabedoria",
                          "name": "Sabedoria",
                          "points": 10,
                          "color" : "#FFF"
                        },
                        {
                          "id": "carisma",
                          "name": "Carisma",
                          "points": char.charisma_attribute,
                          "color" : "#FFF"
                        },
                        {
                          "id": "resistence",
                          "name": "Resistencia",
                          "points": char.resistence_attribute,
                          "color" : "#FFF"
                        },
                        ,
                        {
                          "id": "agility",
                          "name": "Agilidade",
                          "points": char.agility_attribute,
                          "color" : "#FFF"
                        }
                      ],
                      "inventory": [
                        {
                          "id": "/pocao_vermelha.bmp",
                          "name": "Pocao Vermelha",
                          "quantity": char.potions
                        }
                      ],
                      "images": [
                        {
                          "type": "character",
                          "name": `/${imagesHardware[char.race.name + "_" + char.race.color + (char.classe.name != "Novato" ? "_" + char.classe.name : "")]}.bmp`
                        }
                      ]
                    }
                  })).toJSON().data).then(() => {
                    showMessageDefault("Dados enviados pro console com sucesso.")
                  }).catch((reason) => {
                    showMessageDefault("Erro ao tentar sincronizar os dados")
                  })
                }).catch((reason) => {
                  showMessageDefault("Falhou ao tentar conectar no console via bluetooth")
                }) : null}>
              <Text>
                Tranferir dados
              </Text>
            </Button>

            <Button
              mt={5}
              paddingTop={5}
              activeOpacity={0.5}
              onPress={() => connectedDevices.length > 0 ?
                BleManager.isPeripheralConnected(connectedDevices[0].id).then((isConnected) => {
                  if (isConnected) {
                    setConnectedInfo("Peripheral conectado: " + JSON.stringify(connectedDevices[0]))
                  } else {
                    BleManager.connect(connectedDevices[0].id).then(() => {
                      console.log("Connected");
                      showMessageDefault("Peripheral conectado: ")
                    })
                    .catch((error) => {
                      console.log("Não conectou " + error);
                      showMessageDefault("Peripheral não conectado com erro")
                    });
                  }
                }) : null}>
              <Text>
                Validar se está conectado no console
              </Text>
            </Button>
            
            { 
              discoveredDevices.length > 0 ? discoveredDevices.map((value, index) => {
                if(String(value.name).toUpperCase() == "ESP32_BLE" && isScanning) {
                  connectToPeripheral(value)
                }
              }) : null
            }
            
            <Box mt={10} bgColor={'blueGray.500'} rounded={10} shadow={3} py={2}>
              <Text>
                Conectado no console:
              </Text>
              {connectedDevices.length > 0 ? connectedDevices.map((value, index) => {
                
                return <Text>{value.id} : {value.name} : {value.characteristics} : {value.services} : {value.serviceUUIDs}</Text>
              }
              ) : (
                <Text>Sem conexão</Text>
              )}
            </Box>
            
            <Text>{connectedInfo}</Text>
          </Box>

        </View>
      </SafeAreaView>
    </NativeBaseProvider>
  );
}

export default Bluetooth;
