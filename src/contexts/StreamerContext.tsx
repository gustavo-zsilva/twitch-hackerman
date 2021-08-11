import { createContext, ReactNode, useState, useEffect } from "react"

import { formatStreamer } from "../utils/formatStreamer"
import { clientApi } from "../services/clientApi"
import axios from 'axios'
import { parseCookies } from 'nookies'

export const StreamerContext = createContext({} as StreamerContextProps)

type Follower = {
    followed_at: Date,
    from_id: string,
    from_name: string,
    to_id: string,
}

type StreamerProps = {
    language: string,
    name: string,
    gameId: string,
    id: string,
    isLive: boolean,
    tagsIds: string[],
    thumbnailUrl: string,
    title: string,
    startedAt: Date,
    createdAt: Date,
    viewCount: number,
    email: string,
    followers: Follower[],
    totalFollowers: number,
}

type StreamerContextProps = {
    streamer: StreamerProps | null;
    currentUser: CurrentUser | null;
    isNotFound: boolean;
    handleGetStreamerInfo: (name: string) => Promise<void>;
}

type CurrentUser = {
    id: string,
    name: string,
    imageUrl: string,
}

type StreamerProviderProps = {
    children: ReactNode;
}

export function StreamerProvider({ children }: StreamerProviderProps) {
    const [streamer, setStreamer] = useState<StreamerProps | null>(null)
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
    const [isNotFound, setIsNotFound] = useState(false)

    async function handleGetCurrentUserData() {
        const { ['twitchHackerman.token']: token } = parseCookies()
        const accessToken = token ? JSON.parse(token).access_token : null

        // Requesting the url /users returns the correspondent user to the sent token
        const userResponse = await axios.get('https://api.twitch.tv/helix/users', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Client-Id': process.env.CLIENT_ID,
            }
        })
        // Returns Array
        const userInfo = userResponse.data.data[0]
        const currentUser = {
            id: userInfo.id,
            name: userInfo.display_name,
            imageUrl: userInfo.profile_image_url,
        }
        setCurrentUser(currentUser)
    }

    useEffect(() => {
        handleGetCurrentUserData()
    }, [])

    async function handleGetStreamerInfo(name: string) {
        setStreamer(null)
        setIsNotFound(false)
        if (!name) return;

        const channelResponse = await clientApi.get(`/search/channels?query=${name}`)
        let streamerObj = channelResponse.data.data.find(streamer => streamer.display_name.toLowerCase() === name.toLowerCase())
        if (!streamerObj) {
            setIsNotFound(true)
            return;
        }

        const streamerId = streamerObj.id
        
        const channelInfo = await clientApi.get(`/users`, { params: { id: streamerId } })
        const followsResponse = await clientApi.get(`/users/follows`, {
            params: {
                to_id: streamerId,
                first: 100,
            }
        })
        
        streamerObj = {
          ...streamerObj,
          created_at: channelInfo.data.data[0].created_at,
          view_count: channelInfo.data.data[0].view_count,
          email: channelInfo.data.data[0].email,
          followers: followsResponse.data.data,
          total_followers: followsResponse.data.total,
        }
        
        const formattedStreamer = formatStreamer(streamerObj)
        setStreamer(formattedStreamer)
    }

    return (
        <StreamerContext.Provider
            value={{
                streamer,
                currentUser,
                isNotFound,
                handleGetStreamerInfo,
            }}
        >
            {children}
        </StreamerContext.Provider>
    )
}