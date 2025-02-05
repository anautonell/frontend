import { Avatar, Box, Button, Collapse, Flex, Image, Text, Tooltip, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { GetGuildIcon } from "../lib/Utils";

const Dropdown = ({ isOpen, onOpen, onClose, guild }) => {
    const router = useRouter()

    return (
        <Collapse in={isOpen}>
            <Flex p={5} justifyContent="center" alignItems="center" wrap="wrap" gap={2} zIndex={9999} position="absolute" rounded="md" bg="brand.blue.800" minH="100px" cursor="default" top="70px" left="-10vw" right="-10vw">
                <Button colorScheme="brand.blue" onClick={() => router.push(`/dashboard/${guild._id}`)}>Dashboard</Button>
                <Button colorScheme="brand.blue" onClick={() => router.push(`/dashboard/${guild._id}/toggle`)}>Toggle Modules</Button>
                <Button colorScheme="brand.blue" onClick={() => router.push(`/dashboard/${guild._id}/manage`)}>Manage Modules</Button>
            </Flex>
        </Collapse>
    )

}

export default function Navigation({ navGuild, ...rest }) {
    const router = useRouter()

    const dropdownDisclosure = useDisclosure()

    return (
        <Flex
            py={10}
            px={{
                base: 10,
                sm: 40
            }}
            justifyContent={{
                base: "center",
                lg: "space-between"
            }}
            minH="122px"
            position="fixed"
            top="0"
            left="0"
            right="0"
            bgColor="rgb(25, 20, 20, 0.5)"
            zIndex={999}
            backdropFilter={"blur(15px)"}
            alignItems="center"
            {...rest}
        >
            <Image alt="MyProtect-Logo" src="/brand/logo.png" h="55px" w="50px" onClick={() => router.push("/")} cursor="pointer" />

            {navGuild && (
                <Flex position="relative" justifyContent="center" alignItems="center" onClick={dropdownDisclosure.onToggle} direction="column">
                    <Flex alignItems="center" cursor="pointer" >
                        <Avatar
                            mx={5}
                            src={GetGuildIcon({
                                ...navGuild,
                                id: navGuild._id
                            })}
                            boxSize="55px"
                            name={navGuild.name}
                        />
                        <Text fontSize="20px" fontWeight="semibold" display={{
                            base: "none",
                            sm: "unset"
                        }}>{navGuild.name}</Text>
                    </Flex>
                    <Dropdown guild={navGuild} {...dropdownDisclosure} />
                </Flex>
            )}

            <Tooltip label="Visit the Dashboard" fontSize="16px" fontWeight="semibold" py={2} px={10} bg="black" rounded="md" placement="bottom" hasArrow>
                <Button
                    colorScheme="brand.blue"
                    fontSize="20px"
                    py={8}
                    px={10}
                    transition=".17s linear"
                    _hover={{
                        transform: "translateY(-4px) scale(1.05)"
                    }}
                    display={{
                        base: "none",
                        lg: "flex"
                    }}
                    onClick={() => router.push("/dashboard")}
                >
                    Dashboard
                </Button>
            </Tooltip>
        </Flex>
    )
}