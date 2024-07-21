import { FileUpload, FileUploadProps } from './FileUpload'

type Props = {
  onChange: (file: File) => void
}

export const DOCX_TYPE =
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

const App = ({ onChange }: Props) => {
  const fileUploadProp: FileUploadProps = {
    accept: DOCX_TYPE,
    onChange: (file: File) => {
      console.log(`Saving ${JSON.stringify(file)}`)
      onChange(file)
    }
  }

  return (
    <div className="App">
      <FileUpload {...fileUploadProp} />
    </div>
  )
}

export default App
