import { FormEvent, useState } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import axios from 'axios'
import { api } from '../services/api'
import { setCookie, parseCookies } from 'nookies'

import { Button } from '../components/Button'
import { Profile } from '../components/Profile'
import { useStreamer } from '../hooks/useStreamer'
import { Followers } from '../components/Followers'
import { Stats } from '../components/Stats'
import { ProfileButton } from '../components/ProfileButton'

import { FiSearch } from 'react-icons/fi'
import styles from '../styles/pages/Home.module.scss'
import { StreamerProvider } from '../contexts/StreamerContext'

type CurrentUser = {
  id: string,
  name: string,
  imageUrl: string,
}

export default function Home() {

  const { handleGetStreamerInfo, isNotFound, streamer } = useStreamer()
  const [streamerName, setStreamerName] = useState('')
  
  async function handleSearchStreamer(event: FormEvent) {
    event.preventDefault()
    await handleGetStreamerInfo(streamerName)
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>twitchHackerman</title>
      </Head>

      <div>
        <header>
          <h1>
            <Image width={24} height={24} src="/assets/coolcat.png" alt="Coolcat" />
            <span>twitch</span>
            Hackerman
            <strong>
              {''} by <a
                href="https://www.twitch.tv/admpoggers"
                target="_blank"
                rel="noopener noreferrer"
              >
                @AdmPoggers
              </a>
            </strong>
          </h1>

          <form onSubmit={handleSearchStreamer}>
            <div className={styles.input}>
              <FiSearch color="var(--bg-lighter)" size={28} />
              <input
                type="text"
                placeholder="Your favorite streamer"
                value={streamerName}
                onChange={e => setStreamerName(e.target.value)}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </header>

        <main>
          { streamer ? (
            <div className={styles.streamer}>
              <Profile />
              <Stats />
              <Followers />
            </div>
          ) : (
            <h2>{isNotFound ? `Streamer ${streamerName} not found` : 'No streamer yet'}</h2>
          ) }
        </main>
      </div>

      <ProfileButton />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const { ['twitchHackerman.code']: code } = parseCookies(ctx)

  if (!ctx.query.code || ctx.query.code === code) {
    return {
      redirect: {
        destination: `https://id.twitch.tv/oauth2/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.BASE_URL}&scope=channel:read:subscriptions user:edit user:edit:follows user:read:email`,
        permanent: false,
      }
    }
  }
  
  const response = await axios.post(`${process.env.BASE_URL}/api/auth`, {
    data: {
      code: ctx.query.code
    }
  })
  const token = response.data
  setCookie(ctx, 'twitchHackerman.code', String(ctx.query.code))
  setCookie(ctx, 'twitchHackerman.token', JSON.stringify(token), {
    maxAge: token.expires_in,
  })
  
  return {
    props: {}
  }
}