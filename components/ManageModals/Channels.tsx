import { Box, Button, Flex, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { v4 as makeId } from "uuid"
import api from "../../lib/api";
import Select from "react-select"
import SelectStyle from "../../styles/selectStyle";

export default function ChannelModal({ onClose, isOpen, doc, guild }) {
    const defaultRule = () => ({
        title: null,
        description: null,
        id: makeId()
    })

    const defaultButton = () => ({
        label: null,
        link: null,
        id: makeId()
    })
    const toast = useToast({
        status: "success",
        isClosable: true,
        variant: "solid",
        position: "bottom-right"
    })

    const channels = guild.channels.filter(c => c.type == "text")

    const [bot, setBot] = useState(doc.bot || [])
    const [youtube, setYoutube] = useState(doc.youtube || [])
    const [links, setLinks] = useState(doc.links || [])
    const [media, setMedia] = useState(doc.media || [])

    const botChannels = channels.filter(c => bot.includes(c.id)).map(c => ({ label: `#${c.name}`, value: c.id }))
    const youtubeChannels = channels.filter(c => youtube.includes(c.id)).map(c => ({ label: `#${c.name}`, value: c.id }))
    const linkChannels = channels.filter(c => links.includes(c.id)).map(c => ({ label: `#${c.name}`, value: c.id }))
    const mediaChannels = channels.filter(c => media.includes(c.id)).map(c => ({ label: `#${c.name}`, value: c.id }))

    const updateRules = async () => {

        await api("/update_doc", "POST", {
            guild: guild._id,
            collection: "channels",
            bot,
            youtube,
            links,
            media
        })

        onClose()

        return toast({
            title: "Channels Updated",
            description: "Your filtered channels were updated!"
        })
    }

    return (
        <Modal size="3xl" onClose={onClose} isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent bg="gray.900">
                <ModalHeader>
                    Manage: Filtered Channels
                    <ModalCloseButton />
                </ModalHeader>
                <ModalBody>
                    <Flex direction="column" gap={5}>
                        <Box>
                            <FormLabel>Bot Command Channels</FormLabel>
                            <Select
                                styles={SelectStyle}
                                isMulti
                                options={channels.map(c => ({
                                    label: `#${c.name}`,
                                    value: c.id
                                }))}
                                onChange={(channels) => {
                                    setBot(channels.map(c=>c.value))
                                }}
                                defaultValue={botChannels}
                            />
                        </Box>

                        <Box>
                            <FormLabel>YouTube Channels</FormLabel>
                            <Select
                                styles={SelectStyle}
                                isMulti
                                options={channels.map(c => ({
                                    label: `#${c.name}`,
                                    value: c.id
                                }))}
                                onChange={(channels) => {
                                    setYoutube(channels.map(c=>c.value))
                                }}
                                defaultValue={youtubeChannels}
                            />
                        </Box>

                        <Box>
                            <FormLabel>Link Channels</FormLabel>
                            <Select
                                styles={SelectStyle}
                                isMulti
                                options={channels.map(c => ({
                                    label: `#${c.name}`,
                                    value: c.id
                                }))}
                                onChange={(channels) => {
                                    setLinks(channels.map(c=>c.value))
                                }}
                                defaultValue={linkChannels}
                            />
                        </Box>

                        <Box>
                            <FormLabel>Media Channels</FormLabel>
                            <Select
                                styles={SelectStyle}
                                isMulti
                                options={channels.map(c => ({
                                    label: `#${c.name}`,
                                    value: c.id
                                }))}
                                onChange={(channels) => {
                                    setMedia(channels.map(c=>c.value))
                                }}
                                defaultValue={mediaChannels}
                            />
                        </Box>
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="green" fontWeight="normal" onClick={updateRules}>Update</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}