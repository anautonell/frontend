import { MongoClient } from "mongodb"
import Database from "./Database"

export default class Cache {
    public col: any
    public minInterval: number

    constructor(col, minInterval) {
        this.col = col
        this.minInterval = minInterval
    }

    public async retrieve(filter, bypass) {
        const NOW = new Date()
        const res = await Database.Execute(async(client:MongoClient) => {
            const col = await client.db("webCache").collection(this.col)

            const _R = await col.findOne(filter)
            return _R
        })

        if (res && "LAST" in res && !bypass) {
            if ((NOW-res.LAST)/60000 > this.minInterval) {
                return {}
            }
        }

        return res || {}
    }

    public async update(filter, data) {
        await Database.Execute(async(client:MongoClient) => {
            const col = await client.db("webCache").collection(this.col)

            const last = await this.retrieve(filter, true)

            if (Object.keys(last).length == 0) {
                console.log("Creating Document")
                await col.insertOne({
                    ...filter,
                    ...data,
                    LAST: new Date()
                })
            }

            await col.updateOne({
                ...filter
            }, {
                $set: {
                    ...data,
                    LAST: new Date()
                }
            })
        })
    }
}