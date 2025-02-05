import { NextApiRequest, NextApiResponse } from "next";
import Config from "../../../config.json"
import { Modules } from "../../../lib/Modules";

export default async function GetAll(req: NextApiRequest, res : NextApiResponse) {
    
    if (req.method == "POST") {
        const { key, ...data } = JSON.parse(req.body)

        if (key !== Config.clientSecret) return res.status(403).json("Forbidden")

        const { guild, module, ...update } = data

        const mod = new Modules(guild)

        await mod.set(module, update)

        return res.json({
            message: "Success"
        })

    } else {
        return res.status(405).json("Method not allowed")
    }

}