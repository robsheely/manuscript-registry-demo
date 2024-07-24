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

const StyledLabel = styled('label')`
    cursor: pointer,
    text-align: center,
    display: flex,
    width: 400px
  }`

export const DOCX_TYPE =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

export const FileUpload: React.FC<FileUploadProps> = ({
  hoverLabel = 'Click or drag to upload file',
  dropLabel = 'Drop file here',
  height = '100px',
  backgroundColor = '#fff',
  onChange
}) => {
  const [labelText, setLabelText] = React.useState<string>(hoverLabel)
  const [isDragOver, setIsDragOver] = React.useState<boolean>(false)

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
  const color = !isDragOver ? 'primary' : 'disabled'

  return (
    <>
      <HiddenInput
        onChange={handleChange}
        accept={DOCX_TYPE}
        id="file-upload"
        type="file"
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <StyledLabel htmlFor="file-upload" {...dragEvents}>
          <NoMouseBox width="100%" height={height}>
            <IconBox
              height={height}
              width="400px"
              bgcolor={backgroundColor}
              border="solid 1px"
              borderColor={!isDragOver ? 'primary.main' : 'grey.400'}
              borderRadius={2}
            >
              <CloudUploadIcon color={color} fontSize="large" />
              <Typography color={color}>{labelText}</Typography>
            </IconBox>
          </NoMouseBox>
        </StyledLabel>
      </div>
    </>
  )
}

export default FileUpload
