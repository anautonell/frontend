import { Box, Button, Checkbox, Divider, Flex, Heading, Icon, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Tab, TabList, TabPanel, TabPanels, Tabs, Text, useToast } from "@chakra-ui/react"
import { getSession } from "next-auth/client"
import BaseLayout from "../../../components/BaseLayout"
import { FetchBotGuilds } from "../../../lib/DbUtils"
import Config from "../../../config.json"
import { Modules } from "../../../lib/Modules"
import { FaCheck, FaChessRook, FaDatabase, FaFish, FaHammer, FaHandPaper, FaMailBulk } from "react-icons/fa"
import Switch from "react-switch"
import api from "../../../lib/api"
import { useState } from "react"
import { useRouter } from "next/router"


export default function GuildDashboard({ session, guild }) {
    const router = useRouter()

    const [tabIndex, setTabIndex] = useState(0)
    const toast = useToast({
        status: "success",
        isClosable: true,
        variant: "solid",
        position: "bottom-right"
    })

    const [mod, setMod] = useState(false)
    const [rules, setRules] = useState(false)
    const [backups, setBackups] = useState(false)
    const [antiRaid, setAntiRaid] = useState(false)
    const [antiPhishing, setAntiPhishing] = useState(false)
    const [hook, setHook] = useState(false)
    const [cp, setCP] = useState(false)


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
                <BaseLayout pageTitle={`Setup ${guild.name}`} navGuild={guild}>
                    <Flex justifyContent="center" alignItems="center" direction="column" m={2}>
                        <Text fontSize="3vw">Setting up: {guild.name}</Text>
                        <Divider my={2} />


                        <Tabs index={tabIndex} isLazy>
                            <TabPanels>
                                <TabPanel>
                                    <Flex direction="column" justifyContent="center" alignItems="center">
                                        <Text fontSize="20px" textAlign="center">
                                            {"Welcome to MyProtect! MyProtect Protects your Server from Mass-Mention and Webhook raids. Setup MyProtect's Dashboard for your server by completing this short guide!"}
                                        </Text>

                                        <Button colorScheme="green" my={5} onClick={() => setTabIndex(1)}>Continue</Button>
                                    </Flex>
                                </TabPanel>

                                <TabPanel>
                                    <Flex direction="column" justifyContent="center" alignItems="center">
                                        <Text fontSize="25px" textAlign="center">
                                            {"Module: Moderation"}
                                        </Text>

                                        <Text fontSize="18px" textAlign="center">
                                            {"The Moderation module enables ban, warn, and kick commands through MyProtect, as well as a purge command. Moderation commands are restricted to users with the appropriate permissions, and won't be accessible by anyone else. This way, you can punish rule breakers easily."}
                                        </Text>

                                        <Text my={5}><span style={{ transform: "translateY(-10px)" }}>Enable:</span> <Checkbox transform="translateY(4px)" value={mod} height={15} onChange={async () => {
                                            const newStatus = await api("/modules/toggle", "POST", {
                                                guild: guild._id,
                                                module: "Moderation",
                                                status: true
                                            })


                                            setMod(true)

                                            toast({
                                                title: "Module Enabled",
                                                description: "You have enabled Moderation for your server!"
                                            })
                                        }} /></Text>

                                        <Button colorScheme="green" my={5} onClick={() => setTabIndex(2)}>Continue</Button>
                                    </Flex>
                                </TabPanel>

                                <TabPanel>
                                    <Flex direction="column" justifyContent="center" alignItems="center">
                                        <Text fontSize="25px" textAlign="center">
                                            {"Module: Rules"}
                                        </Text>

                                        <Text fontSize="18px" textAlign="center">
                                            {"The Rules module allows you to add rules for your server and present them in a nice and appealing way. With an easy setup from both through the Dashboard and the Bot."}
                                        </Text>

                                        <Text my={5}><span style={{ transform: "translateY(-10px)" }}>Enable:</span> <Checkbox transform="translateY(4px)" value={mod} height={15} onChange={async () => {
                                            const newStatus = await api("/modules/toggle", "POST", {
                                                guild: guild._id,
                                                module: "Rules",
                                                status: true
                                            })


                                            setRules(true)

                                            toast({
                                                title: "Module Enabled",
                                                description: "You have enabled Rules for your server!"
                                            })
                                        }} /></Text>

                                        <Button colorScheme="green" my={5} onClick={() => setTabIndex(3)}>Continue</Button>
                                    </Flex>
                                </TabPanel>

                                <TabPanel>
                                    <Flex direction="column" justifyContent="center" alignItems="center">
                                        <Text fontSize="25px" textAlign="center">
                                            {"Module: Backups"}
                                        </Text>

                                        <Text fontSize="18px" textAlign="center">
                                            {"The Backups module creates and stores backups for your server every 12 hours, which you can restore in case your server got nuked."}
                                        </Text>

                                        <Text my={5}><span style={{ transform: "translateY(-10px)" }}>Enable:</span> <Checkbox transform="translateY(4px)" value={mod} height={15} onChange={async () => {
                                            const newStatus = await api("/modules/toggle", "POST", {
                                                guild: guild._id,
                                                module: "Backups",
                                                status: true
                                            })


                                            setBackups(true)

                                            toast({
                                                title: "Module Enabled",
                                                description: "You have enabled Backups for your server!"
                                            })
                                        }} /></Text>

                                        <Button colorScheme="green" my={5} onClick={() => setTabIndex(4)}>Continue</Button>
                                    </Flex>
                                </TabPanel>

                                <TabPanel>
                                    <Flex direction="column" justifyContent="center" alignItems="center">
                                        <Text fontSize="25px" textAlign="center">
                                            {"Module: Anti Raid"}
                                        </Text>

                                        <Text fontSize="18px" textAlign="center">
                                            {"The Anti Raid module detects possible raids happening on your server and bans the appropriate users."}
                                        </Text>

                                        <Text my={5}><span style={{ transform: "translateY(-10px)" }}>Enable:</span> <Checkbox transform="translateY(4px)" value={mod} height={15} onChange={async () => {
                                            const newStatus = await api("/modules/toggle", "POST", {
                                                guild: guild._id,
                                                module: "AntiRaid",
                                                status: true
                                            })


                                            setAntiRaid(true)

                                            toast({
                                                title: "Module Enabled",
                                                description: "You have enabled Anti Raid for your server!"
                                            })
                                        }} /></Text>

                                        <Button colorScheme="green" my={5} onClick={() => setTabIndex(5)}>Continue</Button>
                                    </Flex>
                                </TabPanel>

                                <TabPanel>
                                    <Flex direction="column" justifyContent="center" alignItems="center">
                                        <Text fontSize="25px" textAlign="center">
                                            {"Module: Anti Raid"}
                                        </Text>

                                        <Text fontSize="18px" textAlign="center">
                                            {"The Anti Phishing module scans and deletes possible scam links sent by users."}
                                        </Text>

                                        <Text my={5}><span style={{ transform: "translateY(-10px)" }}>Enable:</span> <Checkbox transform="translateY(4px)" value={mod} height={15} onChange={async () => {
                                            const newStatus = await api("/modules/toggle", "POST", {
                                                guild: guild._id,
                                                module: "AntiPhishing",
                                                status: true
                                            })


                                            setAntiPhishing(true)

                                            toast({
                                                title: "Module Enabled",
                                                description: "You have enabled Anti Phishing for your server!"
                                            })
                                        }} /></Text>

                                        <Button colorScheme="green" my={5} onClick={() => setTabIndex(6)}>Continue</Button>
                                    </Flex>
                                </TabPanel>

                                <TabPanel>
                                    <Flex direction="column" justifyContent="center" alignItems="center">
                                        <Text fontSize="25px" textAlign="center">
                                            {"Module: Webhook Protection"}
                                        </Text>

                                        <Text fontSize="18px" textAlign="center">
                                            {"The Webhook Protection modules deletes all webhooks that have been possibly violated and used in unethical ways."}
                                        </Text>

                                        <Text my={5}><span style={{ transform: "translateY(-10px)" }}>Enable:</span> <Checkbox transform="translateY(4px)" value={mod} height={15} onChange={async () => {
                                            const newStatus = await api("/modules/toggle", "POST", {
                                                guild: guild._id,
                                                module: "Webhooks",
                                                status: true
                                            })


                                            setHook(true)

                                            toast({
                                                title: "Module Enabled",
                                                description: "You have enabled Webhook Protection for your server!"
                                            })
                                        }} /></Text>

                                        <Button colorScheme="green" my={5} onClick={() => setTabIndex(7)}>Continue</Button>
                                    </Flex>
                                </TabPanel>

                                <TabPanel>
                                    <Flex direction="column" justifyContent="center" alignItems="center">
                                        <Text fontSize="25px" textAlign="center">
                                            {"Module: Filtered (Special) Channels"}
                                        </Text>

                                        <Text fontSize="18px" textAlign="center">
                                            {"Enable the Special Channels module to restrict specific channel content to its topic."}
                                        </Text>

                                        <Text my={5}><span style={{ transform: "translateY(-10px)" }}>Enable:</span> <Checkbox transform="translateY(4px)" value={mod} height={15} onChange={async () => {
                                            const newStatus = await api("/modules/toggle", "POST", {
                                                guild: guild._id,
                                                module: "ContentProtect",
                                                status: true
                                            })


                                            setCP(true)

                                            toast({
                                                title: "Module Enabled",
                                                description: "You have enabled Filtered Channels for your server!"
                                            })
                                        }} /></Text>

                                        <Button colorScheme="green" my={5} onClick={() => setTabIndex(8)}>Continue</Button>
                                    </Flex>
                                </TabPanel>

                                <TabPanel>
                                    <Flex direction="column" justifyContent="center" alignItems="center">
                                        <Text fontSize="20px" textAlign="center">
                                            {"Setup complete! Your modules have been set-up! Click the button to proceed in the Dashboard!"}
                                        </Text>

                                        <Button colorScheme="blue" my={5} onClick={() => router.push(`/dashboard/${guild._id}`)}>Go to Dashboard</Button>
                                    </Flex>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Flex>

                    <Box position="absolute" bottom="30px" left="20px" right="20px">
                        <Slider value={tabIndex} min={0} max={8} onChange={(e) => setTabIndex(e)}>
                            <SliderTrack bg="transparent">
                                <SliderFilledTrack bg="#162d5a" />
                            </SliderTrack>
                            <SliderThumb>
                            </SliderThumb>
                        </Slider>
                    </Box>
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

    return {
        props: {
            session,
            guild: guild || null
        }
    }
}