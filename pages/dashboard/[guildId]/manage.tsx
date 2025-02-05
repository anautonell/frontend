import { Box, Button, Flex, Icon, Text, useDisclosure } from "@chakra-ui/react"
import { getSession } from "next-auth/client"
import BaseLayout from "../../../components/BaseLayout"
import { FetchBotGuilds, FetchGuildDoc } from "../../../lib/DbUtils"
import Config from "../../../config.json"
import { Modules } from "../../../lib/Modules"
import { FaCog } from "react-icons/fa"
import api from "../../../lib/api"
import RuleModal from "../../../components/ManageModals/Rules"
import ChannelModal from "../../../components/ManageModals/Channels"

export default function GuildDashboard({ session, guild, docs }) {

    console.log(docs)

    const ManageBox = ({ name, description, doc, Modal, col }) => {

        const { isOpen, onOpen, onClose } = useDisclosure()
    
        return (
            <Flex alignItems="center" justifyContent="space-between" w="50vw" p={8} bg="gray.800" rounded="md">
                <Box>
                    <Text fontSize="1.5vw" fontWeight="bold">{name}</Text>
                    <Text fontSize=".9vw" color="gray">{description}</Text>
                </Box>
    
                <Icon cursor="pointer" as={FaCog} fontSize="2.5vw" onClick={onOpen} />
    
                {Modal && <Modal guild={guild} onClose={onClose} isOpen={isOpen} doc={doc} />}
            </Flex>
        )
    }

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
                    <Flex wrap="wrap" m={5} gap={5} direction="column" alignItems="center">
                        <ManageBox name={"Rules"} description="manage the server rules." doc={docs.rules} Modal={RuleModal} col={"rules"} />
                    </Flex>

                    <Flex wrap="wrap" m={5} gap={5} direction="column" alignItems="center">
                        <ManageBox name={"Filtered Channels"} description="secure channel content." doc={docs.channels} Modal={ChannelModal} col={"channels"} />
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

    const module = new Modules(guild._id)
    const moduleSettings = await module.get()

    const rules = await FetchGuildDoc(guild._id, "rules")
    const channels = await FetchGuildDoc(guild._id, "channels")
    const phishing_links = await FetchGuildDoc(guild._id, "phishing_links")

    return {
        props: {
            session,
            guild: guild || null,
            docs: {
                rules: Object.keys(rules) == 0 ? { rules: [], buttons: [] } : rules,
                channels: await FetchGuildDoc(guild._id, "channels"),
                phishing_links: await FetchGuildDoc(guild._id, "phishing_links")
            }
        }
    }
}