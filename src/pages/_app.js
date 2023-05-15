import Navbar from '@/components/Navbar'
import '@/styles/globals.css'
import { useRouter } from 'next/router'
import { TokenProvider } from '@/contexts/useToken';

export default function App({ Component, pageProps }) {
  const { pathname: pathName } = useRouter();

  return (
    <TokenProvider>
      { pathName === "/auth/login" || pathName === "/auth/register" ? null : <Navbar /> }
      <Component {...pageProps} />
    </TokenProvider>
  )
}
