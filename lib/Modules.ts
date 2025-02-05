import { MongoClient } from "mongodb"
import Database from "./Database"

export class Modules {
    public guildId: string

    constructor(guildId: string) {
        this.guildId = guildId
    }

    public async get() {
        return await Database.Execute(async(client: MongoClient) => {
            const col = client.db("Bot").collection("modules")

            let res = await col.findOne({_id:this.guildId})

            console.log(res)

            if (!res) {
                await col.insertOne({
                    _id: this.guildId
                })

                return {
                    _id: this.guildId
                }
            } else {
                return res
            }
        })
    }

    public async toggle(module: string, status: boolean) {
        const Data = await this.get()
        if (!Data) return true
        return await Database.Execute(async(client: MongoClient) => {
            const col = client.db("Bot").collection("modules")
            let newStatus
            if (status != null) {
                newStatus = status
            } else {
                newStatus = ((`${module}` in Data) ? !Data[module].enabled : false) 
            }

            const updateDoc = Data
            if (module in Data) {
                updateDoc[module].enabled = newStatus
            } else {
                updateDoc[module] = {
                    enabled: newStatus
                }
            }

            await col.updateOne({
                _id: this.guildId
            }, {
                $set: updateDoc
            })

            return newStatus
        })
    }

    public async set(module: string, settings) {
        const Data = await this.get()
        return await Database.Execute(async(client: MongoClient) => {
            const col = client.db("Bot").collection("modules")

            await col.updateOne({
                _id: this.guildId
            }, {
                $set: settings
            })
        })
    }
}