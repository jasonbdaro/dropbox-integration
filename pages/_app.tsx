import '../styles/_main.scss'
import type { AppProps } from 'next/app'
import { SSRProvider } from 'react-bootstrap';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SSRProvider>
      <Component {...pageProps} />
    </SSRProvider>
  )
}

export default MyApp
