import '@wangeditor/editor/dist/css/style.css'

import { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
type Props = {
  placeHolder: string
  html?: string
  setHtml: (html: string) => void
}

const TextEditor = ({ placeHolder, html, setHtml }: Props) => {
  const [editor, setEditor] = useState<IDomEditor | null>(null) // TS syntax

  const toolbarConfig: Partial<IToolbarConfig> = {
    toolbarKeys: [
      'bold',
      'underline',
      'italic',
      '|',
      'bulletedList',
      'numberedList'
    ]
  }

  const editorConfig: Partial<IEditorConfig> = {
    placeholder: placeHolder,
    scroll: false,
    hoverbarKeys: {}
  }

  // Timely destroy editor, important!
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        style={{ borderBottom: '1px solid #ccc' }}
      />
      <Editor
        defaultConfig={editorConfig}
        value={html}
        mode="simple"
        onCreated={setEditor}
        onChange={(editor) => setHtml(editor.getHtml())}
        style={{ height: '200px', overflowY: 'auto' }}
      />
    </div>
  )
}

export default TextEditor
