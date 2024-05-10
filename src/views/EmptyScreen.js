import { NativeBaseProvider, View, StatusBar, Box } from "native-base";

function EmptyScreen() {
    return (
      <NativeBaseProvider>
        <StatusBar bg="white" barStyle="light-content" />
        <Box safeAreaTop bg="white" />
        <View />
      </NativeBaseProvider>);
}

export default EmptyScreen;