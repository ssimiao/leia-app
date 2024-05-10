import { Box, Heading, AspectRatio, Image, Text, Center, HStack, Stack, NativeBaseProvider } from "native-base";
import * as RootNavigation from '../app/RootNavigation';
import { theme } from '../utils/theme';


function BookReading(props) {
    return (
        <NativeBaseProvider theme={theme}>
            <Box maxW="100%" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1">
                <Stack p="4" space={3}>
                    <Stack space={2}>
                        <Heading size="md" ml="-1">
                        {props.title}
                        </Heading>
                        <Text fontSize="xs" fontWeight="500" ml="-0.5" mt="-1">
                        {props.author}
                        </Text>
                    </Stack>
                    <Text fontWeight="400">
                       Páginas: {props.pages}
                    </Text>
                    <HStack alignItems="center" space={4} justifyContent="space-between">
                        <HStack alignItems="center">
                            {
                                props.categories.map((element) => {
                                    return (<Text color="coolGray.600" fontWeight="400">{element} </Text>)
                                })
                            }
                        </HStack>
                    </HStack>
                </Stack>
            </Box>
        </NativeBaseProvider>
    );
}

export default BookReading;