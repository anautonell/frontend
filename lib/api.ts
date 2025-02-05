import Config from "../config.json"

const api = async(url, method, body) => {
    const res = await fetch(`/api${url}`, {
        method: method,
        body: JSON.stringify({
            key: Config.clientSecret,
            ...body
        })
    })

    return await res.json()
}

export default api