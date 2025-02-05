import { Box, useBreakpointValue, useColorMode } from "@chakra-ui/react";
import Head from "next/head";
import { useEffect } from "react";
import Navigation from "./Navigation";

export default function BaseLayout({ pageTitle, navGuild, children }) {
    const { colorMode, setColorMode } = useColorMode()

    useEffect(() => {
        if (colorMode == "dark") setColorMode("light")
    }, [colorMode, setColorMode])

    const NavMargin = "140px"

    return (
        <>

            <Head>
                <title>{pageTitle} - MyProtect</title>
            </Head>

            <Navigation minH={NavMargin} navGuild={navGuild} />

            <Box mt={`calc(${NavMargin} + 20px)`}>
                <main>
                    {children}
                </main>
            </Box>

        </>
    )
}