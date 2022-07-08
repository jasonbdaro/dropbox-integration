import type { NextPage, GetServerSideProps } from 'next'
import { useEffect } from 'react'
import axios from 'axios'
import querystring from 'querystring'
import { useState as useHookState } from '@hookstate/core'
import { Persistence } from '@hookstate/persistence'
import { useRouter } from 'next/router'

const Callback: NextPage = ({token}: any) => {
  const dropboxtoken: any = useHookState({})
  const router = useRouter()

  useEffect(() => {
    dropboxtoken.attach(Persistence('dropbox-token'))
    dropboxtoken.merge(token)
    setTimeout(() => router.replace('/'), 500)
  }, [])

  return (
    <div className="w-100 text-center">Redirecting...</div>
  )
}

export default Callback

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query, req } = context
  const data = querystring.stringify({
    code: query?.code,
    grant_type: 'authorization_code',
    client_id: 'szxq8lfgp1itqwl',
    client_secret: 'yow6vyk6ptim4fn',
    redirect_uri: `http://${req.headers.host}/callback`,
  })
  const gettoken: any = await axios.post('https://api.dropboxapi.com/oauth2/token', data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  })
  .then(res => res.data)
  return {
    props: {token: gettoken}
  }
}
