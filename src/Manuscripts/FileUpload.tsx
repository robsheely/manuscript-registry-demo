import React from 'react'
import { Box, styled, Typography } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

export type FileUploadProps = {
  imageButton?: boolean
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
  onChange: (file: { name: string; image: string }) => void
}

const HiddenInput = styled('input')({
  display: 'none'
})

const IconBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center'
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
      handleDrop(event)
    }
  }

  const sendFile = async (file: File) => {
    const buffer = await file.arrayBuffer()
    const base64 = btoa(
      new Uint8Array(buffer).reduce(
        (data, byte) => data + String.fromCharCode(byte),
        ''
      )
    )
    if (file.type == DOCX_TYPE) {
      onChange({ name: file.name, image: base64 })
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null && event.target?.files?.length > 0) {
      const file: File = event.target.files[0]
      sendFile(file)
    }
  }

  const handleDrop = async (event: React.DragEvent<HTMLElement>) => {
    if (
      event.dataTransfer.files !== null &&
      event.dataTransfer?.files?.length > 0
    ) {
      const file: File = event.dataTransfer.files[0]
      sendFile(file)
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

export default FileUpload
