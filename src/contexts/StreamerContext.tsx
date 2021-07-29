import { createContext, ReactNode, useEffect, useState } from "react"
import { useRouter } from 'next/router'

import { formatStreamer } from "../utils/formatStreamer"
import { clientApi } from "../services/clientApi"

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

    async function handleGetStreamerInfo(name: string) {
        setStreamer(null)
        setIsNotFound(false)
        if (!name) return;

        const channelResponse = await clientApi.get(`/search/channels?query=${name}`)
        let streamerObj = channelResponse.data.data.find(streamer => streamer.display_name === name)
        if (!streamerObj) {
            setIsNotFound(true)
            return;
        }

        const streamerId = streamerObj.id
        
        const subscribersResponse = await clientApi.get(`/users?id=${streamerId}`)
        const followsResponse = await clientApi.get(`/users/follows?to_id=${streamerId}`)
        
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