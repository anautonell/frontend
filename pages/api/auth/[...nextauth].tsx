import type { NextApiRequest, NextApiResponse } from "next"
import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import Cache from "../../../lib/Cache"
import Config from "../../../config.json"

const formUser = async (token) => {
    const userCache = new Cache("userCache", 1)
    const cachedData = await userCache.retrieve({
        _id: token
    })

    if (cachedData.user) return cachedData.user

    const response = await fetch('https://discord.com/api/users/@me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = await response.json()

    if (!("id" in data)) {
        return (await userCache.retrieve({_id:token})) || {}
    }

    await userCache.update({
        _id: token
    }, {
        user: data
    })

    return data
}

const formGuilds = async (token) => {
    const userCache = new Cache("userCache", 1)
    const cachedData = await userCache.retrieve({
        _id: token
    })

    if (cachedData.guilds) return cachedData.guilds

    const response = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const data = await response.json()

    if (!data[0]) {
        return (await userCache.retrieve({ _id: token }, true)) || []
    }

    await userCache.update({
        _id: token
    }, {
        guilds: data
    })

    return data
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {

    return await NextAuth(req, res, {
        providers: [
            Providers.Discord({
                ...Config,
                scope: "identify guilds"
            })
        ],
        pages: {
            signIn: "/login"
        },
        jwt: {
            encryption: true,
            secret: 'd905dccfd07d4ad1c99696cf7e8bace094e3a7f16fe43cc2d4a3a11564c161db'
        },
        session: {
            maxAge: 30 * 24 * 60 * 60,
            jwt: true
        },
        callbacks: {
            async jwt(token, user, account) {
                const NOW = new Date()
                if (account && user) {
                    return {
                        accessToken: account.accessToken,
                        accessTokenExpires: NOW.getTime() + account.expires_in * 1000,
                        refreshToken: account.refresh_token,
                        user
                    };
                }

                if (NOW < token.accessTokenExpires) {
                    return token;
                }
            },
            async session(session, token) {
                if (token) {
                    session.user = token.user
                    session.accessToken = token.accessToken
                    session.error = token.error
                    session.data = await formUser(token.accessToken)
                    const guilds = await formGuilds(token.accessToken)

                    session.guilds = guilds.filter(guild => (guild.permissions & 0x20) > 0).sort((a, b) => a.name.charCodeAt() - b.name.charCodeAt())
                }

                return session;
            },
        },
    })
}