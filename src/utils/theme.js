import { extendTheme } from "native-base";

export const themeLogin = extendTheme({
    fontConfig: {
        GrenzeGotisch: {
            100: {
            normal: "GrenzeGotisch_100Thin",
            },
            200: {
            normal: "GrenzeGotisch_200ExtraLight",
            },
            300: {
            normal: "GrenzeGotisch_300Light",
            },
            400: {
            normal: "GrenzeGotisch_400Regular",
            },
            500: {
            normal: "GrenzeGotisch_500Medium",
            },
            600: {
            normal: "GrenzeGotisch_600SemiBold",
            },
            700: {
            normal: "GrenzeGotisch_700Bold",
            },
            800: {
            normal: "GrenzeGotisch_800ExtraBold",
            },
            900: {
            normal: "GrenzeGotisch_900Black",
            },
        },
    },
    // Make sure values below matches any of the keys in `fontConfig`
    fonts: {
        heading: "GrenzeGotisch",
        body: "GrenzeGotisch",
        mono: "GrenzeGotisch",
    },
});

export const theme = extendTheme({
    fontConfig: {
        Oswald: {
            200: {
            normal: "Oswald_200ExtraLight",
            },
            300: {
            normal: "Oswald_300Light",
            },
            400: {
            normal: "Oswald_400Regular",
            },
            500: {
            normal: "Oswald_500Medium",
            },
            600: {
            normal: "Oswald_600SemiBold",
            },
            700: {
            normal: "Oswald_700Bold",
            },
        },
    },
    // Make sure values below matches any of the keys in `fontConfig`
    fonts: {
        heading: "Oswald",
        body: "Oswald",
        mono: "Oswald",
    },
});