import axios from 'axios'

// https://id.twitch.tv/oauth2/authorize
//     ?client_id=CLIENT_ID
//     &redirect_uri=URL
//     &response_type=TOKEN
//     &scope=channel:manage:schedule channel:read:subscriptions user:edit user:edit:follows user:read:email

export const api = axios.create({
    baseURL: 'https://api.twitch.tv/helix',
})

api.interceptors.request.use(config => {
    const urlHash = window.location.hash
    const hashObj = urlHash
      .split('&')
      .map(hash => hash.split('='))
      .reduce((pre, [key, value]) => ({
        ...pre,
        [key]: value
      }), {})
    const token = hashObj["#access_token"]

    config.headers = {
        'Client-ID': process.env.CLIENT_ID,
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Authorization': `Bearer ${token}`,
    }

    return config;
})