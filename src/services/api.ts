import axios from 'axios'
import { GetServerSidePropsContext } from 'next'
import { useEffect } from 'react'

import { parseCookies } from 'nookies'

// https://id.twitch.tv/oauth2/authorize
//     ?client_id=CLIENT_ID
//     &redirect_uri=URL
//     &response_type=TOKEN
//     &scope=channel:manage:schedule channel:read:subscriptions user:edit user:edit:follows user:read:email

export function api(ctx?: GetServerSidePropsContext) {
  let accessToken = null;

  if (window) {
    const { ['twitchHackerman.token']: token } = parseCookies()
    accessToken = JSON.parse(token).access_token
  }

  const api = axios.create({
    baseURL: 'https://api.twitch.tv/helix',
  })
  
  api.interceptors.request.use(config => {
    config.headers = {
        'Client-ID': process.env.CLIENT_ID,
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Authorization': `Bearer ${accessToken}`,
    }
  
    return config;
  })

  return api
}