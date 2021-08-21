import { GetServerSideProps } from "next"
import Head from 'next/head'
import Image from 'next/image'

import { api } from '../services/api'
import { ImQuotesLeft } from 'react-icons/im'

import styles from '../styles/pages/Profile.module.scss'
import { parseCookies } from "nookies"

type Streamer = {
    id: string,
    name: string,
    description: string,
    imageUrl: string,
    viewCount: number,
    createdAt: string,
    language: string,
}

type ProfileProps = {
    streamer: Streamer;
}

export default function Profile({ streamer }: ProfileProps) {
    return (
        <div className={styles.profile}>
            <Head>
                <title>Profile</title>
            </Head>

            <div className={styles.banner} />

            <div className={styles.content}>
                <div>
                    <picture>
                        <Image src={streamer.imageUrl} alt="Profile Picture" width={300} height={300} objectFit="cover" />
                    </picture>
                    <strong>{streamer.name}</strong>
                    <span>
                        <ImQuotesLeft size={28} />
                        {streamer.description}
                    </span>
                </div>

                <div></div>

                <div>

                </div>
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    
    const serverApi = api(ctx)
    const username = ctx.params.name

    const { ['twitchHackerman.appToken']: appToken } = parseCookies(ctx)
    const appAccessToken = appToken ? JSON.parse(appToken).access_token : null
    
    const response = await serverApi.get('/users', {
        params: {
            login: username,
            limit: 1,
        }
    })
    const user = response.data.data[0]
    const id = user.id

    const channelResponse = await serverApi.get(`/channels`, {
        params: {
            broadcaster_id: id,
        }
    })
    const channelData = channelResponse.data.data[0]

    const streamer = {
        id,
        name: user.display_name,
        description: user.description,
        imageUrl: user.profile_image_url,
        viewCount: user.view_count,
        createdAt: user.created_at,
        language: channelData.broadcaster_language,
    }

    const webhook = await serverApi.get('/eventsub/subscriptions', {
        headers: {
            'Authorization': `Bearer ${appAccessToken}`
        },
        data: {
            type: "channel.follow",
            version: "1",
            condition: {
                "broadcaster_user_id": id,
            },
            transport: {
                method: "webhook",
                callback: `${process.env.BASE_URL}/api/callback`,
                secret: "admpoggers_"
            }
        }
    })
    console.log(webhook.data)

    return {
        props: {
            streamer: JSON.parse(JSON.stringify(streamer)),
        }
    }
}
