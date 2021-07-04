import { useStreamer } from "../hooks/useStreamer"
import { formatDistance, subDays } from 'date-fns'

import styles from '../styles/components/Followers.module.scss'

export function Followers() {
    const { streamer } = useStreamer()

    return (
        <ul className={styles.followerList}>
            {streamer.followers.map(follower => {
                const followedAt = formatDistance(new Date(follower.followed_at), new Date(), { addSuffix: true })

                return (
                    <li key={follower.from_id} className={styles.follower}>
                        <strong>{follower.from_name}</strong>
                        <span>Followed {followedAt}</span>
                    </li>
                )
            })}
        </ul>
    )
}