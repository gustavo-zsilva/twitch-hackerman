import { StreamerProvider } from '../contexts/StreamerContext'
import '../styles/globals.scss'

function MyApp({ Component, pageProps }) {
  return (
    <StreamerProvider>
      <Component {...pageProps} />
    </StreamerProvider>
  )
}

export default MyApp
