import { Box, Button, Flex, Icon, Text } from "@chakra-ui/react"
import { getSession } from "next-auth/client"
import BaseLayout from "../../../components/BaseLayout"
import { FetchBotGuilds, FetchGuildDoc } from "../../../lib/DbUtils"
import Config from "../../../config.json"
import { FaHammer, FaPlus, FaUser } from "react-icons/fa"
import { BsChatFill } from "react-icons/bs"

const StatBox = ({ icon, color, data, label }) => {

    return (
        <Flex minW="90px" w="max-content" h="auto" bg={color} p={5} rounded="md" justifyContent="space-between" gap={5} alignItems="center" className="animate">
            <Flex direction="column" justifyContent="center" alignItems="center" className="animate">
                <Text className="animate" fontSize="2.5vw" textAlign="center">{data}</Text>
                <Text className="animate" fontSize="1vw" textAlign="center" wordBreak={"break-all"}>{label}</Text>
            </Flex>

            <Icon as={icon} fontSize="4vw"  className="animate" />

        </Flex>
    )
}

export default function GuildDashboard({ session, guild }) {

    console.log(guild)

    return (
        <>
            {!guild && (
                <BaseLayout pageTitle={"Bot not in Guild"}>
                    <Flex alignItems="center" justifyContent="center" direction="column">
                        <Text fontSize="2.5vw" textAlign="center">{"To access this guild's Dashboard, you must invite it in the server!"}</Text>
                        <Button
                            colorScheme="brand.blue"
                            onClick={() => window.open(`https://discord.com/api/oauth2/authorize?client_id=${Config.clientId}&permissions=8&scope=bot%20applications.commands`)}
                            h="60px"
                            w="200px"
                            m={2}
                        >
                            Invite Bot
                        </Button>
                    </Flex>
                </BaseLayout>
            )}
            {guild && (
                <BaseLayout pageTitle={guild.name} navGuild={guild}>
                    <Flex wrap="wrap" justifyContent="center" alignItems="center" direction="row" gap={5}>
                        <StatBox label={"Server Members"} color={"#1e65f5"} data={guild.member_count} icon={FaUser} />
                        <StatBox label={"Banned Members"} color={"#f64f52"} data={guild.ban_count} icon={FaHammer} />
                        <StatBox label={"Invites Created"} color={"#37ef48"} data={guild.invite_count} icon={FaPlus} />
                        <StatBox label={"Server Channels"} color={"#e646f3"} data={guild.channels.length} icon={BsChatFill} />
                    </Flex>
                </BaseLayout>
            )}
        </>
    )
}

export const getServerSideProps = async (ctx) => {

    const session = await getSession(ctx)
    const { guildId } = ctx.query
    let userGuild

    if (session) userGuild = session.guilds.find(g => g.id == guildId)

    if (!session || !userGuild) return {
        redirect: {
            destination: "/login",
            permanent: false
        }
    }

    const botGuilds = await FetchBotGuilds()

    let guild = botGuilds.find(g => g._id == guildId) || null

    if (guild) {
        guild = {
            ...guild,
            roles: guild.roles.map(role => ({
                ...role,
                permissions: role.permissions.toString()
            }))
        }
    }

    const isFirst = await FetchGuildDoc(guild._id, "modules")

    if (Object.keys(isFirst).length == 0) return {
        redirect: {
            destination: `/dashboard/${guild._id}/quicksetup`,
            permanent: false
        }
    }

    return {
        props: {
            session,
            guild: guild || null
        }
    }
}