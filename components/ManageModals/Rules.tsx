import { Box, Button, Flex, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { v4 as makeId } from "uuid"
import api from "../../lib/api";


export default function RuleModal({ onClose, isOpen, doc, guild }) {
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

    const [title, setTitle] = useState(doc.title || "")
    const [description, setDescription] = useState(doc.description || "")
    const [authorName, setAuthorName] = useState(doc.authorName || "")
    const [authorIcon, setAuthorIcon] = useState(doc.authorIcon || "")
    const [imageUrl, setImageUrl] = useState(doc.imageUrl || "")
    const [color, setColor] = useState(doc.color || "")
    const [rules, setRules] = useState([...doc.rules.map((rule => ({ ...rule, id: makeId() }))), defaultRule()])
    const [buttons, setButtons] = useState([...doc.buttons.map((button => ({ ...button, id: makeId() }))), defaultButton()])

    const updateRules = async () => {
        try {
            if (authorIcon) new URL(authorIcon)
            if (imageUrl) new URL(imageUrl)
        } catch {
            return toast({
                status: "error",
                title: "Link Invalid",
                description: "Make sure the links you enter are valid."
            })
        }

        await api("/update_doc", "POST", {
            guild: guild._id,
            collection: "rules",
            title,
            description,
            authorName,
            authorIcon,
            imageUrl,
            color,
            rules: rules.map(rule => ({ title: rule.title, description: rule.description })).filter(rule => rule.title && rule.description),
            buttons: buttons.map(button => ({ label: button.label, link: button.link })).filter(button => button.label && button.link)
        })

        onClose()

        return toast({
            title: "Rules Updated",
            description: "Your server rules were updated!"
        })
    }

    return (
        <Modal size="3xl" onClose={onClose} isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent bg="gray.900">
                <ModalHeader>
                    Manage: Rules
                    <ModalCloseButton />
                </ModalHeader>
                <ModalBody>
                    <Flex direction="column" gap={5}>
                        <Box>
                            <FormLabel>Title</FormLabel>
                            <Input placeholder="Enter title..." defaultValue={title} onChange={(e) => setTitle(e.target.value)} />
                        </Box>

                        <Box>
                            <FormLabel>Description</FormLabel>
                            <Input placeholder="Enter description..." defaultValue={description} onChange={(e) => setDescription(e.target.value)} />
                        </Box>

                        <Box>
                            <FormLabel>Author Name</FormLabel>
                            <Input placeholder="Enter author name..." defaultValue={authorName} onChange={(e) => setAuthorName(e.target.value)} />
                        </Box>

                        <Box>
                            <FormLabel>Author Icon</FormLabel>
                            <Input placeholder="Enter author icon (url)..." defaultValue={authorIcon} onChange={(e) => setAuthorIcon(e.target.value)} />
                        </Box>

                        <Box>
                            <FormLabel>Image URL</FormLabel>
                            <Input placeholder="Enter image url..." defaultValue={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
                        </Box>

                        <Box>
                            <FormLabel>Color</FormLabel>
                            <Input type="color" value={`#${color}`} onChange={(e) => setColor(e.target.value.replace("#", ""))} />
                        </Box>

                        <Flex direction="column" gap={3}>
                            <FormLabel>Rules</FormLabel>
                            {rules.map((rule, index) => (
                                <Flex key={`${rule.id}-${index}`} >
                                    <Input placeholder="Title..." maxW="200px" defaultValue={rule.title} onChange={(e) => {
                                        let NEW = [...rules]
                                        NEW[index].title = e.target.value
                                        setRules(NEW)
                                    }} />
                                    <Input placeholder="Rule..." defaultValue={rule.description} onChange={(e) => {
                                        let NEW = [...rules]
                                        NEW[index].description = e.target.value

                                        if (e.target.value.length <= 0) {
                                            if (rules.length > 1) {
                                                NEW.splice(index, 1)
                                                setRules(NEW)
                                            }
                                        } else if (rules.length - 1 == index && rules.length < 20) {
                                            setRules([...NEW, defaultRule()])
                                        }
                                    }} />
                                </Flex>
                            ))}
                        </Flex>

                        <Flex direction="column" gap={3}>
                            <FormLabel>Buttons</FormLabel>
                            {buttons.map((button, index) => (
                                <Flex key={`${button.id}-${index}`} >
                                    <Input placeholder="Label..." maxW="200px" defaultValue={button.label} onChange={(e) => {
                                        let NEW = [...buttons]
                                        NEW[index].label = e.target.value
                                        setButtons(NEW)
                                    }} />
                                    <Input placeholder="Link..." defaultValue={button.link} onChange={(e) => {
                                        let NEW = [...buttons]
                                        NEW[index].link = e.target.value

                                        if (e.target.value.length <= 0) {
                                            if (buttons.length > 1) {
                                                NEW.splice(index, 1)
                                                setButtons(NEW)
                                            }
                                        } else if (buttons.length - 1 == index && buttons.length < 20) {
                                            setButtons([...NEW, defaultRule()])
                                        }
                                    }} />
                                </Flex>
                            ))}
                        </Flex>
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="green" fontWeight="normal" onClick={updateRules}>Update</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}