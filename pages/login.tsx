import { AbsoluteCenter, Button, Flex, Heading } from "@chakra-ui/react";
import { getCsrfToken, signIn } from "next-auth/client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaDiscord } from "react-icons/fa";
import BaseLayout from "../components/BaseLayout";

export default function SignIn({ csrfToken }) {
    const router = useRouter()

    const [isOpened, setOpened] = useState(false)
    const [isClosed, setClosed] = useState(false)

    useEffect(() => {
        if (isClosed) window.location.replace("/dashboard")
    }, [isClosed, router])


    return (
        <BaseLayout pageTitle={"Login"}>
            <AbsoluteCenter alignItems="center">
                <Flex justifyContent="center" alignItems={"center"} direction="column">
                    <Heading>You must login with Discord to continue</Heading>
                    <form method="POST" action="/api/auth/signin/discord" target="result" id="signInFORM">
                        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
                        <input name="callbackUrl" type="hidden" defaultValue="/close" />
                    </form>
                    <Button my={5} color="white" bg="#5966f2" _hover={{
                        bg: "#2c3bed"
                    }} leftIcon={<FaDiscord />} onClick={() => {
                        const win = window.open('', 'result', 'width=500,height=805');
                        document.getElementById('signInFORM').submit();
                        setOpened(true)
                        const Inter = setInterval(() => {
                            try {
                                const name = win?.location.name
                                win?.close()
                            } catch {
                                null
                            }
                            setClosed(win.closed)
                            
                        }, 1000)
                    }} isLoading={isOpened} loadingText="Waiting for Authorization...">Login with Discord</Button>
                </Flex>
            </AbsoluteCenter>
        </BaseLayout>
    )
}

export async function getServerSideProps(context) {
    const csrfToken = await getCsrfToken(context)
    return {
        props: { csrfToken },
    }
}