import { NextApiRequest, NextApiResponse } from "next";
import Config from "../../config.json"
import { FetchGuildDoc } from "../../lib/DbUtils";
import { Modules } from "../../lib/Modules";

export default async function GetAll(req: NextApiRequest, res : NextApiResponse) {
    
    if (req.method == "POST") {
        const { key, ...data } = JSON.parse(req.body)

        if (key !== Config.clientSecret) return res.status(403).json("Forbidden")

        const { guild, collection , ...rest } = data

        return res.json((await FetchGuildDoc(guild, collection)) || {})

    } else {
        return res.status(405).json("Method not allowed")
    }

}