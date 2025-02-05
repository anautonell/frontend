import { Avatar, Flex, ScaleFade, Text, Tooltip } from "@chakra-ui/react";
import BaseLayout from "../../components/BaseLayout";
import { getSession } from "next-auth/client";
import { FetchBotGuilds } from "../../lib/DbUtils";
import { GetGuildIcon } from "../../lib/Utils"
import { useRouter } from "next/router";

export default function DashboardIndex({ session }) {

    const router = useRouter()

    return (
        <BaseLayout pageTitle={"Dashboard"}>
            <Flex justifyContent="center">
                <Avatar
                    w="100px"
                    h="auto"
                    src={session.user.image}
                    className="animate"
                    name={session.user.name}
                />
            </Flex>
            <Text mt={"20.5px"} className="animate" textAlign="center" fontSize={{
                base: "5vw",
                sm: "25px"
            }}>{session.user.name}, select a server!</Text>

            <Flex wrap="wrap" mt="3vw" p={10} justifyContent="center">
                {session.guilds.map((guild, index) => (
                    <ScaleFade key={`guild-${guild.id}`} initialScale={.4} in={true} delay={1 + index / 10}>
                        <Tooltip label={guild.name} bg="black" fontWeight="semibold" hasArrow>
                            <Avatar cursor="pointer" className="animate" src={GetGuildIcon(guild)} name={guild.name} boxSize="80px" m={3} _hover={{
                                transform: "scale(1.1)"
                            }} onClick={() => router.push(`/dashboard/${guild.id}`)} />
                        </Tooltip>
                    </ScaleFade>
                ))}
            </Flex>
        </BaseLayout>
    )
}

export const getServerSideProps = async (ctx) => {

    const session = await getSession(ctx)

    if (!session) return {
        redirect: {
            destination: "/login",
            permanent: false
        }
    }

    return {
        props: {
            session
        }
    }
}