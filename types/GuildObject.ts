export interface ChannelObject {
    id: string
    name: string
}

export interface RoleObject {
    id: string
    name: string
    permissions: number
    position: number
}

export default interface GuildObject {
    _id: string
    name: string,
    icon: string | null
    description: string | null
    channels : Array<ChannelObject>
    roles: Array<RoleObject>
}