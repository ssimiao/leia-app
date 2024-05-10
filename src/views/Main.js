import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import Login from './Login';
import SignUp from './SignUp';
import Initial from './Initial';
import MainTab from '../components/tabs/Main';
import Person from "./Person";
import Home from './Home';
import CharacterRpg from './CharacterRpg';
import BookShelf from './BookShelf';
import Challenge from './Challenge';
import BookInfo from './BookInfo';
import AddBook from './AddBook';
import Forge from './Forge';
import Goals from './Goals';
import SelectCharacter from './SelectCharacter';
import ReviewBook from './ReviewBook';
import GenerateGame from './GenerateGame';
import GroupInfo from './GroupInfo';
import Bluetooth from './Bluetooth';
import MemoryGame from './MemoryGame';

const Stack = createNativeStackNavigator();

function Main() {
  const isLogged = useSelector((state) => state.login.isLogged);
  const initialRoute = isLogged === true ? "Home" : "Login";
  console.log(initialRoute);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={"Initial"}>
    { isLogged === false ? (
      <>       
        <Stack.Screen name="Initial" component={Initial} />
        <Stack.Screen name="MemoryGame" component={MemoryGame} />
        <Stack.Screen name="MainTab" component={MainTab} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Person" component={Person} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Challenge" component={Challenge} />
        <Stack.Screen name="BookInfo" component={BookInfo} />
        <Stack.Screen name="SignUp" component={SignUp} />       
        <Stack.Screen name="AddBook" component={AddBook} />       
        <Stack.Screen name="Forge" component={Forge} />       
        <Stack.Screen name="Goals" component={Goals} />       
        <Stack.Screen name="SelectCharacter" component={SelectCharacter} />       
        <Stack.Screen name="GenerateGame" component={GenerateGame} />       
        <Stack.Screen name="GroupInfo" component={GroupInfo} />       
        <Stack.Screen name="Bluetooth" component={Bluetooth} />       
      </>
    ) : (
      <>
        <Stack.Screen name="MemoryGame" component={MemoryGame} />
        <Stack.Screen name="CharacterRpg" component={CharacterRpg} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="BookShelf" component={BookShelf} />
        <Stack.Screen name="Challenge" component={Challenge} />
        <Stack.Screen name="BookInfo" component={BookInfo} />
        <Stack.Screen name="SignUp" component={SignUp} />       
        <Stack.Screen name="AddBook" component={AddBook} />       
        <Stack.Screen name="Forge" component={Forge} />       
        <Stack.Screen name="Goals" component={Goals} />       
        <Stack.Screen name="SelectCharacter" component={SelectCharacter} />       
        <Stack.Screen name="ReviewBook" component={ReviewBook} />       
        <Stack.Screen name="Bluetooth" component={Bluetooth} />       
        <Stack.Screen name="GenerateGame" component={GenerateGame} />     
      </>
    )} 
    </Stack.Navigator>    
  )    
}

export default Main;