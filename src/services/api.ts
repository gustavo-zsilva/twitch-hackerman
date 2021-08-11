import { GetServerSidePropsContext } from 'next'
import { parseCookies } from 'nookies'
import axios from 'axios'

// https://id.twitch.tv/oauth2/authorize
//     ?client_id=CLIENT_ID
//     &redirect_uri=URL
//     &response_type=TOKEN
//     &scope=channel:manage:schedule channel:read:subscriptions user:edit user:edit:follows user:read:email

export function api(ctx?: GetServerSidePropsContext) {
  
  const { 'twitchHackerman.token': token } = parseCookies(ctx)
  const accessToken = token ? JSON.parse(token).access_token : null

  const api = axios.create({
    baseURL: 'https://api.twitch.tv/helix',
  })

  if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${accessToken}`
    api.defaults.headers['Client-Id'] = process.env.CLIENT_ID
    api.defaults.headers['Accept'] = 'application/vnd.twitchtv.v5+json'
  }

  return api
}