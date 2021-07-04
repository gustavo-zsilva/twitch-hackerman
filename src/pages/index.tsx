import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'

import { Button } from '../components/Button'
import { Profile } from '../components/Profile'
import { useStreamer } from '../hooks/useStreamer'
import { Followers } from '../components/Followers'
import { Stats } from '../components/Stats'

import { FiSearch } from 'react-icons/fi'
import styles from '../styles/pages/Home.module.scss'

export default function Home() {

  const { handleGetStreamerInfo, isNotFound, streamer } = useStreamer()
  const [streamerName, setStreamerName] = useState('')
  
  async function handleSearchStreamer() {
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
    </div>
  )
}
