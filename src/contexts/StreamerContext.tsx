import { createContext, ReactNode, useEffect, useState } from "react"
import { useRouter } from 'next/router'

import { formatStreamer } from "../utils/formatStreamer"
import { api } from "../services/api"

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
}

type StreamerContextProps = {
    streamer: StreamerProps | null;
    isNotFound: boolean;
    handleGetStreamerInfo: (name: string) => Promise<void>;
}

type StreamerProviderProps = {
    children: ReactNode;
}

export function StreamerProvider({ children }: StreamerProviderProps) {
    const [streamer, setStreamer] = useState<StreamerProps | null>(null)
    const [isNotFound, setIsNotFound] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (!window.location.hash) {
            router.push(`https://id.twitch.tv/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.BASE_URL}&response_type=token&scope=channel:manage:schedule channel:read:subscriptions user:edit user:edit:follows user:read:email`)
        }
    }, [router])

    async function handleGetStreamerInfo(name: string) {

        setStreamer(null)
        setIsNotFound(false)
        if (!name) return;

        const channelResponse = await api.get(`/search/channels?query=${name}`)
        let streamerObj = channelResponse.data.data.find(streamer => streamer.display_name === name)
        if (!streamerObj) {
            setIsNotFound(true)
            return;
        }

        const streamerId = streamerObj.id
        
        const subscribersResponse = await api.get(`/users?id=${streamerId}`)
        const followsResponse = await api.get(`/users/follows?to_id=${streamerId}`)
        
        streamerObj = {
          ...streamerObj,
          created_at: subscribersResponse.data.data[0].created_at,
          view_count: subscribersResponse.data.data[0].view_count,
          email: subscribersResponse.data.data[0].email,
          followers: followsResponse.data.data,
        }
        
        const formattedStreamer = formatStreamer(streamerObj)
        setStreamer(formattedStreamer)
    }

    return (
        <StreamerContext.Provider
            value={{
                streamer,
                isNotFound,
                handleGetStreamerInfo,
            }}
        >
            {children}
        </StreamerContext.Provider>
    )
}