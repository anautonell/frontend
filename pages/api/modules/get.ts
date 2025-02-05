import { NextApiRequest, NextApiResponse } from "next";
import Config from "../../../config.json"
import { Modules } from "../../../lib/Modules";

export default async function GetAll(req: NextApiRequest, res : NextApiResponse) {
    
    if (req.method == "POST") {
        const { key, ...data } = JSON.parse(req.body)

        if (key !== Config.clientSecret) return res.status(403).json("Forbidden")

        const mod = new Modules(data.guild)

        const _data = await mod.get()

        return res.json(_data)

    } else {
        return res.status(405).json("Method not allowed")
    }

}
