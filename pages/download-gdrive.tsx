import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { Dropbox } from 'dropbox'
import { Loader2 } from 'lucide-react'
import Script from 'next/script'

const dbx = new Dropbox({
  accessToken: 'sl.BK6m7WTZ2Zva2mneTQjr0Fy23bdF62Os3z9LkQlfU7dVYdx4wTvTDXSpJ0CTofRaB5u-noVGkJKdUiYPF2riKNse1zrklotjyx8MCy2BS7LDX30MOa9h2K4kAKrLSJYaZJ_koQw'
})


const Download: NextPage = () => {
  const [downloading, setDownloading] = useState(false)

  const download = (e: any) => {
    e.preventDefault()

    setDownloading(true)
    dbx.filesDownload({ path: 'id:UVSKaRSyz1MAAAAAAAAACQ' })
      .then((data: any) => {
        const { result } = data
        const url = window.URL.createObjectURL(new Blob([result.fileBlob]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', result.name) //or any other extension
        document.body.appendChild(link)
        link.click()
      })
      .catch((err: any) => {
        console.log('err',err)
        throw err
      })
      .finally(() => {
        setDownloading(false)
      })
  }

  const handleTest = () => {
    const globalWindow: any = window
    const gapi = globalWindow?.gapi
    gapi.load('client:auth2', () => {
      const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"]
      const SCOPES = "https://www.googleapis.com/auth/drive.metadata.readonly"
      gapi.client.init({
        apiKey: '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',
        clientId: '954260107201-189l9le2kr3v89l4mo5ghr5sh7qgtajn.apps.googleusercontent.com',
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      gapi.auth2.getAuthInstance().signIn().then(() => {
        var event = {
          'summary': `Live Session `,
          'start': {
            'dateTime': `2022-07-10T00:00:00+07:00`,
            'timeZone': 'Asia/Jakarta'
          },
          'end': {
            'dateTime': `2022-08-10T00:00:00+07:00`,
            'timeZone': 'Asia/Jakarta'
          },
          'reminders': {
            'useDefault': false,
            'overrides': [
              {'method': 'popup', 'minutes': 60}
            ]
          },
          'source': {
            'title': 'test',
            'url': 'https://google.com',
          },
        }

        var request = gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': event,
        })

        request.execute(async (event: any) => {
          window.open(event.htmlLink)
        })
      })
    })
  }

  return (
    <div className="d-flex align-items-center justify-content-center h-100">
      <Script strategy="beforeInteractive" src="https://apis.google.com/js/api.js"></Script>
      <div>
        <div>Sample download file from Google Drive</div>
        <button onClick={handleTest}>test</button>
        <div className="d-flex justify-content-center align-items-center">
          {!downloading ? (
            <a href="#" onClick={download} className="d-block text-primary text-decoration-underline text-center">Please click to download</a>
          ) : (
            <div className="me-1">
              Downloading... <Loader2 className="icon-spin" size={20} opacity={0.5} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Download
