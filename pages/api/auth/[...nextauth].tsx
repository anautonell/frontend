export default async function auth(req, res) {
    return await NextAuth(req, res, {
        providers: [
            Providers.Discord({
                clientId: process.env.DISCORD_CLIENT_ID,  // Use the environment variable
                clientSecret: process.env.DISCORD_CLIENT_SECRET,  // Use the environment variable
                scope: "identify guilds"
            })
        ],
        pages: {
            signIn: "/login"
        },
        jwt: {
            encryption: true,
            secret: process.env.NEXTAUTH_SECRET,  // Use the environment variable for JWT secret
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
