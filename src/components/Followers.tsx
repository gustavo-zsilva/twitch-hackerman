import { useStreamer } from "../hooks/useStreamer"
import { formatDistance } from 'date-fns'
import { useChain, animated, useSpringRef, useTransition, useSpring } from '@react-spring/web'

import styles from '../styles/components/Followers.module.scss'

export function Followers() {
    const { streamer } = useStreamer()

    // const springRef = useSpringRef()
    // const props = useSpring({ from: {
    //     background: 'red',
    // },
    // to: {
    //     background: 'blue',
    // }, ref: springRef })

    // const transitionRef = useSpringRef()
    // const transitions = useTransition({ ref: transitionRef })

    // useChain([springRef, transitionRef])

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