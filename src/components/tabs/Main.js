import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome5, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import {Stack, View} from "native-base";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import GameMaster from "../../views/GameMaster";
import Login from "../../views/Login";
import Scan from "../../views/Scan";
import { useSelector } from 'react-redux';
import * as InMemoryCache from "../../service/InMemoryStorageService"
import CharacterRpg from '../../views/CharacterRpg';
import BookShelf from '../../views/BookShelf';
import Configuration from '../../views/Configuration';
import Map from '../../views/Map';
import ReviewBook from '../../views/ReviewBook';
import StudentGroup from '../../views/StudentGroup';
import Forge from '../../views/Forge'

const Tab = createBottomTabNavigator();

function MainTab(componentParams) {
  
  const user_type = componentParams.route.params.user.user_type;

  var char = componentParams.route.params
  InMemoryCache.getJson("char").then(characterCache => {
    if (characterCache != null) {
      char = characterCache
    }
  })

  function showUserTabButton() {
    console.log(user_type)
    return user_type === "Aluno";
  }

  console.log(showUserTabButton())
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              let iconType;
  
              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
                iconType = 'Ionicons';
              } else if (route.name === 'BookShelf') {
                iconName = focused ? 'library' : 'library-outline';
                iconType = 'Ionicons';
              } else if (route.name === 'CharacterRpg') {
                iconName = 'user-shield';
                iconType = 'FontAwesome5';
              } else if (route.name === 'Master') {
                iconName = 'human-white-cane';
                iconType = 'MaterialCommunityIcons';
              } else if (route.name === 'Forge') {
                iconName = 'shop';
                iconType = 'Entypo';
              } else if (route.name === 'Configuration') {
                iconName = focused ? 'build' : 'build-outline';
                iconType = 'Ionicons';
              } else if (route.name === 'Map') {
                iconName = focused ? 'map' : 'map-outline';
                iconType = 'Ionicons';
              } else if (route.name === 'ReviewBook') {
                iconName = focused ? 'reader' : 'reader-outline';
                iconType = 'Ionicons';
              } else if (route.name === 'StudentGroup') {
                iconName = focused ? 'people' : 'people-outline';
                iconType = 'Ionicons';
              }

              if (iconType === 'Ionicons') {
                return <Ionicons name={iconName} size={size} color={color} />;
              } else if (iconType === 'FontAwesome5') {
                return <FontAwesome5 name={iconName} size={size} color={color} />;  
              } else if (iconType === 'Entypo') {
                return <Entypo name={iconName} size={size} color={color} />;  
              }
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;  
            },
            tabBarActiveTintColor: '#041838',
            tabBarInactiveTintColor: '#a3a3a3',
            tabBarLabelStyle: {
              fontFamily: 'Oswald_400Regular'
            }
          })} >
            {
              showUserTabButton() ? <>
                <Tab.Screen name="CharacterRpg" component={CharacterRpg} initialParams={componentParams.route.params} options={{tabBarLabel:'Personagem', headerShown: false}}/>
                <Tab.Screen name="BookShelf" component={BookShelf} options={{tabBarLabel:'Missões', headerShown: false}}/>
                <Tab.Screen name="Forge" component={Forge} initialParams={{"id": char.user.id, "race": char.race.name, "color": char.race.color}}  options={{tabBarLabel:'Guilda', headerShown: false}}/>
                <Tab.Screen name="Configuration" component={Configuration} initialParams={componentParams.route.params}  options={{tabBarLabel:'Configuração', headerShown: false}}/>
              </> :
              <>
                <Tab.Screen name="CharacterRpg" component={CharacterRpg} initialParams={componentParams.route.params} options={{tabBarLabel:'Personagem', headerShown: false}}/>
                {user_type === 'Professor' ? <Tab.Screen name="ReviewBook" component={ReviewBook}   options={{tabBarLabel:'Recomendações', headerShown: false}}/> : null }
                <Tab.Screen name="StudentGroup" component={StudentGroup} initialParams={componentParams.route.params}  options={{tabBarLabel:'Grupos', headerShown: false}}/>
                <Tab.Screen name="Configuration" component={Configuration} initialParams={componentParams.route.params}  options={{tabBarLabel:'Configuração', headerShown: false}}/>
              </>
            }
        </Tab.Navigator>
    );
}

export default MainTab;