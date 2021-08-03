import { useStreamer } from '../hooks/useStreamer'
import { format } from 'date-fns'

import styles from '../styles/components/Stats.module.scss'

export function Stats() {
    const { streamer } = useStreamer()
    const creationDate = format(new Date(streamer.createdAt), "MM/dd/yyyy")

    return (
        <div className={styles.stats}>
            <section>
                <h3>Total View Count</h3>
                <strong>
                    {streamer.viewCount}
                </strong>
            </section>

            <section>
                <h3>Streamer Language</h3>
                <strong>
                    {streamer.language}
                </strong>
            </section>

            <section>
                <h3>Followers Count</h3>
                <strong>
                    {streamer.totalFollowers}
                </strong>
            </section>

            <section>
                <h3>Account Created At</h3>
                <strong>
                    {creationDate}
                </strong>
            </section>

            <section>
                <h3>Streamer Email</h3>
                <strong style={{ textTransform: 'initial', fontSize: '1.2rem' }}>
                    {streamer.email ?? 'Email not set'}
                </strong>
            </section>

            <section>
                <h3>Streamer ID</h3>
                <strong>
                    {streamer.id}
                </strong>
            </section>
        </div>
    )
}