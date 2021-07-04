import Image from 'next/image'
import { useStreamer } from '../hooks/useStreamer'

import styles from '../styles/components/Profile.module.scss'

export function Profile() {

    const { streamer } = useStreamer()

    return (
        <div className={styles.userProfile}>
            <picture>
                <Image
                    width={300}
                    height={300}
                    objectFit="cover"
                    src={streamer.thumbnailUrl}
                    alt={`${streamer.name} Picture`}
                />
            </picture>
            
            <div>
                <strong>
                    <a
                        href={`https://www.twitch.tv/${streamer.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {streamer.name}
                    </a>
                </strong>
                <span className={streamer.isLive ? styles.live : styles.offline}>
                    {streamer.isLive ? 'LIVE NOW' : 'Offline'}
                </span>
            </div>
        </div>
    )
}