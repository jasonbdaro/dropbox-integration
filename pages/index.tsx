import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import { Dropbox } from 'dropbox'
import { Loader2, CornerUpLeft } from 'lucide-react'
import ListGroup from 'react-bootstrap/ListGroup'
import { Folder, File, DownloadCloud } from 'lucide-react'
import { useState as useHookState } from '@hookstate/core'
import { Persistence } from '@hookstate/persistence'
import axios from 'axios'

const Download: NextPage = () => {
  const dropboxtoken: any = useHookState({})
  const [hostname, setHostname] = useState('')
  const [list, setList] = useState([])
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [downloadingid, setDownloadingid] = useState('')
  const [currentpath, setCurrentpath] = useState('')

  useEffect(() => {
    dropboxtoken.attach(Persistence('dropbox-token'))
    setHostname(new URL(window.location.href).origin)
    console.log(dropboxtoken.access_token.get())
    if (dropboxtoken.access_token.get()) {
      getList(dropboxtoken.access_token.get())
    }
  }, [])

  const getList = async (token: string, path = '') => {
    const res: any = await axios.post('https://api.dropboxapi.com/2/files/list_folder', {
      'include_deleted': false,
      'include_has_explicit_shared_members': false,
      'include_media_info': false,
      'include_mounted_folders': true,
      'include_non_downloadable_files': true,
      'path': path,
      'recursive': false
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.data)
    .catch(() => setIsAuthorized(false))
    if (res) {
      setList(res.entries)
      setIsAuthorized(true)
      setCurrentpath(path)
    }
  }

  const downloadFile = (path: string, filename: string) => {
    setDownloadingid(path)
    const dbx = new Dropbox({accessToken: dropboxtoken.access_token.get()})
    dbx.filesDownload({ path })
      .then((data: any) => {
        const { result } = data
        const url = window.URL.createObjectURL(new Blob([result.fileBlob]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', filename) //or any other extension
        document.body.appendChild(link)
        link.click()
      })
      .catch((err: any) => {
        console.log('err',err)
        throw err
      })
      .finally(() => {
        setDownloadingid('')
      })
  }

  const grant = () => {
    const APP_KEY = 'szxq8lfgp1itqwl'
    const redirect_uri = hostname + '/callback'
    let uri = 'https://www.dropbox.com/oauth2/authorize'
        uri += `?client_id=${APP_KEY}&response_type=code`
        uri += `&redirect_uri=${redirect_uri}`
    return uri
  }

  const onClick = (item: any) => {
    if (item?.is_downloadable) {
      downloadFile(item.id, item.name)
    }
    if ('folder' === item['.tag']) {
      getList(dropboxtoken.access_token.get(), item.path_lower)
    }
  }
  const onBack = () => {
    const newpath = currentpath.substring(0, currentpath.lastIndexOf("/"));
    getList(dropboxtoken.access_token.get(), newpath)
  }

  return (
    <div className="d-flex align-items-center justify-content-center h-100">
      <div>
        {isAuthorized ? (
          <>
            <ListGroup variant="flush">
              {currentpath !== '' && <ListGroup.Item  className="cursor-pointer text-primary" onClick={onBack}>
                <span className="me-1 fs-7"><CornerUpLeft size={15} /> Back</span>
              </ListGroup.Item>}
              {list?.map((item: any, index: number) => (
                <ListGroup.Item key={index}  className="cursor-pointer" onClick={() => onClick(item)}>
                  <span className="me-1">{'folder' === item['.tag'] ? <Folder fill="#fccc77" /> : <File />}</span>
                  <span className={`${'folder' === item['.tag'] ? '' : ''}`} title="Click to download">{item.name}</span>
                  {item?.is_downloadable && (<>
                    {downloadingid === item.id ? (
                      <span className="ms-1">
                        <Loader2 className="icon-spin" size={15} opacity={0.5} />
                      </span>
                    ) : (<DownloadCloud className="ms-1" size={15} />)}
                  </>)}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </>
        ) : (
          <>
            <div>Sample download file from dropbox</div>
            <div className="d-flex justify-content-center align-items-center">
              <a href={grant()} className="d-block text-primary text-decoration-underline text-center">Click to authorize</a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Download
