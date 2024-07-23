import { Buffer } from 'buffer'
import * as docx from 'docx-preview'
import React from 'react'
import { DOCX_TYPE } from './FileUpload'

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

  React.useEffect(() => {
    if (file) {
      const href = DOCX_TYPE + ',' + file.image
      const fileData = dataUrlToFile(href, file.name)

      if (ref.current && fileData) {
        const template = fileData.arrayBuffer()
        docx
          .renderAsync(template, ref.current, ref.current, {
            ignoreWidth: true,
            inWrapper: false,
            renderHeaders: false
          })
          .then(() => console.log('docx: finished'))
      }
    }
  }, [])

  return (
    <div className="App">
      <div
        ref={ref}
        id="panel-section"
        style={{ height: '800px', overflowY: 'auto' }}
      />
    </div>
  )
}

export default ScriptDisplay
