import { extendTheme } from "@chakra-ui/react"
import { createBreakpoints, mode } from "@chakra-ui/theme-tools"

const breakpoints = createBreakpoints({
    xs: "25em",
    sm: "30em",
    md: "48em",
    lg: "62em",
    xl: "80em",
    "2xl": "96em",
})

const components = {
}

export const colors = {
    background: "#121212",
    brand: {
        pink: "#ff6de2",
        blueGray: "#3d4f65",
        lightBlack: "#151412",
        blue: {
            50: '#dcf8ff',
            100: '#aee2ff',
            200: '#7cc9ff',
            300: '#4aadff',
            400: '#1a8eff',
            500: '#0083e6',
            600: '#0072b4',
            700: '#005b82',
            800: '#003d51',
            900: '#001921',
        },
    }
}

const fonts = {
    body: "Poppins"
}

const config: ThemeConfig = {
    initialColorMode: 'light',
    useSystemColorMode: false,
}


const styles = {
    global: (props) => ({
        "::-webkit-scrollbar": {
            width: "5px",
            height: "5px"
        },
        "::-webkit-scrollbar-thumb": {
            background: "gray",
            borderRadius: "30px"
        },
        "::-webkit-scrollbar-track": {
            background: "transparent"
        },
        body: {
            bg: "background",
            color: "white",
            overflowX: "hidden",
            fontFamily: "Poppins"
        }
    })
}

const theme = extendTheme({
    components,
    fonts,
    breakpoints,
    styles,
    colors,
    config
})

export default theme