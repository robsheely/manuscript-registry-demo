import React from 'react'
import { Box, styled, Typography } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import { Buffer } from 'buffer'

export type FileUploadProps = {
  imageButton?: boolean
  accept: string
  hoverLabel?: string
  dropLabel?: string
  width?: string
  height?: string
  backgroundColor?: string
  image?: {
    url: string
    imageStyle?: {
      width?: string
      height?: string
    }
  }
  onChange: (file: File) => void
}

const HiddenInput = styled('input')({
  display: 'none'
})

const IconBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'absolute'
})

const NoMouseBox = styled(Box)({
  pointerEvents: 'none'
})

export const DOCX_TYPE =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export const FileUpload: React.FC<FileUploadProps> = ({
  hoverLabel = 'Click or drag to upload file',
  dropLabel = 'Drop file here',
  width = '500px',
  height = '100px',
  backgroundColor = '#fff',
  image: {
    url,
    imageStyle = {
      height: 'inherit'
    }
  } = {},
  onChange
}) => {
  const [imageUrl, setImageUrl] = React.useState(url)
  const [labelText, setLabelText] = React.useState<string>(hoverLabel)
  const [isDragOver, setIsDragOver] = React.useState<boolean>(false)

  const StyledLabel = styled('label')`
    cursor: pointer,
    text-align: center,
    display: flex,
    &:hover p,&:hover svg,& img: {
      opacity: 1
    },
    & p, svg: {
      opacity: 0.4
    },
    &:hover img: {
      opacity: 0.3
    }
  ${() =>
    isDragOver &&
    `& img: {
      opacity: 0.3
    },
    & p, svg: {
      opacity: 1
    }`}
  }`

  const stopDefaults = (e: React.DragEvent) => {
    e.stopPropagation()
    e.preventDefault()
  }
  const dragEvents = {
    onDragEnter: (e: React.DragEvent) => {
      stopDefaults(e)
      setIsDragOver(true)
      setLabelText(dropLabel)
    },
    onDragLeave: (e: React.DragEvent) => {
      stopDefaults(e)
      setIsDragOver(false)
      setLabelText(hoverLabel)
    },
    onDragOver: stopDefaults,
    onDrop: (event: React.DragEvent<HTMLElement>) => {
      stopDefaults(event)
      setLabelText(hoverLabel)
      setIsDragOver(false)
      if (event.dataTransfer.files) {
        setImageUrl(URL.createObjectURL(event.dataTransfer.files[0]))
      }
      handleDrop(event)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImageUrl(URL.createObjectURL(event.target.files[0]))
    }
    if (event.target.files !== null && event.target?.files?.length > 0) {
      const file: File = event.target.files[0]
      if (file.type == DOCX_TYPE) {
        onChange(file)
      }
    }
  }

  const dataUrlToFile = (
    dataUrl: string,
    filename: string
  ): File | undefined => {
    const arr = dataUrl.split(',')
    if (arr.length < 2) {
      console.log('too short')
      return undefined
    }
    const mimeArr = arr[0]
    if (!mimeArr || mimeArr.length < 2) {
      console.log('wring type', mimeArr)
      return undefined
    }
    const buff = Buffer.from(arr[1], 'base64')
    return new File([buff], filename, { type: mimeArr })
  }

  const handleDrop = async (event: React.DragEvent<HTMLElement>) => {
    const file: File = event.dataTransfer.files[0]
    const buffer = await file.arrayBuffer()
    var base64 = btoa(
      new Uint8Array(buffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    )

    if (file.type == DOCX_TYPE) {
      //onChange(file)
    }
    const href = DOCX_TYPE + ',' + base64
    let data = dataUrlToFile(href, file.name)
    if (data) {
      let element = document.createElement('a')
      window.URL = window.URL || window.webkitURL
      element.setAttribute('href', URL.createObjectURL(data))
      element.setAttribute('download', file.name)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
  }
  return (
    <>
      <HiddenInput
        onChange={handleChange}
        accept={DOCX_TYPE}
        id="file-upload"
        type="file"
      />

      <StyledLabel htmlFor="file-upload" {...dragEvents}>
        <NoMouseBox width={width} height={height} bgcolor={backgroundColor}>
          <IconBox height={height} width={width}>
            <CloudUploadIcon fontSize="large" />
            <Typography>{labelText}</Typography>
          </IconBox>
        </NoMouseBox>
      </StyledLabel>
    </>
  )
}
