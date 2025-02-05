import type { AppProps } from 'next/app'
import { ChakraProvider, Image } from '@chakra-ui/react'
import { Flex } from '@chakra-ui/layout'
import theme from '../styles/theme'
import Router from "next/router"
import Head from "next/head"
import { useEffect, useState } from 'react'
import { ThemeProvider } from '@mui/material'
import muiTheme from '../styles/mui'

import "../styles/majorClasses.css"

function MyApp({ Component, pageProps }: AppProps) {

  const [isLoading, setLoading] = useState(false)

  Router.events.on('routeChangeStart', (url) => {
    setLoading(true)
  })

  Router.events.on('routeChangeComplete', (url) => {
    setLoading(false)
  })

  return (
    <ThemeProvider theme={muiTheme}>
      <ChakraProvider resetCSS theme={theme}>
        <Head>
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css" integrity="sha512-42kB9yDlYiCEfx2xVwq0q7hT4uf26FUgSIZBK8uiaEnTdShXjwr8Ip1V4xGJMg3mHkUt9nNuTDxunHF0/EgxLQ==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        </Head>
        {isLoading && (
          <Image alt="loading" src="/loading.svg" boxSize="50px" position="fixed" bottom="10px" right="10px" draggable="false" />
        )}
        <Flex flexDirection="column" minH="100vh">
          <Component {...pageProps} />
        </Flex>
      </ChakraProvider>
    </ThemeProvider>
  )
}

export default MyApp