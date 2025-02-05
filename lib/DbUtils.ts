import { MongoClient } from "mongodb"
import GuildObject from "../types/GuildObject"
import Database from "./Database"

export const FetchBotGuilds: Array<GuildObject> | null = async() => {
    const data = await Database.Execute(async(client: MongoClient) => {
        const col = client.db("botCache").collection("guildCache")

        return await col.find({}).toArray()
    })

    return data
}

export const FetchGuildDoc = async(guildId, collection) => {
    return await Database.Execute(async(client: MongoClient) => {
        const col = client.db("Bot").collection(collection)

        return await col.findOne({
            _id: guildId
        }) || {}
    })
}

export const UpdateGuildDoc = async(guildId, collection, update) => {
    const doc = await FetchGuildDoc(guildId, collection)
    return await Database.Execute(async(client: MongoClient) => {
        const col = client.db("Bot").collection(collection)

        console.log(guildId, collection)
        console.log(doc)

        if (Object.keys(doc) == 0) {
            return await col.insertOne({
                _id: guildId,
                ...update
            })
        }

        return await col.updateOne({
            _id: guildId
        }, {
            $set: {
                ...update
            }
        })
    })
}