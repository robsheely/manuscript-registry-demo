import { Buffer } from 'buffer'
import * as docx from 'docx-preview'
import React from 'react'
import { DOCX_TYPE } from './FileUpload'
import { Box, CircularProgress } from '@mui/material'

const dataUrlToFile = (dataUrl: string, filename: string): File | undefined => {
  const arr = dataUrl.split(',')
  if (arr.length < 2) {
    return undefined
  }
  const mimeArr = arr[0]
  if (!mimeArr || mimeArr.length < 2) {
    return undefined
  }
  const buff = Buffer.from(arr[1], 'base64')
  return new File([buff], filename, { type: mimeArr })
}

type Props = {
  file?: { name: string; image: string }
}

const ScriptDisplay = ({ file }: Props) => {
  const ref = React.useRef(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (file) {
      const href = DOCX_TYPE + ',' + file.image
      const fileData = dataUrlToFile(href, file.name)

      if (ref.current && fileData) {
        setLoading(true)
        const template = fileData.arrayBuffer()
        docx
          .renderAsync(template, ref.current, ref.current, {
            ignoreHeight: false,
            ignoreWidth: true,
            inWrapper: false,
            renderHeaders: false,
            renderChanges: true,
            renderComments: true
          })
          .then(() => {
            setLoading(false)
            console.log('docx: finished')
          })
      }
    }
  }, [])

  return (
    <div>
      {loading && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            padding: 30
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <style>
        {`
            div.panel-section del {
              color: red;
            } 
            div.panel-section ins {
              color: green;
          }`}
      </style>
      <div
        ref={ref}
        id="panel-section"
        className="panel-section"
        style={{ height: 'calc(100vh - 400px)', overflowY: 'auto' }}
      />
    </div>
  )
}

export default ScriptDisplay
